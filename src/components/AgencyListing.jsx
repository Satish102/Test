var React = require('react');
var Header = require('./header.jsx');
var Footer = require('./footer.jsx');
var Navigation = require('./Navigation.jsx');

var SearchItems = require('./Search.jsx'); //search component
var History = require('react-router').History

Parse.initialize("MHBvhcmdlxO1KiNNhpJPMSBmDd1fDI8whzNcnUFk", "dQhzekGozWUAJqJHzQg5rvkTeKbbBZwZZ1R8UXVG");
var AgencyListing = React.createClass({
    
    mixins: [History,ParseReact.Mixin], 
    observe: function(props,state) {
        var nameListing=new Parse.Query('Agency');
        if (state.SearchText!=""){
            nameListing.contains("agencyName",state.SearchText);
        } 
        var emailListing=new Parse.Query('Agency');
        if (state.SearchText!=""){
            emailListing.contains("emailid",state.SearchText);
        } 
        var phoneListing=new Parse.Query('Agency');
        if (state.SearchText!=""){
            phoneListing.contains("phoneNumber",state.SearchText);
        } 
        var agencyListing = Parse.Query.or(nameListing, emailListing,phoneListing);
        return {
           agencyList:agencyListing.ascending('agencyName')                 
        };
    },
    getInitialState:function(){
        return{
            SearchText:""
        }
    },
    handleUserInput:function(filteredText){
        this.setState({SearchText:filteredText})
    },
    componentDidMount:function(){
        document.getElementById("agency").className='active';
        document.getElementById("imgactive_coun").style.display='none';
        document.getElementById("imgactive_attor").style.display='none';
    },
    render: function() {
        return (
            <div id="maincontent">
                <Header />
                <div id="content">
                    <div className="navsection ">
                        <Navigation />
                    </div> 
                    <div className="col-sm-12 col-xs-12 contentsection"> 
                        <div className="listingcontent">
                            <div className="headings">
                                <div className="row"> 
                                    <div className="col-sm-3 col-xs-5 head">
                                        <span id="content_head"> Agencies</span>
                                    </div>
                                    <div className="col-sm-5 col-xs-7 ">
                                        <SearchItems textChange={this.handleUserInput}/>
                                    </div>
                                    <div className="col-sm-4 col-xs-12 pull-right text-right">
                                        <Addnew />
                                    </div>
                                </div>
                                <p className="border_line"></p>
                            </div>
                            <AgencyTable AgencyListing={this.data.agencyList}/>
                        </div>
                        <Footer />
                    </div> 
                </div>
            </div>

        );
    }
});

var Addnew=React.createClass({
    mixins: [History],
    handleAdd:function(){ 
        var temp="add";
        localStorage.setItem('CurrentURL','/agencydetails/'+temp);
        this.history.pushState(null,'/agencydetails/'+temp) 
    },
    render:function(){
        return(
                 <div id="addnew" onClick={this.handleAdd}> + Add New Agency</div>
        );
    }
});



var AgencyTable=React.createClass({
    render:function(){
         return(
            <div> 
            { 
              this.props.AgencyListing.map(function(agency){   
                  return <AgencyRow item={agency}/>  
        
               })
            }
            </div>
        )   
    } 
});

var AgencyRow=React.createClass({ //component fetches data from parse for attorney details
    mixins: [ History ],
    onClickGo:function(){ 
        var objId=this.props.item.objectId;
        localStorage.setItem('CurrentURL','/agencydetails/'+objId);
        this.history.pushState(null,'/agencydetails/'+objId) 

    },
    render:function(){
        if(this.props.item.agencyLogo==undefined){
             var img=<img src="src/images/img_default 130.jpg" id="det_pic" />
        }
        else{
            var img=<img src={this.props.item.agencyLogo.url()} id="det_pic" />
        }
        var month =("0" + this.props.item.createdAt.getMonth()).slice(-2) 
        var day =("0" + this.props.item.createdAt.getDate()).slice(-2);  
        var year =this.props.item.createdAt.getFullYear();
        var on = day+"-"+month+"-"+year;
            return(
            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-4 lists">
                <div className="content_list" onClick={this.onClickGo}>
                    <div className="row">
                        <div className="">
                            {img}
                        </div>
                        <div className="content_detail">
                            <div className="det_listing ">
                                <p className="motherlove">{this.props.item.agencyName}</p>
                                <p>{this.props.item.emailid}</p>
                                <p>{this.props.item.phoneNumber}</p>
                                <p className="createdon"><b>Created on: </b>{on}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

module.exports=AgencyListing;