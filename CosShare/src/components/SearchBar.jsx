import React, { useState } from "react";
import {
  Col,
  Container,
  FormControl,
  Row,
  Form,
  Button,
} from "react-bootstrap";

const SearchBar = ({ searchTerm, onInputChange, onSearch }) => {
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <div style={{ backgroundColor: "#232F46", padding: "10px 0" }}>
      <Container>
        <Row className="justify-content-center">
          <Col md={6}>
            <Form className="d-flex" onSubmit={handleSubmit}>
              <FormControl
                type="search"
                placeholder="Rechercher une publication, un utilisateur..."
                className="me-2"
                aria-label="Search"
                style={{ borderRadius: "25px" }}
                value={searchTerm}
                onChange={(e) => onInputChange(e.target.value)}
              ></FormControl>
              <Button
                variant="outline-light"
                type="submit"
                id="ButtonSearchBar"
                style={{ borderRadius: "25px" }}
              >
                Rechercher
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default SearchBar;
