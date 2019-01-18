  import React, { Component } from "react";
import "./App.css";
import Navigation from "./components/navbar";
import CreateNode from "./components/createNode";
import NodeElement from "./components/node";
import axios from "axios";

class App extends Component {
  state = {
    parameters: null,
    requestDone: true
  };

  getData = async () => {
    try {
      const result = await axios.get("http://localhost:8000/getNode");
      console.log(result.data);
      // if (result.data) {
      //   this.setState({
      //     parameters: result.data,
      //     requestDone: true
      //   });
      // }
    } catch (err) {
      console.log("Error: " + err);
    }
  };

  componentDidMount() {
    this.getData();
  }

  render() {
    return (
      <div className="App">
        {this.state.requestDone && (
          <Navigation
            appState={this.state}
            passData={param => this.setState({ parameters: param })}
          />
        )}
        {!this.state.parameters && this.state.requestDone && (
          <CreateNode
            passData={param => this.setState({ parameters: param })}
          />
        )}
        {this.state.parameters && (
          <NodeElement parametersFromApp={this.state.parameters} />
        )}
      </div>
    );
  }
}

export default App;
