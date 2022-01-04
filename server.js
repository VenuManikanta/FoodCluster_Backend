const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const app = express();

app.use(express.json());
app.use(cors());

var db = mysql.createConnection({
  host: "localhost",
  user: "chef",
  password: "password",
  database: "FoodCluster_db",
});

db.connect((err) => {
  if (err) console.log(err);
  else console.log("Database Connected!");
});

app.post("/signup", (req, res) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const phone = req.body.phone;
  const email = req.body.email;
  const password = req.body.password;

  bcrypt.hash(password, saltRounds, (error, hash) => {
    if (error) console.log(error);
    db.query(
      "INSERT INTO user_details (firstName,lastName,email,phone,password) VALUES (?,?,?,?,?)",
      [firstName, lastName, email, phone, hash],
      (err, result) => {
        if (err) console.log(err);
        res.send({
          message: "Hey " + firstName + ",Registration successful!",
        });
      }
    );
  });
});
app.post("/signin", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  console.log(email + " " + password);
  db.query("SELECT * FROM user_details WHERE email=?", email, (err, result) => {
    if (err) {
      res.send({ err: err });
    }
    if (result.length > 0) {
      bcrypt.compare(password, result[0].password, (error, response) => {
        if (response) {
          result[0].message =
            "Hey " + result[0].firstName + ", You are successfully logged in.";
          res.send(result[0]);
        } else {
          res.send({ message: "Wrong email/password combination" });
        }
      });
    } else {
      res.send({ message: "User doesn't exit" });
    }
  });
});

app.listen(8000, () => {
  console.log("Server is running on port 8000....");
});
