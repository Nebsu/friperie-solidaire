const pg = require("pg");
const pool = new pg.Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "root",
  port: 4545,
});

class User {
  constructor(name, surname, email, password) {
    this.name = name;
    this.surname = surname;
    this.email = email;
    this.password = password;
  }
}

class Product {
  constructor(name, description, price, quantity, image) {
    this.name = name;
    this.description = description;
    this.price = price;
    this.quantity = quantity;
    this.image = image;
  }
}

async function registerUser(user) {
  const text =
    "INSERT INTO utilisateurs(nom, prenom, email, mot_de_passe) VALUES($1, $2, $3, $4) RETURNING *";
  const values = [user.name, user.surname, user.email, user.password];
  return pool.query(text, values);
}

async function getUser(userEmail) {
  const text = "SELECT * FROM utilisateurs WHERE email = $1";
  const values = [userEmail];
  return pool.query(text, values);
}

async function getAllEmail() {
  const result = await pool.query("SELECT email FROM utilisateurs");
  const rows = result.rows.map((row) => row.email);
  return rows;
}

// Ajouter un produit au panier
async function addToCart(currentUser, id, quantity, price, size) {
  const text2 =
    "SELECT * FROM panier P JOIN stock_products S ON S.id_produit = P.id_produit WHERE P.id_produit = $1 AND id_utilisateur = $2 AND taille = $3";
  const values2 = [id, currentUser, size];
  const result = await pool.query(text2, values2);
  const rows = result.rows;
  if (rows.length > 0) {
    const text3 =
      "UPDATE panier SET quantite = quantite + $1 WHERE id_produit = $2 AND id_utilisateur = $3 AND taille = $4";
    const values3 = [quantity, id, currentUser, size];
    return pool.query(text3, values3);
  } else {
    const text =
      "INSERT INTO panier(id_utilisateur, id_produit, quantite, taille, prix_unitaire) VALUES($1, $2, $3, $4, $5) RETURNING *";
    const values = [currentUser, id, quantity, size, price];
    return pool.query(text, values);
  }
}

// Supprimer un produit du panier
async function deleteProductCart(id, currentUserId, size) {
  const text2 = "SELECT * FROM panier WHERE id_produit = $1 AND id_utilisateur = $2 AND taille = $3";
  const values2 = [id, currentUserId, size];
  const result = await pool.query(text2, values2);
  const rows = result.rows;
  console.log(rows);
  if (rows[0].quantite > 1) {
    const text3 =
      "UPDATE panier SET quantite = quantite - 1 WHERE id_produit = $1 AND id_utilisateur = $2 AND taille = $3";
    const values3 = [id, currentUserId, size];
    return pool.query(text3, values3);
  } else {
    const text = "DELETE FROM panier WHERE id_produit = $1 AND id_utilisateur = $2 AND taille = $3";
    const values = [id, currentUserId, size];
    return pool.query(text, values);
  }
}

async function deleteCart(currentUserId) {
  const text = "DELETE FROM panier WHERE id_utilisateur = $1";
  const values = [currentUserId];
  return pool.query(text, values);
}

// Créer une commande
async function createCommand(address, currentUserId) {
  const text =
    "INSERT INTO commandes(id_utilisateur, date_commande, adresse_livraison, etat_livraison) VALUES($1, $2, $3, $4) RETURNING *";
  const state = "En cours de préparation";
  const values = [currentUserId, new Date(), address, state];
  return pool.query(text, values);
}

async function deleteCommand(id) {
  const text = "DELETE FROM commandes WHERE id_commande = $1";
  const values = [id];
  return pool.query(text, values);
}

// Ajouter les produits du panier à la commande
async function addCartToCommand(address, currentUserId) {
  // Créer une commande
  createCommand(address, currentUserId);
  const request =
    "SELECT id_commande FROM commandes WHERE id_utilisateur = $1 AND etat_livraison <> 'Terminée' ORDER BY id_commande DESC LIMIT 1";
  const val = [currentUserId];
  const res = await pool.query(request, val);
  const row = res.rows;
  const id = parseInt(row[0].id_commande, 10);
  // Récupérer les produits du panier
  const text = "SELECT * FROM panier WHERE id_utilisateur = $1";
  const values = [currentUserId];
  const result = await pool.query(text, values);
  const rows = result.rows;
  let taille = "";
  let stock = [];
  let size = 0;
  // Verifier si le stock est suffisant
  for (let i = 0; i < rows.length; i++) {
    taille = "taille_" + rows[i].taille.toLowerCase();
    const text2 = "SELECT " + taille + " FROM produits P JOIN stock_products S ON P.id_produit = S.id_produit WHERE P.id_produit = $1";
    const stockValues = [rows[i].id_produit];
    const stockResult = await pool.query(text2, stockValues);
    const stockRows = stockResult.rows;
    if (taille === "taille_s") {
      size = stockRows[0].taille_s;
    } else if (taille === "taille_m") {
      size = stockRows[0].taille_m;
    } else if (taille === "taille_l") {
      size = stockRows[0].taille_l;
    } else if (taille === "taille_xl") {
      size = stockRows[0].taille_xl;
    }
    stock.push(size);
    if (rows[i].quantite > size) {
      await deleteCommand(id);
      console.log("Stock insuffisant");
      return false;
    }
  }
  // Soustraire la quantité du stock
  for (let i = 0; i < rows.length; i++) {
    if(rows[i].taille == "S"){
      taille = "taille_s";
    } else if(rows[i].taille == "M"){
      taille = "taille_m";
    } else if(rows[i].taille == "L"){
      taille = "taille_l";
    } else if(rows[i].taille == "XL"){
      taille = "taille_xl";
    }
    const text3 = "UPDATE stock_products SET "+ taille +" = $1 WHERE id_produit = $2";
    console.log(stock[i] - rows[i].quantite);
    console.log(rows[i].id_produit);
    const res = stock[i] - rows[i].quantite;
    const values3 = [res, rows[i].id_produit];
    await pool.query(text3, values3);
    console.log("Stock mis à jour");
  }
  // Ajouter les produits à la commande
  for (let i = 0; i < rows.length; i++) {
    const text2 = "INSERT INTO details_commandes(id_commande, id_produit, quantite, taille, prix_unitaire) VALUES($1, $2, $3, $4, $5)";
    const values2 = [
      id,
      rows[i].id_produit,
      rows[i].quantite,
      rows[i].taille,
      rows[i].prix_unitaire,
    ];
    await pool.query(text2, values2);
    console.log("Produit ajouté à la commande");
  }
  // Supprimer le panier
  await deleteCart(currentUserId);
  console.log("Commande créée");
  return true;
}

async function changeCommandState(commandId, state) {
  const text = "UPDATE commandes SET etat_livraison = $1 WHERE id = $2";
  const values = [state, commandId];
  return pool.query(text, values);
}

async function getUserInfoFromCommand(commandId, currentUserId) {
  const text =
    "SELECT * FROM commandes WHERE id_commande = $1 AND id_utilisateur = $2";
  const values = [commandId, currentUserId];
  return pool.query(text, values);
}

async function getCart(currentUserId) {
  const text = "SELECT * FROM panier WHERE id_utilisateur = $1";
  const values = [currentUserId];
  return pool.query(text, values);
}

async function getTotalPrice(currentUserId) {
  const text =
    "SELECT SUM(quantite * prix_unitaire) FROM panier WHERE id_utilisateur = $1";
  const values = [currentUserId];
  const result = await pool.query(text, values);
  const rows = result.rows;
  return rows[0].sum;
}

module.exports = {
  registerUser,
  getUser,
  getAllEmail,
  addToCart,
  deleteProductCart,
  deleteCart,
  createCommand,
  addCartToCommand,
  getCart,
  changeCommandState,
  getUserInfoFromCommand,
  getTotalPrice,
};
