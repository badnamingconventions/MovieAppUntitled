const express = require("express");

const titleRoutes = express.Router();
const TitleBasic = require("../models/title_basic");

titleRoutes.route("/").get(function(req, res) {
  TitleBasic.estimatedDocumentCount().then(count => {
    res.json(count);
  });
});

titleRoutes.route("/:id").get(function(req, res) {
  const id = req.params.id;
  console.log("id: " + id);
  TitleBasic.findById(id, function(err, titleBasic) {
    if (err) {
      console.log(err);
    } else {
      res.json(titleBasic);
    }
  });
});

module.exports = titleRoutes;
