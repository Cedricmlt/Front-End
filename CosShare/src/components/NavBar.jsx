import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import AuthService from "../services/AuthService";
import { useNavigate, useLocation } from "react-router-dom";

const NavBarPrincipal = ({ onReset }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    AuthService.LogoutUser();
    navigate("/login");
  };

  const handleHomeClick = () => {
    if (onReset) {
      onReset(); // Appelle la fonction de réinitialisation
    }
  };

  const location = useLocation();
  const isAdmin = location.pathname === "/admin";

  const token = localStorage.getItem("token");
  const payload = token ? JSON.parse(atob(token.split(".")[1])) : null;
  const isAdminUser = payload?.type_de_compte === "admin";

  return (
    <Navbar expand="lg" id="NavBarParent">
      <Container>
        <Container id="TitleBloc">
          <Navbar.Brand
            onClick={() => {
              navigate("/home");
              handleHomeClick();
            }}
            id="CosShareTitle"
            style={{ cursor: "pointer" }}
          >
            Cos Share
          </Navbar.Brand>
          <Navbar.Brand
            onClick={() => {
              navigate("/home");
              handleHomeClick();
            }}
            id="SousTitle"
            style={{ cursor: "pointer" }}
          >
            Partagez votre passion !
          </Navbar.Brand>
        </Container>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="NavBarElements">
          <Nav className="mx-auto" id="OngletsNavBar">
            <Nav.Link
              onClick={() => {
                navigate("/home");
                handleHomeClick();
              }}
              id="Home"
            >
              Accueil
            </Nav.Link>

            <NavDropdown title="Cosplay" id="Cosplay">
              <NavDropdown.Item href="#action/3.1" id="CosplayMenu1">
                Créer un cosplay
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2" id="CosplayMenu2">
                Faire une estimation
              </NavDropdown.Item>
            </NavDropdown>

            <NavDropdown title="Publication" id="Publication">
              <NavDropdown.Item
                onClick={() => navigate("/create-publication")}
                id="PublicationMenu1"
              >
                Créer une publication
              </NavDropdown.Item>
            </NavDropdown>

            <NavDropdown title="Actualité" id="Actuality">
              <NavDropdown.Item href="#action/3.1" id="ActualityMenu1">
                Voir les actualités
              </NavDropdown.Item>
            </NavDropdown>

            <NavDropdown title="Messagerie" id="Message">
              <NavDropdown.Item href="#action/3.1" id="MessagerieMenu1">
                Envoyer un message
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2" id="MessagerieMenu2">
                Voir les conversations
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3" id="MessagerieMenu3">
                Créer une conversation de groupe
              </NavDropdown.Item>
            </NavDropdown>

            <NavDropdown title="Mon profil" id="MonProfil">
              <NavDropdown.Item
                onClick={() => navigate("/profil")}
                id="MonProfilMenu1"
              >
                Voir mon profil
              </NavDropdown.Item>
              {isAdminUser && (
                <NavDropdown.Item
                  onClick={() => navigate(isAdmin ? "/home" : "/admin")}
                  id="MonProfilMenu2"
                >
                  {isAdmin ? "Retour CosShare" : "Espace Administrateur"}
                </NavDropdown.Item>
              )}
              <NavDropdown.Item
                onClick={() => navigate("/reglages")}
                id="MonProfilMenu3"
              >
                Reglages
              </NavDropdown.Item>
              <NavDropdown.Item
                as="button"
                id="MonProfilMenu4"
                onClick={handleLogout}
              >
                Déconnexion
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBarPrincipal;
