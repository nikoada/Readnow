const express = require("express");
const session = require("express-session");
const cors = require("cors");
const mongoose = require("mongoose");
const Node = require("./nodeModel");

const corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200,
  credentials: true
};

const app = express();

// Bodyparser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session
app.use(
  session({
    secret: "SecretKey",
    resave: true,
    saveUninitialized: true
  })
);

app.use(cors(corsOptions));

// Connecting to mongodb
mongoose.connect(
    "mongodb://localhost:27017/nodelist",
    { useNewUrlParser: true }
  )
  .then(() => console.log("MongoDB Connected..."))
  .catch(err => console.log(err));

app.get("/", (req, res) => {
  return res.send({ version: "1" });
});

app.get("/getNode/:id", (req, res) => {
  Node.findById(req.params.id, function(err, node) {
    if (err) return console.log(err);
    let now = Date.now();
    let status = false;
    if (now - node._doc.data.updated < 10000) status = true;
    res.send({ ...node._doc, online: status });
  });
});

app.get("/getNode", (req, res) => {
  console.log(req.session);
  Node.findById(req.session.user, function(err, node) {
    if (err) return res.send({ err: err });
    return res.send({ message: req.session });
  });
});

app.post("/login", (req, res) => {
  console.log(req.body);
  Node.findById(req.body.id, function(err, node) {
    if (err) return res.send({ err: err });
    req.session.user = req.body.id;
    console.log(req.session);
    res.send(node);
  });
});

app.post("/postNode", (req, res) => {
  let newNode = new Node(req.body);

  newNode.save(function(err) {
    if (err) return res.send(err);
    return res.send({ message: newNode });
  });
});

// example: http://localhost:8000/postValue?id=5c320711e10b0f3ad4766807&value1=33&value2=44
app.get("/postValue", (req, res) => {
  console.log(req.query);
  let { id, ...ValuesOnly } = req.query;
  Node.findByIdAndUpdate(
    req.query.id,
    { $set: { data: { ...ValuesOnly, updated: Date.now() } } },
    { new: true },
    function(err, node) {
      if (err) return res.send(err);
      res.send(node);
    }
  );
});

app.post("/postValue", (req, res) => {
  Node.findByIdAndUpdate(
    req.body.id,
    { $set: { data: req.body.data } },
    { new: true },
    function(err, node) {
      if (err) return res.send(err);
      res.send(node);
    }
  );
});

app.post("/logout", (req, res) => {
  req.session.destroy();
  res.send({ err: 0, message: "you successfully loged out" });
});

app.listen(8000, () => console.log("app listening on port 8000"));
