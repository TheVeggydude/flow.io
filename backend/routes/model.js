const express = require('express');
const router = express.Router();
const element = require('../model/Element');

// Registers a new pipeline element
router.post('/create', async (req, res) => {

    // Check if element with same name already exists.
    if (await element.Model.exists({name: req.body.name})) {
        console.log("Element name already exists, not creating new element");
        res.status(400).send('Invalid element.');
        return;
    }

    // Create element object.
    const elementObj = new element.Model({
        name : req.body.name,
        model : req.body.model,
        location: req.body.location,
    });

    // Validate
    const {error} = element.Validator.validate(elementObj.toObject());
    if (error) {
        console.log(error);
        res.status(400).send('Invalid element.');
        return;
    }

    // Try to save object and handle error.
    try {
        await elementObj.save();
        res.status(200).send(`Element created!`)
    } catch (err) {
        res.status(500).send('Unable to create element.');
    }
});


// Router that fetches meta-data. How many elements are returned is dependent on the provided parameters. In case
// no list of names is given all meta data will be provided. Otherwise only a subset of the data is given.
router.get('/element', async (req, res) => {

    // Get desired names.
    const selectedNames = req.query.name;

    // Set the query filter, dependent on the params given.
    let filter = {};
    if (selectedNames && selectedNames.length > 0) {
        filter.name = selectedNames;  // multiple entries handled by implicit `IN` provided by mongoose.
    }

    // Execute query and store result in `elementList`.
    let elementList = [];
    await element.Model.find(filter, (err, elements) => {
        if (err) {
            res.status(500).send('Error while retrieving data.');
        }

        // Add each element found to the reply list.
        elements.forEach( x => {
                elementList.push(x);
            }
        );
    }).exec();

    // Send reply.
    res.status(200).send(elementList);

});

// Router that updates a specific element.
router.post('/update', async (req, res) => {

    // Verify by trying to find the element in the db.
    const elementObj = await element.Model.findOne({name: req.body.name});

    // Check for existence of object.
    if (!elementObj) {
        res.status(400).send("Element matching name not found.");
        return;
    }

    // Update element
    for (const [key, value] of Object.entries(req.body.update)) {
        elementObj[key] = value;
    }
    elementObj.save();

    // Send successful reply.
    res.status(200).send();

});

// This router is kind of a mini-app that can be attached to other, existing, apps simply by importing it and
// calling app.use(imported_router_variable)
module.exports = router;