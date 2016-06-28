var React = require('react');
var History = require('react-router').History;

var SearchItems=React.createClass({
    passSearchText:function(){
        this.props.textChange(this.refs.searchInput.getDOMNode().value)
    },
    render:function(){
        return(
            <div className="searchbar">
                <div className="searchicon"></div>
                 <input type="text" className="form-control searchfield " name="q" placeholder="Search " ref="searchInput" onChange={this.passSearchText}/>
            </div>
        );
    }
});
module.exports=SearchItems;