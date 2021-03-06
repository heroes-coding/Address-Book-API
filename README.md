# Address Book API

This is a RESTful API for an address book with an Elasticsearch data store written in Node / Express.

The test suite can be run with `yarn test` or `npm run test`. The actual API can be launched with `yarn start` or `npm start`, and the following environmental variables are exposed for further configuration:

- `ELASTIC_SEARCH_URL` - Where elastic search is being served from (with no password & username authentication)
- `ELASTIC_CONTACT_INDEX` - The elastic search index to
- `DEFAULT_CONTACT_PAGE_SIZE` - The default (max) number of contacts to return when not specified
- `DEFAULT_CONTACT_PAGE` - The default page offset for contacts

## The API

`GET /contact?pageSize={}&page={}&query={}`

- Returns a list of contacts.
- Page size and page must be integers, and query is of the form `{ "query": [FULL ElasticSearch queryStringQuery] }`, for example:

```
GET /contact?query={ "query": { "query_string" : { "default_field" : "name", "query" : "Friend" } } }
```

should return the example contact shown below in the contacts section if it was first added (Unless you have a lot of contacts with the name friend as part of their name)

`POST /contact`

- Adds a new contact (posted in JSON) if it is in the proper format and another contact with the same name does not exist
- See the section Contacts below for more information about the correct format for contacts

`GET /contact/{name}`

- Gets a contact by name
- Returns a 404 error if the contact does not exist

`PUT /contact/{name}`

- Updates the contact by a unique name using another contact object included in the body in JSON
- Does not destructively update (will overwrite properties, but will not alter or delete them if not included in the body)
- Returns a 404 error if the contact does not exist

`DELETE /contact/{name}`

- Deletes a contact
- Returns a 404 error if the contact does not exist

## Contacts

Contacts can have the following optional properties, all of which must be strings, and must have a name string:

- street
- city
- country
- zipcode
- stateOrProvince
- homePhone
- workPhone
- cellPhone
- apartmentOrUnit

For example, the following could be a contact JSON object to send:

```JSON
{
  "name": "Your Friend",
  "street": "55 Your Street",
  "city": "Your City",
  "homePhone": "(555) 555-555"
}
```

I decided to use Express to do this api, as it has been a while since I have done something in Node on the back end. There were a number of challenges I faced, some of which I did not have time to resolve, when doing this. Here are some of them and some other thoughts:

- Using dependency injection as a best practice: While rudimentary, I have used manual dependency injection throughout this project, only importing dependencies in test/test.js and index.js. Yay for figuring out how to do that!
- Without static types, it was a little bit inefficient to do property checking on contacts
- There are no interfaces. This along with the above item makes me regret not doing this in Java, and I didn't use TypeScript as I am not proficient enough in it to get things done quickly (yet) and decided to go with plain ES6/7/8 javascript instead
- I could have added Babel for the cleaner dynamic import / export syntax, but to save a little time did not
- As any sane developer should know, it is easier to introduce errors in plain javascript than in Java or another statically typed language, but I think I have properly handled the expected ones and avoided introducing others.
- Mocha is a beautiful testing suite. It actually clearly lists out all of the tests performed. I've used it before once,but coming back to it can appreciate it more in comparison to some others I have used more recently.
- I tried to get "done" for mocha working in multiple ways, but had too many callbacks to process and could not get it working. If the either or both of the last two tests time out, you can run test again and it will probably pass. Of course, I needed to wait at least a second for elasticsearch to properly index new contacts.
