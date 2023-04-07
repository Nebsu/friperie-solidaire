const express = require("express");
const { Client } = require("pg");
const app = express();
const client = new Client({
  host: "localhost",
  user: "postgres",
  port: 4545,
  password: "root",
  database: "postgres",
});

client.connect();

// Add a new user to the database*
app.use(express.json());
app.post("/users", (req, res) => {
  const { name, surname, mail, password } = req.body;
  client.query(
    `INSERT INTO utilisateurs (name, surname, mail, password) VALUES ('${name}', '${surname}', '${mail}', '${password}')`,
    (err, res) => {
      if (!err) {
        console.log("User added");
      } else {
        console.log(err);
      }
      client.end();
    }
  );
});
