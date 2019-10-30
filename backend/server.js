const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const PORT = 4000;
const TitleBasicRouter = require('./routes/title_basic');
const NameBasicRouter = require('./routes/name_basic');
const SearchRouter = require('./routes/search');

app.use(cors());
app.use(bodyParser.json());
mongoose.connect('mongodb://127.0.0.1:27017/movies', { useNewUrlParser: true });
mongoose.set('debug', true);
const connection = mongoose.connection;
connection.once('open', function() {
    console.log("MongoDB database connection established successfully");
})

app.use('/title', TitleBasicRouter);
app.use('/name', NameBasicRouter);
app.use('/search', SearchRouter);
app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
});

/* example of title searches
titlebasics.find( { title_type:"tvEpisode"} )
titlebasics.find( { title_type:"movie", $text: { $search: "\"after earth\"" } } )
titlebasics.find( { title_type:{$exists: true}, $text: { $search: "\"after earth\"" } } )
*/
