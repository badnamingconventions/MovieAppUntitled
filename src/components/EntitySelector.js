import React, { useState } from "react";
import SearchAutoFiller from "./SearchAutoFiller";
import Entity from "./Entity";
import { Button } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { SET_ENTITIES } from "../reducers";

function EntitySelector({ index = 0 }) {
  const dispatch = useDispatch();
  const entity = useSelector(({ entities }) => entities[index]);

  function clearEntity() {
    dispatch({ type: SET_ENTITIES, data: null, index });
  }

  return (
    <div className="EntitySelector">
      {entity ? (
        <Button size={"large"} onClick={clearEntity}>
          <Entity entity={entity} />
        </Button>
      ) : (
        <SearchAutoFiller index={index} />
      )}
    </div>
  );
}

export default EntitySelector;
