const mongoose = require('mongoose');
const joi = require('joi');


const elementSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 4,
        max: 255,
        unique: true
    },
    model: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    location: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    installed: {
        type: Date,
        required: true,
        default: Date.now()
    },
    lastCheckup: {
        type: Date,
        required: true,
        default: Date.now()
    }
});

const elementValidationSchema = new joi.object({
    name: joi.string()
        .min(6)
        .max(255)
        .required(),
    model: joi.string()
        .min(6)
        .max(255)
        .required(),
    location: joi.string()
        .min(6)
        .max(255)
        .required(),
    installed: joi.date()
        .required(),
    lastCheckup: joi.date()
        .required(),
    _id: joi.object()
        .required()
});

module.exports = {
    Model: mongoose.model('Element', elementSchema),
    Validator: elementValidationSchema
};