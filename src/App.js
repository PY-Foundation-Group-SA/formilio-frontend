import React, {Component} from 'react';
import { TextField } from '@material-ui/core';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoadingScreen from 'react-loading-screen';

import './App.css';

import {requestForm, formResponse} from './utils';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fields: null,
      isLoading: true,
      noForm: false,
    }

    this.formName = window.location.pathname.replace('/', '');
  }

  async componentDidMount() {
    try {
      const fields = await requestForm(this.formName);
      this.setState({
        fields,
      })
      var newState = {};
      fields.forEach((element, index) => {
        newState[element.name] = ''
      })
      this.setState(newState);
      this.stopLoading();
    } catch (err) {
      this.setState({
        isLoading: false,
        noForm: true,
      });
    }
  }

  stopLoading = () => {
    this.setState({
      isLoading: false,
    });
  };

  startLoading = () => {
    this.setState({
      isLoading: true,
    });
  };

  resetFields = () => {
    const inputs = Object.keys(this.state);
    
    inputs.map((field, index) => {
      if (['fields', 'isLoading', 'noForm'].includes(field)) {
        return null;
      }

      var tmp = {}
      tmp[field] = ""
      this.setState(tmp);
    });
  };

  onPress = async () => {
    this.startLoading();
    const inputs = Object.keys(this.state);
    
    var responseFields = {}
    inputs.forEach((element) => {

      if (['fields', 'isLoading', 'noForm'].includes(element)) {
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
          this.stopLoading();
          return;
        }else {
          toast.error(resp.error);
          this.stopLoading();
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error("Something wrong>");
        this.stopLoading();
        return;
      });
  }

  renderFields = () => {
    const inputs = Object.keys(this.state);

    return (
      <div>
        {
          inputs.map((field, index) => {

            if (['fields', 'isLoading', 'noForm'].includes(field)) {
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
    const {isLoading, noForm} = this.state;

    if (isLoading) {
      return (
        <LoadingScreen
          loading={true}
          bgColor='#000000'
          spinnerColor='#ffffff'
          logoSrc={require('./loadingLogo.png')}
        />
      );
    }

    if (noForm) {
      console.log('showing')
      return (
        // Illustration by Marina Fedoseenko
        <LoadingScreen
          loading={true}
          bgColor='#000000'
          spinnerColor='#000000'
          logoSrc={require('./404.png')}
          text="Nothing Found Here :("
        />
      );
    }

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
