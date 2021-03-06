import React, {Component} from 'react';
import { TextField } from '@material-ui/core';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoadingScreen from 'react-loading-screen';
import {loadReCaptcha, ReCaptcha} from 'react-recaptcha-google'

import './App.css';

import {requestForm, formResponse} from './utils';

let recaptchaInstance;
let Token;

const executeCaptcha = function () {
  recaptchaInstance.execute();
};

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      _fields: null,
      _isLoading: true,
      _noForm: false,
      _token: null,
    }
    this.notRender = ['_fields', '_isLoading', '_noForm', '_token', '_recaptcha'];
    this.fid = window.location.pathname.replace('/', '');
    this.description = '';
    this.formName = '';
  }

  async componentDidMount() {
    try {
      loadReCaptcha();
      const resp = await requestForm(this.fid);
      this.description = resp.description;
      this.formName = resp.formName;
      const _fields = resp.form
      this.setState({
        _fields,
      })
      var newState = {};
      _fields.forEach((element) => {
        newState[element.name] = ''
      })
      this.setState(newState);
      this.stopLoading();
      setTimeout(() => {
        executeCaptcha()
      }, 3000);
    } catch (err) {
      this.setState({
        _isLoading: false,
        _noForm: true,
      });
    }
  }

  stopLoading = () => {
    this.setState({
      _isLoading: false,
    });
  };

  startLoading = () => {
    this.setState({
      _isLoading: true,
    });
  };

  resetFields = () => {
    const inputs = Object.keys(this.state);
    var tmp = {}
    inputs.forEach((field) => {
      if (this.notRender.includes(field)) {
        return null;
      }
      tmp[field] = ""
      return null;
    });
    this.setState(tmp);
  };

  onLoadRecaptcha() {
    console.log("Here reached: Recaptcha loaded ");
  }

  that = this;
  verifyCallback(token) {
    Token = token;
  }

  onPress = async () => {
    this.startLoading();
    const inputs = Object.keys(this.state);
    
    var responseFields = {}
    inputs.forEach((element) => {

      if (this.notRender.includes(element)) {
        return null;
      };
      responseFields[element] = this.state[element];
    });
    formResponse(this.fid, responseFields, Token)
      .then((resp) => {
        console.log(resp);
        switch (resp.statusCode) {
          case 1: 
            this.resetFields();
            toast.success("Your Response Has Been Added Successfully!");
            this.stopLoading();
            break;
          case 2:
            resp.error.map((e) => toast.error(e));
            break;
          case 8:
            toast.error("Form not found");
            break;
          default:
            toast.error("It looks like we are having trouble processing your request. Come back later!");
        }
        recaptchaInstance.reset();
        executeCaptcha();
        this.stopLoading();
      })
      .catch((err) => {
        console.log(err);
        toast.error("It looks like we are having trouble processing your request. Come back later!");
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

            if (this.notRender.includes(field)) {
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
    const {_isLoading, _noForm} = this.state;

    if (_isLoading) {
      return (
        <LoadingScreen
          loading={true}
          bgColor='#000000'
          spinnerColor='#ffffff'
          logoSrc={require('./loadingLogo.png')}
        />
      );
    }

    if (_noForm) {
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
       `<ReCaptcha
            ref={e => {
              recaptchaInstance = e;
            }}
            size="invisible"
            render="explicit"
            sitekey={process.env.REACT_APP_siteKey}
            onloadCallback={this.onLoadRecaptcha}
            verifyCallback={this.verifyCallback}
        />
       <ToastContainer
          draggable
          position="bottom-right"
        />
        <div className="subContainer">
          <div className="formHeader">{this.formName}</div>
          <div className="formDescription">{this.description}</div>
          <div className="inputContainer">
              { this.state._fields ? this.renderFields() : null }
              <div className="button loginBtn" onClick={() => this.onPress( )}>Submit Form</div>
          </div>  
        </div>
     </div>
    );
  }
};

export default App;
