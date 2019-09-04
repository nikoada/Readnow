import React, { Component } from "react";
import axios from "axios";
import Styles from "../styles/navbarStyles";
import logo from "./Logo-readnow.svg"

export default class Navigation extends Component {
  state = {
    id: null
  };

  getDataFromServer = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/getNode/" + this.state.id,
        {
          crossdomain: true
        }
      )
      if (!response.data.err) this.props.passData({...response.data, requestDone: true});
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  logOutFromServer = async () => {
    try {
      await axios("http://readnow.vulkanclub.tech/logout", {
        method: "post",
        withCredentials: true,
        crossdomain: true
      });
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    return (
      <div style={Styles.mainNavbar}>
        <img style={Styles.logo} src={logo} alt="logo"/>
        {this.props.appState.parameters ? (
          <p style={Styles.paragraphNavbar}>
            {this.props.appState.parameters.id}
          </p>
        ) : (
          <input style={Styles.inputNavbar}
            onChange={event => this.setState({ id: event.target.value })}
            placeholder="----------------------------------"
          />
        )}
        {this.props.appState.parameters ? (
          <button style={Styles.buttonNavbar}
            onClick={() => {
              this.setState({ id: null });
              this.props.passData(null);
              this.logOutFromServer();
            }}
          >
            Log out
          </button>
        ) : (
          <button style={Styles.buttonNavbar} onClick={this.getDataFromServer}>Log in</button>
        )}
      </div>
    );
  }
}
