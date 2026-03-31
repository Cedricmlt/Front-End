import React from "react";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Section "À propos" */}
        <div className="footer-section">
          <h3>À propos</h3>
          <p>
            Bienvenue sur notre plateforme dédiée au cosplay et à la communauté
            des passionnés.
          </p>
        </div>

        {/* Section "Liens utiles" */}
        <div className="footer-section">
          <h3>Liens utiles</h3>
          <ul>
            <li>
              <a href="/contact">Contact</a>
            </li>
            <li>
              <a
                href="/RGPD_CosShare.pdf"
                target="_blank"
                rel="noopener noreferrer"
              >
                Confidentialité
              </a>
            </li>
            <li>
              <a
                href="/CGU_CosShare.pdf"
                target="_blank"
                rel="noopener noreferrer"
              >
                Conditions d'utilisations
              </a>
            </li>
            <li>
              <a href="/faq">FAQ</a>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} CosShare. Tous droits réservés.</p>
      </div>
    </footer>
  );
};

export default Footer;
