const getClientResponse = async (clientFunction, input) => {
  try {
    const response = await clientFunction(input)
    return response
  } catch (err) {
    throw err
  }
}

const getContactGetClientResponse = async (
  properties,
  Contact,
  clientFunction
) => {
  try {
    const contact = Contact(properties)
    return await getClientResponse(clientFunction, contact)
  } catch (err) {
    throw err
  }
}

const contactsService = ({ client, Contact }) => ({
  queryContacts: query => getClientResponse(client.getContactsByQuery, query),
  addContact: contact =>
    getContactGetClientResponse(contact, Contact, client.addContact),
  updateContact: contact =>
    getContactGetClientResponse(contact, Contact, client.updateContact),
  getContact: name => getClientResponse(client.getContact, name),
  deleteContact: name => getClientResponse(client.deleteContact, name)
})

module.exports = contactsService
