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

function clickHandler() {
  console.log("click event");
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

async function addNewProduct(product) {
  const text =
    "INSERT INTO produits(nom, description, prix, stock, image) VALUES($1, $2, $3, $4, $5, $6) RETURNING *";
  const values = [
    product.name,
    product.description,
    product.price,
    product.quantity,
    product.image,
    product.category,
  ];
  return pool.query(text, values);
}

// Ajouter un produit au panier
async function addToCart(currentUser, id, quantity, price) {
  // check if product already in cart
  const text2 =
    "SELECT * FROM panier WHERE id_produit = $1 AND id_utilisateur = $2";
  const values2 = [id, currentUser];
  const result = await pool.query(text2, values2);
  const rows = result.rows;
  if (rows.length > 0) {
    const text3 =
      "UPDATE panier SET quantite = quantite + $1 WHERE id_produit = $2 AND id_utilisateur = $3";
    const values3 = [quantity, id, currentUser];
    return pool.query(text3, values3);
  } else {
    const text =
      "INSERT INTO panier(id_utilisateur, id_produit, quantite, prix_unitaire) VALUES($1, $2, $3, $4) RETURNING *";
    const values = [currentUser, id, quantity, price];
    return pool.query(text, values);
  }
}

// Supprimer un produit du panier
async function deleteProductCart(id, currentUserId) {
  const text2 = "SELECT * FROM panier WHERE id = $1 AND id_utilisateur = $2";
  console.log("productid: " + id);
  console.log("currentUserId: " + currentUserId);
  const values2 = [id, currentUserId];
  const result = await pool.query(text2, values2);
  const rows = result.rows;
  console.log(rows);
  if (rows[0].quantite > 1) {
    const text3 =
      "UPDATE panier SET quantite = quantite - 1 WHERE id = $1 AND id_utilisateur = $2";
    const values3 = [id, currentUserId];
    return pool.query(text3, values3);
  } else {
    const text = "DELETE FROM panier WHERE id = $1 AND id_utilisateur = $2";
    const values = [id, currentUserId];
    return pool.query(text, values);
  }
}

async function deleteCart(currentUserId) {
  const text = "DELETE FROM details_panier WHERE id_utilisateur = $1";
  const values = [currentUserId];
  return pool.query(text, values);
}

// Créer une commande
async function createCommand(address) {
  const text =
    "INSERT INTO commandes(id_utilisateur, date_commande, adresse_livraison, etat_livraison) VALUES($1, $2, $3, $4) RETURNING *";
  const state = "En cours de préparation";
  const values = [currentUserId, new Date(), address, state];
  return pool.query(text, values);
}

// Recuperer le dernier id de commande
async function getCommandId() {
  const text =
    "SELECT MAX(id_commande) FROM commandes WHERE id_utilisateur = $1";
  const values = [currentUserId];
  const result = await pool.query(text, values);
  const rows = result.rows;
  return rows[0].max;
}

// Ajouter les produits du panier à la commande
async function addCartToCommand(adress) {
  createCommand(adress);
  const idCommand = getCommandId();
  const text = "SELECT * FROM panier WHERE id_utilisateur = $1";
  const values = [currentUserId];
  const result = await pool.query(text, values);
  const rows = result.rows;
  await deleteCart();
  for (let i = 0; i < rows.length; i++) {
    const text2 = "INSERT details_commandes VALUES($1, $2, $3, $4)";
    const values2 = [
      idCommand,
      rows[i].id_produit,
      rows[i].quantite,
      rows[i].prix_unitaire,
    ];
    await pool.query(text2, values2);
  }
}

async function getCart(currentUserId) {
  const text = "SELECT * FROM panier WHERE id_utilisateur = $1";
  const values = [currentUserId];
  return pool.query(text, values);
}

module.exports = {
  registerUser,
  getUser,
  getAllEmail,
  addNewProduct,
  addToCart,
  deleteProductCart,
  deleteCart,
  createCommand,
  getCommandId,
  addCartToCommand,
  clickHandler,
  getCart,
};
