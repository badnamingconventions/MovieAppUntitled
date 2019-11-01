import React, { useState } from "react";
import { Icon, Input, AutoComplete } from "antd";
import axios from "axios";
import _ from "lodash";

const { Option } = AutoComplete;

function NameAutoFiller() {
  const [nameBasics, setNameBasics] = useState({});

  function select(id) {
    const nameBasic = nameBasics[id];
    console.log("selected: " + JSON.stringify(nameBasic));
  }

  function search(name) {
    if (name.length < 3) return;
    
    axios
      .get(`http://localhost:4000/search/name/${name}`)
      .then(({ data }) => {
        setNameBasics(_.keyBy(data, "_id"));
      })
      .catch(function(error) {
        console.log(error);
        setNameBasics([]);
      });
  }

  function renderOption(nameBasic) {
    return <Option key={nameBasic._id}>{nameBasic.primary_name}</Option>;
  }

  return (
    <div className="NameAutoFiller">
      <AutoComplete
        className="global-search"
        size="large"
        style={{ width: "100%" }}
        onSelect={select}
        onSearch={_.debounce(search, 250)}
        dataSource={_.values(nameBasics).map(renderOption)}
        placeholder="Enter Actor Name"
        optionLabelProp="text"
      >
        <Input
          suffix={<Icon type="search" className="certain-category-icon" />}
        />
      </AutoComplete>
    </div>
  );
}

export default NameAutoFiller;
