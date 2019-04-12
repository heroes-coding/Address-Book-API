const elasticSearch = require('@elastic/elasticsearch')

const getContact = ({ name, elasticContactIndex, elasticSearchClient }) =>
  new Promise((resolve, reject) => {
    elasticSearchClient.get(
      {
        index: elasticContactIndex,
        id: name
      },
      (err, resp) => {
        if (err) {
          if (resp && resp.body && !resp.body.found) {
            return reject(new Error(`Contact ${name} not found`))
          } else {
            return reject(err)
          }
        } else {
          return resolve(resp.body._source)
        }
      }
    )
  })

const client = ({ elasticSearchUrl, elasticContactIndex }) => () => {
  console.log(
    `Elastic search configured with: ${JSON.stringify({
      elasticSearchUrl,
      elasticContactIndex
    })}`
  )
  const elasticSearchClient = new elasticSearch.Client({
    nodes: [elasticSearchUrl]
  })
  return {
    getHealth: () =>
      new Promise((resolve, reject) => {
        elasticSearchClient.cluster.health({}, (err, resp, status) => {
          if (err) {
            return reject(err)
          }
          return resolve(resp.body)
        })
      }),
    getContact: name =>
      getContact({ name, elasticContactIndex, elasticSearchClient }),
    updateContact: updatedContact =>
      new Promise(async (resolve, reject) => {
        try {
          let contact = await getContact({
            name: updatedContact.name,
            elasticContactIndex,
            elasticSearchClient
          }) // will error out if doesn't exist
          contact = { ...contact, ...updatedContact }
          elasticSearchClient.index(
            {
              index: elasticContactIndex,
              id: contact.name,
              body: contact
            },
            (err, resp, status) => {
              if (err) {
                return reject(err)
              }
              return resolve(contact)
            }
          )
        } catch (err) {
          reject(err)
        }
      }),
    deleteContact: name =>
      new Promise(async (resolve, reject) => {
        try {
          const contact = await getContact({
            name,
            elasticContactIndex,
            elasticSearchClient
          }) // will error out if doesn't exist
          elasticSearchClient.delete(
            {
              index: elasticContactIndex,
              id: contact.name
            },
            (err, resp, status) => {
              if (err) {
                return reject(err)
              }
              return resolve(contact)
            }
          )
        } catch (err) {
          reject(err)
        }
      }),
    addContact: contact =>
      new Promise(async (resolve, reject) => {
        try {
          await getContact({
            name: contact.name,
            elasticContactIndex,
            elasticSearchClient
          })
          return reject(new Error(`Contact ${contact.name} already exists`))
        } catch (err) {
          // silently pass error.  Contact should not exist.  If it does, it's an error
        }
        elasticSearchClient.index(
          {
            index: elasticContactIndex,
            id: contact.name,
            body: contact
          },
          (err, resp, status) => {
            if (err) {
              return reject(err)
            }
            return resolve(contact)
          }
        )
      }),
    template: () => new Promise((resolve, reject) => {})
  }
}

module.exports = client
