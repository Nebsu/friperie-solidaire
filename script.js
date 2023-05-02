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

const database = [];
class User {
  constructor(name, surname, email, password) {
    this.name = name;
    this.surname = surname;
    this.email = email;
    this.password = password;
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
    registerUser(user);
    console.log(database);
  }
});

app.post("/connection", async (req, res) => {
  const data = {
    name: "",
    surname: "",
    email: "",
    prenom: "",
    connection: true,
    inscription: false,
  };
  let email = req.body.email;
  let password = req.body.password;
  console.log("Post Connection");
  const user = await getUser(email);
  console.log(JSON.stringify(user.rows[0].email, null, " "));
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
