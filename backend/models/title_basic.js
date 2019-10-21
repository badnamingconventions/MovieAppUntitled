const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const TitleBasic = new Schema({
    _id: {
        type: String
    },
    title_type: {
        type: String
    },
    primary_title: {
        type: String
    },
    original_title: {
        type: String
    },
    start_year: {
        type: Number
    },
    end_year: {
        type: Number
    },
    runtime_minutes: {
        type: Number
    },
    genres: {
        type: [String]
    },
    is_adult: {
        type: Boolean
    }
});
module.exports = mongoose.model('TitleBasics', TitleBasic);