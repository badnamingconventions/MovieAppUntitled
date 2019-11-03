import { combineReducers } from "redux";
import entities from "./entity_reducer";

export const SET_ENTITIES = "SET_ENTITIES";

export default combineReducers({ entities });
