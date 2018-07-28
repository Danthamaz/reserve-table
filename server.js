const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const mysql = require("mysql");

const app = express();
const PORT = process.env.PORT || 3000;

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "reservations"
});

connection.connect(function(err) {
  if (err) {
    console.log("Connection error" + err);
    return;
  }
  console.log("Connected! :)");
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

// RESERVATIONS

let tableData = [];
let waitlistData = [];

// ROUTES

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname + "/home.html"));
});

app.get("/tables", function(req, res) {
  res.sendFile(path.join(__dirname + "/tables.html"));
});

app.get("/reserve", function(req, res) {
  res.sendFile(path.join(__dirname + "/reserve.html"));
});

app.post("/api/tables", function(req, res) {
  res.sendFile(path.join(__dirname + "/api/tables"));
  connection.query(
    "INSERT INTO customers (customer_name,customer_email,phone_number) VALUES ('" +
      req.body.customerName +
      "','" +
      req.body.customerEmail +
      "','" +
      req.body.phoneNumber +
      "');",
    function(err, res) {
      if (err) {
        console.log(err);
      } else {
        console.log(res);
      }
    }
  );

  connection.query(
    "INSERT INTO reservations (customer_id) VALUES ('" +
      req.body.customerID +
      "');",
    function(err, res) {
      if (err) {
        console.log(err);
      } else {
        console.log(res);
      }
    }
  );

  connection.query(
    "INSERT INTO waitings (customer_id) VALUES ('" +
      req.body.customerID +
      "');",
    function(err, res) {
      if (err) {
        console.log(err);
      } else {
        console.log(res);
      }
    }
  );

  var newTable = req.body;

  if (tableData.length <= 4) {
    tableData.push(newTable);
  } else {
    waitlistData.push(newTable);
  }

  res.json(newTable);
});

app.post("/api/waitlist", function(req, res) {
  let newTable2 = req.body;
  res.json(newTable2);
});

app.get("/api/tables", function(req, res) {
  res.json(tableData);
});

app.get("/api/waitlist", function(req, res) {
  res.json(waitlistData);
});

// START SERVER :D

app.listen(PORT, function() {
  console.log("App listening on PORT: " + PORT);
});
