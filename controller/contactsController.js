const contactsController = ({
  app,
  DEFAULT_CONTACT_PAGE,
  DEFAULT_CONTACT_PAGE_SIZE,
  contactsService
}) => {
  app.get('/contact', (req, res) => {
    let pageSize = req.query.pageSize
    let page = req.query.page
    let query = req.query.query
    if (pageSize) {
      if (isNaN(pageSize) || !Number.isInteger(parseInt(pageSize))) {
        return res
          .status(400)
          .send(`pageSize must be an integer, is ${pageSize}`)
      } else {
        pageSize = parseInt(pageSize)
      }
    } else {
      pageSize = DEFAULT_CONTACT_PAGE_SIZE
    }
    if (page) {
      if (isNaN(page) || !Number.isInteger(parseInt(page))) {
        return res.status(400).send(`page must be an integer, is ${page}`)
      } else {
        page = parseInt(page)
      }
    } else {
      page = DEFAULT_CONTACT_PAGE
    }

    contactsService
      .queryContacts({ pageSize, page, query })
      .then(body => res.json(body))
      .catch(err => res.status(400).send(err.toString()))
  })

  app.get('/contact/:name', (req, res) => {
    const name = req.params.name
    contactsService
      .getContact(name)
      .then(contact => res.status(200).send(contact))
      .catch(err => res.status(404).send(err.toString()))
  })

  app.delete('/contact/:name', (req, res) =>
    contactsService
      .deleteContact(req.params.name)
      .then(contact => res.status(200).send(contact))
      .catch(err => res.status(404).send(err.toString()))
  )

  app.post('/contact', (req, res) =>
    contactsService
      .addContact(req.body)
      .then(body => res.status(200).send(body))
      .catch(err => res.status(400).send(err.toString()))
  )

  app.put('/contact/:name', (req, res) => {
    const contact = req.body
    if (!contact || typeof contact !== 'object') {
      return res.status(404).send('Contact information not provided')
    }
    contact.name = req.params.name // since the body might be missing a name or it might be mismatched, I will use the path as the source of truth
    contactsService
      .updateContact(contact)
      .then(body => res.status(200).send(body))
      .catch(err => res.status(400).send(err.toString()))
  })
}

module.exports = contactsController
