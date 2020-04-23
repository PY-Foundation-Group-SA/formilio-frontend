import React, {Component} from 'react';
import { TextField } from '@material-ui/core';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './App.css';

import {requestForm, formResponse} from './utils';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fields: null,
    }

    this.formName = 'hostel';
  }

  async componentDidMount() {
    const fields = await requestForm(this.formName);
    this.setState({
      fields,
    })
    var newState = {};
    fields.forEach((element, index) => {
      newState[element.name] = ''
    })
    this.setState(newState);
  }

  resetFields = () => {
    const inputs = Object.keys(this.state);
    
    inputs.map((field, index) => {

      if (index === 0) {
        return null;
      }
      var tmp = {}
      tmp[field] = ""
      this.setState(tmp);
    });
  };

  onPress = async () => {
    const inputs = Object.keys(this.state);
    
    var responseFields = {}
    inputs.forEach((element) => {

      if (element === 'fields') {
        return null;
      };
      responseFields[element] = this.state[element];
    });
    console.log(responseFields);
    formResponse(this.formName, responseFields)
      .then((resp) => {
        if (resp.isResponseAdded) {
          toast.success("Your Response Has Been Added Successfully!");
          this.resetFields();
          return;
        }else {
          toast.error(resp.error);
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error("Something wrong>");
        return;
      });
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
              />
            );
          })
        }
      </div>
    );
  }
  
  render() {
    return (
     <div className="mainContainer">
       <ToastContainer
          draggable
          position="bottom-right"
        />
        <div className="loginTextColor">
          <span className="textMedium">Sign Up</span>
          <div className="inputContainer">
              { this.state.fields ? this.renderFields() : null }
              <div className="button loginBtn" onClick={() => this.onPress( )}>Submit Form</div>
          </div>  
        </div>
     </div>
    );
  }
};

export default App;
