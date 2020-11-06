const cassandra = require('cassandra-driver');

// All our cassandra nodes are in the same container at the moment
let contactPoints = process.env.cassandra_instances.split(';');

const localDatacenter = process.env.cassandra_datacenter;
const loadBalancingPolicy = new cassandra.policies.loadBalancing.DCAwareRoundRobinPolicy(localDatacenter);

const clientOptions = {
   policies : {
      loadBalancing : loadBalancingPolicy
   },
   contactPoints: contactPoints,
   queryOptions: { consistency: cassandra.types.consistencies.one },
   authProvider: new cassandra.auth.PlainTextAuthProvider('cassandra', 'cassandra'),
   keyspace:'pipeline'
};

let cassandraClient = new cassandra.Client(clientOptions);

module.exports = class PackageService {

    // Commit sensory data to Cassandra Cluster
    static async insertData(type, data) {

        let query = null;
        data['ts'] = new Date(data['ts']);

        // Query differs per pipeline element type
        switch(type) {
            case 'port':
                query = 'INSERT INTO ports(id, ts, production, desired, delta) VALUES(?, ?, ?, ?, ?)';
                break;
            case 'basin':
                query = 'INSERT INTO basins(id, ts, load) VALUES(?, ?, ?)';
                break;
            default:
                console.log(`Invalid query = ${type}.`);
        }
        console.log(`attempting to insert ${data} using ${query}`);

        // Execute the query
        cassandraClient.execute(query, data, {prepare: true}, (err) => {

            // Log error, if any
            if(err) {
                console.log(err);
            }

        });
    }
}