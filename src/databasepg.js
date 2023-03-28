const { Client } = require("pg");
const client = new Client({
  host: "localhost",
  user: "postgres",
  port: 4545,
  password: "root",
  database: "Friperie",
});

client.connect();

client.query(`SELECT * FROM stock`, (err, res) => {
  if (!err) {
    console.log(res.rows);
  } else {
    console.log(err);
  }
  client.end();
});
