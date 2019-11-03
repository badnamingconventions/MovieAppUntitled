const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const TitlePrincipal = new Schema({
    _id: {
        type: ObjectId
    },
    tconst: {
        type: String
    },
    nconst: {
        type: String
    },
    ordering: {
        type: Number
    },
    category: {
        type: String
    },
    job: {
        type: String
    },
    characters: {
        type: String
    }
});

module.exports = mongoose.model('TitlePrincipals', TitlePrincipal);