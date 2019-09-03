const express = require('express')
const app = express()
const session = require('express-session')
const cors = require('cors')
const server = require('http').createServer(app)
const fs = require('fs')

const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200,
  credentials: true
}

// Bodyparser
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Session
app.use(
  session({
    secret: 'SecretKey',
    resave: true,
    saveUninitialized: true
  })
)

app.use(cors(corsOptions))

// app.use(express.static(`${__dirname}/../../build`))
//
// const path = require('path')
// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, '../../build/index.html'))
// })

app.set('view engine', 'ejs')

app.get('/getNode/:id', (req, res) => {
  Node.findById(req.params.id, function (err, node) {
    if (err) return console.log(err)
    let now = Date.now()
    let status = false
    if (now - node._doc.data.updated < 30000) status = true
    res.send({ ...node._doc, online: status })
  })
})

app.get('/getNode', (req, res) => {
  // console.log(req.session)
  // Node.findById(req.session.user, function (err, node) {
  //   if (err) return res.send({ err: err })
  //   return res.send({ message: req.session })
  // })
})

app.post('/login', (req, res) => {
  console.log(req.body)
  const obj = {
    node: []
  }

  obj.node.push({ id: req.body.id })
  const json = JSON.stringify(obj)
  fs.appendFile('jsonDB.json', json, 'utf8', (error) => {
    if (error){
      res.send({ error : error })
      throw new Error({ error: 1, message: 'Could not add id' })
    }
    res.send({ message: obj })
  })

  // console.log(req.body)
  // Node.findById(req.body.id, function (err, node) {
  //   if (err) return res.send({ err: err })
  //   req.session.user = req.body.id
  //   console.log(req.session)
  //   res.send(node)
  // })
})

app.put('/postNode', (req, res) => {
  let newNode = new Node({ ...req.body, data: { updated: Date.now() } })
  console.log('we are reaching here!')
  newNode.save(function (err) {
    if (err) return res.send(err)
    return res.send({ message: newNode })
  })
})

// example: http://localhost:8000/postValue?id=5c320711e10b0f3ad4766807&value1=33&value2=44
app.get('/postValue', (req, res) => {
  console.log(req.query)
  let { id, ...ValuesOnly } = req.query
  Node.findByIdAndUpdate(
    req.query.id,
    { $set: { data: { ...ValuesOnly, updated: Date.now() } } },
    { new: true },
    function (err, node) {
      if (err) return res.send(err)
      res.send(node)
    }
  )
})

app.put('/postValue', (req, res) => {
  Node.findByIdAndUpdate(
    req.body.id,
    { $set: { data: { ...req.body.data, updated: Date.now() } } },
    { new: true },
    function (err, node) {
      if (err) return res.send(err)
      res.send(node)
    }
  )
})

app.post('/logout', (req, res) => {
  req.session.destroy()
  res.send({ err: 0, message: 'you successfully loged out' })
})

app.get('/ereader', (req, res) => {
  res.render('index', { initialContent: 42 })
})

let port = process.env.PORT || 8080
server.listen(port, () => console.log(`app listening on port ${port}`))
