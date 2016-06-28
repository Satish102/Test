var React = require('react');//component initialisations
var Header = require('./header.jsx');
var Footer = require('./footer.jsx');
var Alert = require('./alert.jsx'); //alert component
var History = require('react-router').History
Parse.initialize("MHBvhcmdlxO1KiNNhpJPMSBmDd1fDI8whzNcnUFk", "dQhzekGozWUAJqJHzQg5rvkTeKbbBZwZZ1R8UXVG");  //parse initializatiom  
var Child = Parse.Object.extend("Child");  
var objid=[];
var EditChild = React.createClass({ //main parent component 
    mixins: [ History ],
    render: function() {
        return(
            <div id="maincontent">
                <Header />
                <section>
                    <div id="addchildpage">
                        <div className="row">
                           <div className="col-sm-11 childhead"> 
                               <div className="row"> 
                                    <div className="col-sm-2 ">
                                        <span id="content_head"> Children</span>
                                    </div>
                                </div> 
                                <p className="border_line"></p>
                                <div className="row"> 
                                    <div className="col-sm-3 ">
                                        <span> Children / <span id="addnew_pink"> Children Details</span></span>
                                    </div>
                                </div> 
                            </div> 
                        </div> 
                        <EditContent childid={this.props.params.childid} />
                    </div>  
                    <Footer /> 
                </section> 
            </div>
        ) 
    }
});

var EditContent=React.createClass({ //content component- includes edit section and preview section
    getInitialState: function(){ 
        return { 
            name:'',
            age:0,
            gender:'',
            city:'',
            stat:'',
            race:'',
            status:'',
            desc:'',
            caption1:'',
            caption2:'',
            caption3:'',
            obid1:'',
            obid2:'' ,
            obid3:'',
            img0:'',img1:'',img2:''
        }
    },
    componentWillMount:function(){ //fetching data from parse child table
        var aid=localStorage.getItem('Type');
        var currentUser = Parse.User.current();
        if (currentUser) { // to prevent url editing to unauthorised pages
            if (aid=="SA")
            {
                this.history.pushState(null, '/login')
            }
        }
        var val=this.props.childid; // object id of child passing from listing page
        var initial=this;
        var arr=[];
        var cap=[];
        var query = new Parse.Query(Child); //for fetching pointer dropdown values
        query.include('gender');
        query.include('city');
        query.include('state');
        query.include('race');
        query.include('status')
        query.equalTo("objectId", val);
        query.find({
            success: function(results) {   
                for (var i = 0; i < results.length; i++) {
                    var object = results[i];  
                    var nm=object.get('child_name');
                    var ag=object.get('childAge');
                    var gender=object.get('gender');
                    var gen=gender.get('name'); 
                    var city=object.get('city');
                    var ct=city.get('cityName'); 
                    var stat=object.get('state');
                    var st=stat.get('stateName'); 
                    var race=object.get('race');
                    var rc=race.get('Name'); 
                    var status=object.get('status');
                    var sts=status.get('status'); 
                    var des=object.get('description');
                }  
            initial.setState({name:nm,age:ag,gender:gen,city:ct,stat:st,race:rc,status:sts,desc:des}) ; //setting states of child data
            } 
        });  
        var ChildImages = Parse.Object.extend("ChildImages"); //fetch images from child image table
        var child = new ChildImages();
        var imgQuery = new Parse.Query(ChildImages);
        imgQuery.matchesQuery("child_id",  query); //fetch all images with same objectid
        imgQuery.find({
            success: function(results) { 
                for (var i = 0; i < results.length; i++) {                 
                    var object = results[i];   
                    arr[i]=object.get('image').url();
                    cap[i]=object.get('captions');
                    objid[i]=object.id;
                }
                document.getElementById("child_img_prevw1").src=arr[0];
                document.getElementById("img0").src=arr[0];
                var obid1=objid[0];
                document.getElementById("child_img_prevw2").src=arr[1];
                document.getElementById("img1").src=arr[1];
                var obid2=objid[1];
                document.getElementById("child_img_prevw3").src=arr[2];
                document.getElementById("img2").src=arr[2];
                var obid3=objid[2];
                var cap1=cap[0];
                var cap2=cap[1];
                var cap3=cap[2];
                initial.setState({caption1:cap1,caption2:cap2,caption3:cap3,obid1:obid1,obid2:obid2,obid3:obid3}); //setting states of images and captions
                if(arr[0]==undefined){ //if no image in table, shows default image
                    document.getElementById("img0").src="src/Images/img_default 130.jpg";
                     document.getElementById("caro1").style.display ='none';
                }
                if(arr[1]==undefined){
                    document.getElementById("img1").src="src/Images/img_default 130.jpg";
                    document.getElementById("caro2").style.display ='none';
                }
                if(arr[2]==undefined){
                    document.getElementById("img2").src="src/Images/img_default 130.jpg";
                    document.getElementById("caro3").style.display ='none';
                }
                
                if(arr[1]==undefined && arr[2]==undefined){
                    document.getElementById("caro1").style.display ='none';
                }
           }
        }); 
    },
    handleName:function(e){ //set new edited name to variable 'name'
        this.setState({name:e})
    },
    handleAge:function(e){ //set new edited age to variable 'age'
        this.setState({age:e})
    },
    handleGender:function(e){ //set new edited gender to variable 'gender'
        this.setState({gender:e})
    },
    handleCity:function(e){ //set new edited city to variable 'city'
        this.setState({city:e})
    },
    handleState:function(e){ //set new edited state to variable 'stat'
        this.setState({stat:e})
    },
    handleRace:function(e){ //set new edited race to variable 'race'
        this.setState({race:e})
    },
    handleStatus:function(e){ //set new edited status to variable 'status'
        this.setState({status:e})
    },
    handleDesc:function(e){ //set new edited description to variable 'desc'
        this.setState({desc:e})
    },
    render:function(){ 
        return (
            <div className="row" id="childdetails">
                <div className="col-sm-9 col-xs-12">
                    <div className="addchild">
                        <div id="childpink">
                            <div id="pinkDiv">
                                <p id="child_pinkhead">{this.state.name}</p>
                            </div> 
                        </div>
                        <EditDetails childid={this.props.childid} obid1={this.state.obid1} obid2={this.state.obid2} obid3={this.state.obid3} c_name={this.handleName} c_age={this.handleAge} c_gender={this.handleGender} c_city={this.handleCity} c_stat={this.handleState} c_race={this.handleRace} c_status={this.handleStatus} c_desc={this.handleDesc} name={this.state.name} age={this.state.age} gender={this.state.gender} city={this.state.city} stat={this.state.stat} race={this.state.race} status={this.state.status} desc={this.state.desc} caption1={this.state.caption1} caption2={this.state.caption2} caption3={this.state.caption3} /> 
                    </div>
                </div> 
                <div className="col-sm-3 col-xs-12">
                    <div className="addprev">
                        <div id="mobpreview">
                            <span id="addmobheading">Mobile Preview</span>
                        </div>
                        <MobilePreview caption1={this.state.caption1} caption2={this.state.caption2} caption3={this.state.caption3} name={this.state.name} age={this.state.age} gender={this.state.gender} city={this.state.city} stat={this.state.stat} race={this.state.race} status={this.state.status} desc={this.state.desc} />
                    </div>
                </div>
            </div>  
        )
    }
});

var EditDetails = React.createClass({ //component includes - child images component and edit section
    mixins: [History,ParseReact.Mixin],
    observe: function(){ //for acquiring dropdown values of status,gender,city,state and race from parse
      var stus = (new Parse.Query('Status')); 
      var gend = (new Parse.Query('Gender'));
      var cities = (new Parse.Query('City'));
      var statess = (new Parse.Query('State'));
      var races = (new Parse.Query('Race'));
      return {
        status: stus, 
        gender:gend,
        city:cities,
        stat:statess,
        race:races
        }
    },
    getInitialState: function(){ // setting initial state to variables
        return { 
                capt1:'', currenturl:'',
                viewAlert:{showAlert: false}
        }
    },

    handleEdit:function(){ // setting properties of datas that are edited
        this.props.c_name(this.refs.name.getDOMNode().value);
        this.props.c_age(this.refs.age.getDOMNode().value);
        this.props.c_gender(this.refs.gender.getDOMNode().value);
        this.props.c_city(this.refs.city.getDOMNode().value);
        this.props.c_stat(this.refs.stat.getDOMNode().value);
        this.props.c_race(this.refs.race.getDOMNode().value);
        this.props.c_status(this.refs.status.getDOMNode().value);
        this.props.c_desc(this.refs.desc.getDOMNode().value);
    },
    handleHideAlert:function(){ //for hiding modal window
        this.setState({viewAlert: {showAlert: false}})
    },

    handleShowAlertSuccess:function(e){ //set states of values wen modal window is shown
        this.setState({viewAlert: {showAlert: true}});
    },

    handleShowAlertFail:function(e){ //set states of values wen modal window is shown
        this.setState({viewAlert: {showAlert: true}, message:"Sorry, unable to save ..."});
    },

    handleSubmit: function(e) {// on clicking submit button saves to parse   
        $(document).ready(function() { //validation
            $('#contact_form').bootstrapValidator({
                feedbackIcons: {
                    valid: 'glyphicon glyphicon-ok',
                    invalid: 'glyphicon glyphicon-remove',
                    validating: 'glyphicon glyphicon-refresh'
                },
                fields: {
                    Name: {
                        validators: {
                                stringLength: {
                                min: 2,
                                max:20,
                            },
                                notEmpty: {
                                message: 'Please enter the name'
                            },
                                regexp: {
                                    regexp:/^[a-zA-Z ]*$/,
                                    message: 'Not valid name.Enter only alphabets'
                            },
                        }
                    },
                    age: {
                        validators: {
                            stringLength: {
                                min: 1,
                                max:21,
                            },
                            notEmpty: {
                                message: 'Please enter the age'
                            },
                        }
                    },
                    description: {
                        validators: {
                              stringLength: {
                                max: 500,
                                message:'Please enter a description not more than 500 words'
                            },
                            notEmpty: {
                                message: 'Please enter a description about child'
                            }
                        }
                    }
                }
            })
                .on('success.form.bv', function(e) {
                $('#success_message').slideDown({ opacity: "show" }, "slow") 
                    $('#contact_form').data('bootstrapValidator').resetForm();
               
                $.post($form.attr('action'), $form.serialize(), function(result) {

                }, 'json');
            });
            
        });
            var name = this.props.name;
            var age = this.props.age;
            var gender = this.props.gender;  
            var city = this.props.city;
            var stat = this.props.stat;
            var race = this.props.race; 
            var desc = this.props.desc; 
            var status=this.props.status;
            var Age=parseInt(age);
            var self=this;
            var val=this.props.childid;
            var query = new Parse.Query(Child);
            query.equalTo("objectId", val);               
            query.find({
                success: function(results) {  
                    for (var i = 0; i < results.length; i++) { 
                        var object = results[i];
                        object.set("child_name",name);
                        object.set("childAge", Age);
                        object.set("description",desc); 
                        var Gender = Parse.Object.extend("Gender"); // getting gender object id to set as pointer in city column
                        var query = new Parse.Query(Gender);
                        query.equalTo("name",gender);
                        query.find({
                            success: function(results) {
                                for (var i = 0; i < results.length; i++) {
                                  var obj = results[i];
                                }     
                                var gend = new Parse.Object("Gender"); //setting pointer in city column
                                gend.id = obj.id;
                                object.set("gender", gend);
                                object.save();
                            },
                            error: function(error) {
                                alert("Error: " + error.code + " " + error.message);
                            }
                        });

                        var Race = Parse.Object.extend("Race"); //getting state object id to set as pointer in state column
                        var querys = new Parse.Query(Race);
                        querys.equalTo("Name",race);
                        querys.find({
                            success: function(results) {
                                for (var i = 0; i < results.length; i++) {
                                var obj = results[i];
                            }
                                var race = new Parse.Object("Race"); // setting pointer in state column
                                race.id = obj.id;
                                object.set("race", race);
                            },
                            error: function(error) {
                                alert("Error: " + error.code + " " + error.message);
                            }
                        });
                        var City = Parse.Object.extend("City"); // getting city object id to set as pointer in city column
                        var query = new Parse.Query(City);
                        query.equalTo("cityName",city);
                        query.find({
                            success: function(results) {
                                for (var i = 0; i < results.length; i++) {
                                     var obj = results[i];
                                }     
                            var city = new Parse.Object("City"); //setting pointer in city column
                            city.id = obj.id;
                            object.set("city", city);
                          },
                          error: function(error) {
                            alert("Error: " + error.code + " " + error.message);
                          }
                        });

                        var State = Parse.Object.extend("State"); //getting state object id to set as pointer in state column
                        var querys = new Parse.Query(State);
                        querys.equalTo("stateName",stat);
                        querys.find({
                          success: function(results) {
                            for (var i = 0; i < results.length; i++) {
                              var obj = results[i];
                            }
                          var state = new Parse.Object("State"); // setting pointer in state column
                          state.id = obj.id;
                          object.set("state", state);
                          object.save();
                          },
                          error: function(error) {
                            alert("Error: " + error.code + " " + error.message);
                          }
                        });
                        var Status = Parse.Object.extend("Status"); // getting city object id to set as pointer in city column
                        var query = new Parse.Query(Status);
                        query.equalTo("status",status);
                        query.find({
                          success: function(results) {
                            for (var i = 0; i < results.length; i++) {
                              var obj = results[i];
                            }     
                            var status = new Parse.Object("Status"); //setting pointer in city column
                            status.id = obj.id;
                            object.set("status", status);
                            object.save();
                          },
                          error: function(error) {
                            alert("Error: " + error.code + " " + error.message);
                          }
                        });
                        if(name.length===0 || name.length <= 2){
                            return;
                         } 
                         else if(desc.length===0){
                            return;
                        }     
                        object.save({
                            success: function(results) {
                            },
                            error: function(error) {
                                alert("Error: " + error.code + " " + error.message);
                            }
                        });
                    }
                    self.setState({currenturl:'/childListing',message:"Child details have been saved successfully !"})
                    self.handleShowAlertSuccess();
                },
                error: function(error) {
                    self.handleShowAlertFail();
                }
            });
    },
    handleAlert:function(e){
        this.setState({message:e})
    },
    handlePublish: function(e)
    {   var self=this;
        var Child = Parse.Object.extend("Child");
        var val=self.props.childid;
        var query = new Parse.Query(Child);
        query.equalTo("objectId", val);               
        query.find({
            success: function(results) {  
                for (var i = 0; i < results.length; i++) { 
                    var object = results[i];
                    var date = new Date();
                    object.set("isPublished", true);
                    object.set("publishedOn", date);
                    }
                     object.save();
                self.setState({message:" Child details Published Successfully"});
                self.handleShowAlertSuccess();
            },
            error: function(error) {
                self.handleShowAlertFail();
            }
        });
    },
    handleCancel:function(){
        localStorage.setItem('CurrentURL','/childListing');
        this.history.pushState(null, '/childListing');
    },
    render: function() {
        return (
            <div id="addchilddetails">
                <div className="addchildphoto">
                    <ChildImages  childid={this.props.childid} obid1={this.props.obid1} obid2={this.props.obid2} obid3={this.props.obid3} caption1={this.props.caption1} caption2={this.props.caption2} caption3={this.props.caption3} />
                </div>
                <div className="detailschild"> 
                    <p id="pinkfont"> * You need to upload at least one photo of the child </p>
                    <form  id="contact_form">
                        <div className="form-group fc_formgroup pull-left" id="addchildname"> 
                            <label className="agencyInptFieldHead">Name</label>
                            <input type="text" className="form-control" name="Name" ref="name" id="child_name" value={this.props.name} onChange={this.handleEdit}  placeholder="Name" />
                        </div>

                         <div className="form-group  pull-left child_selectbox">
                            <label className="agencyInptFieldHead">Age</label>
                            <input type="number" min="1" max="21" className="form-control"  ref="age" id="age" name="age" value={this.props.age} onChange={this.handleEdit} placeholder="Age" />
                        </div>
                        <div className="form-group  pull-left child_selectbox">
                         <label className="agencyInptFieldHead">Gender</label>
                        <select className=" form-control optionlist genderbox" ref="gender" id="dd_gender" value={this.props.gender} onChange={this.handleEdit}> 
                             { 
                              this.data.gender.map(function(child){   
                                  return <option className="list-group-item" id="gender">{child.name}</option>
                               })
                            }
                        </select>
                        </div>
                        <div className="form-group  clearFloat "> 
                            <label className="agencyInptFieldHead">City</label>
                            <select className=" form-control optionlist addchildplace" ref="city" id="dd_city" value={this.props.city} onChange={this.handleEdit}> 
                                { 
                                  this.data.city.map(function(child){   
                                      return <option className="list-group-item" id="child_city" key={child.objectId}>{child.cityName}</option>
                                   })
                                }
                            </select>
                        </div>
                        <div className="form-group  "> 
                            <label className="agencyInptFieldHead">State</label>
                            <select className=" form-control optionlist addchildplace" ref="stat" id="dd_state" value={this.props.stat} onChange={this.handleEdit}> 
                                 { 
                                  this.data.stat.map(function(child){   
                                      return <option className="list-group-item" id="stat">{child.stateName}</option>
                                   })
                                }
                            </select>
                        </div>
                        <div className="form-group "> 
                            <label className="agencyInptFieldHead">Race</label>
                            <select className=" form-control optionlist addchildplace" ref="race" id="dd_race" value={this.props.race} onChange={this.handleEdit}> 
                                 { 
                                  this.data.race.map(function(child){   
                                      return <option className="list-group-item" id="stat">{child.Name}</option>
                                   })
                                }
                            </select>
                        </div>
                        <div className="form-group  "> 
                            <label className="agencyInptFieldHead">Status</label>
                            <select className=" form-control optionlist addchildplace" ref="status" id="dd_status" value={this.props.status} onChange={this.handleEdit}> 
                                 { 
                                  this.data.status.map(function(child){   
                                      return <option className="list-group-item" id="stat">{child.status}</option>
                                   })
                                }
                            </select>
                        </div>
                        <div className="form-group clearFloat"> 
                            <label className="agencyInptFieldHead">Description</label>
                            <textarea className="form-control addchilddesc" name="description" id="descrip" ref="desc" value={this.props.desc} onChange={this.handleEdit} placeholder="Description" ></textarea>
                        </div>
                        
                        <div className="childrenbtn pull-right">
                            <button type="submit" className="btn" id="childsavebtn" onClick={this.handleSubmit} >Save</button>
                            <button type="button" className="btn" id="publishButton" onClick={this.handlePublish}>Publish</button>
                            <button type="submit" className="btn" id="childcancelbtn" onClick={this.handleCancel} >Cancel</button>
                        </div>
                    </form>
                    {this.state.viewAlert.showAlert ? <Alert handleHideAlert={this.handleHideAlert} currenturl={this.state.currenturl} message={this.state.message} /> : null} 
                </div>
            </div>
        );
    }
});
var MobilePreview = React.createClass({  //mobile preview component
    getInitialState: function(){ 
              return { parseFile:''}
    },
    handleAddImg:function(filteredText){
        this.setState({parseFile:filteredText});
    }, 
    render: function() {                     
        return ( 
            <div id="mob_preview">
                <div className="nopreview_space">
                    <div id="childprev_img">
                       <PreviewImage caption1={this.props.caption1} caption2={this.props.caption2} caption3={this.props.caption3} parseFile={this.handleAddImg} handleImgSrc={this.handleImgSrc}/>
                    </div>
                   <div id="childprev_details">
                       <p id="childprev_name">{this.props.name}</p>
                       <p id="childprev_year">{this.props.age} years</p>
                       <p>{this.props.gender}</p>
                       <p>{this.props.city}</p>
                       <p>{this.props.stat}</p>
                       <p>{this.props.race}</p>
                       <p>Status : <span id="childprev_status">{this.props.status}</span></p>
                   </div>
                </div>
                <div id="editdesc_prev">
                    <p id="childprev_desc">{this.props.desc}</p>
                </div>
            </div>          
        )
    }
}); 
var PreviewImage = React.createClass({   //preview image of mobile preview
    
     getInitialState: function(){ 
        return { 
            caption1:'',
            caption2:'',
            caption3:''

        }
    },
    render: function() { 
        return (
            <div className="col-sm-12 col-xs-12 child_mainlist">
                <div id="carousel-example-generic" className="carousel" >
                    <ol className="carousel-indicators mob_carousel-indicators">
                        <li data-target="#carousel-example-generic" data-slide-to="0" id="caro1" className="active"></li>
                        <li data-target="#carousel-example-generic" data-slide-to="1" id="caro2"></li>
                        <li data-target="#carousel-example-generic" data-slide-to="2" id="caro3"></li>
                    </ol>
                    <div className="carousel-inner" role="listbox">
                        <div className="item active">
                            <img  id="child_img_prevw1" className="child_img_prevw" src="" />
                            <div className="carousel-caption fc_caro_caption">
                                <p id="cap1">{this.props.caption1}</p>
                            </div>
                        </div>
                        <div className="item">
                            <img id="child_img_prevw2" className="child_img_prevw" src=""  />
                            <div className="carousel-caption fc_caro_caption">
                                <p id="cap2">{this.props.caption2}</p>
                            </div>
                        </div>
                        <div className="item">
                            <img  id="child_img_prevw3" className="child_img_prevw" src="" />
                            <div className="carousel-caption fc_caro_caption">
                                <p id="cap3">{this.props.caption3}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        )
    }
});     

var ChildImages=React.createClass({ //child image component
    getInitialState:function(){ 
        return {view: {showModal: false},
                imageID:'',
                imageSRC:'',
                imageALT:'',
                viewAlert: {showAlert: false},
        }

    },
    handleHideModal:function(){ //for hiding modal window
        this.setState({view: {showModal: false}})
    },
    handleShowModal:function(e){ //set states of values wen modal window is shown
        var picid=e.target.id;
        var picurl=e.target.src;
        var picalt=e.target.alt;
        this.setState({view: {showModal: true},imageID:picid,imageSRC:picurl,imageALT:picalt});
    },
    handleHideAlert:function(){ //for hiding modal window
        this.setState({viewAlert: {showAlert: false}})
    },
    handleShowAlertSuccess:function(e){ //set states of values wen modal window is shown
        this.setState({viewAlert: {showAlert: true}});
    },
    deleteImage:function(){ //deletes all images of a child
        document.getElementById("img0").src="src/Images/img_default 130.jpg";
        document.getElementById("cap1").innerHTML='';
        document.getElementById("img1").src="src/Images/img_default 130.jpg";
        document.getElementById("cap2").innerHTML='';
        document.getElementById("img2").src="src/Images/img_default 130.jpg";
        document.getElementById("cap3").innerHTML='';
        document.getElementById("child_img_prevw1").src="";
        document.getElementById("child_img_prevw2").src="";
        document.getElementById("child_img_prevw3").src="";
        document.getElementById("caro1").style.display ='none';
        document.getElementById("caro2").style.display ='none';
        document.getElementById("caro3").style.display ='none';
        document.getElementById("img0").alt="";
        document.getElementById("img1").alt="";
        document.getElementById("img2").alt="";
        var val=this.props.childid;
        var self=this;
        var query = new Parse.Query(Child);
        query.equalTo("objectId", val);
        var ChildImages = Parse.Object.extend("ChildImages");
        var imgQuery = new Parse.Query(ChildImages);
        imgQuery.matchesQuery("child_id",  query); 
        imgQuery.find({
            success: function(results) { 
                for (var i = 0; i < results.length; i++) {                 
                    var object = results[i];   
                    objid[i]=object.id;
                            
                    imgQuery.get(objid[i], {
                      success: function(myObj) {
                        myObj.destroy({});
                      },
                      error: function(object, error) {
                      }
                  });
                }
                self.setState({message:"All the child photos are deleted successfully ..."});
                self.handleShowAlertSuccess();
            },
            error: function(object, error) {
            }
        });
    },
    render:function(){ 
        return(
            <div>
            <div className="col-sm-12 col-xs-12 abs">
                <div className="editchildpic" >
                    <div className="editinputchildpic"></div>
                    <span id="editclickforpic"> Add photo</span>
                </div>
            </div>
            <div className="col-sm-10 col-xs-8 edit_img_prevw_space">
                <div id="imagetable">
                    <table>
                        <tr>
                            <td className="edit_td">
                                <img src="src/images/img_default 130.jpg" className="fc_thumbnail" id="img0" alt={this.props.obid1} onClick={this.handleShowModal}/>
                                <div className="child_caption">
                                    <p id="cap1">{this.props.caption1}</p>
                                </div>
                            </td>
                            <td className="edit_td">
                                <img src="src/images/img_default 130.jpg" className="fc_thumbnail" id="img1" alt={this.props.obid2} onClick={this.handleShowModal} />
                                <div className="child_caption">
                                    <p id="cap2">{this.props.caption2}</p>
                                </div>
                            </td>
                            <td className="edit_td">
                                <img src="src/images/img_default 130.jpg" className="fc_thumbnail" id="img2" alt={this.props.obid3} onClick={this.handleShowModal}/> 
                                <div className="child_caption">
                                    <p id="cap3">{this.props.caption3}</p>
                                </div>
                            </td>
                            {this.state.view.showModal ? <Modal capt1={this.handleCap} handleHideModal={this.handleHideModal} imageID={this.state.imageID} imageSRC={this.state.imageSRC} imageALT={this.state.imageALT} caption1={this.props.caption1} caption2={this.props.caption2} caption3={this.props.caption3} childid={this.props.childid} /> : null} 
                        </tr>
                        {this.state.viewAlert.showAlert ? <Alert handleHideAlert={this.handleHideAlert} currenturl={this.state.currenturl} message={this.state.message} /> : null} 
                    </table>
                </div>
                
            </div>
            <div className="deleteall">
                <button type="button" className="btn" id="deleteall" onClick={this.deleteImage} >Delete All</button>
            </div>
            </div>
        );
    
    }
});
      

var  ModalImageUploader = React.createClass({ //component for uploading image in modal window
    changePic:function(e){  // preview of uploaded image
        var output = document.getElementById("fc_modal-img");
        output.src = URL.createObjectURL(e.target.files[0]); 
       
    }, 
    render: function() {                    
        return (
            <div className="fileUpload btn " onChange={this.handleChange}>
                <div className="modal_pic_select">
                    <span id="modal_clickforpic">Change Photo</span>
                </div>
                <input type="file" accept="image/*" className="modal-addchildfoto" id="profilePhotoFileUpload"  onChange={this.changePic}/>
            </div>
            
        )
    }   
});      
var Modal = React.createClass({ //modal window component
    getInitialState:function(){
        return{cap:'',
               viewAlert: {showAlert: false}
            }
    },
    handleCaption:function(e){ //set state of new caption from input field
        var new_id=this.props.imageID; 
        this.setState({cap:e.target.value});  
    }, 
    hideModel:function(e){ 
        $(this.getDOMNode()).modal('hide'); 
    },
    handleHideAlert:function(){ //for hiding modal window
        this.setState({viewAlert: {showAlert: false}})
    },
    handleShowAlertFail:function(e){ //set states of values wen modal window is shown
        this.setState({viewAlert: {showAlert: true}});
    },
    componentDidMount:function(){
        $(this.getDOMNode()).modal('show');
        var new_id=this.props.imageID;
        if(new_id=='img0'){
            var oldcaption=this.props.caption1;
            this.setState({cap:oldcaption});
        }
        else if(new_id=='img1'){
            var oldcaption=this.props.caption2;
            this.setState({cap:oldcaption});
        }
        else if(new_id=='img2'){
            var oldcaption=this.props.caption3;
            this.setState({cap:oldcaption});
        }
        $(this.getDOMNode()).on('hidden.bs.modal', this.props.handleHideModal);
    },
    addImage:function(){ //save image and caption to parse
        var new_id=this.props.imageID;
        var output = document.getElementById("fc_modal-img").src;
        var prevw=document.getElementById(new_id);
        prevw.src = output; 
        if(new_id=='img0'){
            document.getElementById('child_img_prevw1').src=prevw.src;
        }
        else if(new_id=='img1'){
            document.getElementById('child_img_prevw2').src=prevw.src;
            document.getElementById("caro1").style.display ='inline-block';
            document.getElementById("caro2").style.display ='inline-block';
        }
        else if(new_id=='img2'){
            document.getElementById('child_img_prevw3').src=prevw.src;
            document.getElementById("caro3").style.display ='inline-block';
        }
        var img_id=this.props.imageALT;
        var cap=this.state.cap;
        var ChildImages = Parse.Object.extend("ChildImages");
        var val=this.props.childid;
        var myUser = new Parse.Query(ChildImages);
        var children= new ChildImages();  
        var self=this;
        var fileUploadControl = $("#profilePhotoFileUpload")[0]; //upload images to child table
            if (fileUploadControl.files.length > 0) {
                var file = fileUploadControl.files[0];
                var name="photo.jpg";
                var parseFile = new Parse.File(name, file);
                parseFile.save().then(function() {
                }, function(error) {
                    self.setState({message:"Unable to save... Sorry..!"});
                    self.handleShowAlertFail();
                });
            }
            if(img_id!="undefined") // to replace already existing image and caption
            { 
                myUser.equalTo("objectId",img_id);
                myUser.find({
                    success: function(results) {  
                        for(var i=0; i<results.length; i++){
                            var object=results[i];
                    }        
                    var ch = new Parse.Object("Child"); 
                    ch.id = val;
                    children.set("objectId",img_id);
                    children.set("child_id",ch);
                    children.set("captions",cap);
                    children.set("image",parseFile);
                    children.save().then(function() {
                        if(new_id=="img0"){
                            var Child = Parse.Object.extend("Child");
                            var query = new Parse.Query(Child);
                            var children=new Child();
                            query.equalTo("objectId",val);
                            query.find({
                                success: function(results) {
                                    for(var i=0; i<results.length; i++){
                                        var obj=results[i];
                                        obj.set("image",parseFile);
                                        obj.save();
                                    }
                                },
                                error: function(error) {
                                    self.setState({message:"Unable to save... Sorry..!"});
                                    self.handleShowAlertFail();
                                }
                            });
                        }
                        else{}
                    },
                    function(error) {
                        self.setState({message:"Unable to save... Sorry..!"});
                        self.handleShowAlertFail();
                    });
                           
                    },
                    error: function(error) {
                        self.setState({message:"Unable to save... Sorry..!"});
                        self.handleShowAlertFail();
                    }
                });
            }
            else{ //to add new image 
                var ch = new Parse.Object("Child"); 
                ch.id = val;
                children.set("child_id",ch);
                children.set("captions",cap);
                children.set("image",parseFile);
                children.save().then(function() {
                },
            function(error) {
                self.setState({message:"Unable to save... Sorry..!"});
                self.handleShowAlertFail();
            });
                   
            }
    },
    cancelModal:function(){
        var new_id=this.props.imageID;
        var prevw=document.getElementById(new_id);
        prevw.src = document.getElementById(new_id).src; 
        if(new_id=='img0'){
            document.getElementById('child_img_prevw1').src=prevw.src;
            document.getElementById('img0').src=prevw.src;
        }
        else if(new_id=='img1'){
            document.getElementById('child_img_prevw2').src=prevw.src;
            document.getElementById('img1').src=prevw.src;
            document.getElementById("caro1").style.display ='inline-block';
            document.getElementById("caro2").style.display ='inline-block';
        }
        else if(new_id=='img2'){
            document.getElementById('img2').src=prevw.src;
            document.getElementById('child_img_prevw3').src=prevw.src;
            document.getElementById("caro3").style.display ='inline-block';
        }
    },
    render:function(){   
        return (
          <div className="modal fade">
            <div className="modal-dialog fc_modal-dialog">
              <div className="modal-content">
                <div className="modal-header fc_mod_header">
                  <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                  <h4 className="modal-title fc_modalhead" >Add photo</h4>
                </div>
                <div className="modal-body fc_modal-body">
                    <div className="modal_addchildpic">
                        <img className="fc_img-thumbnail img0" id="fc_modal-img" src={this.props.imageSRC}/>
                        <ModalImageUploader onUpload={this.handleChange} imageSRC={this.props.imageSRC} imageID={this.props.imageID}/>
                    </div>
                    <div className="fc_caption">
                        <input type="text" ref="caption" className="form-control" value={this.state.cap} onChange={this.handleCaption} placeholder="Add Caption" />
                    </div>
                </div>
                <div className="modal-footer fc_modal-footer">
                  <button type="button" className="btn" id="cancelmodalButton"  onClick={this.cancelModal} data-dismiss="modal" >Cancel</button>
                  <button type="button" className="btn" id="addmodalButton" onClick={this.addImage} data-dismiss="modal">Add</button>
                </div>
              </div>
              {this.state.viewAlert.showAlert ? <Alert handleHideAlert={this.handleHideAlert} currenturl={this.state.currenturl} message={this.state.message} /> : null} 
            </div>
          </div>
        )
    },
    propTypes:{
        handleHideModal: React.PropTypes.func.isRequired
    }
}); 

module.exports=EditChild;