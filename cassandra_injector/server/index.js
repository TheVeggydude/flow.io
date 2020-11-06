const PackageService = require("../services/PackageService");
const {Kafka} = require('kafkajs')

setTimeout(() => {

    let brokers = process.env.kafka_brokers;
    console.log(`Brokers selected: ${brokers.split(",")}`);

    const kafka = new Kafka({
        clientId: 'flow_io',
        brokers: brokers.split(',')
    });

    const consumer = kafka.consumer({
        groupId: 'cassandra-interface'
    });

    const run = async() => {
        await consumer.connect();
        await consumer.subscribe({
            topic: process.env.kafka_topic,
            fromBeginning: true
        });

        await consumer.run({
            eachMessage: async ({_, partition, message}) => {
                const msg = message.value.toString().replace(/'/g,"\"");

                console.log({
                    partition,
                    offset: message.offset,
                    value: msg,
                });

                // Extract data from messages
                const data = JSON.parse(msg);
                const type = data["type"];

                // Send queries
                console.log(`Message from ${data["id"]} to be inserted = ${data}`);
                await PackageService.insertData(type, data);  // Insert into historical
            }
        });
    }

    run();

}, 30000);
