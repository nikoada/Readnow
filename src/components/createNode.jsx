import React from "react";
import randomstring from "randomstring";
import axios from "axios";
import Styles from "../styles/createNodeStyles"

class CreateNode extends React.Component {
  state = {
    inputs: [<div key={randomstring.generate(3)}>
  <input style={Styles.inputParameter}
    onChange={event =>
      this.setState({ pos1param: {name: event.target.value} })
    }
    placeholder="Parameter 1"
  />
  <input style={Styles.inputExt}
    onChange={event =>
      this.setState({ pos1param: {...this.state.pos1param, ext: event.target.value} })
    }
    placeholder="ext"
  />
</div>]
  };

  createNodeOnServerAndGetIt = async () => {
    let { inputs, ...clone} = this.state
    const result = await axios("http://localhost:8000/postNode", {
      method: "post",
      data: { ...clone },
      withCredentials: true
    });
    console.log(result.data.message);
    this.props.passData({...result.data.message, requestDone: true})
  };

  increaseInput = () => {
    console.log(this.state.inputs.length)
    let inputArr = [...this.state.inputs]
    let element = <div key={randomstring.generate(3)}>
  <input style={Styles.inputParameter}
    onChange={event =>
      this.setState({ ["pos" + inputArr.length + "param"]: {name: event.target.value} })
    }
    placeholder={"Parameter " + (this.state.inputs.length + 1)}
  />
  <input style={Styles.inputExt}
    onChange={event =>
      // pay attantion that there is no dot between ...this.state and ["pos" + ...]
      this.setState({ ["pos" + inputArr.length + "param"]: {...this.state["pos" + inputArr.length + "param"], ext: event.target.value}  })
    }
    placeholder="ext"
  />
</div>;

    inputArr.push(element);

    this.setState({
      inputs: inputArr
    })
  }

  render() {
    console.log(this.state.inputsAmount)
    return (
      <div style={Styles.main}>
        <div style={Styles.titleContainer}>
          <input style={Styles.inputTitle}
            onChange={event => this.setState({ title: event.target.value })}
            placeholder="Title"
          />
        </div>
        {this.state.inputs}
          <button style={Styles.buttonCreate} onClick={this.increaseInput}>+</button>
          <button style={Styles.buttonCreate} onClick={this.state.pos1param && this.createNodeOnServerAndGetIt}>Submit</button>

      </div>
    );
  }
}

export default CreateNode;
