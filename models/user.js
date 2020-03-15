let mongoose = require('mongoose');
let beautifyUnique = require('mongoose-beautiful-unique-validation');

let UserSchema = mongoose.Schema( {
    email: {
        type: String,
        unique: 'Email already taken.'
    },
    username: {
        type: String,
        unique: 'Username already taken.'
    },
    fullName: {
        type: String
    },
    password: {
        type: String
    },
    rank: {
        type: String
    },
    country: {
        type: String
    }
}, {
    versionKey: false
});

UserSchema.plugin(beautifyUnique);

let User = module.exports = mongoose.model('User', UserSchema);