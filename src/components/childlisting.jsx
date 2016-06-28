var React = require('react');
var Header = require('./header.jsx');
var Footer = require('./footer.jsx');
var SearchItems = require('./Search.jsx');
var History = require('react-router').History

Parse.initialize("MHBvhcmdlxO1KiNNhpJPMSBmDd1fDI8whzNcnUFk", "dQhzekGozWUAJqJHzQg5rvkTeKbbBZwZZ1R8UXVG");
var Child = Parse.Object.extend("Child");
var ChildDetails = React.createClass({ //content section main component
    mixins: [History ,ParseReact.Mixin  ], 
    observe: function(props,state) {
        
        var nameListing=new Parse.Query(Child);
        if (state.SearchText!=""){
            nameListing.contains("child_name",state.SearchText);
        } 
         var ageListing=new Parse.Query(Child);
        if (state.SearchText!=""){
            var age=state.SearchText;
            ageListing.equalTo("childAge",Number(age));
        } 
        var genderListing=new Parse.Query(Child);
        if (state.SearchText!=""){
            var Gender = Parse.Object.extend("Gender");
            var gendQuery = new Parse.Query(Gender);
            gendQuery.contains("name",state.SearchText);
            genderListing.matchesQuery("gender",gendQuery);
        } 
        var stateListing=new Parse.Query(Child);
        if (state.SearchText!=""){
            var State = Parse.Object.extend("State");
            var stateQuery = new Parse.Query(State);
            stateQuery.contains("stateName",state.SearchText);
            stateListing.matchesQuery("state",stateQuery);
        } 
        var statusListing=new Parse.Query(Child);
        if (state.SearchText!=""){
            var Status = Parse.Object.extend("Status");
            var statusQuery = new Parse.Query(Status);
            statusQuery.contains("status",state.SearchText);
            statusListing.matchesQuery("status",statusQuery);
        } 
        var childListing = Parse.Query.or(nameListing,ageListing,genderListing,stateListing,statusListing);
        childListing.include('gender');
        childListing.include('state');
        childListing.include('status');
        return {
           childList:childListing.ascending('child_name')    
        };
    },
    getInitialState:function(){ //initial state for search text
        return{
            SearchText:""
        }
    },
    handleUserInput:function(filteredText){
        this.setState({SearchText:filteredText})
    },
    addChild:function(e){        
        localStorage.setItem('CurrentURL','/childAdd'); 
        this.history.pushState(null, '/childAdd');
    }, 
    componentDidMount:function(){
        var aid=localStorage.getItem('Type'); // to prevent url editing to unauthorised pages
        var currentUser = Parse.User.current();
        if (currentUser) {
            if (aid=="SA")
            {
                this.history.pushState(null, '/login')
            }
        }
    },
    render: function() {
        return (
            <div id="maincontent">
                <Header />
                <div className="row">
                    <div id="content">
                        <div className="col-sm-12 col-xs-12"> 
                            <div className=" child_contentlist">
                                <div className="headings">
                                    <div className="row"> 
                                        <div className="col-sm-2 col-xs-5 child_head">
                                            <span id="content_head"> Children</span>
                                        </div>
                                        <div className="col-sm-6 col-xs-7 searchbar ">
                                            <SearchItems textChange={this.handleUserInput}/>
                                        </div>
                                        <div className="col-sm-4 col-xs-12 pull-right text-right">
                                            <span id="addnew" onClick ={this.addChild}> + Add New Child</span>
                                        </div>
                                    </div>
                                    <p className="border_line"></p>
                                </div>
                                <ChildTable ChildDetails={this.data.childList}  />
                            </div>
                            <Footer />
                        </div> 
                    </div>
                </div> 
            </div>
        );
    }
});

var ChildTable=React.createClass({ //component for child listing details
    render:function(){
         return(
            <div> 
            { 
              this.props.ChildDetails.map(function(child){ 
                var id=localStorage.getItem('agencyId');
                if(child.agencyId.objectId === id){
                  return <ChildRow item={child} /> 
                }
                else{
                    // return <ChildRow item="NA" /> 
                    // alert("No children added");
                }
               })
            }
            </div>
        )   
    } 
});
var ChildRow=React.createClass({ //component fetches data from parse for child details    
     mixins: [ History ],
    onClickGo:function(e){   
        var objId=this.props.item.objectId;
        localStorage.setItem('CurrentURL','/childEdit/'+objId);
        this.history.pushState(null,'/childEdit/'+objId)  
    },
    render:function(){ 
        var on='';
        if(this.props.item.isPublished==true && this.props.item.publishedOn != null){
            var month =this.props.item.publishedOn.getMonth()+1;
            var day =("0" + this.props.item.publishedOn.getDate()).slice(-2);  
            var year =this.props.item.publishedOn.getFullYear();
            on = day+"-"+month+"-"+year;
        }
        else{
            on="Not Published";
        }

        return(
            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-4 lists">
                <div className="content_list">
                    <img src={this.props.item.image.url()} id="det_pic" />
                    <div className="content_detail" onClick={this.onClickGo}>
                        <div className="child_listing" >
                            <p className="motherlove child_det">{this.props.item.child_name}  | <span id="childAge_pink">{this.props.item.childAge}years</span></p>
                            <p className="child_det">{this.props.item.gender.name}</p>
                            <p className="child_det">{this.props.item.state.stateName}</p>
                            <p className="child_det"><span>Status : </span><span id="childStatus">{this.props.item.status.status}</span></p>
                            <p className="createdon child_det">Published on: {on}</p>
                        </div>
                    </div>
                </div>
            </div> 
        );
    }
});
module.exports=ChildDetails;