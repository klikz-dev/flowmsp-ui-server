import React from 'react';
import ErrorMessage from '../common/FlashMessageComponent';
require('./login.scss');

class LoginComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      credentials: {
        email: '',
        password: ''
      },
      isLoggingIn: false
    };
    this.onChange = this.onChange.bind(this);
    this.onSave = this.onSave.bind(this);
  }

  onChange(event) {
    const field = event.target.name;
    const credentials = this.state.credentials;
    credentials[field] = event.target.value;
    return this.setState({credentials: credentials});
  }

  onSave(event) {
    event.preventDefault();
    this.setIsLoggingIn(true);
    this.props.loginUser(this.state.credentials);
  }

  setIsLoggingIn = isLoggingIn => {
    this.setState({ isLoggingIn: isLoggingIn });
  };

  render() {
    return (
       <div className="container login-container">
        <div className="col-md-12 login-wrapper">
         <div className="row">
            <div className="col-md-4 col-md-offset-4">
               <div className="panel panel-login">
                  <div className={this.state.isLoggingIn ? 'loader' : 'visibility-hidden'} />
                  <div className="panel-heading">
                     <div className="col-lg-12">
                        <h3>FlowMSP Sign in</h3>
                        <p>Enter your FlowMSP login information below</p>
                     </div>
                     <hr/ >
                  </div>
                  <div className="panel-body">
                     <div className="row">
                        <div className="col-lg-12">
	                       <ErrorMessage
	                         message={this.props.errorMessage}
	                       />
                           <form id="login-form" action="#" method="post" onSubmit={this.onSave}>
                              <div className="form-group">
                                 <input type="email" name="email" value={this.state.credentials.email}  className="form-control" placeholder="Username" onChange={this.onChange} required/>
                              </div>
                              <div className="form-group">
                                 <input type="password" name="password" className="form-control" value={this.state.credentials.password} placeholder="Password" onChange={this.onChange} required/>
                              </div>
                              <div className="form-group">
                                 <input type="submit" className="btn btn-lg btn-block btn-login" value="Login" disabled={this.state.isLoggingIn} />
                              </div>
                              <div className="form-group">
                                 <div className="row">
                                    <div className="col-lg-12">
                                       <div className="text-center">
                                          <a href="#"  className="forgot-password" onClick={this.props.handleForgotPassword}>Forgot Password?</a>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           </form>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         </div>

         <div>
            <div className="row">
               <div className="col-md-6 col-md-offset-3">
                  <div className="panel-account">
                      <div className="col-lg-12">
                         <h3>Not currently a FlowMSP customer?</h3>
                         <button type="button" className="btn btn-login" onClick={this.props.handleCreateAccountClick}>
                           Create your FlowMSP account
                         </button>
                      </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
    );
  }
}
export default LoginComponent;
