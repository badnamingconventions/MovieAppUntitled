const express = require("express");

const nameRoutes = express.Router();
const NameBasic = require("../models/name_basic");

nameRoutes.route("/").get(function(req, res) {
  NameBasic.estimatedDocumentCount().then(count => {
    res.json(count);
  });
});

nameRoutes.route("/:id").get(function(req, res) {
  const id = req.params.id;
  console.log("id: " + id);
  NameBasic.findById(id, function(err, nameBasic) {
    if (err) {
      console.log(err);
    } else {
      res.json(nameBasic);
    }
  });
});

module.exports = nameRoutes;
