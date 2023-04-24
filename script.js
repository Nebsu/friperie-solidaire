let ejs = require("ejs");
let express = require("express");
let app = express();

app.use(express.static("public"));
app.use("/css", express.static(__dirname + "public/css"));
app.use("/js", express.static(__dirname + "public/js"));
app.use("/img", express.static(__dirname + "public/img"));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index.ejs", {});
  return;
});

app.post("/", (req, res) => {
  let name = req.body.name;
  let surname = req.body.surname;
  let email = req.body.email;
  let password = req.body.password;
  let confirm_password = req.body.confirmpassword;
  if (email === "azfklazfazfb") {
    // Verification si adresse email déjà utilisée
  } else if (password != confirm_password || password.length < 8) {
    // Verification mot de passe
    res.render("index.ejs/", {});
    console.log("Mot de passe invalide");
    return;
  } else {
    // Ajout des données dans la base de données
    res.render("index.ejs/", {});
    console.log("Mot de passe valide");
    console.log("Name: " + name);
    console.log("Surname: " + surname);
    console.log("Email: " + email);
  }
});

app.listen(5501);
