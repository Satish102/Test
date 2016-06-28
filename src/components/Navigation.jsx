var React = require('react');
var History = require('react-router').History

var Navigation = React.createClass({ //navigation list component
    mixins: [ History ],
    handleAgency:function(){ //to go to agency pages
        localStorage.setItem('CurrentURL','/agency');
        this.history.pushState(null, '/agency')   
    },
    handleCounsellor:function(){ //to go to counsellor pages
        localStorage.setItem('CurrentURL','/counsellor');
        this.history.pushState(null, '/counsellor')   
    },
    handleAttorney:function(){ //to go to attorney pages
        localStorage.setItem('CurrentURL','/attorney');
        this.history.pushState(null, '/attorney')   
    },
    componentDidMount:function(){
        var aid=localStorage.getItem('Type'); // to prevent url editing to unauthorised pages
        var currentUser = Parse.User.current();
        if (currentUser) {
             if (aid!="SA")
              {
                this.history.pushState(null, '/login')
              }
        }
    },
    render: function() {
        return (
            <nav className="nav_font">
                <ul>
                    <li className="navlist active_icon" id="agency" onClick={this.handleAgency}>  
                        <div className="ag_logo"></div>
                        <div id="imgactive_agency"></div>
                        <span className="side_logo">Agencies</span>
                    </li>
                    <li className="navlist active_icon" id="counsellor" onClick={this.handleCounsellor}>
                        <div className="coun_logo"></div>
                        <div id="imgactive_coun"></div>
                        <span className="side_logo_2">Counsellors</span>
                    </li>
                    <li className="navlist active_icon" id="attorney" onClick={this.handleAttorney}>
                        <div className="atto_logo"></div>
                        <div id="imgactive_attor"></div>
                        <span className="side_logo" >Attorneys</span>
                    </li>
                </ul>
            </nav>    
        );
    }
});

module.exports=Navigation;