var React = require('react');
var History = require('react-router').History;

var Alert=React.createClass({
  mixins: [History], 
  
  componentDidMount:function(){
    $(this.getDOMNode()).modal('show');
    $(this.getDOMNode()).on('hidden.bs.modal', this.props.handleHideAlert);
  },
  onClose:function(){
    var url=this.props.currenturl;
    if(url!=undefined && url!=''){
      localStorage.setItem('CurrentURL',url);
      this.history.pushState(null, url);
    }
  },
  render:function(){
    return (
      <div id="fcModal" className="modal fade" role="dialog">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal">&times;</button>
              <h4 className="modal-title">Confirmation</h4>
            </div>
            <div className="modal-body">
              <p>{this.props.message}</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn submitButton" onClick={this.onClose} data-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
    )
  },
});

module.exports=Alert;
