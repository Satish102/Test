var React   = require('react');
var Alert = require('./alert.jsx');
var History = require('react-router').History

Parse.initialize("MHBvhcmdlxO1KiNNhpJPMSBmDd1fDI8whzNcnUFk", "dQhzekGozWUAJqJHzQg5rvkTeKbbBZwZZ1R8UXVG");
/* This is the top level component of the page which renders the page.*/
var Header = React.createClass({ //Main header component
  mixins: [ History ],
  getInitialState:function(){
    return{
       adminname:'',
       pic:'',
       viewAlert:'',
       alertmessage:''
     }
  },
  componentDidMount:function(){ //executes immediately after the components are mounted 
    var self=this;
    var name=localStorage.getItem('UserName',name);
    self.setState({adminname:name});
    var pic=localStorage.getItem('ProfilePic');
    self.setState({pic:pic});
  },

  logout:function(){ //logout function
    Parse.User.logOut();
    localStorage.removeItem('CurrentURL');
    localStorage.removeItem('agencyid');
    localStorage.removeItem('UserName');
    localStorage.removeItem('UserType');
    localStorage.removeItem('Type');
    this.history.pushState(null, '/login') 
  },
  handleHideAlert:function(){ //for hiding modal window
        this.setState({viewAlert: false})
  },
  handleShowAlertSuccess:function(){ //set states of values wen modal window is shown
        this.setState({viewAlert: true});
  },
  resetpassword:function(){ //reset password function
    var self=this;
    var currentUser = Parse.User.current();
    var mailid=currentUser.get('username');
    Parse.User.requestPasswordReset(mailid, {
      success: function() {
        self.setState({alertmessage:'A link to reset your password has been sent to your e-mail'});
        self.handleShowAlertSuccess();
      },
      error: function(error) {
        alert("Error: " + error.code + " " + error.message);
      }
    });
  },
  render: function() {
    return (
      <header>
        <div className="headsection">
          <div className=" logo_font " id="logo">
            <span id="logo_foster">Foster</span>
            <span id="logo_care">Care</span>
          </div>
          <div className="pull-right">
            <div className="admindetails">
              <div className="prof_img" ><img src={this.state.pic} id="admin_profpic"/></div>
                <div className="prof_name"  >
                  <span>{this.state.adminname}</span>
                </div>
              <div className="dropdown">
                <span id="dLabel" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  <span className="dropdown_img"></span>
                </span>
                <ul className="dropdown-menu" aria-labelledby="dLabel">
                  <div className="dropuparrow"></div>
                  <li className="droplist" onClick={this.resetpassword}><div className="reseticon"></div>Reset Password</li>
                  <li className="droplist" onClick={this.logout}><div className="logouticon" ></div>Logout</li>
                </ul>
              </div>
            </div>
          </div>
          {this.state.viewAlert ? <Alert handleHideAlert={this.handleHideAlert} message={this.state.alertmessage} /> : null} 
        </div>
      </header>
    );
  }
});
module.exports=Header;