import React, { useState } from "react";
import { Icon, Input, AutoComplete } from "antd";
import axios from "axios";
import _ from "lodash";

const { Option, OptGroup } = AutoComplete;

const find = (id, collection) => _.find(collection, ["_id", id]);

function NameAutoFiller() {
  const [people, setPeople] = useState([]);
  const [movies, setMovies] = useState([]);

  function select(id) {
    const selectedItem = find(id, people) || find(id, movies);
    console.log("selected: " + JSON.stringify(selectedItem));
  }

  function search(name) {
    if (name.length < 3) return;

    axios
      .get(`http://localhost:4000/search/name/${name}`)
      .then(({ data }) => {
        setPeople(data);
      })
      .catch(function(error) {
        console.log(error);
        setPeople([]);
      });

    axios
      .get(`http://localhost:4000/search/title/movie/${name}`)
      .then(({ data }) => {
        setMovies(data);
      })
      .catch(function(error) {
        console.log(error);
        setMovies([]);
      });
  }

  const peopleOptions = (
    <OptGroup key={"people"} label={"People"}>
      {people.map(person => (
        <Option key={person._id}>
          {person.primary_name}
          <span className="search-item-year">{person.birthYear}</span>
        </Option>
      ))}
    </OptGroup>
  );

  const movieOptions = (
    <OptGroup key="movies" label={"Movies"}>
      {movies.map(movie => (
        <Option key={movie._id}>
          {movie.primary_title}
          <span className="search-item-year">{movie.start_year}</span>
        </Option>
      ))}
    </OptGroup>
  );

  return (
    <div className="NameAutoFiller">
      <AutoComplete
        className="global-search"
        size="large"
        style={{ width: "300px" }}
        onSelect={select}
        onSearch={_.debounce(search, 250)}
        dataSource={[peopleOptions, movieOptions]}
        placeholder="Enter Actor Name or Title"
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
