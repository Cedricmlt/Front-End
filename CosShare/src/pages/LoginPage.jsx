import React, { useState } from "react";
import AuthService from "../services/AuthService";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await AuthService.LoginUser({
        email_connexion: email,
        password: password,
      });

      const { token } = data;
      localStorage.setItem("token", token);

      navigate("/home");
    } catch (error) {
      setError("Échec de la connexion. Veuillez vérifier vos identifiants.");
    }
  };

  return (
    <div style={{ backgroundColor: "#232F46", minHeight: "100vh" }}>
      <div className="ParentTitleForm">
        <h1 id="TitleForm">Cos Share</h1>
        <p id="SousTitleForm">Partagez votre passion !</p>
      </div>
      <Container id="FormLogin">
        <Row className="w-100 justify-content-center">
          <Col md={6} lg={4}>
            <Card className="p-4 shadow-sm">
              <h2 className="text-center mb-4">Connexion</h2>

              {error && <p className="text-danger text-center">{error}</p>}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>E-mail</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="test@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-2">
                  <Form.Label>Mot de passe</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>

                {/* Mot de passe oublié */}
                <div className="text-end mb-3">
                  <small
                    style={{ cursor: "pointer", color: "#0d6efd" }}
                    onClick={() => navigate("/forgot-password")}
                  >
                    Mot de passe oublié ?
                  </small>
                </div>

                <div className="d-grid gap-2">
                  <Button type="submit" id="ButtonForm1">
                    Connexion
                  </Button>

                  <Button
                    type="button"
                    id="ButtonForm2"
                    style={{
                      backgroundColor: "#1e4769",
                      borderColor: "#1e4769",
                      color: "#FFFFFF",
                    }}
                    onClick={() => navigate("/register")}
                  >
                    Inscription
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
          <Row className="align-items-center justify-content-center flex-nowrap">
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

export default LoginPage;
