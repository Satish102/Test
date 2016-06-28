var React = require('react'); //react component
var Header = require('./header.jsx'); //header component
var Footer = require('./footer.jsx'); //footer component
var Navigation = require('./Navigation.jsx'); //navigation component
var SearchItems = require('./Search.jsx'); //search component
var History = require('react-router').History //react-router component

Parse.initialize("MHBvhcmdlxO1KiNNhpJPMSBmDd1fDI8whzNcnUFk", "dQhzekGozWUAJqJHzQg5rvkTeKbbBZwZZ1R8UXVG");
var CounsellorListing = React.createClass({//content section main component
    mixins: [ History ,ParseReact.Mixin],
    observe: function(props,state) {
        var nameListing=new Parse.Query('Counsellor');
        if (state.SearchText!=""){
            nameListing.contains("CounsellorName",state.SearchText);
        } 
        var emailListing=new Parse.Query('Counsellor');
        if (state.SearchText!=""){
            emailListing.contains("emailId",state.SearchText);
        } 
        var phoneListing=new Parse.Query('Counsellor');
        if (state.SearchText!=""){
            phoneListing.contains("phoneNumber",state.SearchText);
        } 
        var webListing=new Parse.Query('Counsellor');
        if (state.SearchText!=""){
            webListing.contains("webAddress",state.SearchText);
        } 
       var counsellorListing = Parse.Query.or(nameListing, emailListing,phoneListing,webListing);
        return {
           counsellorList:counsellorListing.ascending('CounsellorName')                  
        };
    },
    getInitialState:function(){ //initial state for search text
        return{
            SearchText:""
        }
    },
    handleUserInput:function(filteredText){ //setting state for user input in searchbar
        this.setState({SearchText:filteredText})
    },
    componentDidMount:function(){ //function calls immediately after components are get mounted
        document.getElementById("counsellor").className='active';
        document.getElementById("imgactive_agency").style.display='none';
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
                                        <span id="content_head"> Counsellors</span>
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
                            <CounsellorTable CounsellorListing={this.data.counsellorList}/>
                        </div>
                        <Footer />
                    </div> 
                </div>
            </div>
               
            
        );
    }
});

var Addnew=React.createClass({ //Add new counsellor component
    mixins: [History],
    handleAdd:function(){ 
        var temp="add";
        localStorage.setItem('CurrentURL','/counsellordetails/'+temp);
        this.history.pushState(null,'/counsellordetails/'+temp) 
    },
    render:function(){
        return(
                 <div id="addnew" onClick={this.handleAdd}> + Add New Counsellor</div>
        );
    }
});

var CounsellorTable=React.createClass({ //component for counsellor details
    render:function(){
         return(
            <div> 
            { 
              this.props.CounsellorListing.map(function(counsellor){   
                  return <CounsellorRow item={counsellor}/>  
               })
            }
            </div>
        )   
    } 
});

var CounsellorRow=React.createClass({ //component fetches data from parse for counsellor details
    mixins: [ History ],
    onClickGo:function(){ 
        var objId=this.props.item.objectId;
        localStorage.setItem('CurrentURL','/counsellordetails/'+objId);
        this.history.pushState(null,'/counsellordetails/'+objId) 
    },
    getInitialState:function() {
            return {ribbon:''}
    },
    render:function(){
        if(this.props.item.image==undefined){ //if no image is uploaded in parse, set a default image
             var img=<img src="src/images/img_default 130.jpg" id="det_pic" />
        }
        else{
            var img=<img src={this.props.item.image.url()} id="det_pic" />
        }
        if(this.props.item.sponsored==true){ // for setting pink ribbon to indicate sponsored or not
             var banner = <div id="pinkribbon">{this.state.banner}</div>;
        }
        else{
             var banner=<div id="greyribbon">{this.state.banner}</div>;
        }
        return(
            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-4 lists">
                <div className="content_list" onClick={this.onClickGo}>
                    <div className="row">
                        <div className="">
                            {img}
                        </div>
                        <div className="content_detail">
                            <div className="det_listing ">
                                <p className="motherlove">{this.props.item.CounsellorName}</p>
                                <p>{this.props.item.emailId}</p>
                                <p>{this.props.item.phoneNumber}</p>
                                <p className="createdon">{this.props.item.webAddress}</p>
                            </div>
                        </div>
                        <div>{banner}</div>
                    </div>
                </div>
            </div>
        );
    }
});

module.exports=CounsellorListing;