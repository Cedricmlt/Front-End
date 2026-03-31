import React, { useEffect, useState } from "react";
import axios from "axios";
import NavBarPrincipal from "../components/NavBar.jsx";
import Footer from "../components/Footer.jsx";
import FondEcran from "../assets/FondEcran.jpg";

const ProfilPage = () => {
  const [user, setUser] = useState(null);
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [pseudo, setPseudo] = useState("");
  const [email, setEmail] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      const decoded = JSON.parse(atob(token.split(".")[1]));
      const response = await axios.get(
        `http://localhost:3000/api/users/${decoded.id_Users}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const u = response.data.user;
      setUser(u);
      setPrenom(u.prenom);
      setNom(u.nom);
      setPseudo(u.pseudo);
      setEmail(u.email_connexion);
      setPhotoPreview(u.photo_profil);
    };
    fetchUser();
  }, []);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem("token");
      const decoded = JSON.parse(atob(token.split(".")[1]));

      let currentPhotoUrl = user?.photo_profil;

      // Upload de la photo si une nouvelle a été choisie
      if (photoFile) {
        const formData = new FormData();
        formData.append("photo", photoFile);

        const uploadRes = await axios.put(
          `http://localhost:3000/api/users/${decoded.id_Users}/photo`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          },
        );
        currentPhotoUrl = uploadRes.data.photo_profil;
        setPhotoPreview(currentPhotoUrl);
        setPhotoFile(null);
      }

      // Mise à jour des infos texte
      await axios.put(
        `http://localhost:3000/api/users/${decoded.id_Users}`,
        {
          email_connexion: email,
          prenom,
          nom,
          pseudo,
          photo_profil: currentPhotoUrl,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setUser((prev) => ({ ...prev, photo_profil: currentPhotoUrl }));
      setSuccess("Profil mis à jour avec succès ! ✅");
    } catch (err) {
      console.error(err);
      setError("Une erreur est survenue lors de la mise à jour.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div style={{ backgroundImage: `url(${FondEcran})`, minHeight: "100vh" }}>
      <NavBarPrincipal />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          paddingTop: "100px",
          paddingBottom: "80px",
        }}
      >
        <div
          style={{
            backgroundColor: "#232F46",
            borderRadius: "12px",
            padding: "40px",
            width: "500px",
            color: "#FFFFFF",
          }}
        >
          <h2
            style={{
              textAlign: "center",
              marginBottom: "30px",
              fontFamily: "Calibri, sans-serif",
            }}
          >
            Mon Profil
          </h2>

          {/* Photo de profil */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginBottom: "30px",
            }}
          >
            <img
              src={photoPreview}
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                objectFit: "cover",
                marginBottom: "15px",
              }}
            />
            <label
              style={{
                padding: "8px 20px",
                borderRadius: "20px",
                backgroundColor: "#374761",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              Changer la photo
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                style={{ display: "none" }}
              />
            </label>
          </div>

          {error && (
            <p style={{ color: "#FF5555", marginBottom: "15px" }}>{error}</p>
          )}
          {success && (
            <p style={{ color: "#55FF88", marginBottom: "15px" }}>{success}</p>
          )}

          {/* Champs */}
          {[
            { label: "Prénom", value: prenom, setter: setPrenom },
            { label: "Nom", value: nom, setter: setNom },
            { label: "Pseudo", value: pseudo, setter: setPseudo },
            { label: "Email", value: email, setter: setEmail },
          ].map(({ label, value, setter }) => (
            <div key={label} style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "bold",
                }}
              >
                {label}
              </label>
              <input
                type="text"
                value={value}
                onChange={(e) => setter(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  border: "none",
                  backgroundColor: "#1a2538",
                  color: "#FFFFFF",
                  boxSizing: "border-box",
                }}
              />
            </div>
          ))}

          <button
            onClick={handleSubmit}
            disabled={isLoading}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "25px",
              border: "none",
              backgroundColor: "#4a90e2",
              color: "#FFFFFF",
              cursor: "pointer",
              fontSize: "16px",
              opacity: isLoading ? 0.7 : 1,
            }}
          >
            {isLoading ? "Mise à jour..." : "Sauvegarder"}
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProfilPage;
