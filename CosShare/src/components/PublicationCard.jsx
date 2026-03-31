import React, { useEffect, useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { FaRegCommentDots } from "react-icons/fa";
import { IoIosMore } from "react-icons/io";
import axios from "axios";

const PublicationCard = ({
  id_Publication,
  pseudo,
  description,
  pastilleUrl,
  objectPosition,
  carouselImages,
  id_Users,
  currentUser,
  id_PublicationOwner,
  cree_le,
}) => {
  const profilePic =
    pastilleUrl ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(pseudo)}&background=374761&color=fff`;
  // Etats
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentText, setEditingCommentText] = useState("");
  const [showLikers, setShowLikers] = useState(false);
  const [likers, setLikers] = useState([]);
  const [followedUsers, setFollowedUsers] = useState([]);
  const [timeAgo, setTimeAgo] = useState("");
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [publicationTags, setPublicationTags] = useState([]);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editDescription, setEditDescription] = useState("");
  const [editFiles, setEditFiles] = useState([]);
  const [editPreviews, setEditPreviews] = useState([]);
  const [editUrlInput, setEditUrlInput] = useState("");
  const [editUrls, setEditUrls] = useState([]);
  const [editTagInput, setEditTagInput] = useState("");
  const [editTags, setEditTags] = useState([]);
  const [editError, setEditError] = useState(null);
  const [editSuccess, setEditSuccess] = useState(null);
  const [editIsLoading, setEditIsLoading] = useState(false);

  // Fermeture des modales avec la touche Échap
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setShowOptionsModal(false);
        setShowComments(false);
        setShowLikers(false);
        setShowEditModal(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const createdAt = new Date(dateString);
    const seconds = Math.floor((now - createdAt) / 1000);

    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) {
      return `Publiée il y a ${interval} an${interval > 1 ? "s" : ""}`;
    }

    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) {
      return `Publiée il y a ${interval} mois`;
    }

    interval = Math.floor(seconds / 86400);
    if (interval >= 1) {
      return `Publiée il y a ${interval} jour${interval > 1 ? "s" : ""}`;
    }

    interval = Math.floor(seconds / 3600);
    if (interval >= 1) {
      return `Publiée il y a ${interval} heure${interval > 1 ? "s" : ""}`;
    }

    interval = Math.floor(seconds / 60);
    if (interval >= 1) {
      return `Publiée il y a ${interval} minute${interval > 1 ? "s" : ""}`;
    }

    return "Publiée à l'instant";
  };

  useEffect(() => {
    if (cree_le) {
      setTimeAgo(formatTimeAgo(cree_le));
      const interval = setInterval(() => {
        setTimeAgo(formatTimeAgo(cree_le));
      }, 60000);
      return () => clearInterval(interval);
    }
  }, [cree_le]);

  // Génère les aperçus des nouveaux fichiers sélectionnés dans la modale d'édition
  useEffect(() => {
    const objectUrls = Array.from(editFiles).map((file) =>
      URL.createObjectURL(file),
    );
    setEditPreviews(objectUrls);
    return () => objectUrls.forEach((url) => URL.revokeObjectURL(url));
  }, [editFiles]);

  const fetchComments = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/user-publication-comment/publication/${id_Publication}`,
      );
      setComments(response.data.comments);
    } catch (error) {
      console.error("Erreur lors de la récupération des commentaires :", error);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/publication-tags`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      );
      const filtered = response.data.publicationsTags.filter(
        (t) => Number(t.publication_Id) === Number(id_Publication),
      );
      setPublicationTags(filtered);
    } catch (error) {
      console.error("Erreur lors de la récupération des tags :", error);
    }
  };

  const fetchFollowedUsers = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/follow`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const myFollows = response.data.follow
        .filter((f) => f.id_Follower === id_Users)
        .map((f) => f.id_Followed);
      setFollowedUsers(myFollows);
    } catch (error) {
      console.error("Erreur lors de la récupération des follows :", error);
    }
  };

  const fetchLikers = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/user-publication-like/likers/${id_Publication}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      );
      setLikers(response.data.likers);
      await fetchFollowedUsers();
    } catch (error) {
      console.error("Erreur lors de la récupération des likers :", error);
    }
  };

  const fetchLikeStatusAndCount = async () => {
    try {
      const likeResponse = await axios.get(
        `http://localhost:3000/api/user-publication-like/${id_Users}/${id_Publication}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      setIsLiked(true);

      const countResponse = await axios.get(
        `http://localhost:3000/api/user-publication-like/count/${id_Publication}`,
      );
      setLikeCount(countResponse.data.count);
    } catch (error) {
      if (error.response?.status === 404) {
        setIsLiked(false);
      } else {
        console.error("Erreur lors de la récupération du like :", error);
      }
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      await fetchLikeStatusAndCount();
      await fetchFollowedUsers();
      await fetchComments();
      await fetchTags();
    };
    fetchInitialData();
  }, [id_Users, id_Publication]);

  const handlePrev = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + carouselImages.length) % carouselImages.length,
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % carouselImages.length);
  };

  const handleLike = async () => {
    const newLikeState = !isLiked;
    try {
      setIsLiked(newLikeState);

      const url = `http://localhost:3000/api/user-publication-like`;
      const payload = {
        users_Id: id_Users,
        publication_Id: id_Publication,
        is_notified: 0,
      };

      if (newLikeState) {
        // Si on like, on envoie une requête POST
        await axios.post(url, payload, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Si tu utilises un token JWT
          },
        });
      } else {
        // Si on unlike, on envoie une requête DELETE
        await axios.delete(
          `${url}/${payload.users_Id}/${payload.publication_Id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );
      }

      const countResponse = await axios.get(
        `http://localhost:3000/api/user-publication-like/count/${id_Publication}`,
      );
      setLikeCount(countResponse.data.count);
    } catch (error) {
      if (error.response?.status === 409) {
        // ← like déjà existant, on force l'état à "liké" sans changer le count ✅
        setIsLiked(true);
      } else {
        console.error("Erreur lors de la gestion du like :", error);
        // Reviens en arrière en cas d'erreur
        setIsLiked(!newLikeState);
        setLikeCount(newLikeState ? likeCount - 1 : likeCount + 1);
      }
    }
  };

  const handleComment = async () => {
    if (!commentText.trim() || !id_Users) return;

    try {
      await axios.post(
        `http://localhost:3000/api/user-publication-comment`,
        {
          users_Id: id_Users,
          publication_Id: id_Publication,
          commentaire: commentText,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      );
      setCommentText("");
      fetchComments();
    } catch (error) {
      console.error("Erreur lors de l'envoi du commentaire :", error);
    }
  };

  const handleEditComment = async (id_comment) => {
    if (!editingCommentText.trim()) return;

    try {
      await axios.put(
        `http://localhost:3000/api/user-publication-comment/${id_comment}`,
        { commentaire: editingCommentText },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      );
      setEditingCommentId(null);
      setEditingCommentText("");
      fetchComments();
    } catch (error) {
      console.error("Erreur lors de la modification du commentaire :", error);
    }
  };

  const handleDeleteComment = async (id_comment) => {
    const confirm = window.confirm(
      "Voulez-vous vraiment supprimer ce commentaire ?",
    );
    if (!confirm) return;

    try {
      await axios.delete(
        `http://localhost:3000/api/user-publication-comment/${id_comment}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      );
      fetchComments();
    } catch (error) {
      console.error("Erreur lors de la suppression du commentaire :", error);
    }
  };

  const handleFollow = async (id_Followed) => {
    try {
      const isFollowed = followedUsers.includes(id_Followed);

      if (isFollowed) {
        await axios.delete(
          `http://localhost:3000/api/follow/${id_Users}/${id_Followed}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );
        setFollowedUsers(followedUsers.filter((id) => id !== id_Followed));
      } else {
        await axios.post(
          `http://localhost:3000/api/follow`,
          { id_Follower: id_Users, id_Followed },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );
        setFollowedUsers([...followedUsers, id_Followed]);
      }
    } catch (error) {
      console.error("Erreur lors du follow/unfollow :", error);
    }
  };

  const handleDeletePublication = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      };

      //  Supprimer les médias
      const mediasResponse = await axios.get(
        `http://localhost:3000/api/media-publication/publication/${id_Publication}`,
        { headers },
      );
      for (const media of mediasResponse.data.medias) {
        await axios.delete(
          `http://localhost:3000/api/media-publication/${media.id_Media}`,
          { headers },
        );
      }

      //  Supprimer les commentaires
      const commentsResponse = await axios.get(
        `http://localhost:3000/api/user-publication-comment/publication/${id_Publication}`,
      );
      for (const comment of commentsResponse.data.comments) {
        await axios.delete(
          `http://localhost:3000/api/user-publication-comment/${comment.id_comment}`,
          { headers },
        );
      }

      //  Supprimer les likes
      const likersResponse = await axios.get(
        `http://localhost:3000/api/user-publication-like/likers/${id_Publication}`,
        { headers },
      );
      for (const liker of likersResponse.data.likers) {
        await axios.delete(
          `http://localhost:3000/api/user-publication-like/${liker.id_Users}/${id_Publication}`,
          { headers },
        );
      }

      //  Supprimer les tags liés
      const allTagsResponse = await axios.get(
        `http://localhost:3000/api/publication-tags`,
        { headers },
      );
      const publicationTags = allTagsResponse.data.publicationsTags.filter(
        (t) => t.publication_Id === id_Publication,
      );
      for (const tag of publicationTags) {
        await axios.delete(
          `http://localhost:3000/api/publication-tags/${id_Publication}/${tag.tag_Id}`,
          { headers },
        );
      }

      // Supprimer la publication
      await axios.delete(
        `http://localhost:3000/api/publication/${id_Publication}`,
        { headers },
      );

      window.location.reload();
    } catch (error) {
      console.error("Erreur lors de la suppression de la publication :", error);
    }
  };

  // ─── Ouverture de la modale d'édition (pré-remplissage) ──────────────────────
  const handleOpenEditModal = () => {
    setEditDescription(description);
    setEditFiles([]);
    setEditPreviews([]);
    setEditUrlInput("");
    setEditUrls([]);
    setEditTagInput("");
    setEditTags([]);
    setEditError(null);
    setEditSuccess(null);
    setShowOptionsModal(false);
    setShowEditModal(true);
  };

  // ─── Gestion des URLs ─────────────────────────────────────────────────────────
  const handleEditAddUrl = () => {
    if (!editUrlInput.trim()) return;
    setEditUrls([...editUrls, editUrlInput.trim()]);
    setEditUrlInput("");
  };

  const handleEditRemoveUrl = (index) => {
    setEditUrls(editUrls.filter((_, i) => i !== index));
  };

  // ─── Gestion des tags ─────────────────────────────────────────────────────────
  const handleEditAddTag = () => {
    const tag = editTagInput.trim().replace(/^#/, "");
    if (!tag || editTags.includes(tag)) return;
    setEditTags([...editTags, tag]);
    setEditTagInput("");
  };

  const handleEditRemoveTag = (index) => {
    setEditTags(editTags.filter((_, i) => i !== index));
  };

  const handleEditSubmit = async () => {
    if (!editDescription.trim()) {
      setEditError("La description est obligatoire.");
      return;
    }

    setEditIsLoading(true);
    setEditError(null);

    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      await axios.put(
        `http://localhost:3000/api/publication/${id_Publication}`,
        { description: editDescription },
        { headers },
      );

      if (editFiles.length > 0 || editUrls.length > 0) {
        // Récupération des anciens médias
        const mediasResponse = await axios.get(
          `http://localhost:3000/api/media-publication/publication/${id_Publication}`,
          { headers },
        );

        // Suppression un par un
        for (const media of mediasResponse.data.medias) {
          await axios.delete(
            `http://localhost:3000/api/media-publication/${media.id_Media}`,
            { headers },
          );
        }

        // Ajout des nouveaux médias
        const formData = new FormData();
        formData.append("publication_Id", id_Publication);
        Array.from(editFiles).forEach((file) =>
          formData.append("images", file),
        );
        editUrls.forEach((url) => formData.append("urls", url));

        await axios.post(
          "http://localhost:3000/api/media-publication",
          formData,
          { headers: { ...headers, "Content-Type": "multipart/form-data" } },
        );
      }

      for (const tag of publicationTags) {
        await axios.delete(
          `http://localhost:3000/api/publication-tags/${id_Publication}/${tag.tag_Id}`,
          { headers },
        );
      }

      for (const label of editTags) {
        try {
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
              { publication_Id: id_Publication, tag_Id },
              { headers },
            );
          }
        } catch (err) {
          console.error("Erreur tag :", err);
        }
      }

      setEditSuccess("Publication modifiée avec succès ! ✅");
      setTimeout(() => {
        setShowEditModal(false);
        window.location.reload();
      }, 1500);
    } catch (err) {
      console.error(err);
      setEditError("Une erreur est survenue lors de la modification.");
    } finally {
      setEditIsLoading(false);
    }
  };

  return (
    // La card de la publication
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "min(470px, 95vw)",
        margin: "0 auto",
        paddingTop: "90px",
      }}
    >
      {/* Les 3 points ... */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          backgroundColor: "#232F46",
          borderRadius: "10px 10px 0px 0px",
          color: "#FFFFFF",
        }}
      >
        {/* Le pseudo */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "13px",
            paddingLeft: "15px",
            margin: "10px",
          }}
        >
          <img
            src={profilePic}
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              objectFit: "cover",
            }}
            alt="Un utilisateur portant un costume."
          />
          <span id="PseudoUserCard" style={{ whiteSpace: "nowrap" }}>
            {pseudo}
          </span>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginLeft: "150px",
          }}
        >
          {id_Users !== id_PublicationOwner && (
            <button
              onClick={() => handleFollow(id_PublicationOwner)}
              style={{
                padding: "4px 12px",
                borderRadius: "5px",
                border: "none",
                backgroundColor: followedUsers.includes(id_PublicationOwner)
                  ? "#374761"
                  : "#4a90e2",
                color: "#FFFFFF",
                cursor: "pointer",
                fontSize: "13px",
              }}
            >
              {followedUsers.includes(id_PublicationOwner)
                ? "Suivi(e)"
                : "Suivre"}
            </button>
          )}
        </div>
        {/* Réglage du style des 3 points ... */}
        <IoIosMore
          onClick={() => setShowOptionsModal(true)}
          role="button"
          tabIndex={0}
          aria-label="Options de la publication"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") setShowOptionsModal(true);
          }}
          style={{
            width: "30px",
            height: "50px",
            margin: "13px",
            cursor: "pointer",
          }}
        />
      </div>

      {/* Carrousel */}
      <div style={{ position: "relative" }}>
        <img
          src={carouselImages[currentIndex]}
          alt={`Image ${currentIndex + 1} sur ${carouselImages.length}`}
          style={{
            width: "470px",
            height: "clamp(200px, 40vw, 350px)",
            objectFit: "cover",
            objectPosition: "center 35%",
          }}
        />

        {/* Bouton gauche */}
        <button
          onClick={handlePrev}
          style={{
            position: "absolute",
            left: "10px",
            top: "50%",
            transform: "translateY(-50%)",
            backgroundColor: "rgba(0,0,0,0.5)",
            color: "white",
            border: "none",
            borderRadius: "50%",
            width: "35px",
            height: "35px",
            cursor: "pointer",
            fontSize: "18px",
          }}
        >
          ‹
        </button>
        {/* Bouton droit */}
        <button
          onClick={handleNext}
          style={{
            position: "absolute",
            right: "10px",
            top: "50%",
            transform: "translateY(-50%)",
            backgroundColor: "rgba(0,0,0,0.5)",
            color: "white",
            border: "none",
            borderRadius: "50%",
            width: "35px",
            height: "35px",
            cursor: "pointer",
            fontSize: "18px",
          }}
        >
          ›
        </button>
        {/* Points indicateurs */}
        <div
          style={{
            position: "absolute",
            bottom: "10px",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            gap: "6px",
          }}
        >
          {carouselImages.map((_, i) => (
            <div
              key={i}
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor:
                  i === currentIndex ? "white" : "rgba(255,255,255,0.5)",
              }}
            />
          ))}
        </div>
      </div>

      {/* Les icônes*/}
      <div
        style={{
          backgroundColor: "#232F46",
          borderRadius: "0px 0px 10px 10px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "20px",
            alignItems: "center",
            paddingLeft: "10px",
            zIndex: 10,
          }}
        >
          <div
            onClick={handleLike}
            role="button"
            tabIndex={0}
            aria-label={isLiked ? "Ne plus aimer" : "Aimer"}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") handleLike();
            }}
            style={{ cursor: "pointer" }}
          >
            {isLiked ? (
              <FaHeart
                style={{
                  width: "30px",
                  height: "35px",
                  color: "red",
                  margin: "10px",
                }}
              />
            ) : (
              <FaRegHeart
                style={{
                  width: "30px",
                  height: "35px",
                  color: "#FFFFFF",
                  margin: "10px",
                }}
              />
            )}
          </div>

          <FaRegCommentDots
            onClick={() => {
              setShowComments(!showComments);
              if (!showComments) fetchComments();
            }}
            role="button"
            tabIndex={0}
            aria-label="Voir les commentaires"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                setShowComments(!showComments);
                if (!showComments) fetchComments();
              }
            }}
            style={{
              width: "30px",
              height: "35px",
              color: "#FFFFFF",
              cursor: "pointer",
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "8px",
            paddingLeft: "20px",
            marginTop: "10px",
          }}
        >
          <img
            src={profilePic}
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              objectFit: "cover",
            }}
            alt="Un utilisateur portant un costume."
          />
          <p
            id="RefLikeCard"
            style={{ cursor: "pointer" }}
            onClick={() => {
              setShowLikers(true);
              fetchLikers();
            }}
          >
            {isLiked && currentUser ? (
              <>
                Aimé par <strong>{currentUser.pseudo}</strong> et{" "}
                <strong style={{ textDecoration: "underline" }}>
                  {likeCount - 1} autres utilisateurs
                </strong>
              </>
            ) : (
              <>
                <strong style={{ textDecoration: "underline" }}>
                  {likeCount} personnes
                </strong>{" "}
                ont aimé cette publication
              </>
            )}
          </p>
        </div>
        <p id="RefCommentCard">
          <strong>{pseudo}</strong> {description}
        </p>

        {/* Tags */}
        {publicationTags.length > 0 && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "8px",
              paddingLeft: "20px",
              paddingBottom: "10px",
            }}
          >
            {publicationTags.map((tag, i) => (
              <span
                key={i}
                style={{
                  backgroundColor: "#374761",
                  padding: "4px 10px",
                  borderRadius: "20px",
                  fontSize: "13px",
                  color: "#FFFFFF",
                }}
              >
                #{tag.label.replace(/^#/, "")}
              </span>
            ))}
          </div>
        )}
        <span
          id="RefViewCommentCard"
          onClick={() => {
            setShowComments(true);
            fetchComments();
          }}
          style={{ cursor: "pointer", color: "#aaa", fontSize: "14px" }}
        >
          Voir les {comments.length} commentaires
        </span>
        <p id="RefTimePubliCard">{timeAgo}</p>

        {showLikers && (
          <div
            onClick={() => setShowLikers(false)}
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
              role="dialog"
              aria-modal="true"
              aria-label="Mentions J'aime"
              style={{
                position: "relative",
                width: "400px",
                maxHeight: "500px",
                borderRadius: "10px",
                backgroundColor: "#232F46",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Header */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "15px",
                  borderBottom: "1px solid #374761",
                }}
              >
                <strong style={{ color: "#FFFFFF", fontSize: "16px" }}>
                  Mentions J'aime
                </strong>
                <button
                  onClick={() => setShowLikers(false)}
                  style={{
                    backgroundColor: "transparent",
                    border: "none",
                    color: "#FFFFFF",
                    fontSize: "22px",
                    cursor: "pointer",
                  }}
                >
                  ✕
                </button>
              </div>

              {/* Liste des likers */}
              <div
                style={{
                  overflowY: "auto",
                  padding: "15px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "15px",
                }}
              >
                {likers.length === 0 ? (
                  <p style={{ color: "#aaa", textAlign: "center" }}>
                    Aucun like pour l'instant.
                  </p>
                ) : (
                  likers.map((liker, index) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        <img
                          src={liker.photo_profil}
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            objectFit: "cover",
                          }}
                        />
                        <strong style={{ color: "#FFFFFF" }}>
                          {liker.pseudo}
                        </strong>
                      </div>
                      {/* Bouton Suivre — seulement si ce n'est pas l'utilisateur connecté */}
                      {liker.id_Users !== id_Users && (
                        <button
                          onClick={() => handleFollow(liker.id_Users)}
                          style={{
                            padding: "6px 15px",
                            borderRadius: "5px",
                            border: "none",
                            backgroundColor: followedUsers.includes(
                              liker.id_Users,
                            )
                              ? "#374761"
                              : "#4a90e2",
                            color: "#FFFFFF",
                            cursor: "pointer",
                          }}
                        >
                          {followedUsers.includes(liker.id_Users)
                            ? "Suivi(e)"
                            : "Suivre"}
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {showComments && (
          <div
            onClick={() => setShowComments(false)}
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
              role="dialog"
              aria-modal="true"
              aria-label="Commentaires"
              style={{
                display: "flex",
                flexDirection: window.innerWidth < 768 ? "column" : "row",
                width: "min(900px, 95vw)",
                height: window.innerWidth < 768 ? "90vh" : "600px",
                borderRadius: "10px",
                overflow: "hidden",
                backgroundColor: "#232F46",
              }}
            >
              <button
                onClick={() => setShowComments(false)}
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  backgroundColor: "transparent",
                  border: "none",
                  color: "#FFFFFF",
                  fontSize: "22px",
                  cursor: "pointer",
                  zIndex: 10,
                }}
              >
                ✕
              </button>

              {/* Partie gauche — Carrousel */}
              <div
                style={{
                  position: "relative",
                  width: window.innerWidth < 768 ? "100%" : "55%",
                  height: window.innerWidth < 768 ? "250px" : "auto",
                  backgroundColor: "#000",
                }}
              >
                <img
                  src={carouselImages[currentIndex]}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <button
                  onClick={handlePrev}
                  aria-label="Image précédente"
                  style={{
                    position: "absolute",
                    left: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    backgroundColor: "rgba(0,0,0,0.5)",
                    color: "white",
                    border: "none",
                    borderRadius: "50%",
                    width: "35px",
                    height: "35px",
                    cursor: "pointer",
                    fontSize: "18px",
                  }}
                >
                  ‹
                </button>
                <button
                  onClick={handleNext}
                  aria-label="Image suivante"
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    backgroundColor: "rgba(0,0,0,0.5)",
                    color: "white",
                    border: "none",
                    borderRadius: "50%",
                    width: "35px",
                    height: "35px",
                    cursor: "pointer",
                    fontSize: "18px",
                  }}
                >
                  ›
                </button>
                <div
                  style={{
                    position: "absolute",
                    bottom: "10px",
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    gap: "6px",
                  }}
                >
                  {carouselImages.map((_, i) => (
                    <div
                      key={i}
                      style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        backgroundColor:
                          i === currentIndex
                            ? "white"
                            : "rgba(255,255,255,0.5)",
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Partie droite — Commentaires */}
              <div
                style={{
                  width: window.innerWidth < 768 ? "100%" : "45%",
                  display: "flex",
                  flexDirection: "column",
                  borderLeft:
                    window.innerWidth < 768 ? "none" : "1px solid #374761",
                  borderTop:
                    window.innerWidth < 768 ? "1px solid #374761" : "none",
                  flex: 1,
                  minHeight: 0,
                }}
              >
                {/* Header */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "15px",
                    borderBottom: "1px solid #374761",
                  }}
                >
                  <img
                    src={profilePic}
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                  <strong style={{ color: "#FFFFFF" }}>{pseudo}</strong>
                </div>

                {/* Description */}
                <div
                  style={{ padding: "15px", borderBottom: "1px solid #374761" }}
                >
                  <p style={{ color: "#FFFFFF", margin: 0 }}>
                    <strong>{pseudo}</strong> {description}
                  </p>
                </div>

                {/* Liste des commentaires */}
                <div
                  style={{
                    flex: 1,
                    overflowY: "auto",
                    padding: "15px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  {comments.length === 0 ? (
                    <p style={{ color: "#aaa", textAlign: "center" }}>
                      Aucun commentaire pour l'instant.
                    </p>
                  ) : (
                    comments.map((comment, index) => (
                      <div
                        key={index}
                        style={{
                          display: "flex",
                          gap: "10px",
                          alignItems: "flex-start",
                        }}
                      >
                        <img
                          src={comment.photo_profil}
                          style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "50%",
                            objectFit: "cover",
                          }}
                        />
                        <div style={{ flex: 1 }}>
                          {editingCommentId === comment.id_comment ? (
                            // ← Mode édition
                            <div style={{ display: "flex", gap: "8px" }}>
                              <input
                                type="text"
                                value={editingCommentText}
                                onChange={(e) =>
                                  setEditingCommentText(e.target.value)
                                }
                                onKeyDown={(e) =>
                                  e.key === "Enter" &&
                                  handleEditComment(comment.id_comment)
                                }
                                style={{
                                  flex: 1,
                                  padding: "6px",
                                  borderRadius: "5px",
                                  border: "none",
                                  backgroundColor: "#1a2538",
                                  color: "#FFFFFF",
                                }}
                              />
                              <button
                                onClick={() =>
                                  handleEditComment(comment.id_comment)
                                }
                                style={{
                                  padding: "4px 8px",
                                  borderRadius: "5px",
                                  border: "none",
                                  backgroundColor: "#4a90e2",
                                  color: "#FFFFFF",
                                  cursor: "pointer",
                                  fontSize: "12px",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                Sauvegarder
                              </button>
                              <button
                                onClick={() => setEditingCommentId(null)}
                                style={{
                                  padding: "4px 8px",
                                  borderRadius: "5px",
                                  border: "none",
                                  backgroundColor: "#666",
                                  color: "#FFFFFF",
                                  cursor: "pointer",
                                  fontSize: "12px",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                Annuler
                              </button>
                            </div>
                          ) : (
                            // ← Mode lecture
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              <p style={{ color: "#FFFFFF", margin: 0 }}>
                                <strong>{comment.pseudo}</strong>{" "}
                                {comment.commentaire}
                              </p>
                              {/* ← Bouton modifier visible seulement pour l'auteur */}
                              {(comment.users_Id === id_Users ||
                                id_Users === id_PublicationOwner) && (
                                <div
                                  style={{
                                    display: "flex",
                                    gap: "5px",
                                    marginLeft: "10px",
                                  }}
                                >
                                  {/* Bouton Modifier visible seulement pour l'auteur */}
                                  {comment.users_Id === id_Users && (
                                    <button
                                      onClick={() => {
                                        setEditingCommentId(comment.id_comment);
                                        setEditingCommentText(
                                          comment.commentaire,
                                        );
                                      }}
                                      style={{
                                        padding: "4px 8px",
                                        borderRadius: "5px",
                                        border: "none",
                                        backgroundColor: "#374761",
                                        color: "#FFFFFF",
                                        cursor: "pointer",
                                        fontSize: "12px",
                                        whiteSpace: "nowrap",
                                      }}
                                    >
                                      Modifier
                                    </button>
                                  )}
                                  {/* Bouton Supprimer visible pour l'auteur et le propriétaire */}
                                  <button
                                    onClick={() =>
                                      handleDeleteComment(comment.id_comment)
                                    }
                                    style={{
                                      padding: "4px 8px",
                                      borderRadius: "5px",
                                      border: "none",
                                      backgroundColor: "#e24a4a",
                                      color: "#FFFFFF",
                                      cursor: "pointer",
                                      fontSize: "12px",
                                      whiteSpace: "nowrap",
                                    }}
                                  >
                                    Supprimer
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Input commentaire */}
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    padding: "15px",
                    borderTop: "1px solid #374761",
                    alignItems: "center",
                  }}
                >
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleComment()}
                    placeholder="Ajouter un commentaire..."
                    style={{
                      flex: 1,
                      padding: "8px",
                      borderRadius: "5px",
                      border: "none",
                      backgroundColor: "#1a2538",
                      color: "#FFFFFF",
                    }}
                  />
                  <button
                    onClick={handleComment}
                    style={{
                      padding: "8px 15px",
                      borderRadius: "5px",
                      border: "none",
                      backgroundColor: "#4a90e2",
                      color: "#FFFFFF",
                      cursor: "pointer",
                    }}
                  >
                    Publier
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showOptionsModal && (
          <div
            onClick={() => setShowOptionsModal(false)}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label="Options de la publication"
              style={{
                width: "300px",
                borderRadius: "10px",
                backgroundColor: "#232F46",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              {/* Option Modifier */}
              <button
                onClick={handleOpenEditModal}
                style={{
                  padding: "10px",
                  border: "none",
                  backgroundColor: "transparent",
                  color: "#FFFFFF",
                  cursor: "pointer",
                  textAlign: "left",
                  fontSize: "16px",
                }}
              >
                Modifier
              </button>

              {/* Option Supprimer */}
              <button
                onClick={() => {
                  const confirmDelete = window.confirm(
                    "Voulez-vous vraiment supprimer cette publication ?",
                  );
                  if (confirmDelete) {
                    handleDeletePublication();
                  }
                }}
                style={{
                  padding: "10px",
                  border: "none",
                  backgroundColor: "transparent",
                  color: "#FF5555",
                  cursor: "pointer",
                  textAlign: "left",
                  fontSize: "16px",
                }}
              >
                Supprimer
              </button>

              {/* Option Annuler */}
              <button
                onClick={() => setShowOptionsModal(false)}
                style={{
                  padding: "10px",
                  border: "none",
                  backgroundColor: "transparent",
                  color: "#FFFFFF",
                  cursor: "pointer",
                  textAlign: "left",
                  fontSize: "16px",
                }}
              >
                Annuler
              </button>
            </div>
          </div>
        )}

        {/* ─── Modale : Modifier la publication ───────────────────────────────── */}
        {showEditModal && (
          <div
            onClick={() => setShowEditModal(false)}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label="Modifier la publication"
              style={{
                width: "500px",
                maxHeight: "90vh",
                overflowY: "auto",
                backgroundColor: "#232F46",
                borderRadius: "12px",
                padding: "30px",
                color: "#FFFFFF",
              }}
            >
              <h4 style={{ marginBottom: "25px", textAlign: "center" }}>
                Modifier la publication
              </h4>

              {editError && (
                <p style={{ color: "#FF5555", marginBottom: "15px" }}>
                  {editError}
                </p>
              )}
              {editSuccess && (
                <p style={{ color: "#55FF88", marginBottom: "15px" }}>
                  {editSuccess}
                </p>
              )}

              {/* Description */}
              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "bold",
                  }}
                >
                  Description *
                </label>
                <textarea
                  rows={4}
                  placeholder="Décrivez votre publication..."
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "8px",
                    border: "none",
                    backgroundColor: "#1a2538",
                    color: "#FFFFFF",
                    resize: "vertical",
                    fontFamily: "inherit",
                    boxSizing: "border-box",
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
                  onChange={(e) => setEditFiles(e.target.files)}
                  style={{ color: "#FFFFFF" }}
                />
                {editPreviews.length > 0 && (
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      flexWrap: "wrap",
                      marginTop: "10px",
                    }}
                  >
                    {editPreviews.map((src, i) => (
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
                    type="text"
                    placeholder="https://exemple.com/image.jpg"
                    value={editUrlInput}
                    onChange={(e) => setEditUrlInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleEditAddUrl()}
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
                    onClick={handleEditAddUrl}
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
                {editUrls.map((url, i) => (
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
                      onClick={() => handleEditRemoveUrl(i)}
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
                    type="text"
                    placeholder="#JeuVideo, #Cosplay..."
                    value={editTagInput}
                    onChange={(e) => setEditTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleEditAddTag()}
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
                    onClick={handleEditAddTag}
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
                  {editTags.map((tag, i) => (
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
                        onClick={() => handleEditRemoveTag(i)}
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
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <button
                  onClick={() => setShowEditModal(false)}
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
                  onClick={handleEditSubmit}
                  disabled={editIsLoading}
                  style={{
                    padding: "10px 25px",
                    borderRadius: "25px",
                    border: "none",
                    backgroundColor: "#4a90e2",
                    color: "#FFFFFF",
                    cursor: "pointer",
                    opacity: editIsLoading ? 0.7 : 1,
                  }}
                >
                  {editIsLoading ? "Modification en cours..." : "Modifier"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicationCard;
