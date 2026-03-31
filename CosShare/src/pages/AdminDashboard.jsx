import { useState } from "react";
import NavBarPrincipal from "../components/NavBar.jsx";
import Footer from "../components/Footer.jsx";
import {
  Container,
  Row,
  Col,
  FormControl,
  Button,
  Table,
  Badge,
  Modal,
  Form,
} from "react-bootstrap";

const AdminDashboard = () => {
  const [formData, setFormData] = useState({
    email: "",
    pseudo: "",
    nom: "",
    prenom: "",
  });
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);
  const [pressedButton, setPressedButton] = useState(null);

  const [showCommentModal, setShowCommentModal] = useState(false);
  const [commentUser, setCommentUser] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [commentError, setCommentError] = useState(null);
  const [commentSuccess, setCommentSuccess] = useState(null);

  const [tickets, setTickets] = useState([]);
  const [ticketsError, setTicketsError] = useState(null);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editData, setEditData] = useState({
    email_connexion: "",
    prenom: "",
    nom: "",
    pseudo: "",
  });
  const [editError, setEditError] = useState(null);
  const [editSuccess, setEditSuccess] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSearch = async () => {
    try {
      const token = localStorage.getItem("token");
      const searchTerm =
        formData.pseudo || formData.nom || formData.prenom || formData.email;

      if (!searchTerm) {
        setError("Veuillez saisir au moins un champ.");
        return;
      }

      const response = await fetch(
        `http://localhost:3000/api/users/search?searchTerm=${searchTerm}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      const data = await response.json();
      setSearched(true);

      if (response.ok) {
        setUsers(data.users);
        setError(null);
      } else {
        setError(data.message);
        setUsers([]);
      }
    } catch (err) {
      setError("Erreur lors de la recherche.");
    }
  };

  const handleDelete = async (id_Users) => {
    if (!window.confirm("Confirmer la suppression de cet utilisateur ?"))
      return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3000/api/users/${id_Users}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.ok) {
        setUsers(users.filter((u) => u.id_Users !== id_Users));
      }
    } catch (err) {
      setError("Erreur lors de la suppression.");
    }
  };

  const handleOpenModal = (user) => {
    setSelectedUser(user);
    setEditData({
      email_connexion: user.email_connexion || "",
      prenom: user.prenom || "",
      nom: user.nom || "",
      pseudo: user.pseudo || "",
    });
    setEditError(null);
    setEditSuccess(null);
    setShowModal(true);
  };

  const handleOpenCommentModal = (user) => {
    setCommentUser(user);
    setCommentText(user.commentaire_interne || "");
    setCommentError(null);
    setCommentSuccess(null);
    setShowCommentModal(true);
  };

  const handleCommentSubmit = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:3000/api/users/${commentUser.id_Users}/commentaire`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ commentaire_interne: commentText }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        setCommentSuccess("Commentaire sauvegardé ✅");
        setUsers(
          users.map((u) =>
            u.id_Users === commentUser.id_Users
              ? { ...u, commentaire_interne: commentText }
              : u,
          ),
        );
      } else {
        setCommentError(data.message);
      }
    } catch (err) {
      setCommentError("Erreur lors de la sauvegarde.");
    }
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  // Envoyer la modification
  const handleEditSubmit = async () => {
    try {
      const token = localStorage.getItem("token");

      if (
        !editData.email_connexion ||
        !editData.prenom ||
        !editData.nom ||
        !editData.pseudo
      ) {
        setEditError("Tous les champs sont obligatoires.");
        return;
      }

      const response = await fetch(
        `http://localhost:3000/api/users/${selectedUser.id_Users}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            email_connexion: editData.email_connexion,
            prenom: editData.prenom,
            nom: editData.nom,
            pseudo: editData.pseudo,
          }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        setEditSuccess("Utilisateur modifié avec succès ✅");
        // Mettre à jour la liste sans refaire une recherche
        setUsers(
          users.map((u) =>
            u.id_Users === selectedUser.id_Users ? { ...u, ...editData } : u,
          ),
        );
      } else {
        setEditError(data.message || "Erreur lors de la modification.");
      }
    } catch (err) {
      setEditError("Erreur lors de la modification.");
    }
  };

  const fetchTickets = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/api/tickets", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        setTickets(data.tickets);
        setTicketsError(null);
      } else {
        setTicketsError(data.message);
      }
    } catch (err) {
      setTicketsError("Erreur lors de la récupération des tickets.");
    }
  };

  const handleOpenTicketModal = (ticket) => {
    setSelectedTicket(ticket);
    setShowTicketModal(true);
  };

  const handleUpdateStatut = async (id_ticket, statut) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3000/api/tickets/${id_ticket}/statut`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ statut }),
        },
      );
      if (response.ok) {
        setTickets(
          tickets.map((t) =>
            t.id_ticket === id_ticket ? { ...t, statut } : t,
          ),
        );
        if (selectedTicket?.id_ticket === id_ticket) {
          setSelectedTicket({ ...selectedTicket, statut });
        }
      }
    } catch (err) {
      setTicketsError("Erreur lors de la mise à jour du statut.");
    }
  };

  const handleDeleteTicket = async (id_ticket) => {
    if (!window.confirm("Confirmer la suppression de ce ticket ?")) return;
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3000/api/tickets/${id_ticket}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (response.ok) {
        setTickets(tickets.filter((t) => t.id_ticket !== id_ticket));
        setShowTicketModal(false);
      }
    } catch (err) {
      setTicketsError("Erreur lors de la suppression.");
    }
  };

  const handleUpdateRole = async (id_Users, nouveauRole) => {
    if (
      !window.confirm(`Confirmer le changement de rôle en "${nouveauRole}" ?`)
    )
      return;
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3000/api/users/${id_Users}/role`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ type_de_compte: nouveauRole }),
        },
      );
      if (response.ok) {
        setUsers(
          users.map((u) =>
            u.id_Users === id_Users ? { ...u, type_de_compte: nouveauRole } : u,
          ),
        );
      }
    } catch (err) {
      setError("Erreur lors du changement de rôle.");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        fontFamily: "Calibri, sans-serif",
      }}
    >
      <NavBarPrincipal />

      <main style={{ flex: 1, padding: "20px" }}>
        <Container>
          {/* Formulaire */}
          <div
            style={{
              border: "1px solid #dee2e6",
              borderRadius: "8px",
              padding: "clamp(10px, 3vw, 20px)",
              marginBottom: "20px",
            }}
          >
            <h5>Formulaire de gestion utilisateur</h5>
            <p style={{ color: "red", fontSize: "0.85rem" }}>
              * Veuillez saisir les champs obligatoires
            </p>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label htmlFor="email">E-mail *</Form.Label>
                  <FormControl
                    id="email"
                    type="text"
                    name="email"
                    placeholder="E-mail *"
                    value={formData.email}
                    onChange={handleChange}
                    className="mb-2"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label htmlFor="pseudo">Pseudo *</Form.Label>
                  <FormControl
                    id="pseudo"
                    type="text"
                    name="pseudo"
                    placeholder="Pseudo *"
                    value={formData.pseudo}
                    onChange={handleChange}
                    className="mb-2"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label htmlFor="nom">Nom</Form.Label>
                  <FormControl
                    id="nom"
                    type="text"
                    name="nom"
                    placeholder="Nom"
                    value={formData.nom}
                    onChange={handleChange}
                    className="mb-2"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label htmlFor="prenom">Prénom</Form.Label>
                  <FormControl
                    id="prenom"
                    type="text"
                    name="prenom"
                    placeholder="Prénom"
                    value={formData.prenom}
                    onChange={handleChange}
                    className="mb-2"
                  />
                </Form.Group>
              </Col>
            </Row>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <div className="d-grid d-sm-flex justify-content-sm-center">
              <Button
                onClick={handleSearch}
                onMouseDown={() => setPressedButton("search")}
                onMouseUp={() => setPressedButton(null)}
                onMouseLeave={() => setPressedButton(null)}
                style={{
                  backgroundColor:
                    pressedButton === "search" ? "#2a5c45" : "#2a5c45",
                  border: "none",
                  borderRadius: "25px",
                  padding: "8px 30px",
                  transform:
                    pressedButton === "search" ? "scale(0.95)" : "scale(1)",
                  transition: "all 0.1s ease",
                }}
              >
                Rechercher
              </Button>
            </div>
          </div>

          {/* Liste des utilisateurs */}
          {searched && (
            <div
              style={{
                border: "1px solid #dee2e6",
                borderRadius: "8px",
                padding: "20px",
              }}
            >
              <h5>Liste des utilisateurs</h5>

              {users.length === 0 ? (
                <p className="text-muted">Aucun utilisateur trouvé.</p>
              ) : (
                <Table responsive hover style={{ verticalAlign: "middle" }}>
                  <thead>
                    <tr>
                      <th>Nom</th>
                      <th>Prénom</th>
                      <th>Pseudo</th>
                      <th>Rôle</th>
                      <th>Statut</th>
                      <th>Modifier</th>
                      <th>Commentaire</th>
                      <th>Supprimer</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id_Users}>
                        <td>{user.nom}</td>
                        <td>{user.prenom}</td>
                        <td>{user.pseudo}</td>
                        <td>
                          <Button
                            onClick={() =>
                              handleUpdateRole(
                                user.id_Users,
                                user.type_de_compte === "admin"
                                  ? "user"
                                  : "admin",
                              )
                            }
                            onMouseDown={() =>
                              setPressedButton(`role-${user.id_Users}`)
                            }
                            onMouseUp={() => setPressedButton(null)}
                            onMouseLeave={() => setPressedButton(null)}
                            style={{
                              backgroundColor:
                                user.type_de_compte === "admin"
                                  ? "#f0a500"
                                  : "#2a5c45",
                              border: "none",
                              borderRadius: "20px",
                              padding: "5px 15px",
                              fontSize: "0.85rem",
                              transform:
                                pressedButton === `role-${user.id_Users}`
                                  ? "scale(0.95)"
                                  : "scale(1)",
                              transition: "all 0.1s ease",
                            }}
                          >
                            {user.type_de_compte === "admin"
                              ? "Retirer admin"
                              : "Rendre admin"}
                          </Button>
                        </td>
                        <td>
                          <Badge
                            bg={user.compte_actif ? "success" : "secondary"}
                          >
                            {user.compte_actif ? "Actif" : "Inactif"}
                          </Badge>
                        </td>
                        <td>
                          <Button
                            variant="warning"
                            size="sm"
                            onClick={() => handleOpenModal(user)}
                            onMouseDown={() =>
                              setPressedButton(`edit-${user.id_Users}`)
                            }
                            onMouseUp={() => setPressedButton(null)}
                            onMouseLeave={() => setPressedButton(null)}
                            style={{
                              backgroundColor:
                                pressedButton === `edit-${user.id_Users}`
                                  ? "#8E8E93"
                                  : "#8E8E93",
                              border: "none",
                              borderRadius: "20px",
                              padding: "5px 15px",
                              fontSize: "0.85rem",
                              transform:
                                pressedButton === `edit-${user.id_Users}`
                                  ? "scale(0.95)"
                                  : "scale(1)",
                              transition: "all 0.1s ease",
                            }}
                          >
                            Modifier
                          </Button>
                        </td>

                        <td>
                          <Button
                            onClick={() => handleOpenCommentModal(user)}
                            onMouseDown={() =>
                              setPressedButton(`comment-${user.id_Users}`)
                            }
                            onMouseUp={() => setPressedButton(null)}
                            onMouseLeave={() => setPressedButton(null)}
                            style={{
                              backgroundColor: "#5c7a9e",
                              border: "none",
                              borderRadius: "20px",
                              padding: "5px 15px",
                              fontSize: "0.85rem",
                              transform:
                                pressedButton === `comment-${user.id_Users}`
                                  ? "scale(0.95)"
                                  : "scale(1)",
                              transition: "all 0.1s ease",
                            }}
                          >
                            Commentaire
                          </Button>
                        </td>

                        <td>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDelete(user.id_Users)}
                            onMouseDown={() =>
                              setPressedButton(`delete-${user.id_Users}`)
                            }
                            onMouseUp={() => setPressedButton(null)}
                            onMouseLeave={() => setPressedButton(null)}
                            style={{
                              backgroundColor:
                                pressedButton === `delete-${user.id_Users}`
                                  ? "#e05c5c"
                                  : "#e05c5c",
                              border: "none",
                              borderRadius: "20px",
                              padding: "5px 15px",
                              fontSize: "0.85rem",
                              transform:
                                pressedButton === `delete-${user.id_Users}`
                                  ? "scale(0.95)"
                                  : "scale(1)",
                              transition: "all 0.1s ease",
                            }}
                          >
                            Supprimer
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </div>
          )}

          {/* Section Tickets de support */}
          <div
            style={{
              border: "1px solid #dee2e6",
              borderRadius: "8px",
              padding: "clamp(10px, 3vw, 20px)",
              marginTop: "20px",
            }}
          >
            <div className="d-flex justify-content-between align-items-center gap-2 mb-3">
              <h5>Tickets de support</h5>
              <Button
                onClick={fetchTickets}
                onMouseDown={() => setPressedButton("tickets")}
                onMouseUp={() => setPressedButton(null)}
                onMouseLeave={() => setPressedButton(null)}
                style={{
                  backgroundColor: "#2a5c45",
                  border: "none",
                  borderRadius: "20px",
                  padding: "5px 15px",
                  fontSize: "0.85rem",
                  transform:
                    pressedButton === "tickets" ? "scale(0.95)" : "scale(1)",
                  transition: "all 0.1s ease",
                }}
              >
                Charger les tickets
              </Button>
            </div>

            {ticketsError && <p style={{ color: "red" }}>{ticketsError}</p>}

            {tickets.length === 0 ? (
              <p className="text-muted">Aucun ticket à afficher.</p>
            ) : (
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>Titre</th>
                    <th>Utilisateur</th>
                    <th>Statut</th>
                    <th>Date</th>
                    <th>Voir</th>
                    <th>Supprimer</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((ticket) => (
                    <tr key={ticket.id_ticket}>
                      <td>{ticket.titre}</td>
                      <td>
                        {ticket.prenom} {ticket.nom}
                      </td>
                      <td>
                        <Badge
                          bg={
                            ticket.statut === "resolu"
                              ? "success"
                              : ticket.statut === "en_cours"
                                ? "warning"
                                : "danger"
                          }
                        >
                          {ticket.statut === "en_attente"
                            ? "En attente"
                            : ticket.statut === "en_cours"
                              ? "En cours"
                              : "Résolu"}
                        </Badge>
                      </td>
                      <td>
                        {new Date(ticket.date_creation).toLocaleDateString(
                          "fr-FR",
                        )}
                      </td>
                      <td>
                        <Button
                          onClick={() => handleOpenTicketModal(ticket)}
                          onMouseDown={() =>
                            setPressedButton(`view-${ticket.id_ticket}`)
                          }
                          onMouseUp={() => setPressedButton(null)}
                          onMouseLeave={() => setPressedButton(null)}
                          style={{
                            backgroundColor: "#5c7a9e",
                            border: "none",
                            borderRadius: "20px",
                            padding: "5px 15px",
                            fontSize: "0.85rem",
                            transform:
                              pressedButton === `view-${ticket.id_ticket}`
                                ? "scale(0.95)"
                                : "scale(1)",
                            transition: "all 0.1s ease",
                          }}
                        >
                          Voir
                        </Button>
                      </td>
                      <td>
                        <Button
                          onClick={() => handleDeleteTicket(ticket.id_ticket)}
                          onMouseDown={() =>
                            setPressedButton(`del-ticket-${ticket.id_ticket}`)
                          }
                          onMouseUp={() => setPressedButton(null)}
                          onMouseLeave={() => setPressedButton(null)}
                          style={{
                            backgroundColor: "#e05c5c",
                            border: "none",
                            borderRadius: "20px",
                            padding: "5px 15px",
                            fontSize: "0.85rem",
                            transform:
                              pressedButton === `del-ticket-${ticket.id_ticket}`
                                ? "scale(0.95)"
                                : "scale(1)",
                            transition: "all 0.1s ease",
                          }}
                        >
                          Supprimer
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </div>
        </Container>
      </main>

      {/* Modale de modification */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Modifier l'utilisateur</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editError && <p style={{ color: "red" }}>{editError}</p>}
          {editSuccess && <p style={{ color: "green" }}>{editSuccess}</p>}
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email_connexion"
                value={editData.email_connexion}
                onChange={handleEditChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Prénom</Form.Label>
              <Form.Control
                type="text"
                name="prenom"
                value={editData.prenom}
                onChange={handleEditChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Nom</Form.Label>
              <Form.Control
                type="text"
                name="nom"
                value={editData.nom}
                onChange={handleEditChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Pseudo</Form.Label>
              <Form.Control
                type="text"
                name="pseudo"
                value={editData.pseudo}
                onChange={handleEditChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Annuler
          </Button>

          <Button
            onClick={handleEditSubmit}
            style={{ backgroundColor: "#2a5c45", border: "none" }}
          >
            Sauvegarder
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showCommentModal}
        onHide={() => setShowCommentModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Commentaire interne — {commentUser?.prenom} {commentUser?.nom}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {commentError && <p style={{ color: "red" }}>{commentError}</p>}
          {commentSuccess && <p style={{ color: "green" }}>{commentSuccess}</p>}
          <Form>
            <Form.Group>
              <Form.Label>Commentaire</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Ajouter une note interne sur cet utilisateur..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowCommentModal(false)}
          >
            Annuler
          </Button>
          <Button variant="danger" onClick={() => setCommentText("")}>
            Effacer
          </Button>
          <Button
            onClick={handleCommentSubmit}
            style={{ backgroundColor: "#2a5c45", border: "none" }}
          >
            Sauvegarder
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showTicketModal}
        onHide={() => setShowTicketModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Ticket — {selectedTicket?.titre}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            <strong>Utilisateur :</strong> {selectedTicket?.prenom}{" "}
            {selectedTicket?.nom}
          </p>
          <p>
            <strong>Date :</strong>{" "}
            {selectedTicket &&
              new Date(selectedTicket.date_creation).toLocaleDateString(
                "fr-FR",
              )}
          </p>
          <p>
            <strong>Description :</strong>
          </p>
          <p
            style={{
              backgroundColor: "#f8f9fa",
              padding: "10px",
              borderRadius: "8px",
            }}
          >
            {selectedTicket?.description}
          </p>
          <p>
            <strong>Statut actuel :</strong>{" "}
            <Badge
              bg={
                selectedTicket?.statut === "resolu"
                  ? "success"
                  : selectedTicket?.statut === "en_cours"
                    ? "warning"
                    : "danger"
              }
            >
              {selectedTicket?.statut === "en_attente"
                ? "En attente"
                : selectedTicket?.statut === "en_cours"
                  ? "En cours"
                  : "Résolu"}
            </Badge>
          </p>
          <hr />
          <p>
            <strong>Changer le statut :</strong>
          </p>
          <div className="d-flex gap-2">
            <Button
              onClick={() =>
                handleUpdateStatut(selectedTicket.id_ticket, "en_attente")
              }
              style={{
                backgroundColor: "#e05c5c",
                border: "none",
                borderRadius: "20px",
                fontSize: "0.85rem",
              }}
            >
              En attente
            </Button>
            <Button
              onClick={() =>
                handleUpdateStatut(selectedTicket.id_ticket, "en_cours")
              }
              style={{
                backgroundColor: "#f0a500",
                border: "none",
                borderRadius: "20px",
                fontSize: "0.85rem",
              }}
            >
              En cours
            </Button>
            <Button
              onClick={() =>
                handleUpdateStatut(selectedTicket.id_ticket, "resolu")
              }
              style={{
                backgroundColor: "#2a5c45",
                border: "none",
                borderRadius: "20px",
                fontSize: "0.85rem",
              }}
            >
              Résolu
            </Button>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowTicketModal(false)}>
            Fermer
          </Button>
          <Button
            onClick={() => handleDeleteTicket(selectedTicket.id_ticket)}
            style={{ backgroundColor: "#e05c5c", border: "none" }}
          >
            Supprimer le ticket
          </Button>
        </Modal.Footer>
      </Modal>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
