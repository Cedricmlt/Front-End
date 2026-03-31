import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import NavBarPrincipal from "../components/NavBar.jsx";
import Footer from "../components/Footer.jsx";
import FondEcran from "../assets/FondEcran.jpg";
import { IoMoonOutline } from "react-icons/io5";
import { GoAlert } from "react-icons/go";
import { AiOutlineMail } from "react-icons/ai";
import { IoMdNotificationsOutline } from "react-icons/io";
import { MdOutlineDelete } from "react-icons/md";

const ReglagesPage = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifPush, setNotifPush] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [password, setPassword] = useState("");
  const [deleteError, setDeleteError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const token = localStorage.getItem("token");
  const decoded = token ? JSON.parse(atob(token.split(".")[1])) : null;

  const handleDeleteAccount = async () => {
    if (!password.trim()) {
      setDeleteError("Veuillez entrer votre mot de passe.");
      return;
    }

    setIsLoading(true);
    setDeleteError(null);

    try {
      // Récupérer l'email de l'utilisateur connecté
      const userRes = await axios.get(
        `http://localhost:3000/api/users/${decoded.id_Users}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      // Vérifier le mot de passe via le login
      await axios.post("http://localhost:3000/api/users/login", {
        email_connexion: userRes.data.user.email_connexion,
        password: password,
      });

      const headers = { Authorization: `Bearer ${token}` };
      const id = decoded.id_Users;

      // 1. Supprimer les publications et leurs données liées
      const pubRes = await axios.get(`http://localhost:3000/api/publication`, {
        headers,
      });
      const mesPubs = pubRes.data.publication.filter((p) => p.users_Id === id);

      for (const pub of mesPubs) {
        // Médias
        const mediasRes = await axios.get(
          `http://localhost:3000/api/media-publication/publication/${pub.id_Publication}`,
          { headers },
        );
        for (const media of mediasRes.data.medias) {
          await axios.delete(
            `http://localhost:3000/api/media-publication/${media.id_Media}`,
            { headers },
          );
        }
        // Commentaires
        const commentsRes = await axios.get(
          `http://localhost:3000/api/user-publication-comment/publication/${pub.id_Publication}`,
        );
        for (const comment of commentsRes.data.comments) {
          await axios.delete(
            `http://localhost:3000/api/user-publication-comment/${comment.id_comment}`,
            { headers },
          );
        }
        // Likes
        const likersRes = await axios.get(
          `http://localhost:3000/api/user-publication-like/likers/${pub.id_Publication}`,
          { headers },
        );
        for (const liker of likersRes.data.likers) {
          await axios.delete(
            `http://localhost:3000/api/user-publication-like/${liker.id_Users}/${pub.id_Publication}`,
            { headers },
          );
        }
        // Tags
        const tagsRes = await axios.get(
          `http://localhost:3000/api/publication-tags`,
          { headers },
        );
        const pubTags = tagsRes.data.publicationsTags.filter(
          (t) => t.publication_Id === pub.id_Publication,
        );
        for (const tag of pubTags) {
          await axios.delete(
            `http://localhost:3000/api/publication-tags/${pub.id_Publication}/${tag.tag_Id}`,
            { headers },
          );
        }
        // Publication
        await axios.delete(
          `http://localhost:3000/api/publication/${pub.id_Publication}`,
          { headers },
        );
      }

      // 2. Supprimer les follows
      const followRes = await axios.get(`http://localhost:3000/api/follow`, {
        headers,
      });
      const mesFollows = followRes.data.follow.filter(
        (f) => f.id_Follower === id || f.id_Followed === id,
      );
      for (const follow of mesFollows) {
        await axios.delete(
          `http://localhost:3000/api/follow/${follow.id_Follower}/${follow.id_Followed}`,
          { headers },
        );
      }

      // 3. Supprimer le compte
      await axios.delete(`http://localhost:3000/api/users/${id}`, { headers });

      localStorage.removeItem("token");
      navigate("/login");
    } catch (err) {
      console.error("Erreur suppression :", err.response?.data);
      if (err.response?.status === 401) {
        setDeleteError("Mot de passe incorrect.");
      } else {
        setDeleteError(
          "Une erreur est survenue : " +
            (err.response?.data?.message || "inconnue"),
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const menuItems = [
    {
      icon: <IoMoonOutline size={20} />,
      label: "Thème (Light/Dark)",
      action: () => setDarkMode(!darkMode),
      right: (
        <div
          onClick={() => setDarkMode(!darkMode)}
          style={{
            width: "46px",
            height: "26px",
            borderRadius: "13px",
            backgroundColor: darkMode ? "#4a90e2" : "#374761",
            position: "relative",
            cursor: "pointer",
            transition: "background 0.3s",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "3px",
              left: darkMode ? "23px" : "3px",
              width: "20px",
              height: "20px",
              borderRadius: "50%",
              backgroundColor: "#FFFFFF",
              transition: "left 0.3s",
            }}
          />
        </div>
      ),
    },
    {
      icon: <GoAlert size={20} />,
      label: "Signaler un problème",
      action: () => alert("Fonctionnalité à venir"),
    },
    {
      icon: <AiOutlineMail size={20} />,
      label: "Notifications E-mail",
      right: (
        <div
          onClick={() => setNotifEmail(!notifEmail)}
          style={{
            width: "46px",
            height: "26px",
            borderRadius: "13px",
            backgroundColor: notifEmail ? "#4a90e2" : "#374761",
            position: "relative",
            cursor: "pointer",
            transition: "background 0.3s",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "3px",
              left: notifEmail ? "23px" : "3px",
              width: "20px",
              height: "20px",
              borderRadius: "50%",
              backgroundColor: "#FFFFFF",
              transition: "left 0.3s",
            }}
          />
        </div>
      ),
    },
    {
      icon: <IoMdNotificationsOutline size={20} />,
      label: "Notifications Push",
      right: (
        <div
          onClick={() => setNotifPush(!notifPush)}
          style={{
            width: "46px",
            height: "26px",
            borderRadius: "13px",
            backgroundColor: notifPush ? "#4a90e2" : "#374761",
            position: "relative",
            cursor: "pointer",
            transition: "background 0.3s",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "3px",
              left: notifPush ? "23px" : "3px",
              width: "20px",
              height: "20px",
              borderRadius: "50%",
              backgroundColor: "#FFFFFF",
              transition: "left 0.3s",
            }}
          />
        </div>
      ),
    },
    {
      icon: <MdOutlineDelete size={20} />,
      label: "Supprimer mon compte",
      action: () => setShowDeleteModal(true),
      danger: true,
    },
  ];

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
            padding: "30px",
            width: "400px",
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
            Réglages
          </h2>

          {menuItems.map((item, i) => (
            <div
              key={i}
              onClick={item.action}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "15px",
                borderRadius: "10px",
                marginBottom: "10px",
                backgroundColor: "#1a2538",
                cursor: item.action ? "pointer" : "default",
                color: item.danger ? "#FF5555" : "#FFFFFF",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "15px" }}
              >
                <span style={{ fontSize: "20px" }}>{item.icon}</span>
                <span style={{ fontSize: "15px" }}>{item.label}</span>
              </div>
              {item.right && (
                <div onClick={(e) => e.stopPropagation()}>{item.right}</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Modale suppression */}
      {showDeleteModal && (
        <div
          onClick={() => setShowDeleteModal(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "#232F46",
              borderRadius: "12px",
              padding: "35px",
              width: "380px",
              color: "#FFFFFF",
            }}
          >
            <h3
              style={{
                textAlign: "center",
                marginBottom: "10px",
                color: "#FF5555",
              }}
            >
              Supprimer mon compte
            </h3>
            <p
              style={{
                textAlign: "center",
                color: "#aaa",
                marginBottom: "25px",
                fontSize: "14px",
              }}
            >
              Cette action est irréversible. Confirmez avec votre mot de passe.
            </p>

            {deleteError && (
              <p
                style={{
                  color: "#FF5555",
                  marginBottom: "15px",
                  textAlign: "center",
                }}
              >
                {deleteError}
              </p>
            )}

            <input
              type="password"
              placeholder="Votre mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleDeleteAccount()}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
                border: "none",
                backgroundColor: "#1a2538",
                color: "#FFFFFF",
                marginBottom: "20px",
                boxSizing: "border-box",
              }}
            />

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setPassword("");
                  setDeleteError(null);
                }}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "25px",
                  border: "none",
                  backgroundColor: "#374761",
                  color: "#FFFFFF",
                  cursor: "pointer",
                }}
              >
                Annuler
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={isLoading}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "25px",
                  border: "none",
                  backgroundColor: "#FF5555",
                  color: "#FFFFFF",
                  cursor: "pointer",
                  opacity: isLoading ? 0.7 : 1,
                }}
              >
                {isLoading ? "Suppression..." : "Supprimer"}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ReglagesPage;
