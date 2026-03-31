import React, { useState } from "react";
import AuthService from "../services/AuthService";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import Footer from "../components/Footer";

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
      <div
        className="ParentTitleForm"
        style={{
          textAlign: "center",
          padding: "20px 10px 0px 10px",
        }}
      >
        <h1 id="TitleForm">Cos Share</h1>
        <p id="SousTitleForm">Partagez votre passion !</p>
      </div>
      <Container id="FormLogin" style={{ padding: "20px 15px" }}>
        <Row className="w-100 justify-content-center">
          <Col xs={12} sm={10} md={6} lg={4}>
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
                    role="button"
                    tabIndex={0}
                    aria-label="Mot de passe oublié, cliquez pour réinitialiser"
                    style={{ cursor: "pointer", color: "#0d6efd" }}
                    onClick={() => navigate("/forgot-password")}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        navigate("/forgot-password");
                      }
                    }}
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

      <Footer />
    </div>
  );
};

export default LoginPage;
