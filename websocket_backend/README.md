# Flow.io update streaming image
The goal of this image is to provide a WebSocket connection that broadcasts simulation updates. These updates are 
received via a _Kafka_ streaming consumer.

## Design
A node [express](https://www.npmjs.com/package/express) server in combination with [express-ws](https://www.npmjs.com/package/express-ws) 
exposes the websocket to outside connections. 

In order to get the data from Kafka, we use [kafka-node](https://www.npmjs.com/package/kafka-node). This package allows
us to use the JS concept of _Streams_ - instead of handling each _Kafka_ message individually, we provide a pipeline.
This pipeline of actions takes the mesage, transforms it into a format WebSockets can handle, and send it off to said 
WebSocket.

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

### Receiving messages
Listening to this WebSocket is done through standard methods, such as by e.g. using the [ws](https://www.npmjs.com/package/ws)
package. 