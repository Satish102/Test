var React = require('react'); //initialising components
var Header = require('./header.jsx');
var Footer = require('./footer.jsx');
var Navigation = require('./Navigation.jsx');
var SearchItems = require('./Search.jsx');
var History = require('react-router').History

Parse.initialize("MHBvhcmdlxO1KiNNhpJPMSBmDd1fDI8whzNcnUFk", "dQhzekGozWUAJqJHzQg5rvkTeKbbBZwZZ1R8UXVG");
var Attorneys = Parse.Object.extend("Attorneys");
var AttorneyListing = React.createClass({ //content section main component
    mixins: [ParseReact.Mixin], 
    observe: function(props,state) {
        var nameListing=new Parse.Query(Attorneys); //search with name
        if (state.SearchText!=""){
            nameListing.contains("attorneyName",state.SearchText);
        } 
        var emailListing=new Parse.Query(Attorneys);//search with email
        if (state.SearchText!=""){
            emailListing.contains("emailId",state.SearchText);
        } 
        var phoneListing=new Parse.Query(Attorneys);// search with phone number
        if (state.SearchText!=""){
            phoneListing.contains("phoneNumber",state.SearchText);
        } 
        var webListing=new Parse.Query(Attorneys);// search withweb address
        if (state.SearchText!=""){
            webListing.contains("webAddress",state.SearchText);
        } 
       var attorneyListing = Parse.Query.or(nameListing, emailListing,phoneListing,webListing);
        return {
           attorneyList:attorneyListing.ascending('attorneyName')                 
        };
    },
    getInitialState:function(){ //initial state for search text
        return{
            SearchText:""
        }
    },
    handleUserInput:function(filteredText){ //setting initial state to search input
        this.setState({SearchText:filteredText})
    },
    componentDidMount:function(){
        document.getElementById("attorney").className='active';
        document.getElementById("imgactive_coun").style.display='none';
        document.getElementById("imgactive_agency").style.display='none';
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
                                        <span id="content_head"> Attorneys</span>
                                    </div>
                                    <div className="col-sm-5 col-xs-7 searchbar ">
                                        <SearchItems textChange={this.handleUserInput}/>
                                    </div>
                                    <div className="col-sm-4 col-xs-12 pull-right text-right">
                                        <Addnew />
                                    </div>
                                </div>
                                <p className="border_line"></p>
                            </div>
                            <AttorneyTable AttorneyListing={this.data.attorneyList}/>
                        </div>
                        <Footer />
                    </div> 
                </div>
            </div>    
        );
    }
});

var Addnew=React.createClass({ //component for add new attorney
    mixins: [History],
    handleAdd:function(){ // redirects to add attorney page
        var temp="add";
        localStorage.setItem('CurrentURL','/attorneydetails/'+temp);
        this.history.pushState(null,'/attorneydetails/'+temp) 
    },
    render:function(){
        return(
                 <div id="addnew" onClick={this.handleAdd}> + Add New Attorney</div>
        );
    }
});

var AttorneyTable=React.createClass({ //component for attorney details
    render:function(){
         return(
            <div> 
            { 
              this.props.AttorneyListing.map(function(attorney){   
                  return <AttorneyRow item={attorney}/>  
               })
            }
            </div>
        )   
    } 
});

var AttorneyRow=React.createClass({ //component fetches data from parse for attorney details
    mixins: [ History ],
    onClickGo:function(){ 

        var objId=this.props.item.objectId;
        localStorage.setItem('CurrentURL','/attorneydetails/'+objId);
        this.history.pushState(null,'/attorneydetails/'+objId) 
    },
    getInitialState:function() {
            return {ribbon:''}
    },
    render:function(){
        if(this.props.item.image==undefined){
             var img=<img src="src/images/img_default 130.jpg" id="det_pic" />
        }
        else{
            var img=<img src={this.props.item.image.url()} id="det_pic" />
        }
        if(this.props.item.sponsored==true){
             var banner = <div id="pinkribbon">{this.state.banner}</div>;
        }
        else{
             var banner=<div id="greyribbon">{this.state.banner}</div>;
        }
        
        return(
            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-4 lists">
                <div className="content_list"  onClick={this.onClickGo}>
                    <div className="row">
                        <div className="">
                            {img}
                        </div>
                        <div className="content_detail">
                            <div className="det_listing ">
                                <p className="motherlove">{this.props.item.attorneyName}</p>
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

module.exports=AttorneyListing;