import React, { useState } from "react";
import "./SearchAutoFiller.css";
import { Icon, Button, Input, AutoComplete } from "antd";
import axios from "axios";
import _ from "lodash";

const { Option } = AutoComplete;

function onSelect(value) {
  console.log("onSelect", value);
}
function searchResult(query) {}

function renderOption(item) {
  return (
    <Option key={item.category} text={item.category}>
      <div className="global-search-item">
        <span className="global-search-item-desc">
          Found {item.query} on
          <a
            href={`https://s.taobao.com/search?q=${item.query}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {item.category}
          </a>
        </span>
        <span className="global-search-item-count">{item.count} results</span>
      </div>
    </Option>
  );
}

function NameAutoFiller() {
  const [nameBasics, setNameBasics] = useState([]);

  const search = name => {
    axios
      .get(`http://localhost:4000/search/name/${name}`)
      .then(({ data }) => {
        setNameBasics(data);
      })
      .catch(function(error) {
        console.log(error);
        setNameBasics([]);
      });
  };

  function renderOption(nameBasic) {
    return <Option key={nameBasic._id}>{nameBasic.primary_name}</Option>;
  }

  return (
    <div className="NameAutoFiller">
      <div className="global-search-wrapper" style={{ width: 300 }}>
        <AutoComplete
          className="global-search"
          size="large"
          style={{ width: "100%" }}
          onSelect={onSelect}
          onSearch={search}
          dataSource={nameBasics.map(renderOption)}
          placeholder="input here"
          optionLabelProp="text"
        >
          <Input
            suffix={<Icon type="search" className="certain-category-icon" />}
          />
        </AutoComplete>
      </div>
    </div>
  );
}

export default NameAutoFiller;
