import React, {Component} from 'react';
import { TextField } from '@material-ui/core';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './App.css';

import {requestForm} from './utils';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fields: null,
    }
  }

  async componentDidMount() {
    const fields = await requestForm('real');
    this.setState({
      fields,
    })
    var newState = {};
    fields.forEach((element, index) => {
      newState[element.name] = ''
    })
    this.setState(newState);
  }

  renderFields = () => {
    const inputs = Object.keys(this.state);

    return (
      <div>
        {
          inputs.map((field, index) => {

            if (index === 0) {
              return null;
            }
            var tmp = {}
            var setter = (text) => {
              tmp[field] = text;
              this.setState(tmp);
            }

            return (
              <TextField
                  id='outlined-basic'
                  fullWidth={true}
                  label={field}
                  variant="outlined"
                  margin='normal'
                  color="primary"
                  InputLabelProps="textLight"
                  value={this.state[field]}
                  onChange={(text) => setter(text.target.value)}
                  required
                  type='text'
                  autoFocus
              />
            );
          })
        }
      </div>
    );
  }
  
  render() {
    const {name} = this.state;
    return (
     <div className="mainContainer">
        <div className="loginTextColor">
          <ToastContainer
              draggable
              position="bottom-right"
          />
          <span className="textMedium">Sign Up</span>
          <div className="inputContainer">
              { this.state.fields ? this.renderFields() : null }
              <div className="button loginBtn" onClick={() => this.onSignUpSubmit()}>Submit Form</div>
          </div>  
      </div>
     </div>
    );
  }
};

export default App;
