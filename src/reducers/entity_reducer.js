import { SET_ENTITIES } from "./index";

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

const initialState = [willSmith];

export default (state = initialState, { type, data, index }) => {
  switch (type) {
    case SET_ENTITIES:
      state[index] = data;
      return [...state];

    default:
      return state;
  }
};
