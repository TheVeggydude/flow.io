# Flow.io backend
This image contains the RESTful API backend used by the _Flow.io_ app. All (semi-)static data is accessed here via HTTP
requests.

## Design
A node [express](https://www.npmjs.com/package/express) app is created to serve the endpoints. A router is created for 
each of the connected databases, order to keep the code clean. This means that the endpoints exposed by our API can be
divided up into segments for each of these technologies.

The pipeline updates, as specified in `../simulation/README.md`, are stored in a _Cassandra_ database. Connecting to that
database is done via the [cassandra-driver](https://www.npmjs.com/package/cassandra-driver) by DataStax. These updates
are made available via the `./routers/historical.js` router.

### Update endpoints
All endpoints provided by this router are prepended by a `/historical`, e.g. `http://some.domain/historical/all`.

#### GET `/all`
**Required**: 
As query parameters:
- `id`: id of the element (e.g `pump_0` - no quotation marks).
- `type`: element type (either `port` or `basin`).

**Returns**: 
JSON list of updates for a given id and pipeline element type. This list is ordered by timestamp, oldest
update first. 

#### GET `/latest`
**Required**: 
Query param `type`. Either `port` or `basin`.

**Returns**: 
JSON list of updates for all known pipeline elements.

### Model endpoints
All endpoints provided by this router are prepended by a `/model`, e.g. `http://some.domain/model/element`. It provides
an interface with which to interact with semi-static data about the pipeline model.

#### POST `/create`
**Required**: 
JSON formatted data of the pipeline element to be created. A `name`, `model` and `location` need to be specified.

Example:
```json
{
  "name": "some name", 
  "model": "some model",
  "location": "some location"
}
```

**Returns**: 

Any of the following:
- 200 code: creation was successful. 
- 400 code: parameters given are invalid. See `model/Element.js` for the schema.
- 500 code: there was an unspecified server-side error that caused the element to not be created.

#### GET `/element`
**Optional**: 
Parameters:
- `name`: the name/id of the pipeline element to be queried. 

If you want all elements, leave the parameters empty - this will return all static pipeline element data.

**Returns**: 
List of JSOn formatted objects that contain static pipeline element data.

#### POST `/update` 
Will update a single element's static data with the provided values.

**Required**:
JSON formatted update data. A `name` field, containing the name of the element to be updated. Then a `parameter` field
that contains a JSON object with the fields to be updated. These can contain any of the fields as described in `/create`.

Example:
```json
{
    "name": "pump_0",
    "update": {
        "model": "some model",
        "location": "some location"
    }
}
```

**Returns**: 

Any of the following:
- 200 code: update was successful. 
- 400 code: parameters given are invalid. See `model/Element.js` for the schema.
- 500 code: there was an unspecified server-side error that caused the element to not be updated.


## Deployment
This image can be built and run inside of _docker_ using the standard methods for doing so. However, we also already 
include it in our top-level directory's `docker-compose.yml`. All environment variables have been set there.

### Development
In the case you're running this on your local machine, the backend is exposed to `http://localhost:4003`

### Environment variables
There are two environment variables that dictate the behavior of the container. These can be set in the `docker-compose.yml`
file.

- `port`: port address for the server to listen at. Defaults to port 4003.
- `startupTimeout`: timeout, in milliseconds, how long to wait before starting up the server.
- `mongoose_uri`: mongoose database uri. Already set in the `docker-compose.yml`. Should technically be kept secret, but
given the nature of the project it is preferable to just always have it set.
