const express = require('express');
const router = express.Router();


// Cassandra driver parameters
const cassandra = require('cassandra-driver');
const localDatacenter = 'datacenter1';
const contactPoints = ['cassandra-cluster', 'cassandra-cluster', 'cassandra-cluster'];
const loadBalancingPolicy = new cassandra.policies.loadBalancing.DCAwareRoundRobinPolicy(localDatacenter);


// Creating the param options for driver
const clientOptions = {
   policies : {
      loadBalancing : loadBalancingPolicy
   },
   contactPoints: contactPoints,
   authProvider: new cassandra.auth.PlainTextAuthProvider('cassandra', 'cassandra'),
   keyspace:'pipeline'
};


// Cassandra connection device used by all requests from this backend instance.
let cassandraClient = new cassandra.Client(clientOptions);


// Route that should fetch the complete historical data for a single pipeline element.
router.get('/all', async (req, res) => {

    // Get required data from the msg body
    const element = req.query.id;
    const type = req.query.type;

    // If requested data not specified
    if (!element || !type) {
        res.status(400).send({message: 'Missing/invalid parameter(s)'});
        return;
    }

    // Perform the query asynchronously and handle the result
    let queryPromise = queryElementHistory(element, type);
    queryPromise.then((history) => {

        res.status(200).json(history);

    }).catch((err) => {  // catch error, if any

        console.log('ERROR: historical data query failed:');
        console.log(err);

        res.status(500).send({message: 'Query unsuccessful.'});

    });

});


// Route that fetches the latest updates for each element in the pipeline
router.get('/latest', async (req, res) => {
    const elementType = req.query.type;

    // Check for no results
    if(elementType === undefined){
        console.log(`Element type undefined`);
        res.status(500).send({message: 'Query unsuccessful.'});
        return;
    }

    let elems = [];

    // Asynchronously run the query and data handling
    let queryPorts = queryLatest(elementType);

    // Fetch latest port data.
    await queryPorts.then((elementList) => {

        elems = elems.concat(elementList);

    }).catch((err) => {  // catch error, if any

        console.log('ERROR: latest port updates query failed:');
        console.log(err);

        res.status(500).send({message: 'Query unsuccessful.'});

    });

    res.status(200).send(elems);

});


function queryLatest(type) {
    return new Promise((resolve, reject) => {

        const query = `select * from ${type+'s'} per partition limit 1`;

        // Execute query
        cassandraClient.execute(query, (err, result) => {

            // Reject if error and backprop the error
            if(err) {
                return reject(err);
            }

            // Check for no results
            if(result === undefined){
                return reject(`No results found.`);
            }

            // For each row in the returned data
            let elementList = [];
            for (let i = 0; i < result.rows.length; i ++) {
                // Push the row onto the element list
                elementList.push(result.rows[i]);

            }

            // Successful, so resolve while returning the list
            resolve(elementList);
        });
    });
}


function queryElementHistory(id, type) {
    return new Promise((resolve, reject) => {

        let queryElementHistory = null;

        // Different query for each type of element - as each type is in its own cassandra table.
        switch (type) {
            case 'port':
                queryElementHistory = 'select * from ports where id = ?';
                break;

            case 'basin':
                queryElementHistory = 'select * from basins where id = ?';
                break;

            default:
                console.log(`Invalid query = ${type}.`);
        }

        const params = [id];

        // Execute query
        cassandraClient.execute(queryElementHistory, params, {prepare: true}, (err, result) => {

            // Reject if error and backprop the error
            if(err) {
                reject(err);
            }

            // Successful, so resolve while returning the list of historical data points
            resolve(result.rows.reverse())
        });
    });
}

// This router is kind of a mini-app that can be attached to other, existing, apps simply by importing it and
// calling app.use(imported_router_variable)
module.exports = router;