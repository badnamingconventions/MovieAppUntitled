const express = require("express");

const relationRoutes = express.Router();
const TitlePrincipal = require("../models/title_principal");

relationRoutes.get("/name/:id", function(req, res) {
  const id = req.params.id;

  console.log("id: " + id);

  TitlePrincipal.aggregate()
    .match({ nconst: id })
    .lookup({
      from: "titlebasics",
      localField: "tconst",
      foreignField: "_id",
      as: "moviedata"
    })
    .project({ _id: 0, moviedata: 1 })
    .match({ "moviedata.title_type": "movie" })
    .unwind("moviedata")
    .replaceRoot({ $mergeObjects: ["$moviedata"] })
    .then(result => {
      res.json(result);
    })
    .catch(errors => {
      console.log(errors);
      res.status(422).json({ errors });
    });
});

module.exports = relationRoutes;
