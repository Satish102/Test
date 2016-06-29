var React = require('react');
var Alert = require('./alert.jsx'); //alert component
var History = require('react-router').History

//Parse.initialize("MHBvhcmdlxO1KiNNhpJPMSBmDd1fDI8whzNcnUFk", "dQhzekGozWUAJqJHzQg5rvkTeKbbBZwZZ1R8UXVG"); 
//var User = Parse.Object.extend("User"); 
//var user = new Parse.User();

var Login = React.createClass({ //Login component
   mixins: [ History ],

  getInitialState: function(){ //setting initial states for username and password
    return { userName: '',password: '',viewAlert:{showAlert: false},
            message:''};
  },
  handleUserName: function(e){ /*on changing username*/               
    this.setState({userName:e.target.value});                  
  },
  handlePassword: function(e){ /*on changing password*/            
    this.setState({password:e.target.value});  
  },
  handleHideAlert:function(){ //for hiding modal window
    this.setState({viewAlert:{showAlert: false}})
  },
  handleShowAlertFail:function(e){ //set states of values wen modal window is shown
    this.setState({viewAlert:{showAlert: true}});
  },
  handleLogin: function(e){ /*on clicking Login button*/
   var self=this;
    $('#nameForm').bootstrapValidator({ //validation
      feedbackIcons: {
        valid: 'has-success',
        invalid: 'has-error',
        validating: 'glyphicon glyphicon-refresh'
      },
      fields: {                       
        name: { //username validation
          validators: {                              
            notEmpty: {
              message: 'Please enter the user name'
            },                              
            regexp: {
              regexp: '^[^@\\s]+@([^@\\s]+\\.)+[^@\\s]+$',
              message: 'Not valid email'
            }
          }
        },
        password: { //password validation
          validators: {                              
            notEmpty: {
              message: 'Please enter the password'
            }
          }
        }
      },

      onSuccess: function(e, data) {            // checks if username and password are valid -calls  on success of validation             
        var uname = self.state.userName;                          
        var pswd  = self.state.password;                
 
        localStorage.setItem('User',true);
        localStorage.setItem('UserType','AA');  //storing usertype
        var name='Satish';
        localStorage.setItem('UserName',name);  //storing username
        var type = 'AA';
        localStorage.setItem('Type',type);
        var id=123;
        var a_id=id.id;                         //stores agency id of the user (needed for child pages)
        localStorage.setItem('agencyId',a_id);
        self.history.pushState(null, '/agency')
      }
    });                 
  },
  
  render: function() {                  
    return (                     
      <div id="logincontent"> 
        <div id="LoginWrapper">
          <p id="fosterCareText">
            <span id="fosterText">Foster</span>
            <span id="careText">Care</span>
          </p>
            <div id="login" >
              <div id="loginBlue">
                Login
              </div>
              <div id="greyDiv"></div>
              <form id="nameForm" role="form" method="post">
                <div id="unamePswdDivOuter">
                  <div id="unamePswdDiv">
                    <div className="form-group">
                      <label className="unamePswdText uname">User Name</label>
                      <input type="text" className="form-control" id="usr" name="name" placeholder="User Name" value={this.state.userName} onChange={this.handleUserName} />
                    </div>
                    <div className="form-group">
                      <label className="unamePswdText">Password</label>
                      <input type="password" className="form-control" id="pwd" name="password" placeholder="Password" onChange={this.handlePassword} />
                    </div>
                    <input type="submit" className="btn" id="loginButton" value="Login" onClick={this.handleLogin} />                                    
                    <span className="checkbox" id="checkboxLogin">
                      <label>
                        <input type="checkbox" id="checkboxSize" />
                        <p id="staySignedText"> Stay signed in </p>
                      </label>
                    </span> 
                    <span id="forgotPswd"  data-toggle="modal" data-target="#myModal" onClick={this.resetpassword}>Forgot Password?</span>    
                  </div>
                </div> 
              </form>
            </div> 
            {this.state.viewAlert.showAlert ? <Alert handleHideAlert={this.handleHideAlert} message={this.state.message} /> : null}                       
        </div>                    
      </div>                            
    )
  }
}); 
module.exports=Login;