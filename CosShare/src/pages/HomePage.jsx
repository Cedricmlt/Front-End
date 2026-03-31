import React, { useEffect, useState } from "react";
import axios from "axios";
import NavBarPrincipal from "../components/NavBar.jsx";
import SearchBar from "../components/SearchBar.jsx";
import PublicationCard from "../components/PublicationCard.jsx";
import pastilleUser from "../assets/pastilleUser.jpg";
import FondEcran from "../assets/FondEcran.jpg";
import Footer from "../components/Footer.jsx";

const HomePage = () => {
  const [publication, setPublication] = useState([]);
  const [filteredPublications, setFilteredPublications] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [mediasMap, setMediasMap] = useState({});

  useEffect(() => {
    const initUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decoded = JSON.parse(atob(token.split(".")[1]));
          setCurrentUserId(decoded.id_Users);

          const userResponse = await axios.get(
            `http://localhost:3000/api/users/${decoded.id_Users}`,
            { headers: { Authorization: `Bearer ${token}` } },
          );
          setCurrentUser(userResponse.data.user);
          console.log("Utilisateur récupéré :", userResponse.data); 
        } catch (error) {
          console.error("Erreur récupération utilisateur :", error);
        }
      }

      const fetchPublication = async () => {
        try {
          const response = await axios.get(
            "http://localhost:3000/api/publication",
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            },
          );
          const publications = response.data.publication;
          setPublication(publications);
          setFilteredPublications(publications);

          const medias = {};
          for (const pub of publications) {
            const mediaRes = await axios.get(
              `http://localhost:3000/api/media-publication/publication/${pub.id_Publication}`,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              },
            );
            medias[pub.id_Publication] = mediaRes.data.medias.map((m) => m.url);
          }
          setMediasMap(medias);

          const usersInfo = {};
          for (const pub of publications) {
            const userId = pub.users_Id;
            if (!usersInfo[userId]) {
              const userRes = await axios.get(
                `http://localhost:3000/api/users/${userId}`,
                {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                },
              );
              usersInfo[userId] = userRes.data.user;
            }
          }

          const updatedPublications = publications.map((pub) => ({
            ...pub,
            user: usersInfo[pub.users_Id],
          }));

          setPublication(updatedPublications);
          setFilteredPublications(updatedPublications);
        } catch (error) {
          console.error("Récupération des publications impossible :", error);
        }
      };

      fetchPublication();
    };
    initUser();
  }, []);

  const handleReset = () => {
    setFilteredPublications(publication);
    setSearchTerm("");
  };

  const handleInputChange = (term) => {
    setSearchTerm(term); // Met à jour le terme de recherche sans déclencher la recherche
  };

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredPublications(publication);
      return;
    }
    const lowercasedTerm = searchTerm.toLowerCase();
    const filtered = publication.filter((pub) => {
      const pseudo = pub.pseudo ? pub.pseudo.toLowerCase() : "";
      const description = pub.description ? pub.description.toLowerCase() : "";
      return (
        pseudo.includes(lowercasedTerm) || description.includes(lowercasedTerm)
      );
    });
    setFilteredPublications(filtered);
  };

  const getCarouselImages = (id_Publication) => {
    const images = mediasMap[id_Publication];
    return images && images.length > 0 ? images : [pastilleUser];
  };

  return (
    <div style={{ backgroundImage: `url(${FondEcran})` }}>
      <NavBarPrincipal onReset={handleReset} />
      <SearchBar
        searchTerm={searchTerm}
        onInputChange={handleInputChange}
        onSearch={handleSearch}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "30px",
          marginBottom: "80px",
        }}
      >
        {filteredPublications.length > 0 ? (
          filteredPublications.map((pub, index) => (
            <PublicationCard
              key={pub.id_Publication}
              id_Publication={pub.id_Publication}
              pseudo={pub.pseudo}
              description={pub.description}
              pastilleUrl={pub.user?.photo_profil}
              carouselImages={getCarouselImages(pub.id_Publication)}
              id_Users={currentUserId}
              currentUser={currentUser}
              id_PublicationOwner={pub.users_Id}
              cree_le={pub.cree_le}
            />
          ))
        ) : (
          <p
            style={{
              color: "white",
              textAlign: "center",
              fontFamily:
                "'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif",
            }}
          >
            Aucune publication ne correspond à votre recherche.
          </p>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default HomePage;
