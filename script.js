

const ejs = require("ejs");
const pg = require("pg");
const express = require("express");
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

let currentUserId = NaN;
let currentName = "";

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
async function addToCart(id, quantity, price) {
  const text =
    "INSERT INTO panier(id_utilisateur, id_produit, quantite, prix_unitaire) VALUES($1, $2, $3) RETURNING *";
  const values = [currentUserId, id, quantity, price];
  return pool.query(text, values);
}

// Supprimer un produit du panier
async function deleteProductCart(id) {
  const text =
    "DELETE FROM panier WHERE id_produit = $1 AND id_utilisateur = $2";
  const values = [id, currentUserId];
  return pool.query(text, values);
}

async function deleteCart() {
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

app.post("/inscription", async (req, res) => {
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
  const database = await getAllEmail();
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
    const user = new User(name, surname, email, password);
    registerUser(user);
    connection = true;
    pop_up = true;
    res.redirect("/connection");
    return;
  }
  const data = {
    name: namefield,
    surname: surnamefield,
    email: emailfield,
    prenom: "",
    connection: connection,
    inscription: inscription,
    connected: false,
    panier:false,
  };
  res.render("index.ejs", data);
  return;
});

app.post("/connection", async (req, res) => {
  let connection = false;
  let emailfield = "";
  let connected = false;
  let email = req.body.email;
  let password = req.body.password;
  console.log("Post Connection");
  const user = await getUser(email);
  if (user.rows.length == 0) {
    connection = true;
    console.log("Utilisateur non trouvé");
    return;
  } else if (user.rows[0].mot_de_passe != password) {
    connection = true;
    emailfield = email;
    console.log("Mot de passe incorrect");
  } else {
    console.log("Connection réussie");
    connected = true;
    currentName = user.rows[0].prenom;
    currentUserId = user.rows[0].id_utilisateur;
    console.log(currentName + " " + currentUserId);
    res.redirect("/connected");
    return;
  }
  const data = {
    name: "",
    surname: "",
    email: "",
    prenom: currentName + " ",
    connection: connection,
    inscription: false,
    connected: connected,
    panier:false,
  };
  res.render("index.ejs", data);
});

app.get("/deconnection", function (req, res) {
  currentName = "";
  currentUserId = "";
  res.redirect("/");
});

app.get("/connected", async (req, res) => {
  const result = await pool.query("SELECT * FROM produits");
  const rows = result.rows;
  const data = {
    name: "",
    surname: "",
    email: "",
    prenom: currentName,
    connection: false,
    inscription: false,
    connected: true,
    products: rows,
    panier:false,
  };
  res.render("index.ejs", data);
});

app.get("/connection", function (req, res) {
  const data = {
    name: "",
    surname: "",
    email: "",
    prenom: currentName + " ",
    connection: true,
    inscription: false,
    connected: false,
    panier:false,
  };
  res.render("index.ejs", data);
  return;
});

app.get("/inscription", function (req, res) {
  const data = {
    name: "",
    surname: "",
    email: "",
    prenom: "",
    connection: false,
    inscription: true,
    connected: false,
    panier:false,
  };
  res.render("index.ejs", data);
  return;
});

app.get("/panier", async (req, res) => {
  const data = {
    name: "",
    surname: "",
    email: "",
    prenom: currentName,
    connection: false,
    inscription: false,
    connected: true,
    panier:true,
  };
  res.render("index.ejs", data);
  return;
});


app.get("/", (req, res) => {
  const data = {
    name: "",
    surname: "",
    email: "",
    prenom: "",
    connection: false,
    inscription: false,
    connected: false,
    panier:false,
  };
  res.render("index.ejs", data);
  return;
});



app.listen(5501);
