const assert = require('assert')
const { propNames, Contact } = require('../entity/contact')
const elasticSearchUrl =
  process.env.ELASTIC_SEARCH_URL || 'http://127.0.0.1:9200'
const elasticContactIndex = process.env.ELASTIC_CONTACT_INDEX || 'contacts'

const elasticSearchClient = require('../data/elasticSearchClient')({
  elasticSearchUrl,
  elasticContactIndex
})
const contactsService = require('../service/contactsService')({
  client: elasticSearchClient,
  Contact
})

const hasAsyncError = async asyncFunc => {
  let hasError
  try {
    await asyncFunc()
  } catch (err) {
    hasError = true
  }
  return hasError
}

const asyncSleep = ms =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(true)
    }, ms)
  })

require('./contactTests')({ propNames, Contact, assert })
require('./contactsServiceTests')({
  contactsService,
  Contact,
  assert,
  hasAsyncError,
  asyncSleep
})
