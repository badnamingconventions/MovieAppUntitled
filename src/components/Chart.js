import React, { useState } from "react";
import SearchAutoFiller from "./SearchAutoFiller";
import Entity from "./Entity";
import { Button } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { SET_ENTITIES } from "../reducers";
import Tree from "react-d3-tree";
import axios from "axios";

export default function Chart({ index = 0 }) {
  const dispatch = useDispatch();
  const entity = useSelector(({ entities }) => entities[index]);
  const [treeData, setTreeData] = useState(createTreeData(entity));
  const [injectedNodesCount, setInjectedNodesCount] = useState(null);

  function clearEntity() {
    dispatch({ type: SET_ENTITIES, data: null, index });
  }

  function click(info) {
    console.log("clicked-2: ", JSON.stringify(info));
    if (!info.children) {
      info.children = [];
    }
    info.children.push({
      name: `Inserted Node ${injectedNodesCount}`,
      id: `inserted-node-${injectedNodesCount}`
    });
    setInjectedNodesCount(injectedNodesCount + 1);
    setTreeData(treeData);
  }

  /*    the idea here was to edit the child node in place
        so if someone clicked on a node, a server call would go get the connections
        but I was unable to find a clean way mark those connections to the "clicked" node
        most examples only show adding things to the root node.
        if there is a quick way of finding the clicked node, that would make this experiment easier
    */
  //   const addChildNode = () => {
  //     const nextData = clone(this.state.data);
  //     const target = nextData.children;
  //     this.injectedNodesCount++;
  //     target.push({
  //       name: `Inserted Node ${this.injectedNodesCount}`,
  //       id: `inserted-node-${this.injectedNodesCount}`
  //     });
  //     this.setState({
  //       data: nextData
  //     });
  //   };

  return (
    <div className="Chart">
      <Tree data={treeData} onClick={click} />
    </div>
  );
}

function createTreeData({ _id, primary_name, primary_title }) {
  return {
    _id,
    name: primary_name || primary_title,
    children: []
  };
}
