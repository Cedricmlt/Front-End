import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Card,
  Alert,
} from "react-bootstrap";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/api/users/forgot-password",
        { email_connexion: email },
      );
      setMessage(response.data.message);
      setError("");
    } catch (err) {
      setError("Une erreur est survenue. Veuillez réessayer.");
      setMessage("");
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#232F46",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
      className="ParentTitleForm"
    >
      <Container className="flex-grow-1 d-flex flex-column">
        <Row className="justify-content-center text-center">
          <div className="ParentTitleForm">
            <h1 id="TitleForm">Cos Share</h1>
            <p id="SousTitleForm">Partagez votre passion !</p>
          </div>
        </Row>
        <Row className="FormForgotPass">
          <Col md={6} lg={4}>
            <Card
              style={{
                borderRadius: "10px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                padding: "2rem",
                backgroundColor: "#FFFFFF",
              }}
            >
              <Card.Body>
                <h2
                  className="text-center mb-4"
                  style={{
                    color: "#1E3A5F",
                    fontFamily: "Calibri, sans-serif",
                  }}
                >
                  Mot de passe oublié
                </h2>
                {message && <Alert variant="success">{message}</Alert>}
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label style={{ color: "#1E3A5F" }}>E-mail</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Entrez votre email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      style={{ borderColor: "#1E3A5F" }}
                    />
                  </Form.Group>
                  <div className="d-grid gap-2">
                    <Button
                      type="submit"
                      variant="primary"
                      style={{
                        backgroundColor: "#1E3A5F",
                        borderColor: "#1E3A5F",
                      }}
                    >
                      Envoyer le lien de réinitialisation
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      style={{
                        backgroundColor: "#2A5244"
                      }}
                      onClick={() => navigate("/login")}
                    >
                      Retour à la connexion
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ForgotPasswordPage;
