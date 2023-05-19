const ejs = require("ejs");
const pg = require("pg");
const express = require("express");
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

let currentUserId = NaN;
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
  constructor(name, surname, email, password) {
    this.name = name;
    this.surname = surname;
    this.email = email;
    this.password = password;
  }
}

var clickHandler = function () {
  console.log("click event");
};

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
    const user = new User(name, surname, email, password);
    functions.registerUser(user);
    connection = true;
    pop_up = true;
    res.redirect("/connection");
    return;
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
    return;
  } else if (user.rows[0].mot_de_passe != password) {
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
    type_produit: "Catalogue",
    name: "",
    surname: "",
    email: "",
    prenom: currentName,
    connection: false,
    inscription: false,
    connected: connectState,
    products: rows,
    panier: false,
  };
  res.render("index.ejs", data);
});

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

app.get("/panier", async (req, res) => {
  const data = {
    type_produit: "Catalogue",
    prenom: currentName,
    connection: false,
    inscription: false,
    connected: connectState,
    panier: true,
  };
  res.render("index.ejs", data);
  return;
});

app.get("/veste", async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM produits WHERE category = 'veste'"
  );
  const counter = await pool.query(
    "SELECT COUNT(*) FROM produits WHERE category = 'veste'"
  );
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
  };
  res.render("index.ejs", data);
  return;
});

app.get("/pantalon", async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM produits WHERE category = 'pantalon'"
  );
  const counter = await pool.query(
    "SELECT COUNT(*) FROM produits WHERE category = 'pantalon'"
  );
  const rows = result.rows;
  const count = counter.rows[0].count;
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
  };
  res.render("index.ejs", data);
  return;
});

app.get("/chemise", async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM produits WHERE category = 'chemise'"
  );
  const counter = await pool.query(
    "SELECT COUNT(*) FROM produits WHERE category = 'chemise'"
  );
  const rows = result.rows;
  const count = counter.rows[0].count;
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
  };
  res.render("index.ejs", data);
  return;
});

app.get("/accessoire", async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM produits WHERE category = 'accessoire'"
  );
  const counter = await pool.query(
    "SELECT COUNT(*) FROM produits WHERE category = 'accessoire'"
  );
  const rows = result.rows;
  const count = counter.rows[0].count;
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
  };
  res.render("index.ejs", data);
  return;
});

app.get("/produits/:id", async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM produits WHERE id_produit = " + req.params.id
  );
  const rows = result.rows;

  const data = {
    type_produit: "",
    prenom: currentName,
    connection: false,
    inscription: false,
    connected: connectState,
    products: "",
    panier: false,
    produit_id : rows[0].id_produit,
    produit_name : rows[0].nom,
    produit_price : rows[0].prix,
    produit_quantity : rows[0].stock,
  };
  res.render("produit.ejs",data);
  return;
});

app.get("/", (req, res) => {
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

app.listen(5501);
