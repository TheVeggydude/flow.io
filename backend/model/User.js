const mongoose = require('mongoose');
const joi = require('joi');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    password: {
        type: String,
        required: true,
        min: 6,
        max: 1024
    },
    admin: {
        type: Boolean,
        required: true,
        default: false
    }
});

const userValidationSchema = joi.object({
    name: joi.string()
        .alphanum()
        .min(6)
        .max(255)
        .required(),
    password: joi.string()
        .min(6)
        .max(1024)
        .required(),
    admin: joi.boolean().required()
})

module.exports = {
    User: mongoose.model('User', userSchema),
    userValidation: userValidationSchema
};