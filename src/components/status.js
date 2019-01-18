import React, { Component } from "react";
import Styles from "../styles/statusStyles";

export default class Status extends Component {
  render() {
    return (
      <div style={Styles.main}>
        <div style={Styles.nodeParam}>Status</div>
        <div style={Styles.nodeValue}>
          {this.props.online ? "•" : "◦"}
          {this.props.online ? (
            <div style={Styles.nodeExt}>on</div>
          ) : (
            <div style={Styles.nodeExt}>off</div>
          )}
        </div>
      </div>
    );
  }
}
