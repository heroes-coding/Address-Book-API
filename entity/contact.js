const MAX_PROP_CHARS = 50
const VALID_PHONE_CHARS = '0123456789()- '
const VALID_ZIP_CHARS = '0123456789- '

const hasPropertiesCheck = properties => {
  if (!properties || typeof properties !== 'object') {
    throw new Error('Contact does not have valid properties')
  }
  if (!properties.name) {
    throw new Error('Contact does not have a name')
  }
}

const containsInvalidPropsCheck = properties => {
  const incorrectProps = Object.keys(properties).filter(
    p => !propNames.includes(p)
  )
  if (incorrectProps.length) {
    throw new Error(
      'Contact had unexpected properties: ' + incorrectProps.join()
    )
  }
}

const propValidation = (propKey, prop) => {
  if (typeof prop !== 'string') {
    throw new Error(`${propKey} was not passed as a string`)
  } else if (prop.length > MAX_PROP_CHARS) {
    throw new Error(
      `${propKey} is too long, ${MAX_PROP_CHARS} is the maximum length, and it is ${
        prop.length
      } characters long`
    )
  } else if (
    propKey.includes('Phone') &&
    prop.split('').filter(c => !VALID_PHONE_CHARS.includes(c)).length
  ) {
    throw new Error(
      `${propKey} (${prop}) contains invalid characters for a phone number, which only include ${VALID_PHONE_CHARS}`
    )
  } else if (
    propKey === 'zipcode' &&
    prop.split('').filter(c => !VALID_ZIP_CHARS.includes(c)).length
  ) {
    throw new Error(
      `${propKey} (${prop}) contains invalid characters for a zip code, which only include ${VALID_ZIP_CHARS}`
    )
  }
}

const propNames = [
  'name',
  'street',
  'city',
  'country',
  'zipcode',
  'stateOrProvince',
  'homePhone',
  'workPhone',
  'cellPhone',
  'apartmentOrUnit'
]
/**
 * Creates a new contact, using a properties object with the property names from the property names in
 * propNames at the top of this file.  It must have a name property, and all others are optional but
 * must be strings.
 */
const Contact = properties => {
  try {
    hasPropertiesCheck(properties)
    containsInvalidPropsCheck(properties)
    const contact = {}
    for (const propKey of Object.keys(properties)) {
      const prop = properties[propKey]
      propValidation(propKey, prop)
      contact[propKey] = prop
    }
    return contact
  } catch (err) {
    throw err
  }
}

module.exports = { Contact, propNames }
