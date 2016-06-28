var React = require('react');
var History = require('react-router').History

var Footer = React.createClass({ //footer component
    render: function() {
        return (
            <div className="row">
                <footer>
                    <div className="col-xs-6 col-sm-3 col-xs-offset-5 col-sm-offset-5 footerfont">
                         <span>FosterCare @ 2015</span>
                    </div>
                </footer>
             </div>
        );
    }
});
module.exports=Footer;