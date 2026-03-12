import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/AuthService";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";

const RegisterPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email_connexion: "",
    password: "",
    prenom: "",
    nom: "",
    pseudo: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await AuthService.RegisterUser(form);
      navigate("/login"); // 👉 après inscription → login
    } catch (err) {
      setError("Un problème est survenu lors de l'inscription.");
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#232F46",
        minHeight: "100vh",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "50px",
        flexDirection: "column",
      }}
    >
      <div className="ParentTitleForm">
        <h1 id="TitleForm">Cos Share</h1>
        <p id="SousTitleForm">Partagez votre passion !</p>
      </div>
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card className="p-4 p-md-5 shadow-lg">
              <h2 className="text-center mb-4">Inscription</h2>

              {error && <p className="text-danger text-center mb-3">{error}</p>}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email_connexion"
                    placeholder="email@gmail.com"
                    value={form.email_connexion}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Mot de passe</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="Mot de passe"
                    value={form.password}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Prénom</Form.Label>
                      <Form.Control
                        type="text"
                        name="prenom"
                        placeholder="Prénom"
                        value={form.prenom}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Nom</Form.Label>
                      <Form.Control
                        type="text"
                        name="nom"
                        placeholder="Nom"
                        value={form.nom}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-4">
                  <Form.Label>Pseudo</Form.Label>
                  <Form.Control
                    type="text"
                    name="pseudo"
                    placeholder="Pseudo"
                    value={form.pseudo}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <div className="d-grid gap-2">
                  <Button
                    type="submit"
                    style={{
                      backgroundColor: "#1e4769",
                      borderColor: "#1e4769",
                      color: "#FFFFFF",
                    }}
                  >
                    S'inscrire
                  </Button>

                  <Button id="ButtonForm1" onClick={() => navigate("/login")}>
                    Déjà un compte ? Connexion
                  </Button>
                </div>
              </Form>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Pied de page */}
      <footer
        className="mt-auto py-3"
        style={{ backgroundColor: "#232F46", color: "#FFFFFF" }}
      >
        <Container id="FooterElements">
          <Row className="align-items-center justify-content-between flex-nowrap">
            <Col xs="auto">
              <p className="mb-0">© 2026 CosShare. Tous droits réservés</p>
            </Col>

            <Col xs="auto">
              <p className="mb-0">Contact</p>
            </Col>

            <Col xs="auto">
              <p className="mb-0">À propos</p>
            </Col>

            <Col xs="auto">
              <p className="mb-0">Confidentialité</p>
            </Col>

            <Col xs="auto">
              <p className="mb-0">Conditions d'utilisation</p>
            </Col>
          </Row>
        </Container>
      </footer>
    </div>
  );
};

export default RegisterPage;
