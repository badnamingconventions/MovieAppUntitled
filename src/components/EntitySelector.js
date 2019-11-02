import React, { useState } from "react";
import SearchAutoFiller from "../SearchAutoFiller";
import Entity from "./Entity";
import { Button, Layout } from "antd";

const willSmith = {
  _id: "nm0000226",
  primary_name: "Will Smith",
  birthYear: "1968",
  deathYear: "\\N",
  primaryProfession: ["music_department", "actor", "producer"],
  knownForTitles: ["tt0120891", "tt0119654", "tt0098800", "tt0480249"],
  wikidata: [
    {
      _id: "5dbd02f699cacd339ff80447",
      imdb_id: "nm0000226",
      image: "Will%20Smith%20%2832335923807%29.jpg",
      wikidata_id: "Q40096"
    }
  ]
};

function EntitySelector() {
  const [entity, setEntity] = useState(willSmith);

  return (
    <div className="EntitySelector">
      {entity ? (
        <Button size={"large"} onClick={() => setEntity(null)}>
          <Entity entity={entity} />
        </Button>
      ) : (
        <SearchAutoFiller setEntity={setEntity} />
      )}
    </div>
  );
}

export default EntitySelector;
