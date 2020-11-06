const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Route importing
const apiHistorical = require('../routes/historical');
const apiMeta = require('../routes/model');

// Setup server
const app = express();  // Easy-to-use web-app starting point
app.use(express.json());  // automagically parse all request json into req.body.VAR_NAME
app.use(cors());  // Allow requests from other hosts - required for containerization

// Attach routers
app.use('/historical', apiHistorical);
app.use('/model', apiMeta);

const mongoUrl = process.env.mongoose_uri;

// Start server on specified port after a delay
setTimeout(() => {

    // Create connection to MongoDB cluster
    mongoose.connect(mongoUrl, {useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
        console.log('Connected to MongoDB!');
    }).catch(() => {
        // already handled by error event catcher.
    });

    mongoose.connection.on('error', err => {
        console.log(err);
    });

    const port = process.env.port || 4003;
    app.listen(port, () => console.log(`Backend instance started on port ${port}`));
}, parseInt(process.env.startupTimeout));
