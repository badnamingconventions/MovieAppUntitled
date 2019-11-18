//WIP

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
    .match({ "moviedata.title_type": "movie" })
    .replaceRoot({ $mergeObjects: ["$moviedata"] })
    .limit(5)
    .then(result => {
      res.json(result);
    })
    .catch(errors => {
      console.log(errors);
      res.status(422).json({ errors });
    });
});

relationRoutes.get("/names/:id", function(req, res) {
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
    .match({ "moviedata.title_type": "movie" })
    .project({ _id: 0, moviedata: 1 })
    .replaceRoot({ $mergeObjects: ["$moviedata"] })
    .lookup({
      from: "titleprincipals",
      localField: "_id",
      foreignField: "tconst",
      as: "namedata"
    })
    .unwind("namedata")
    .match({ "namedata.category": { $in: ["self", "actor", "actress"] }})
    .replaceRoot({ $mergeObjects: ["$namedata"] })
    // .match({ "ordering": 9 })
    .limit(5)
    .then(result => {
      res.json(result);
    })
    .catch(errors => {
      console.log(errors);
      res.status(422).json({ errors });
    });
});

module.exports = relationRoutes;
