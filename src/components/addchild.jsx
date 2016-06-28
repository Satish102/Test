var React = require('react'); //initialisation of components
var Header = require('./header.jsx');
var Footer = require('./footer.jsx');
var Alert = require('./alert.jsx'); //alert component
var History = require('react-router').History

Parse.initialize("MHBvhcmdlxO1KiNNhpJPMSBmDd1fDI8whzNcnUFk", "dQhzekGozWUAJqJHzQg5rvkTeKbbBZwZZ1R8UXVG");    
var Child = Parse.Object.extend("Child"); 
var child_id='';
var AddChild = React.createClass({ //parent component includes add detail component and preview component
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
                                        <span> Children / <span id="addnew_pink"> Add New Child</span></span>
                                    </div>
                                </div> 
                            </div> 
                        </div> 
                        <div className="row" id="childdetails">
                            <div className="col-sm-9 col-xs-12">
                                <div className="addchild">
                                    <div id="childpink">
                                        <span id="addheading">Add New Children</span>
                                    </div>
                                    <AddDetails /> 
                                </div>
                            </div> 
                            <div className="col-sm-3 col-xs-12">
                                <div className="addprev">
                                    <div id="mobpreview">
                                        <span id="addmobheading">Mobile Preview</span>
                                    </div>
                                    <MobilePreview /> 
                                </div>
                            </div>
                        </div>  
                    </div>  
                    <Footer />
                </section> 
        </div>
        ) 
    }
});

var AddDetails = React.createClass({ //component to add details of child
    mixins: [History,ParseReact.Mixin],
    observe: function(){ //for acquiring pointer dropdown values
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
    getInitialState: function(){ //initialising states of data
        return { 
                name:'',
                age:0,
                gender:'',
                city:'',
                stat:'',
                race:'',
                status:'',
                desc:'',
                caption:[],
                LoadedImages:{},
                ImagePath:'',
                publisheds:'false',
                agencyid:'',
                viewAlert:{showAlert: false},
                message:'', currenturl:''
        }
    },
    handleUserInput:function(childImages,ImagePath){ //setting state of new uploaded foto and image path
        this.setState({LoadedImages:childImages,ImagePath:ImagePath });
    },
    componentDidMount:function(){ //gets the agency id of agency logged in
        var id=localStorage.getItem('agencyId');
        this.setState({agencyid:id})
        var aid=localStorage.getItem('Type');// to prevent url editing to unauthorised pages
        var currentUser = Parse.User.current();
        if (currentUser) {
            if (aid=="SA")
            {
                this.history.pushState(null, '/login')
            }
        }
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
    handleAddChild:function(){ //setting states of data with new added data
        this.setState({ name:this.refs.name.getDOMNode().value, age:this.refs.age.getDOMNode().value,city:this.refs.city.getDOMNode().value, stat:this.refs.stat.getDOMNode().value,gender:this.refs.gender.getDOMNode().value,race:this.refs.race.getDOMNode().value,status: this.refs.status.getDOMNode().value, desc: this.refs.desc.getDOMNode().value})
        this.setState({publisheds:'false'})},
    handleCaption:function(val,picid){
        var captions=this.state.caption;
        if(picid=='img0')
        {
            if (captions[0]) {
               captions[0]=val; 
            }
            else
            {
                captions.push(val);
            }
        };

         if(picid=='img1')
        {
            if (captions[1]) {
               captions[1]=val; 
            }
            else
            { 
                if (captions[0]==NaN) {
               captions.push('') 
                    }
                captions.push(val);
            }
        };

         if(picid=='img2')
        {
            if (captions[2]) {
               captions[2]=val; 
            }
            else
            { 
                    if (captions[0]==NaN) {
                   captions.push('') 
               }
                   if (captions[1]==NaN) {
                   captions.push('') 
                }
                captions.push(val);
            }
        };
        this.setState({ caption:captions})
    },
    handleSubmit: function(e)
    {   
        $(document).ready(function() { //validation
            $('#contact_form').bootstrapValidator({
                feedbackIcons: {
                    valid: 'glyphicon glyphicon-ok',
                    invalid: 'glyphicon glyphicon-remove',
                    validating: 'glyphicon glyphicon-refresh'
                },
                fields: {
                    Name: { //name validation
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
                    age: { //age validation
                        validators: {
                            notEmpty: {
                                message: 'Please enter age'
                            },
                        }
                    },
                    gender: { //gender validation
                        validators: {
                            notEmpty: {
                                message: 'Please select gender'
                            }
                        }
                    },
                    city: { //city validation
                        validators: {
                            notEmpty: {
                                message: 'Please select the city'
                            }
                        }
                    },
                    state: { //state validation
                        validators: {
                            notEmpty: {
                                message: 'Please select the state'
                            }
                        }
                    },
                    race: { //race validation
                        validators: {
                            notEmpty: {
                                message: 'Please select the race'
                            }
                        }
                    },
                    status: { //status validation
                        validators: {
                            notEmpty: {
                                message: 'Please select the status'
                            }
                        }
                    },
                    description: { //description validation
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
        
        var name = this.state.name;
        var age = this.state.age;
        var gender = this.state.gender;  
        var city = this.state.city;
        var stat = this.state.stat;
        var race = this.state.race; 
        var desc = this.state.desc; 
        var status=this.state.status;
        var publ=this.state.publisheds;
        var agency_id=this.state.agencyid;
        var Age=parseInt(age);
        var children= new Child();  
        children.set("isPublished", false);
        children.set({"child_name":name,
                      "childAge": Age,
                      "description":desc}); 
        var self=this;    
        var Agency = Parse.Object.extend("Agency"); // getting agency object id to set as pointer in agencyid column
            var query = new Parse.Query(Agency);
            query.equalTo("objectId",agency_id);
            query.find({
              success: function(results) {
                for (var i = 0; i < results.length; i++) {
                  var object = results[i];
                }     
                var agen = new Parse.Object("Agency"); //setting pointer in agencyid column
                agen.id = object.id;
                children.set("agencyId", agen);
                }
            });
        var Gender = Parse.Object.extend("Gender"); // getting gender object id to set as pointer in gender column
            var query = new Parse.Query(Gender);
            query.equalTo("name",gender);
            query.find({
              success: function(results) {
                for (var i = 0; i < results.length; i++) {
                  var object = results[i];
                }     
                var gend = new Parse.Object("Gender"); //setting pointer in gender column
                gend.id = object.id;
                children.set("gender", gend);
                }
            });

            var Race = Parse.Object.extend("Race"); //getting race object id to set as pointer in race column
            var querys = new Parse.Query(Race);
            querys.equalTo("Name",race);
            querys.find({
              success: function(results) {
                for (var i = 0; i < results.length; i++) {
                  var obj = results[i];
                }
              var race = new Parse.Object("Race"); // setting pointer in race column
              race.id = obj.id;
              children.set("race", race);
              }
            });
            var City = Parse.Object.extend("City"); // getting city object id to set as pointer in city column
            var query = new Parse.Query(City);
            query.equalTo("cityName",city);
            query.find({
              success: function(results) {
                for (var i = 0; i < results.length; i++) {
                  var object = results[i];
                }     
                var city = new Parse.Object("City"); //setting pointer in city column
                city.id = object.id;
                children.set("city", city);
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
              var statess = new Parse.Object("State"); // setting pointer in state column
              statess.id = obj.id;
              children.set("state", statess);
              }
            });
            var Status = Parse.Object.extend("Status"); // getting status object id to set as pointer in status column
            var query = new Parse.Query(Status);
            query.equalTo("status",status);
            query.find({
              success: function(results) {
                for (var i = 0; i < results.length; i++) {
                  var object = results[i];
                }     
                var status = new Parse.Object("Status"); //setting pointer in status column
                status.id = object.id;
                children.set("status", status);
              }
            });

            var fileUploadControl = $("#profilePhotoFileUpload")[0]; //upload images to child table
            var haspic=fileUploadControl.files.length;
              if (fileUploadControl.files.length == 0) {
                self.setState({message:"Please add a photo ... "});
                self.handleShowAlertSuccess();
              }
              else if (fileUploadControl.files.length > 0) {
                var file = fileUploadControl.files[0];
                var name = "photo.jpg";
                var parseFile = new Parse.File(name, file);
              }
            parseFile.save().then(function() {

            }, function(error) {
              self.handleShowAlertFail();
            });
            children.set("image",parseFile);
            if(name.length===0 || name.length <= 2){
                return;
             } 
            else if(desc.length===0){
                return;
             } 
             else if(status.length===0 || race.length===0 || city.length===0){
                return;
             }
            var objects=this;
        children.save({
          success: function(results) { //to uplaod images and caption sin childImage table
            child_id=results.id;
            objects.setState({currenturl:'/childListing',message:"Child details have been saved successfully !"})
            objects.handleShowAlertSuccess();
            if (objects.state.LoadedImages) {
            for (var imgs = objects.state.LoadedImages.length - 1; imgs >= 0; imgs--) {
                var file = objects.state.LoadedImages[imgs];
                var name = objects.state.LoadedImages[imgs].name;
                var parseFile = new Parse.File(name, file);
                
                var myUser = new Parse.Object("ChildImages");
                myUser.set("image", parseFile);

                var ch = new Parse.Object("Child"); //setting pointer in city column
                ch.id = results.id;
                myUser.set("child_id",ch)

                var caps=objects.state.caption[imgs];
                myUser.set("captions",caps)
                myUser.save()
                    .then(function() {
                    }.bind(this), function(error) {
                    });

                    };
            }
          },
          error: function(error) {
             self.handleShowAlertSuccess();
          }
        });
    },
     handlePublish: function(e){ //to publish child with latest added details
        var Child = Parse.Object.extend("Child");
        var query = new Parse.Query(Child);
        var objects=this;
        query.equalTo("objectId",child_id) ;
        query.find({
            success:function(results){
                for(var i=0; i<=results.length;i++ )
                {
                    object=results[i];
                    var date = new Date();
                    object.set("isPublished", true);
                    object.set("publishedOn", date);
                    object.save();
                }
                 objects.setState({message:" Published successfully !! "});
                    objects.handleShowAlertSuccess();
            },            
            error:function(){
               self.handleShowAlertSuccess();
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
                    <ImageUploader onUpload={this.handleUserInput}/>
                    <ChildImages handleCaption={this.handleCaption}  path={this.state.ImagePath} childImages={this.state.LoadedImages} />
                </div>
                <div className="detailschild">
                    <p id="pinkfont"> * You need to upload at least one photo of the child </p>
                    <form  id="contact_form">
                        <div className="form-group fc_formgroup pull-left" id="addchildname">
                            <label className="agencyInptFieldHead">Name</label>
                            <input type="text" className="form-control" name="Name" ref="name" id="child_name" onChange={this.handleAddChild} placeholder="Name" />
                        </div>
                       
                        <div className="form-group  pull-left child_selectbox">
                            <label className="agencyInptFieldHead">Age</label>
                            <input type="number" min="1" max="21" className="form-control"  name="age" ref="age" id="age" onChange={this.handleAddChild} placeholder="Age"/>
                        </div>

                        <div className="form-group pull-left child_selectbox"> 
                            <label className="agencyInptFieldHead">Gender</label>
                            <select className=" form-control optionlist genderbox" name="gender" ref="gender" onChange={this.handleAddChild}> //retrievng dropdown values of age
                                <option value=""  disabled selected>Select</option> 
                                { 
                                    this.data.gender.map(function(d){
                                        return (
                                            <option key={d.objectId} className="list-group-item">{d.name}</option>
                                        )
                                    })
                                }                           
                            </select>
                        </div>
                        
                        <div className="form-group  clearFloat "> 
                            <label className="agencyInptFieldHead">City</label>
                            <select className=" form-control optionlist addchildplace" name="city" ref="city" onChange={this.handleAddChild}> //retrievng dropdown values of gender
                                <option value=""  disabled selected>Select your city</option>
                                { 
                                    this.data.city.map(function(e){
                                        return (
                                            <option key={e.objectId} className="list-group-item">{e.cityName}</option>
                                        )
                                    })
                                }                              
                            </select>
                        </div>

                        <div className="form-group  "> 
                            <label className="agencyInptFieldHead">State</label>
                            <select className=" form-control optionlist addchildplace" name="state" ref="stat" onChange={this.handleAddChild}> //retrievng dropdown values of gender
                                <option value=""  disabled selected>Select your state</option>
                                { 
                                    this.data.stat.map(function(f){
                                        return (
                                            <option key={f.objectId} className="list-group-item">{f.stateName}</option>
                                        )
                                    })
                                }                              
                            </select>
                        </div>

                        <div className="form-group "> 
                            <label className="agencyInptFieldHead">Race</label>
                            <select className=" form-control optionlist addchildplace" name="race" ref="race" onChange={this.handleAddChild}> //retrievng dropdown values of gender
                                <option value=""  disabled selected>Select the race</option>
                                { 
                                    this.data.race.map(function(g){
                                        return (
                                            <option key={g.objectId} className="list-group-item">{g.Name}</option>
                                        )
                                    })
                                }                              
                            </select>
                        </div>

                        <div className="form-group  "> 
                            <label className="agencyInptFieldHead">Status</label>
                            <select className=" form-control optionlist addchildplace" name="status" ref="status" onChange={this.handleAddChild}> //retrievng dropdown values of age                          
                                <option value=""  disabled selected>Select your status</option>
                                { 
                                    this.data.status.map(function(h){
                                        return (
                                            <option key={h.objectId} className="list-group-item">{h.status}</option>
                                        )
                                    })
                                }     
                            </select>
                        </div>

                        <div className="form-group "> 
                            <label className="agencyInptFieldHead">Description</label>
                            <textarea className="form-control addchilddesc" name="description" ref="desc" onChange={this.handleAddChild}  ></textarea>
                        </div>
                        <div className="childrenbtn pull-right">
                            <button type="submit" className="btn" id="childsavebtn" onClick={this.handleSubmit} >Save</button>
                            <button type="button" className="btn" id="publishButton" onClick={this.handlePublish}>Publish</button>
                            <button type="submit" className="btn" id="childcancelbtn" onClick={this.handleCancel} >Cancel</button>
                        </div>
                    </form>
                </div>
                {this.state.viewAlert.showAlert ? <Alert handleHideAlert={this.handleHideAlert} currenturl={this.state.currenturl} message={this.state.message} /> : null}
            </div>
        );
    }
});

var MobilePreview = React.createClass({  //mobilr preview component
    render: function() {                     
        return ( 
            <div id="mob_preview">
                <div className="nopreview_space">
                    <span id="nopreview"> No Preview</span>
                </div>
                <div id="desc_prev"></div>
            </div>          
        )
    }
}); 

var ChildImages=React.createClass({ //component to uplaod child images and captions
    getInitialState:function(){
        return {view: {showModal: false},
                imageID:'',
                imageSRC:''
        }
    },
    handleHideModal:function(){ //for hiding modal window
        this.setState({view: {showModal: false}})
 
    },
    handleShowModal:function(e){
        var picid=e.target.id;
        var picurl=e.target.src;
        this.setState({view: {showModal: true},imageID:picid,imageSRC:picurl});
    },
    changeCaption:function(picCaption){
          this.props.handleCaption(picCaption,this.state.imageID)
    },
    render:function(){
        return(
            <div className="col-sm-10 col-xs-8 image_preview_space">
                <div id="imagetable">
                    <table>
                        <tr>
                            <td><img src="src/Images/img_default 130.jpg" className="fc_thumbnail" id="img0" onClick={this.handleShowModal}/></td>
                            <td><img src="src/Images/img_default 130.jpg" className="fc_thumbnail" id="img1" onClick={this.handleShowModal} /></td>
                            <td><img src="src/Images/img_default 130.jpg" className="fc_thumbnail" id="img2" onClick={this.handleShowModal}/>  </td>
                            {this.state.view.showModal ? <Modal  changeCaption={this.changeCaption} handleHideModal={this.handleHideModal} imageSRC={this.state.imageSRC}/> : null} 
                        </tr>
                    </table>
                </div>
            </div>
        );
    }
});

var  ImageUploader = React.createClass({ //component to upload multiple images at a time
    changePic:function(e){  // preview of uploaded image
        var output = document.getElementById("img0");
        output.src = URL.createObjectURL(e.target.files[0]);
        var output = document.getElementById("img1");
        output.src = URL.createObjectURL(e.target.files[1]);
        var output = document.getElementById("img2");
        output.src = URL.createObjectURL(e.target.files[2]);
    },   
    handleChange: function(event) {  
        var temppath=URL.createObjectURL(event.target.files[0]); 
        if (event.target.files[0]) {
            var img0=URL.createObjectURL(event.target.files[0]);
            $(".img0").fadeIn("fast").attr('src',img0)
        };
        if (event.target.files[1]) {
            var img1=URL.createObjectURL(event.target.files[1]);
            $(".img1").fadeIn("fast").attr('src',img1)
        };
        if (event.target.files[2]) {
            var img2=URL.createObjectURL(event.target.files[2]);
            $(".img2").fadeIn("fast").attr('src',img2)
        };
        this.props.onUpload(event.target.files,temppath);
        if(img0==undefined){
            document.getElementById("img0").src="src/Images/img_default 130.jpg";
        }
        if(img1==undefined){
            document.getElementById("img1").src="src/Images/img_default 130.jpg";
        }
        if(img2==undefined){
            document.getElementById("img2").src="src/Images/img_default 130.jpg";
        }
    },   

    render: function() {                            
        return (
            <div className="col-sm-2 col-xs-3 abs">
                <div className="addchildpic" onChange={this.handleChange}>
                    <div className="fileUpload btn ">
                        <div className="inputchildpic">
                            <span id="clickforpic"> Add photo</span>
                        </div>
                        <input type="file" multiple="true" accept="image/*" className="addchildfoto" id="profilePhotoFileUpload"  onChange={this.changePic}/>
                    </div>
                </div>  
            </div>
        )
    }   
});      

var Modal = React.createClass({ //modal window component
    handleCaption:function(e){ 
        this.props.changeCaption(this.refs.caption.getDOMNode().value)   
    },
    hideModel:function(e){ 
        this.props.changeCaption(this.refs.caption.getDOMNode().value)   
        $(this.getDOMNode()).modal('hide'); 
    },
    componentDidMount:function(){
        $(this.getDOMNode()).modal('show');
        $(this.getDOMNode()).on('hidden.bs.modal', this.props.handleHideModal);
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
                    <img className="fc_thumbnail " src={this.props.imageSRC}/>
                    <div className="fc_caption">
                        <input type="text" ref="caption" className="form-control" onChange={this.handleCaption} placeholder="Add Caption" />
                    </div>
                </div>
                <div className="modal-footer fc_modal-footer">
                  <button type="button" className="btn" id="cancelmodalButton" data-dismiss="modal">Cancel</button>
                  <button type="button" className="btn" id="addmodalButton"  onClick={this.hideModel} >Add</button>
                </div>
              </div>
            </div>
          </div>
        )
    },
    propTypes:{
        handleHideModal: React.PropTypes.func.isRequired
    }
}); 

module.exports=AddChild;