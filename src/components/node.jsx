import React, { Component } from "react";
import axios from "axios";
import Item from "./nodeItem";
import Styles from "../styles/nodeStyles";
import Status from "./status"

export default class NodeElement extends Component {
  // temporary
  state = {
    nodeData: this.props.parametersFromApp,
    serverData: null,
    online: false

  };

  async getDataFromServer() {
    try {
      const response = await axios.get(
        "http://localhost:8000/getNode/" + this.state.nodeData._id,
        {
          crossdomain: true
        }
      );
      this.setState({
        serverData: this.shapeState(response.data),
        online: response.data.online,
      });
      console.log(this.state.serverData)
    } catch (error) {
      console.log(error);
    }
  }

  shapeState(gotDataParam) {
    let positions = [];
    let newObj = gotDataParam;

    for (let key in newObj) {
      if (key.includes("pos")) {
        positions.push(key);
      }
    }

    positions.sort();
    positions.map(
      (item, index) => (newObj[item].value = newObj.data["value" + (index + 1)])
    );

    return newObj;
  }

  componentDidMount() {
    this.getDataFromServer();
    this.interval = setInterval(() => this.getDataFromServer(), 5000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  iterator(objParam) {
    let items = [];

    for (let key in objParam) {
      if (key.includes("pos")) {
        items.push(key);
      }
    }
    items.sort();
    let newItems = items.map(item => <Item nodeParam={objParam[item]} />);
    return newItems;
  }

  render() {
    return (
      <div style={Styles.main}>
        <p style={Styles.nodeParagraph}>{this.state.serverData?this.state.serverData.title:this.state.nodeData.title}</p>
        {this.state.serverData?this.iterator(this.state.serverData):this.iterator(this.state.nodeData)}
        <Status online={this.state.online} />
      </div>
    );
  }
}
