const ejs = require("ejs");
const pg = require("pg");
const express = require("express");
const app = express();
const pool = new pg.Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "root",
  port: 5432,
});

app.use(express.static("public"));
app.use("/css", express.static(__dirname + "public/css"));
app.use("/js", express.static(__dirname + "public/js"));
app.use("/img", express.static(__dirname + "public/img"));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

const database = [];
class User {
  constructor(name, surname, email, password) {
    this.name = name;
    this.surname = surname;
    this.email = email;
    this.password = password;
  }
}

function getAllEmail() {
  let emails = [];
  for (let i = 0; i < database.length; i++) {
    emails.push(database[i].email);
  }
  return emails;
}

function checkConnect(email, password) {
  for (let i = 0; i < database.length; i++) {
    if (database[i].email === email && database[i].password === password) {
      return true;
    }
  }
  return false;
}

app.get("/connection", function (req, res) {
  const data = {
    name: "",
    surname: "",
    email: "",
    prenom: "",
    connection: true,
    inscription: false,
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
  };
  res.render("index.ejs", data);
  return;
});

app.post("/inscription", (req, res) => {
  const data = {
    name: "",
    surname: "",
    email: "",
    prenom: "",
    connection: false,
    inscription: true,
  };
  let name = req.body.name;
  let surname = req.body.surname;
  let email = req.body.email;
  let password = req.body.password;
  let confirm_password = req.body.confirmpassword;
  console.log("Post Inscription");
  if (getAllEmail().includes(email)) {
    // check if email is already in database
    res.render("index.ejs", data);
    console.log("Email déjà utilisé");
    return;
  } else if (password != confirm_password || password.length < 8) {
    // Verification mot de passe
    pop_up = true;
    res.render("index.ejs", data);
    console.log("Mot de passe invalide");
    return;
  } else {
    // Ajout des données dans la base de données
    res.render("index.ejs", data);
    const user = new User(name, surname, email, password);
    database.push(user);
    console.log(database);
  }
});

app.post("/connection", (req, res) => {
  const data = {
    name: "",
    surname: "",
    email: "",
    prenom: "",
    connection: true,
    inscription: false,
  };
  let email = req.body.email;
  let surname = req.body.password;
  console.log("Post Connection");
  if (checkConnect(email, surname)) {
    console.log("Connecté");
  } else {
    console.log("Erreur");
  }
  res.render("index.ejs", data);
  // Partie connection
});
app.post("/", (req, res) => {
  let name = req.body.name;
  let surname = req.body.surname;
  let email = req.body.email;
  let password = req.body.password;
  let confirm_password = req.body.confirmpassword;
  const database = [];
  const data = { name: "", surname: "", email: "", prenom: "" };
  console.log("Post");
});

app.listen(5501);
