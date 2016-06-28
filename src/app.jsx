var React     = require('react');
var ReactDOM  = require('react-dom');
var Router    = require('react-router').Router
var Route     = require('react-router').Route
var Link      = require('react-router').Link
var History   = require('react-router').History
var Login     = require('./components/Login.jsx');
var AgencyListing     = require('./components/AgencyListing.jsx');
var CounsellorListing = require('./components/CounsellorListing.jsx');
var AttorneyListing   = require('./components/AttorneyListing.jsx');
var AgencyDetails     = require('./components/AgencyDetails.jsx');
var CounsellorDetails = require('./components/CounsellorDetails.jsx');
var AttorneyDetails   = require('./components/AttorneyDetails.jsx');
var ChildDetails      = require('./components/childlisting.jsx');
var AddChild          = require('./components/addchild.jsx');
var EditChild         = require('./components/childedit.jsx');

const App = React.createClass({
  getInitialState() {
    return {
      loggedIn: false
    }
  },

  mixins: [ History ],

componentDidMount: function() {
  this.setState({
      loggedIn:localStorage.getItem('User')
  })
 
 console.log('URL:',localStorage.getItem('CurrentURL'));
  if (localStorage.getItem('CurrentURL'))
  {
    this.history.pushState(null, localStorage.getItem('CurrentURL'))
  }
  else
  {
    this.history.pushState(null, '/login') 
  }
},

render: function(){ 
  return (
    <div>
      {this.props.children}
    </div>
  )
}
});

var Routei=React.createClass({  
  render:function(){
    return( 
      <Router>
        <Route path="/" component={App}>
            <Route path = "/login" component={Login}/> 
            <Route path = "/header/:login" component={Login}/>  
            <Route path = "/agency" component={AgencyListing}/>
            <Route path = "*" component={NoMatch}/>    
        </Route>         
      </Router>    
    )
  }
});

const NoMatch = React.createClass({
  render: function(){
    return <h1>404 Page Not found</h1>
  }
});

ReactDOM.render(<Routei/>, document.getElementById('contentsection'))