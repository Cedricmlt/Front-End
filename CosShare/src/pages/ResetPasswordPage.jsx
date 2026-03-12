import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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

const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Les données ne correspondent pas.");
      return;
    }
    try {
      const response = await axios.post(
        `http://localhost:3000/api/users/reset-password/${token}`,
        { password },
      );
      setMessage(response.data.message);
      setError("");
      setTimeout(() => navigate("/login"), 3000);
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
          <Col md={4} lg={6}>
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
                    fontFamily:
                      "'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif",
                  }}
                >
                  Réinitialiser le mot de passe
                </h2>
                {message && <Alert variant="success">{message}</Alert>}
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label style={{ color: "#1E3A5F" }}>
                      Nouveau mot de passe
                    </Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Entrez un nouveau mot de passe"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      style={{ borderColor: "#1E3A5F" }}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label style={{ color: "#1E3A5F" }}>
                      Confirmer le mot de passe
                    </Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Confirmez le nouveau mot de passe"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      style={{ borderColor: "#1E3A5F" }}
                    />
                  </Form.Group>
                  <div className="d-grid gap-2">
                    <Button
                      type="submit"
                      variant="primary"
                      style={{
                        backgroundColor: "#2A5244",
                        borderColor: "#2A5244",
                      }}
                    >
                      Réinitialiser le mot de passe
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

export default ResetPasswordPage;
