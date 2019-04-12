const contactServiceTests = ({
  contactsService,
  Contact,
  assert,
  hasAsyncError,
  asyncSleep
}) => {
  describe('contactsService', function () {
    describe('createsAndMakesAvailableNewContactsThatAreNotAvailableOnceSuccessfullyDeleted', function () {
      const fleetingContact = Contact({
        name: 'The Vault Dweller 2',
        street: '64 Somewhere Street',
        city: 'Nowhere Town'
      })
      it('Successfully returns the same contact from the creation call (contactsService.addContact)', async function () {
        const newContact = await contactsService.addContact(fleetingContact)
        assert.deepEqual(newContact, {
          ...fleetingContact
        })
      })
      it('Successfully returns the same contact from a get call using the same name (contactsService.getContact)', async function () {
        const oldContact = await contactsService.getContact(
          fleetingContact.name
        )
        assert.deepEqual(oldContact, {
          ...fleetingContact
        })
      })
      it('Successfully returns the same contact from a deletion call (contactsService.deleteContact)', async function () {
        const deletedContact = await contactsService.deleteContact(
          fleetingContact.name
        )
        assert.deepEqual(deletedContact, {
          ...fleetingContact
        })
      })
      it('Throws an error when trying to get the now deleted contact (contactsService.getContact)', async function () {
        const hasError = await hasAsyncError(() =>
          contactsService.getContact(fleetingContact.name)
        )
        assert.equal(hasError, true)
      })
    })

    describe('cannotDeleteNonContact', function () {
      it("Throws an error when trying to delete a contact that doesn't exist", async function () {
        const hasError = await hasAsyncError(() =>
          contactsService.getContact('The Rat King')
        )
        assert.equal(hasError, true)
      })
    })
    describe('cannotUpdateNonContact', function () {
      it("Throws an error when trying to update a contact that doesn't exist", async function () {
        const hasError = await hasAsyncError(() =>
          contactsService.updateContact({
            name: 'The Rat King',
            street: '55 Main Sewer Sewer'
          })
        )
        assert.equal(hasError, true)
      })
    })
    describe('cannotGetNonContact', function () {
      it("Throws an error when trying to get a contact that doesn't exist", async function () {
        const hasError = await hasAsyncError(() =>
          contactsService.getContact('The Rat King')
        )
        assert.equal(hasError, true)
      })
    })
    describe('cannotMakeContactWithSameName', function () {
      it('Throws an error when trying to add a contact with the same name again', async function () {
        const duplicatingContact = Contact({
          name: 'The same guy',
          street: '64 Somewhere Street',
          city: 'Nowhere Town'
        })
        await contactsService.addContact(duplicatingContact)
        const hasError = await hasAsyncError(() =>
          contactsService.addContact({
            ...duplicatingContact,
            street: 'new street'
          })
        )
        assert.equal(hasError, true)
        await contactsService.deleteContact(duplicatingContact.name)
      })
    })
    describe('createsAndUpdatesContactWithNewInfoNonDestructively', function () {
      const fleetingContact = Contact({
        name: 'The Vault Dweller 2',
        street: '64 Somewhere Street',
        city: 'Nowhere Town'
      })
      it('Successfully returns the same contact from the creation call (contactsService.addContact)', async function () {
        const newContact = await contactsService.addContact(fleetingContact)
        assert.deepEqual(newContact, {
          ...fleetingContact
        })
      })
      it('Successfully returns the updated contact from a get call using the same name with new properties (contactsService.updateContact)', async function () {
        const oldContact = await contactsService.updateContact({
          name: fleetingContact.name,
          country: 'Skyland'
        })
        assert.deepEqual(oldContact, {
          ...fleetingContact,
          country: 'Skyland'
        })
      })
      it('Successfully returns the updated contact from a get call using the same name with overwritten properties (contactsService.updateContact)', async function () {
        const oldContact = await contactsService.updateContact({
          name: fleetingContact.name,
          city: 'Cloud City'
        })
        assert.deepEqual(oldContact, {
          ...fleetingContact,
          city: 'Cloud City',
          country: 'Skyland'
        })
      })
      it('Successfully returns the same contact from a deletion call (contactsService.deleteContact)', async function () {
        const deletedContact = await contactsService.deleteContact(
          fleetingContact.name
        )
        assert.deepEqual(deletedContact, {
          ...fleetingContact,
          city: 'Cloud City',
          country: 'Skyland'
        })
      })
    })
    describe('returnsIndexedContactsBySearchTermAfterDelay', function () {
      it('Returns expected length of contacts after a delay', async function () {
        const crazyLastName = 'NobodyElseHasThisLastNameTrustMe'
        const names = ['Bob', 'Jane', 'Frank', 'Helen', 'Guy'].map(
          n => `${n} ${crazyLastName}`
        )
        names.forEach(name => contactsService.addContact({ name }))
        await asyncSleep(1000)
        const query = `name:${crazyLastName}`
        const contacts = await contactsService.queryContacts({
          query
        })
        assert.equal(contacts.length, names.length)
        names.forEach(name => contactsService.deleteContact(name))
      })
    })
  })
}

module.exports = contactServiceTests
