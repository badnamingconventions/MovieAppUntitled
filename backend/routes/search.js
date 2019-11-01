const express = require("express");
const { check, validationResult } = require("express-validator");

const searchRoutes = express.Router();
const NameBasic = require("../models/name_basic");
const TitleBasic = require("../models/title_basic");
require('dotenv').config()

console.log("search env test: "+ process.env.TMDB_API_KEY);

searchRoutes.route("/title").get(function(req, res) {
  TitleBasic.estimatedDocumentCount().then(count => {
    res.json(count);
  });
});

searchRoutes.get(
  "/title/:title",
  [
    check("title")
      .trim()
      .isLength({ min: 3 })
      .escape()
  ],
  function(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const title = req.params.title;
    const query = textSearch(title, { title_type: { $exists: true } });

    console.log("title: " + title);
    console.log("query: " + JSON.stringify(query));

    TitleBasic.find(query).limit(25).then(titles => {
      res.json(titles);
    });
  }
);

searchRoutes.get(
  "/name/:name",
  [
    check("name")
      .trim()
      .isLength({ min: 3 })
      .escape()
  ],
  function(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const name = req.params.name;
    const query = textSearch(name);

    console.log("name: " + name);
    console.log("query: " + JSON.stringify(query));

    NameBasic.find(query).limit(25).then(names => {
      res.json(names);
    });
  }
);

const textSearch = (string, otherParams) => ({
  ...otherParams,
  $text: {
    $search: `\"${string}\"`
  }
});

module.exports = searchRoutes;
