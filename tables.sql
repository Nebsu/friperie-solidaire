DROP TABLE IF EXISTS details_commandes CASCADE;
DROP TABLE IF EXISTS commandes CASCADE;
DROP TABLE IF EXISTS produits CASCADE;
DROP TABLE IF EXISTS utilisateurs CASCADE;
DROP TABLE IF EXISTS panier CASCADE;

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
  prix NUMERIC(10, 2) NOT NULL,
  category VARCHAR(50) NOT NULL,
  image TEXT DEFAULT NULL
);

CREATE TABLE stock_products (
  id_stock_product SERIAL PRIMARY KEY,
  id_produit INT NOT NULL REFERENCES produits(id_produit) ON DELETE CASCADE,
  taille_s INT NOT NULL,
  taille_m INT NOT NULL,
  taille_l INT NOT NULL,
  taille_xl INT NOT NULL
);

-- Table "commandes"
CREATE TABLE commandes (
  id_commande SERIAL PRIMARY KEY,
  id_utilisateur INT NOT NULL REFERENCES utilisateurs(id_utilisateur),
  date_commande TIMESTAMP NOT NULL DEFAULT NOW(),
  adresse_livraison TEXT NOT NULL,
  etat_livraison TEXT NOT NULL
);

-- Table "details_commandes"
CREATE TABLE details_commandes (
  id_detail_commande SERIAL PRIMARY KEY,
  id_commande INT NOT NULL REFERENCES commandes(id_commande) ON DELETE CASCADE,
  id_produit INT NOT NULL REFERENCES produits(id_produit) ON DELETE CASCADE,
  quantite INT NOT NULL,
  taille VARCHAR(2) NOT NULL,
  prix_unitaire NUMERIC(10, 2) NOT NULL
);


-- Table "panier"
CREATE TABLE panier (
  id_panier SERIAL PRIMARY KEY,
  id_utilisateur INT NOT NULL,
  id_produit INT NOT NULL REFERENCES produits(id_produit),
  quantite INT NOT NULL,
  taille VARCHAR(2) NOT NULL,
  prix_unitaire NUMERIC(10, 2) NOT NULL
);
