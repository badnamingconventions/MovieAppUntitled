const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const NameBasic = new Schema({
    _id: {
        type: String
    },
    primaryName: {
        type: String
    },
    birthYear: {
        type: Number
    },
    deathYear: {
        type: String
    },
    primaryProfession: {
        type: [String]
    },
    knownForTitles: {
        type: [String]
    }
});
module.exports = mongoose.model('NameBasics', NameBasic);