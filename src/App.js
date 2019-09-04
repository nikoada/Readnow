  import React, { Component } from "react";
import "./App.css";
import Navigation from "./components/navbar";
import CreateNode from "./components/createNode";
import NodeElement from "./components/node";

class App extends Component {
  state = {
    parameters: null,
    requestDone: true
  };

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
