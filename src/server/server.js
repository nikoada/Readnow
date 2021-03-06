const express = require('express')
const app = express()
const cors = require('cors')
const server = require('http').createServer(app)
const fs = require('fs')
const randomstring = require('randomstring')

const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200,
  credentials: true
}

// Bodyparser
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(cors(corsOptions))

app.use(express.static(`${__dirname}/../../build`))

const path = require('path')
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../build/index.html'))
})

app.set('view engine', 'ejs')

app.get('/getNode/:id', (req, res) => {
  if (!fs.existsSync(`${__dirname}/../../src/server/nodes/${req.params.id}.json`)) return res.send({ message: `can't find the node with id: ${req.body.id} ` })
  fs.readFile(`${__dirname}/../../src/server/nodes/${req.params.id}.json`, (err, data) => {
    if (err) res.send({ error: err, message: 'can\'t find the node' })
    const content = JSON.parse(data)
    const now = Date.now()
    let status = false
    if (now - content.updated < 30000) status = true
    res.send({ ...content, online: status })
  })
})

app.post('/postNode', (req, res) => {
  // here we add unique id to object and timestamp on creation
  const newNode = { ...req.body, id: randomstring.generate(16), updated: Date.now() }
  const json = JSON.stringify(newNode)

  fs.writeFile(`${__dirname}/../../src/server/nodes/${newNode.id}.json`, json, 'utf8', (error) => {
    if (error) {
      res.send({ error: error, message: 'can\'t creat a node' })
    }
    res.send(newNode)
  })
})

app.put('/postValue', (req, res) => {
  if (!fs.existsSync(`${__dirname}/../../src/server/nodes/${req.body.id}.json`)) return res.send({ message: `can't find the node with id: ${req.body.id} ` })
  const nodeObj = req.body
  nodeObj.updated = Date.now()
  const json = JSON.stringify(nodeObj)
  fs.writeFile(`${__dirname}/../../src/server/nodes/${req.body.id}.json`, json, 'utf8', (error) => {
    if (error) {
      res.send({ error: error, message: 'can\'t update a node' })
    }
    const { updated, ...rest } = nodeObj
    res.send(rest)
  })
})

app.post('/postValue', (req, res) => {
  if (!fs.existsSync(`${__dirname}/../../src/server/nodes/${req.body.id}.json`)) return res.send({ message: `can't find the node with id: ${req.body.id} ` })
  const nodeObj = req.body
  nodeObj.updated = Date.now()
  const json = JSON.stringify(nodeObj)
  fs.writeFile(`${__dirname}/../../src/server/nodes/${req.body.id}.json`, json, 'utf8', (error) => {
    if (error) {
      res.send({ error: error, message: 'can\'t update a node' })
    }
    const { updated, ...rest } = nodeObj
    res.send(rest)
  })
})

const port = process.env.PORT || 3000
server.listen(port, () => console.log(`app listening on port ${port}`))
