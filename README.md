[![Build Status](https://secure.travis-ci.org/carvilsi/weaver-noGraphDB-poc.png?branch=master)](http://travis-ci.org/carvilsi/weaver-noGraphDB-poc)[![codecov](https://codecov.io/gh/carvilsi/weaver-noGraphDB-poc/branch/master/graph/badge.svg)](https://codecov.io/gh/carvilsi/weaver-noGraphDB-poc)

# weaver-noGraphDB-poc
A POC of a weaver concept based on non graphDB and powered by sails js

## Install and run
Clone or download this repository, execute:

`$ cd weaver-noGraphDB-poc`

`$ npm install`

`$ sails lift`

If everything go well the server will be ready at: [http://localhost:1337](http://localhost:1337)


## Tests
To run test execute:

`$ npm test`

The default test is against mongodb, so you'll need a running instance of this db.

## DB
To change the db modify the 'connection' parameter at 'config/models.js'

Tested with:
* [MongoDB](https://www.mongodb.com/)
* [mySQL](http://www.mysql.com/)

## API
The main endpoint is:

**/entity**

### Create

The id parameter, treat at internal as idw must be unique.

Just an entity:

**POST** create?id=Neo

```
{
  "idw": "Neo",
  "createdAt": "2016-10-23T21:43:38.091Z",
  "updatedAt": "2016-10-23T21:43:38.091Z",
  "id": "580d2f0a62a672f3088bfe7d"
}
```

With values:

**POST** create?id=Smith&key=name&value=Mr Smith


Response

```
{
  "attributes": [
    {
      "key": "name",
      "value": "Mr Smith",
      "createdAt": "2016-10-23T21:42:26.654Z",
      "updatedAt": "2016-10-23T21:42:26.654Z",
      "id": "580d2ec262a672f3088bfe7a"
    }
  ],
  "relations": [],
  "idw": "Smith",
  "createdAt": "2016-10-23T21:42:26.674Z",
  "updatedAt": "2016-10-23T21:42:26.726Z",
  "id": "580d2ec262a672f3088bfe7b"
}
```

### Update

Add values to an entity.

**POST** update?id=Neo&key=high&value=222

Response:

```
{
  "attributes": [
    {
      "key": "high",
      "value": "222",
      "createdAt": "2016-10-23T21:49:47.627Z",
      "updatedAt": "2016-10-23T21:49:47.627Z",
      "id": "580d307b62a672f3088bfe7f"
    }
  ],
  "relations": [],
  "idw": "Neo",
  "createdAt": "2016-10-23T21:43:38.091Z",
  "updatedAt": "2016-10-23T21:49:47.689Z",
  "id": "580d2f0a62a672f3088bfe7d"
}
```

### Delete

Deletes an entity and the values of it.

**POST** delete?id=Entity_idw

Response: 200

```
{
  "msg": "Ok"
}
```

### Relate

Relates two entities

**POST** relate?source=Neo&target=Smith&relation=fights

Response:

```
{
  "attributes": [
    {
      "key": "name",
      "value": "No se",
      "createdAt": "2016-10-23T10:27:15.141Z",
      "updatedAt": "2016-10-23T10:27:15.141Z",
      "id": "580c908319dead1c039bfb7b"
    }
  ],
  "relations": [
    {
      "relation": "fights",
      "source": "580c908319dead1c039bfb7c",
      "target": "580c909e19dead1c039bfb82",
      "createdAt": "2016-10-23T10:31:01.130Z",
      "updatedAt": "2016-10-23T10:31:01.130Z",
      "id": "580c916519dead1c039bfb86"
    }
  ],
  "idw": "Neo",
  "createdAt": "2016-10-23T10:27:15.156Z",
  "updatedAt": "2016-10-23T10:31:01.136Z",
  "id": "580c908319dead1c039bfb7c"
}
```

### Read

#### Eagerness 0
Is the default values for reading, returns just the values of the entity

**GET** read?id=Neo

Response:

```
{
  "attributes": [
    {
      "key": "high",
      "value": "222",
      "createdAt": "2016-10-23T21:49:47.627Z",
      "updatedAt": "2016-10-23T21:49:47.627Z",
      "id": "580d307b62a672f3088bfe7f"
    }
  ],
  "idw": "Neo",
  "createdAt": "2016-10-23T21:43:38.091Z",
  "updatedAt": "2016-10-23T21:49:47.689Z",
  "id": "580d2f0a62a672f3088bfe7d"
}
```

#### Eagerness 1

* Returns the values of the entity and the related entities. The defaul level to reading is not verbose v=0

**GET** read?id=Neo&e=1

Response:

```
{
  "attributes": [
    {
      "key": "high",
      "value": "222",
      "createdAt": "2016-10-23T21:49:47.627Z",
      "updatedAt": "2016-10-23T21:49:47.627Z",
      "id": "580d307b62a672f3088bfe7f"
    }
  ],
  "relations": [
    {
      "relation": "fights",
      "source": "580d2f0a62a672f3088bfe7d",
      "target": "580d2ec262a672f3088bfe7b",
      "createdAt": "2016-10-23T21:59:52.555Z",
      "updatedAt": "2016-10-23T21:59:52.555Z",
      "id": "580d32d862a672f3088bfe81"
    }
  ],
  "idw": "Neo",
  "createdAt": "2016-10-23T21:43:38.091Z",
  "updatedAt": "2016-10-23T21:59:52.562Z",
  "id": "580d2f0a62a672f3088bfe7d"
}
```

* With v=1 returns the values populated of the related entities

**GET** read?id=Neo&e=1&v=1

```
{
  "attributes": [
    {
      "key": "high",
      "value": "222",
      "createdAt": "2016-10-23T21:49:47.627Z",
      "updatedAt": "2016-10-23T21:49:47.627Z",
      "id": "580d307b62a672f3088bfe7f"
    }
  ],
  "relations": [
    {
      "attributes": [],
      "source": {
        "idw": "Neo",
        "createdAt": "2016-10-23T21:43:38.091Z",
        "updatedAt": "2016-10-23T21:59:52.562Z",
        "id": "580d2f0a62a672f3088bfe7d"
      },
      "target": {
        "idw": "Smith",
        "createdAt": "2016-10-23T21:42:26.674Z",
        "updatedAt": "2016-10-23T21:42:26.726Z",
        "id": "580d2ec262a672f3088bfe7b"
      },
      "relation": "fights",
      "createdAt": "2016-10-23T21:59:52.555Z",
      "updatedAt": "2016-10-23T21:59:52.555Z",
      "id": "580d32d862a672f3088bfe81"
    }
  ],
  "idw": "Neo",
  "createdAt": "2016-10-23T21:43:38.091Z",
  "updatedAt": "2016-10-23T21:59:52.562Z",
  "id": "580d2f0a62a672f3088bfe7d"
}
```
