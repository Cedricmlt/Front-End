import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import NavBarPrincipal from "../components/NavBar.jsx";
import Footer from "../components/Footer.jsx";
import FondEcran from "../assets/FondEcran.jpg";

const CreatePublication = () => {
  const navigate = useNavigate();
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);
  const [urlInput, setUrlInput] = useState("");
  const [urls, setUrls] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [previews, setPreviews] = useState([]);

  // Génère les aperçus des images sélectionnées
  useEffect(() => {
    const objectUrls = Array.from(files).map((file) =>
      URL.createObjectURL(file),
    );
    setPreviews(objectUrls);
    return () => objectUrls.forEach((url) => URL.revokeObjectURL(url));
  }, [files]);

  const handleAddUrl = () => {
    if (!urlInput.trim()) return;
    setUrls([...urls, urlInput.trim()]);
    setUrlInput("");
  };

  const handleRemoveUrl = (index) => {
    setUrls(urls.filter((_, i) => i !== index));
  };

  const handleAddTag = () => {
    const tag = tagInput.trim().replace(/^#/, "");
    if (!tag || tags.includes(tag)) return;
    setTags([...tags, tag]);
    setTagInput("");
  };

  const handleRemoveTag = (index) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!description.trim()) {
      setError("La description est obligatoire.");
      return;
    }
    if (files.length === 0 && urls.length === 0) {
      setError("Ajoutez au moins une image.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const pubResponse = await axios.post(
        "http://localhost:3000/api/publication",
        { description },
        { headers },
      );
      const publication_Id = pubResponse.data.newPublication;

      if (files.length > 0 || urls.length > 0) {
        const formData = new FormData();
        formData.append("publication_Id", publication_Id);
        Array.from(files).forEach((file) => formData.append("images", file));
        urls.forEach((url) => formData.append("urls", url));

        await axios.post(
          "http://localhost:3000/api/media-publication",
          formData,
          { headers: { ...headers, "Content-Type": "multipart/form-data" } },
        );
      }

      for (const label of tags) {
        try {
          // Crée le tag (ou récupère l'existant via le 409)
          let tag_Id;
          try {
            const tagRes = await axios.post(
              "http://localhost:3000/api/tags",
              { label },
              { headers },
            );
            tag_Id = tagRes.data.addTag;
          } catch (err) {
            if (err.response?.status === 409) {
              // Tag déjà existant, on récupère tous les tags et on trouve le bon
              const allTags = await axios.get(
                "http://localhost:3000/api/tags",
                { headers },
              );
              const found = allTags.data.tags.find((t) => t.label === label);
              tag_Id = found?.id_Tag;
            }
          }

          if (tag_Id) {
            await axios.post(
              "http://localhost:3000/api/publication-tags",
              { publication_Id, tag_Id },
              { headers },
            );
          }
        } catch (err) {
          console.error("Erreur tag :", err);
        }
      }

      setSuccess("Publication créée avec succès ! ✅");
      setTimeout(() => navigate("/home"), 1500);
    } catch (err) {
      console.error(err);
      setError("Une erreur est survenue lors de la création.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        backgroundImage: `url(${FondEcran})`,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <NavBarPrincipal />

      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          padding: "clamp(70px, 10vw, 100px) 15px 40px",
        }}
      >
        <div
          style={{
            width: "min(500px, 95vw)",
            backgroundColor: "#232F46",
            borderRadius: "12px",
            padding: "clamp(15px, 3vw, 30px)",
            color: "#FFFFFF",
          }}
        >
          <h4 style={{ marginBottom: "25px", textAlign: "center" }}>
            Créer une publication
          </h4>

          {error && (
            <p style={{ color: "#FF5555", marginBottom: "15px" }}>{error}</p>
          )}
          {success && (
            <p style={{ color: "#55FF88", marginBottom: "15px" }}>{success}</p>
          )}

          {/* Description */}
          <div style={{ marginBottom: "20px" }}>
            <label
              htmlFor="description"
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "bold",
              }}
            >
              Description *
            </label>
            <textarea
              id="description"
              rows={4}
              placeholder="Décrivez votre publication..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
                border: "none",
                backgroundColor: "#1a2538",
                color: "#FFFFFF",
                resize: "vertical",
                fontFamily: "inherit",
              }}
            />
          </div>

          {/* Upload fichiers */}
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "bold",
              }}
            >
              Images depuis l'ordinateur
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setFiles(e.target.files)}
              style={{ color: "#FFFFFF" }}
            />
            {/* Aperçus */}
            {previews.length > 0 && (
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  flexWrap: "wrap",
                  marginTop: "10px",
                }}
              >
                {previews.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt=""
                    style={{
                      width: "80px",
                      height: "80px",
                      objectFit: "cover",
                      borderRadius: "6px",
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* URLs d'images */}
          <div style={{ marginBottom: "20px" }}>
            <label
              htmlFor="urlInput"
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "bold",
              }}
            >
              Images via URL
            </label>
            <div style={{ display: "flex", gap: "8px" }}>
              <input
                id="urlInput"
                type="text"
                placeholder="https://exemple.com/image.jpg"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddUrl()}
                style={{
                  flex: 1,
                  padding: "8px 12px",
                  borderRadius: "8px",
                  border: "none",
                  backgroundColor: "#1a2538",
                  color: "#FFFFFF",
                }}
              />
              <button
                onClick={handleAddUrl}
                style={{
                  padding: "8px 15px",
                  borderRadius: "8px",
                  border: "none",
                  backgroundColor: "#4a90e2",
                  color: "#FFFFFF",
                  cursor: "pointer",
                }}
              >
                Ajouter
              </button>
            </div>
            {urls.map((url, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: "6px",
                  backgroundColor: "#1a2538",
                  padding: "6px 10px",
                  borderRadius: "6px",
                }}
              >
                <span
                  style={{
                    fontSize: "13px",
                    color: "#aaa",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    maxWidth: "380px",
                  }}
                >
                  {url}
                </span>
                <button
                  onClick={() => handleRemoveUrl(i)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#FF5555",
                    cursor: "pointer",
                    fontSize: "16px",
                  }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* Tags */}
          <div style={{ marginBottom: "25px" }}>
            <label
              htmlFor="tagInput"
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "bold",
              }}
            >
              Tags
            </label>
            <div style={{ display: "flex", gap: "8px" }}>
              <input
                id="tagInput"
                type="text"
                placeholder="#JeuVideo, #Cosplay..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
                style={{
                  flex: 1,
                  padding: "8px 12px",
                  borderRadius: "8px",
                  border: "none",
                  backgroundColor: "#1a2538",
                  color: "#FFFFFF",
                }}
              />
              <button
                onClick={handleAddTag}
                style={{
                  padding: "8px 15px",
                  borderRadius: "8px",
                  border: "none",
                  backgroundColor: "#4a90e2",
                  color: "#FFFFFF",
                  cursor: "pointer",
                }}
              >
                Ajouter
              </button>
            </div>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
                marginTop: "10px",
              }}
            >
              {tags.map((tag, i) => (
                <span
                  key={i}
                  style={{
                    backgroundColor: "#374761",
                    padding: "4px 10px",
                    borderRadius: "20px",
                    fontSize: "13px",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  #{tag}
                  <button
                    onClick={() => handleRemoveTag(i)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#FF5555",
                      cursor: "pointer",
                      fontSize: "14px",
                      padding: 0,
                    }}
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Boutons */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={() => navigate("/home")}
              style={{
                padding: "10px 25px",
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
              onClick={handleSubmit}
              disabled={isLoading}
              style={{
                padding: "10px 25px",
                borderRadius: "25px",
                border: "none",
                backgroundColor: "#4a90e2",
                color: "#FFFFFF",
                cursor: "pointer",
                opacity: isLoading ? 0.7 : 1,
              }}
            >
              {isLoading ? "Publication en cours..." : "Publier"}
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CreatePublication;
