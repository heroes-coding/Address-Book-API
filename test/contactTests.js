const contactTests = ({ propNames, Contact, assert }) => {
  describe('Contact', function () {
    describe('onlyNeedsName', function () {
      const nameContact = { name: 'Jeremy' }
      it(`Only needs a name in the properties object passed in (${JSON.stringify(
        nameContact
      )})`, function () {
        assert.deepEqual(Contact(nameContact), { ...nameContact })
      })
    })
    describe('mustHaveName', function () {
      it('Throws error when properties object passed without name', function () {
        assert.throws(() => Contact({ street: '66 Elm Street' }), Error)
      })
    })
    describe('numbersCannotHaveCharsOtherThan: 0123456789- ()', function () {
      it('Throws error when passed other chars', function () {
        for (let phone of propNames.filter(p => p.includes('Phone'))) {
          assert.throws(
            () => Contact({ name: 'Some Guy', [phone]: 'not a phone number' }),
            Error
          )
        }
      })
      it('Accepts phone numbers with dashes, spaces, and paranthesis', function () {
        for (let phone of propNames.filter(p => p.includes('Phone'))) {
          assert.ok(
            () => Contact({ name: 'Some Guy', [phone]: '(123) 456-7890' }),
            Error
          )
        }
      })
    })
    describe('canHaveAllProperties', function () {
      const fullContact = {}
      propNames.forEach(prop => {
        fullContact[prop] = '1337'
      })
      it(`Can have every property (${JSON.stringify(
        fullContact
      )})`, function () {
        assert.deepEqual(Contact(fullContact), { ...fullContact })
      })
    })
    describe('cannotHaveExtraProperty', function () {
      const wrongProp = 'favoriteColor'
      const propsWithWrongProp = { name: 'Joe', [wrongProp]: 'Red' }
      it(`Throws error when any property not in propNames (propNames: ${JSON.stringify(
        propNames
      )}) (${JSON.stringify(
        propsWithWrongProp
      )} has a prop that is not in propNames: ${!propNames.includes(
        wrongProp
      )})`, function () {
        assert.throws(() => Contact({ [wrongProp]: 'Red' }), Error)
      })
    })
  })
}

module.exports = contactTests
