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

async function getAllEmail() {
  const result = await pool.query("SELECT email FROM utilisateurs");
  const rows = result.rows.map((row) => row.email);
  return rows;
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
  }
  const data = {
    name: namefield,
    surname: surnamefield,
    email: emailfield,
    prenom: "",
    connection: connection,
    inscription: inscription,
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
  }
  const data = {
    name: "",
    surname: "",
    email: "",
    prenom: user.rows[0].prenom,
    connection: connection,
    inscription: false,
  };
  console.log(data.prenom);
  res.render("index.ejs", data);
  // Partie connection
});

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

app.listen(5501);
