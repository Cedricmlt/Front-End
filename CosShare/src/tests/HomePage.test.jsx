import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import HomePage from "../pages/HomePage.jsx";
import userEvent from "@testing-library/user-event";

// Mock axios
vi.mock("axios", () => ({
  default: {
    get: vi.fn().mockResolvedValue({
      data: {
        publication: [
          {
            id_Publication: 1,
            pseudo: "Compte test",
            description: "Voici une publication de test.",
            users_Id: 1,
            cree_le: new Date().toISOString(),
            user: {
              photo_profil: "http://localhost:3000/uploads/test.jpg",
            },
          },
        ],
        medias: [{ url: "http://localhost:3000/uploads/image.jpg" }],
        user: { photo_profil: "http://localhost:3000/uploads/test.jpg" },
      },
    }),
  },
}));

// Mock des composants enfants
vi.mock("../components/NavBar.jsx", () => ({
  default: () => <div>NavBar</div>,
}));
vi.mock("../components/SearchBar.jsx", () => ({
  default: ({ searchTerm, onInputChange, onSearch }) => (
    <div>
      <input
        placeholder="Rechercher une publication, un utilisateur..."
        value={searchTerm}
        onChange={(e) => onInputChange(e.target.value)}
      />
      <button onClick={onSearch}>Rechercher</button>
    </div>
  ),
}));
vi.mock("../components/Footer.jsx", () => ({
  default: () => <div>Footer</div>,
}));
vi.mock("../components/PublicationCard.jsx", () => ({
  default: ({ pseudo, description }) => (
    <div data-testid="publication-card">
      <span>{pseudo}</span>
      <span>{description}</span>
    </div>
  ),
}));

describe("HomePage - Rendu des PublicationCard", () => {
  it("affiche une PublicationCard quand il y a une publication", async () => {
    render(<HomePage />);
    const cards = await screen.findAllByTestId("publication-card");
    expect(cards).toHaveLength(1);
  });

  it("affiche le bon pseudo dans la PublicationCard", async () => {
    render(<HomePage />);
    expect(await screen.findByText("Compte test")).toBeInTheDocument();
  });

  it("affiche la bonne description dans la PublicationCard", async () => {
    render(<HomePage />);
    expect(
      await screen.findByText("Voici une publication de test."),
    ).toBeInTheDocument();
  });
});

describe("HomePage - Barre de recherche", () => {
  it("filtre les publications selon le pseudo recherché", async () => {
    render(<HomePage />);

    // Attendre que la publication soit affichée
    await screen.findByTestId("publication-card");

    // Simuler la saisie dans la barre de recherche
    const input = screen.getByPlaceholderText(/rechercher/i);
    await userEvent.type(input, "Compte test");

    // Cliquer sur le bouton Rechercher
    const button = screen.getByText(/rechercher/i);
    await userEvent.click(button);

    // La publication doit toujours être visible
    const cards = screen.getAllByTestId("publication-card");
    expect(cards).toHaveLength(1);
  });

  it("affiche le message aucune publication si la recherche ne correspond à rien", async () => {
    render(<HomePage />);

    await screen.findByTestId("publication-card");

    const input = screen.getByPlaceholderText(/rechercher/i);
    await userEvent.type(input, "xxxxxxxxxxx");

    const button = screen.getByText(/rechercher/i);
    await userEvent.click(button);

    expect(
      screen.getByText(/aucune publication ne correspond/i),
    ).toBeInTheDocument();
  });
});
