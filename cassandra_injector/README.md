# Cassandra injector
This directory contains all the code for the `cassandra_injector` image. This image consumes messages from a specified
topic on specific _Kafka_ brokers. These messages are then inserted into _Cassandra_.

## Design
In its current shape, the injector uses the [kafkajs](https://www.npmjs.com/package/kafkajs) package to consume messages
from selected _Kafka_ brokers. A hardcoded consumer group is used so that multiple instances of this consumer could be
running in parallel without creating duplicates in the database.

For inserting into the _Cassandra_ database we use the package [cassandra-driver](https://www.npmjs.com/package/cassandra-driver).
Each message that comes in is inspected and handled according to its pipeline element type. `Port` object updates are
added to the `pipeline.ports` table, `Basin` objects to `pipeline.basins`. 

Each update is also stored in the `pipeline.latest` table. This only stores one row for each known pipeline element. For
each new element update this row is updated to the latest value (specifically, upserted - update unless the row doesn't 
exist, in that case insert a new row). This data is used to provide info about the last known updates to the user.

## Usage
This image can be built and run inside of _docker_ using the standard methods for doing so. However, we also already 
include it in our top-level directory's `docker-compose.yml`. All environment variables have been set there.

### Environment variables
There are two environment variables that dictate the behavior of the container. These can be set in the `docker-compose.yml`
file.

- `kafka_brokers`: a list of _Kafka_ brokers to listen to. Each broker consists of an either an IP address or container
name, followed by the port listened to. Brokers are separated by a `;`. Example: `kafka_brokers=kafka_0:29091;kafka_1:29092`. 
- `kafka_topic`: a single string with the _Kafka_ topic listened to by the internal consumer used by this image. Example:
`kafka_topic=simulation_updates`. Note, this value must obviously be the same as the topic used by the data source.

### Messages
Each message is built according to the specification found in `../simulation/README.md`. Refer to that documentation to 
see the latest message structure.