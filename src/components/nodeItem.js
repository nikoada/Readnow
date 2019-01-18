import React from "react";
import Styles from "../styles/nodeItemStyles";

const Item = props => {
  let { name, value, ext } = props.nodeParam;
  return (
    <div style={Styles.main}>
      <div style={Styles.nodeParam}>{name}</div>
      <div style={Styles.nodeValue}>
        {value || 0} <div style={Styles.nodeExt}>{ext}</div>
      </div>
    </div>
  );
};

export default Item;
