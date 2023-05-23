const ejs = require("ejs");
const pg = require("pg");
const express = require("express");
const bcrypt = require("bcrypt");
const functions = require("./public/js/function.js");
const app = express();
const pool = new pg.Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "root",
  port: 4545,
});

app.use(express.static("public"));
app.use("/css", express.static(__dirname + "public/css"));
app.use("/js", express.static(__dirname + "public/js"));
app.use("/img", express.static(__dirname + "public/img"));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

let currentUserId = 0;
let currentName = "";
let connectState = false;

async function CreatePool() {
  const pool = new pg.Pool({
    user: "postgres",
    host: "localhost",
    database: "postgres",
    password: "root",
    port: 4545,
  });
  const now = await pool.query("SELECT NOW()");
  await pool.end();
  return now;
}

(async () => {
  const poolResult = await CreatePool();
  console.log(poolResult.rows[0].now);
})();

class User {
  constructor(name, surname, email, adress, password) {
    this.name = name;
    this.surname = surname;
    this.email = email;
    this.address = adress;
    this.password = password;
  }
}

//Gestion du formulaire d'inscription
app.post("/inscription/", async (req, res) => {
  let namefield = "";
  let surnamefield = "";
  let emailfield = "";
  let inscription = false;
  let connection = false;

  let name = req.body.name;
  let surname = req.body.surname;
  let email = req.body.email;
  let password = req.body.password;
  let confirm_password = req.body.confirmpassword;
  let address = req.body.address;
  const database = await functions.getAllEmail();
  console.log("Post Inscription");
  if (name.length < 2 || name.length > 30) {
    // Verification nom
    namefield = "";
    emailfield = email;
    surnamefield = surname;
    pop_up = true;
    inscription = true;
    console.log("Nom invalide");
  } else if (surname.length < 2 || surname.length > 30) {
    // Verification prenom
    surnamefield = "";
    emailfield = email;
    namefield = name;
    pop_up = true;
    inscription = true;
    console.log("Prénom invalide");
  } else if (database.includes(email)) {
    // check if email is already in database
    console.log("Email déjà utilisé");
  } else if (password != confirm_password || password.length < 8) {
    // Verification mot de passe
    pop_up = true;
    inscription = true;
    emailfield = email;
    namefield = name;
    surnamefield = surname;
    console.log("Mot de passe invalide");
  } else {
    // Ajout des données dans la base de données
    bcrypt.hash(password, 10, function (err, hash) {
      const user = new User(name, surname, email, address, hash);
      console.log(user);
      functions.registerUser(user);
    });
    connection = true;
    pop_up = true;
    res.redirect("/connection");
  }
  const data = {
    type_produit: "Catalogue",
    name: namefield,
    surname: surnamefield,
    email: emailfield,
    prenom: "",
    connection: connection,
    inscription: inscription,
    connected: connectState,
    panier: false,
  };
  res.render("index.ejs", data);
  return;
});

//Gestion du formulaire de connexion
app.post("/connection", async (req, res) => {
  let connection = false;
  let emailfield = "";
  let email = req.body.email;
  let password = req.body.password;
  console.log("Post Connection");
  const user = await functions.getUser(email);
  if (user.rows.length == 0) {
    connection = true;
    console.log("Utilisateur non trouvé");
  }else{
    let hashedPassword = user.rows[0].mot_de_passe;
    const b = await bcrypt.compare(password, hashedPassword);
    if (b == false) {
      emailfield = email;
      console.log("Mot de passe incorrect");
    } else {
      console.log("Connection réussie");
      connectState = true;
      currentName = user.rows[0].prenom;
      currentUserId = user.rows[0].id_utilisateur;
      console.log(currentName + " " + currentUserId);
      res.redirect("/connected");
      return;
    }
  }
  const data = {
    type_produit: "Catalogue",
    name: "",
    surname: "",
    email: emailfield,
    prenom: currentName + " ",
    connection: connection,
    inscription: false,
    connected: connectState,
    panier: false,
  };
  res.render("index.ejs", data);
  return;
});

//Gestion d'un ajout au panier
app.post("/produits/:id", async (req, res) => {
  let id = req.params.id;
  let size = req.body.size;
  let quantity = req.body.quantity;
  let result = 
    await pool.query("SELECT * FROM produits WHERE id_produit = "+id);
  let rows = result.rows;
  let price = rows[0].prix;
  functions.addToCart(currentUserId, id, quantity, price, size);
  res.redirect("/produits");
  return;
});

app.get("/deconnection", function (req, res) {
  currentName = "";
  currentUserId = "";
  res.redirect("/");
  return;
});

//Page apres connexion
app.get("/connected", async (req, res) => {
  const result = await pool.query("SELECT * FROM produits");
  const rows = result.rows;
  const resultpantalon = await pool.query(
    "SELECT * FROM produits WHERE category = 'pantalon'"
  );
  const resultchemise = await pool.query(
    "SELECT * FROM produits WHERE category = 'chemise'"
  );
  const resultaccessoire = await pool.query(
    "SELECT * FROM produits WHERE category = 'accessoire'"
  );
  const resultveste = await pool.query(
    "SELECT * FROM produits WHERE category = 'veste'"
  );
  const total_price = await functions.getTotalPrice(currentUserId);
  const count1 = resultpantalon.rows.length;
  const count2 = resultchemise.rows.length;
  const count3 = resultaccessoire.rows.length;
  const count4 = resultveste.rows.length;
  const rows1 = resultpantalon.rows;
  const rows2 = resultchemise.rows;
  const rows3 = resultaccessoire.rows;
  const rows4 = resultveste.rows;
  const data = {
    type_produit: "Catalogue",
    count_pantalon: count1,
    count_chemise: count2,
    count_accessoire: count3,
    count_veste: count4,
    products_pantalon: rows1,
    products_chemise: rows2,
    products_accessoire: rows3,
    products_veste: rows4,
    name: "",
    surname: "",
    email: "",
    prenom: currentName,
    connection: false,
    inscription: false,
    connected: connectState,
    products: rows,
    panier: false,
    total_price: total_price,
  };
  res.render("index.ejs", data);
  return;
});

//Page de connexion
app.get("/connection", function (req, res) {
  const data = {
    type_produit: "Catalogue",
    name: "",
    surname: "",
    email: "",
    prenom: currentName + " ",
    connection: true,
    inscription: false,
    connected: connectState,
    panier: false,
  };
  res.render("index.ejs", data);
  return;
});

//Page d'inscription
app.get("/inscription", function (req, res) {
  const data = {
    type_produit: "Catalogue",
    name: "",
    surname: "",
    email: "",
    prenom: "",
    connection: false,
    inscription: true,
    connected: connectState,
    panier: false,
  };
  res.render("index.ejs", data);
  return;
});

//Page du panier
app.get("/panier", async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM panier JOIN produits ON panier.id_produit = produits.id_produit WHERE id_utilisateur =" +
      currentUserId
  );
  const result2 = 
  await pool.query("SELECT SUM(prix_unitaire * quantite) FROM panier WHERE id_utilisateur = " + currentUserId);
  const data = {
    type_produit: "Catalogue",
    prenom: currentName,
    connection: false,
    inscription: false,
    connected: connectState,
    panier: true,
    elt_panier: result.rows,
    elt_panier_length: result.rows.length,
    sommetotale: result2.rows[0].sum,
    total_price: await functions.getTotalPrice(currentUserId),
  };
  res.render("panier.ejs", data);
  return;
});

//Suppression d'un produit du panier
app.get("/panier/:id_produit/:taille", async (req, res) => {
  const id_produit = req.params.id_produit;
  const taille = req.params.taille;
  await functions.deleteProductCart(id_produit, currentUserId, taille);
  res.redirect("/panier");
  return;
});

//Ajout de tous les produits du panier à la table commande
app.get("/panier/commande", async (req, res) => {
  const result = await pool.query(
    "SELECT adresse FROM utilisateurs WHERE id_utilisateur = " + currentUserId);
  const adresse = result.rows[0].adresse;
  await functions.addCartToCommand(String(adresse),currentUserId);
  res.redirect("/produits");
  return;
});

//Page pantalon
app.get("/produits/veste", async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM produits WHERE category = 'veste'"
  );
  const counter = await pool.query(
    "SELECT COUNT(*) FROM produits WHERE category = 'veste'"
  );
  const total_price = await functions.getTotalPrice(currentUserId);
  const rows = result.rows;
  const count = counter.rows[0].count;
  const data = {
    type_produit: "veste",
    count: count,
    prenom: currentName,
    connection: false,
    inscription: false,
    connected: connectState,
    products: rows,
    panier: false,
    functions: functions,
    total_price: total_price,
  };
  res.render("liste_produits.ejs", data);
  return;
});

// Page pantalon
app.get("/produits/pantalon", async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM produits WHERE category = 'pantalon'"
  );
  const counter = await pool.query(
    "SELECT COUNT(*) FROM produits WHERE category = 'pantalon'"
  );
  const rows = result.rows;
  const count = counter.rows[0].count;
  total_price = await functions.getTotalPrice(currentUserId);
  const data = {
    type_produit: "pantalon",
    count: count,
    prenom: currentName,
    connection: false,
    inscription: false,
    connected: connectState,
    products: rows,
    panier: false,
    functions: functions,
    total_price: total_price,
  };
  res.render("liste_produits.ejs", data);
  return;
});

//Page chemises
app.get("/produits/chemise", async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM produits WHERE category = 'chemise'"
  );
  const counter = await pool.query(
    "SELECT COUNT(*) FROM produits WHERE category = 'chemise'"
  );
  const rows = result.rows;
  const count = counter.rows[0].count;
  total_price = await functions.getTotalPrice(currentUserId);
  const data = {
    type_produit: "chemise",
    count: count,
    prenom: currentName,
    connection: false,
    inscription: false,
    connected: connectState,
    products: rows,
    panier: false,
    functions: functions,
    total_price: total_price,
  };
  res.render("liste_produits.ejs", data);
  return;
});

//Page accessoires
app.get("/produits/accessoire", async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM produits WHERE category = 'accessoire'"
  );
  const counter = await pool.query(
    "SELECT COUNT(*) FROM produits WHERE category = 'accessoire'"
  );
  const rows = result.rows;
  const count = counter.rows[0].count;
  const total_price = await functions.getTotalPrice(currentUserId);
  const data = {
    type_produit: "accessoire",
    count: count,
    prenom: currentName,
    connection: false,
    inscription: false,
    connected: connectState,
    products: rows,
    panier: false,
    functions: functions,
    total_price: total_price,
  };
  res.render("liste_produits.ejs", data);
  return;
});

//Page produit individuel
app.get("/produits/:id", async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM produits WHERE id_produit = " + req.params.id
  );
  const rows = result.rows;
  const result2 = await pool.query(
    "SELECT * FROM produits WHERE category = 'accessoire'"
  );
  const rows2 = result2.rows;
  const total_price = await functions.getTotalPrice(currentUserId);
  const data = {
    type_produit: "",
    prenom: currentName,
    connection: false,
    inscription: false,
    connected: connectState,
    products: rows2,
    panier: false,
    produit_id: rows[0].id_produit,
    produit_name: rows[0].nom,
    produit_price: rows[0].prix,
    produit_quantity: rows[0].stock,
    produit_type: rows[0].category,
    produit_image: rows[0].image,
    total_price: total_price,
  };
  res.render("produit.ejs", data);
  return;
});

//Page de la liste des produits
app.get("/produits", async (req, res) => {
  const result = await pool.query("SELECT * FROM produits");
  const rows = result.rows;
  const totalPrice = await functions.getTotalPrice(currentUserId);
  const data = {
    type_produit: "",
    prenom: currentName,
    connection: false,
    inscription: false,
    connected: connectState,
    products: rows,
    panier: false,
    produit_id: rows[0].id_produit,
    produit_name: rows[0].nom,
    produit_price: rows[0].prix,
    produit_quantity: rows[0].stock,
    produit_type: rows[0].category,
    total_price: totalPrice,
  };
  res.render("liste_produits.ejs", data);
  return;
});


//Page d'accueil
app.get("/", async (req, res) => {
  connectState = false;
  const data = {
    type_produit: "Catalogue",
    connection: false,
    inscription: false,
    connected: connectState,
    panier: false,
  };
  console.log(connectState);
  res.render("index.ejs", data);
  return;
});

//créer une page gerant
app.get("/gerant", async (req, res) => {
  const result = 
  await pool.query("SELECT * FROM produits");
  const rows = result.rows;
  const result2 = 
  await pool.query("SELECT * FROM stock_products");
  const rows2 = result2.rows;
  const result3 = 
  await pool.query("SELECT * FROM commandes WHERE etat_livraison <> 'Terminée'");
  const rows3 = result3.rows;
  const data = {
    type_produit: "Catalogue",
    connection: false,
    inscription: false,
    connected: connectState,
    panier: false,
    products: rows,
    stock_products: rows2,
    commandes: rows3,
  };
  res.render("gerant.ejs", data);
  return;
});

// créer une page gerant_stock
app.get("/gerant_stock/:id", async (req, res) => {
  const result = 
  await pool.query("SELECT * FROM produits WHERE id_produit = " + req.params.id);
  const rows = result.rows;
  const result2 = 
  await pool.query("SELECT * FROM stock_products WHERE id_produit = " + req.params.id);
  const rows2 = result2.rows;
  const data = {
    type_produit: "Catalogue",
    connection: false,
    inscription: false,
    connected: connectState,
    panier: false,
    products: rows,
    stock_products: rows2,
    id : req.params.id,
  };
  res.render("gerant_stock.ejs", data);
  return;
});


// créer une page gerant_commandes
app.get("/gerant_commandes/:id", async (req, res) => {
  const result = 
  await pool.query("SELECT * FROM produits");
  const rows = result.rows;
  const result2 = 
  await pool.query("SELECT * FROM stock_products");
  const rows2 = result2.rows;
  const result3 = 
  await pool.query("SELECT * FROM commandes WHERE id_commande = " + req.params.id);
  const rows3 = result3.rows;
  const data = {
    type_produit: "Catalogue",
    connection: false,
    inscription: false,
    connected: connectState,
    panier: false,
    products: rows,
    stock_products: rows2,
    commandes: rows3,
    id : req.params.id,
  };
  res.render("gerant_commandes.ejs", data);
  return;
});

// Gestion de la modification du stock
app.post("/gerant_stock/:id", async (req, res) => {
  console.log(req.params.id);
  let qtS = req.body.addS;
  await functions.modifyStock(req.params.id, "S", qtS);
  let qtM = req.body.addM;
  await functions.modifyStock(req.params.id, "M", qtM);
  let qtL = req.body.addL;
  await functions.modifyStock(req.params.id, "L", qtL);
  let qtXL = req.body.addXL;
  await functions.modifyStock(req.params.id, "XL", qtXL);
  console.log(qtL, qtXL, qtM, qtS);
  res.redirect("/gerant_stock/" + req.params.id);
});

app.get('/gerant_commandes/c/:id', async (req, res) => {
  await functions.updateCommande(req.params.id, "c");
  res.redirect("/gerant");
});

app.listen(5501);
