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

// app.use(function (req, res, next) {
//
//     // Website you wish to allow to connect
//     res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
//
//     // Request methods you wish to allow
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//
//     // Request headers you wish to allow
//     res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
//
//     // Set to true if you need the website to include cookies in the requests sent
//     // to the API (e.g. in case you use sessions)
//     res.setHeader('Access-Control-Allow-Credentials', true);
//
//     // Pass to next layer of middleware
//     next();
// });

// app.use( express.static( `${__dirname}/../../build` ) );
//
// const path = require('path')
// app.get('/', (req, res)=>{
//   res.sendFile(path.join(__dirname, '../../build/index.html'));
// })

app.set("view engine", "ejs");


// Connecting to mongodb
mongoose.connect(
    "mongodb://138.197.182.5:27017/nodelist",
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
  let newNode = new Node({...req.body, data: {updated: 0}});

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

app.put("/postValue", (req, res) => {
  Node.findByIdAndUpdate(
    req.body.id,
    { $set: { data: {...req.body.data, updated: Date.now() } } },
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

app.get("/ereader", (req, res) => {
  res.render("index", { values: 42 });
})

let port = process.env.PORT || 8080;
app.listen(port, () => console.log(`app listening on port ${port}`));
