let mongoose = require('mongoose');

let problemSchema = mongoose.Schema( {
    id: {
        type: Number
    },
    title: {
        type: String
    },
    difficulty: {
        type: String
    },
    author: {
        type: String
    },
    description: {
        type: String
    },
    input: {
        type: String
    },
    output: {
        type: String
    },
    input_example: {
        type: String
    },
    output_example: {
        type: String
    },
    inputs: {
        type: [String]
    },
    outputs: {
        type: [String]
    }
}, {
    versionKey: false
});

let Problem = module.exports = mongoose.model('Problem', problemSchema);