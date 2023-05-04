-- Table "utilisateurs"
CREATE TABLE utilisateurs (
  id_utilisateur SERIAL PRIMARY KEY,
  nom VARCHAR(50) NOT NULL,
  prenom VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL,
  mot_de_passe VARCHAR(255) NOT NULL
);

-- Table "produits"
CREATE TABLE produits (
  id_produit SERIAL PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  prix NUMERIC(10, 2) NOT NULL,
  stock INT NOT NULL,
  image BYTEA,
  category VARCHAR(50) NOT NULL,
);

-- Table "commandes"
CREATE TABLE commandes (
  id_commande SERIAL PRIMARY KEY,
  id_utilisateur INT NOT NULL REFERENCES utilisateurs(id_utilisateur),
  date_commande TIMESTAMP NOT NULL DEFAULT NOW(),
  adresse_livraison VARCHAR(255) NOT NULL,
  etat_livraison VARCHAR(20) NOT NULL
);

-- Table "details_commandes"
CREATE TABLE details_commandes (
  id_detail_commande SERIAL PRIMARY KEY,
  id_commande INT NOT NULL REFERENCES commandes(id_commande),
  id_produit INT NOT NULL REFERENCES produits(id_produit),
  quantite INT NOT NULL,
  prix_unitaire NUMERIC(10, 2) NOT NULL
);

-- Table "panier"
CREATE TABLE panier (
  id_panier SERIAL PRIMARY KEY,
  id_utilisateur INT NOT NULL REFERENCES utilisateurs(id_utilisateur), 
);

-- Table "details_panier"
CREATE TABLE details_panier (
  id_detail_panier SERIAL PRIMARY KEY,
  id_panier INT NOT NULL,
  id_produit INT NOT NULL REFERENCES produits(id_produit),
  quantite INT NOT NULL,
  prix_unitaire NUMERIC(10, 2) NOT NULL,
  FOREIGN KEY (id_panier) REFERENCES panier(id_panier) ON DELETE CASCADE
);
