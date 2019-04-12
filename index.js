const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const port = process.env.PORT || 4242
const elasticSearchUrl =
  process.env.ELASTIC_SEARCH_URL || 'http://127.0.0.1:9200'
const elasticContactIndex = process.env.ELASTIC_CONTACT_INDEX || 'contacts'

// entities
const Contact = require('./entity/contact')

// data
const elasticSearchClient = require('./data/elasticSearchClient')({
  elasticSearchUrl,
  elasticContactIndex
})()

// services
const contactsService = require('./service/contactsService')({
  client: elasticSearchClient,
  Contact
})()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.text())
app.use(bodyParser.json({ type: 'application/json' }))

app.get('/', (req, res) =>
  elasticSearchClient
    .getHealth()
    .then(body => res.json(body))
    .catch(err => res.status(500).send({ error: err }))
)

app.get('/contact/:name', (req, res) => {
  const name = req.params.name
  contactsService
    .getContact(name)
    .then(contact => res.status(200).send(contact))
    .catch(err => res.status(400).send(err.toString()))
})

app.delete('/contact/:name', (req, res) => {
  const name = req.params.name
  contactsService
    .deleteContact(name)
    .then(contact => res.status(200).send(contact))
    .catch(err => res.status(400).send(err.toString()))
})

app.post('/contact', (req, res) => {
  const contact = req.body
  contactsService
    .addContact(contact)
    .then(body => res.status(200).send(body))
    .catch(err => res.status(400).send(err.toString()))
})

app.put('/contact/:name', (req, res) => {
  const contact = req.body
  if (!contact || typeof contact !== 'object') {
    return res.status(400).send('Contact information not provided')
  }
  contact.name = req.params.name // since the body might be missing a name or it might be mismatched, I will use the path as the source of truth
  contactsService
    .updateContact(contact)
    .then(body => res.status(200).send(body))
    .catch(err => res.status(400).send(err.toString()))
})

app.listen(port)
console.log('Express app listening on port ' + port)
