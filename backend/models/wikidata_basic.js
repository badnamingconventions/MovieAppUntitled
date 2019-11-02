const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const NameBasic = new Schema({
    _id: {
        type: String
    },
    imdb_id: {
        type: String
    },
    wikidata_id: {
        type: Number
    },
    image: {
        type: String
    }
});
module.exports = mongoose.model('WikidataBasics', NameBasic);