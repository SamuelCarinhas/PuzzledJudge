let mongoose = require('mongoose');
let beautifyUnique = require('mongoose-beautiful-unique-validation');

let SubmissionSchema = mongoose.Schema( {
    id: {
        type: Number,
    },
    username: {
        type: String,
    },
    problem: {
        type: Number
    },
    status: {
        type: String
    },
    fileName: {
        type: String
    },
}, {
    versionKey: false
});

SubmissionSchema.plugin(beautifyUnique);

let Submission = module.exports = mongoose.model('Submission', SubmissionSchema);