const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const port = process.env.PORT || 4242
const elasticSearchUrl =
  process.env.ELASTIC_SEARCH_URL || 'http://127.0.0.1:9200'
const elasticContactIndex = process.env.ELASTIC_CONTACT_INDEX || 'contacts'
const DEFAULT_CONTACT_PAGE_SIZE = 10
const DEFAULT_CONTACT_PAGE = 0

// entities
const { Contact } = require('./entity/contact')

// data
const elasticSearchClient = require('./data/elasticSearchClient')({
  elasticSearchUrl,
  elasticContactIndex
})

// services
const contactsService = require('./service/contactsService')({
  client: elasticSearchClient,
  Contact
})

// controllers - only need to be called to create the controller
require('./controller/contactsController')({
  app,
  DEFAULT_CONTACT_PAGE,
  DEFAULT_CONTACT_PAGE_SIZE,
  contactsService
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.text())
app.use(bodyParser.json({ type: 'application/json' }))

app.listen(port)
console.log('Express app listening on port ' + port)
