import React from "react";
import { Avatar } from "antd";
import _ from "lodash";

const WIKIDATA_IMAGE_BASE_URL =
  "http://commons.wikimedia.org/wiki/Special:FilePath/";

export default function EntityAvatar({ entity, icon = "user" }) {
  const imageName = _.get(entity, "wikidata[0].image", null);

  return (
    <>
      <Avatar
        shape="square"
        src={imageName && WIKIDATA_IMAGE_BASE_URL + imageName}
        icon={icon}
        className="search-item-avatar"
      />
      {entity.primary_name || entity.primary_title}
    </>
  );
}
