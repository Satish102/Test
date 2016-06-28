var React = require('react'); 
var Header = require('./header.jsx');//header component
var Footer = require('./footer.jsx');//footer component
var Navigation = require('./Navigation.jsx');//navigation component
var Alert = require('./alert.jsx'); //alert component
var History = require('react-router').History

Parse.initialize("MHBvhcmdlxO1KiNNhpJPMSBmDd1fDI8whzNcnUFk", "dQhzekGozWUAJqJHzQg5rvkTeKbbBZwZZ1R8UXVG"); 
var Counsellor = Parse.Object.extend("Counsellor");
var counsellor = new Counsellor(); 
var City = Parse.Object.extend("City");

var CounsellorDetails = React.createClass({ //counsellor add/edit page main component
    render: function() {
        return (
            <div id="maincontent">
                <Header /> 
                <div id="content">
                    <div className="navsection ">
                        <Navigation /> 
                    </div> 
                    <div className="col-sm-12 col-xs-12 contentsection"> 
                        <div className="addside">
                            <div className="headings">
                                <div className="row"> 
                                    <div className="col-lg-3 ">
                                        <span id="content_head"> Counsellors</span>
                                    </div>
                                </div>
                                <p className="border_line"></p>
                                <div className="row"> 
                                    <div className="col-lg-3 ">
                                        <span>Counsellors / <span id="addnew_pink">Counsellors Details</span></span>
                                    </div>
                                </div> 
                            </div>
                            <Save counsellorid={this.props.params.counsellorid}/>
                        </div>
                        <Footer /> 
                    </div> 
                </div>
             </div>   
        );
    }
});

var Save = React.createClass({ //save component
    mixins: [History,ParseReact.Mixin],
    observe: function(){ //for acquiring city and state dropdown values
      var cty = (new Parse.Query('City').include('city'));
      var st=(new Parse.Query('State').include('state'));
      return {
        cities: cty , 
        sts:st  
        }
    }, 
    getInitialState: function(){ //initialising states 
      return { 
        name:'',
        mail: '',
        phno:'',
        webaddr:'',
        city:'',
        sta:'',
        descrp:'',
        street:'',
        country:'',
        pin:'',
        heading:'',
        done:false,
        picSelect:0,parseFile:'',date:'',
        submit:'',
        addpic:'',
        profpic:'',
        viewAlert:{showAlert: false},
        message:'',currenturl:''
        };
    },

    handleCounsellor: function(e){ //setting states of variables w.r.t input values
        this.setState({name:this.refs.name.getDOMNode().value,mail:this.refs.mail.getDOMNode().value,phno:this.refs.ph.getDOMNode().value,webaddr:this.refs.web.getDOMNode().value,street:this.refs.street.getDOMNode().value,country:this.refs.country.getDOMNode().value,pin:this.refs.pin.getDOMNode().value,descrp:this.refs.des.getDOMNode().value});
        this.setState({city:this.refs.city.getDOMNode().value});
        this.setState({sta:this.refs.st.getDOMNode().value});          
    },  
    componentDidMount: function() {
        var self=this;
        document.getElementById("counsellor").className='active';
        document.getElementById("imgactive_agency").style.display='none';
        document.getElementById("imgactive_attor").style.display='none';
        var val=this.props.counsellorid ; 
        var self=this;
        if(val=='add'){ //add counsellor
            self.setState({submit:'Add',addpic:'Add Image +',heading:'Add New Counsellor',profpic:"src/Images/img_default 130.jpg"})
            document.getElementById("addpic").className='addpic';
            document.getElementById("createdOnDiv").style.display='none';
            
        } 
        else if(val!=undefined){//Edit Counsellor
            document.getElementById("createdOnDiv").style.display='block';
            document.getElementById("addpic").className='changePic';   
            self.setState({submit:'Save',addpic:'Change Image +'})

            var query = new Parse.Query(Counsellor);
            query.equalTo("objectId", val);
            query.find({
              success: function(results) {   
                for (var i = 0; i < results.length; i++) {
                    var object = results[i];   
                    //setting date (created on) of the counsellor
                    var month =("0" + object.createdAt.getMonth()).slice(-2) 
                    var day =("0" + object.createdAt.getDate()).slice(-2);  
                    var year =object.createdAt.getFullYear();
                    var date = day+"-"+month+"-"+year; 

                    var imgVal=object.get('image');
                    if(imgVal==undefined){ //if no image in table, shows default image
                         self.setState({profpic:"src/Images/img_default 130.jpg"})
                    }
                    else{
                        self.setState({profpic:imgVal.url()})           
                    }
                    //setting states of input fields with parse db values
                    var name=object.get('CounsellorName');
                    var mail=object.get('emailId');
                    var phno=object.get('phoneNumber');
                    var webaddr=object.get('webAddress');
                    var street=object.get('street');
                    var country=object.get('country');
                    var pin=object.get('pinCode');
                    var descrp=object.get('description');
                    var sta=object.get('state');
                    if(sta!=undefined){ // setting state value
                        var statePrev =object.get('state').get('stateName'); 
                        self.setState({sta:statePrev})
                    } 
                    var city=object.get('city');
                    if(city!=undefined){ //setting city value
                        var cityPrev =object.get('city').get('cityName'); 
                         self.setState({city:cityPrev})
                    }

                    if(object.get('sponsored')==true){  //setting checkbox value
                         self.setState({done:true})
                    }   
                    else{
                        self.setState({done:false})
                    }
                    self.setState({name:name,mail:mail,phno:phno,webaddr:webaddr,street:street,country:country,pin:pin,descrp:descrp,heading:name});
                }  
                self.setState({date:date})               
            },
            error: function(error) {
                self.setState({message:"Sorry, Unable to fetch data from parse...!!"})
                self.handleShowAlertSuccess();
            }            
            });           
        }  
            
    },
    handleHideAlert:function(){ //for hiding modal window
        this.setState({viewAlert:{showAlert: false}})
    },
    handleShowAlertSuccess:function(e){ //set states of values wen modal window is shown
        this.setState({viewAlert:{showAlert: true}});
    },
    handleShowAlertFail:function(e){ //set states of values wen modal window is shown
        this.setState({viewAlert:{showAlert: true}, message:"Sorry, unable to save ..."});
    },
    
    addCounsellor: function(e){   
        var self=this;
            $('#nameForm').bootstrapValidator({ //validations 
                    feedbackIcons: {
                        valid: 'has-success',
                        invalid: 'has-error',
                        validating: 'glyphicon glyphicon-refresh'
                    },
                    fields: {
                        name: { //validation for name
                            validators: {
                                stringLength: {
                                    min: 2,
                                    max:20,
                                    message: 'Minimum 2 , maximum 30 characters'
                                },
                                notEmpty: {
                                    message: 'Please enter the name'
                                },                            
                                regexp: {
                                    regexp:/^[a-zA-Z ]*$/,
                                    message: 'Not valid name.Enter only alphabets'
                                }

                            }
                        },
                        email: { //email validation
                            validators: {                                                               
                                regexp: {
                                    regexp: '^[^@\\s]+@([^@\\s]+\\.)+[^@\\s]+$',
                                    message: 'Not valid email'
                                },
                                notEmpty: {
                                    message: 'Please enter the email address'
                                },
                            },
                            
                        },
                        description: { //description validation
                            validators: {
                                stringLength: {                                   
                                    min:0,
                                    message: 'Maximum 500 characters'
                                }

                            }
                        },
                        phone: { //phone no validation
                            validators: {   
                                stringLength: {
                                    min: 10,
                                    max:10,
                                    message: 'Phone number should be 10 digits'
                                },                            
                                regexp: {
                                    regexp:/^\d+$/ ,
                                    message: 'Not valid phone.Enter only digits'
                                },
                                notEmpty: {
                                    message: 'Please enter the contact number'
                                },
                            }
                        },
                        url: { //url validation
                            validators: {                               
                                regexp: {
                                   regexp:/(https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})/,
                                   message: 'Example: www.fc.com',
                                },
                                notEmpty: {
                                    message: 'Please enter agency website'
                                },
                            }
                        },
                        pin: { //pincode validation
                            validators: {                               
                                regexp: {
                                    regexp:/^\d{5}$/,
                                    message: 'Not valid pin.Enter a 5 digit pincode'
                                },
                            }
                        }
                    },

                    onSuccess: function(e, data) {//this section before submit (after validation success)

                        var counsellor = new Counsellor();
                        var fileUploadControl = $("#profilePhotoFileUpload")[0];
                       
                         if (fileUploadControl.files.length > 0) { //uploading image
                            var file = fileUploadControl.files[0];
                            var name = "photo.jpg";
                            var parseFile = new Parse.File(name, file); //setting and saving parse image file
                            parseFile.save().then(function() {
                                }, function(error) {
                                    self.setState({message:"Sorry, Unable to save photo...!!"})
                                    self.handleShowAlertSuccess();
                                });
                        }   
                        // setting states of edited values 
                        var name = self.state.name;        
                        var email = self.state.mail; 
                        var phone = self.state.phno; 
                        var web = self.state.webaddr;
                        var street =self.state.street;
                        var country = self.state.country;
                        var pin = self.state.pin;
                        var city=self.state.city;
                        var des = self.state.descrp;
                        var stat = self.state.sta;
                        var check= self.state.done;   

                        var val=self.props.counsellorid ;                        
            
                        if(city!=''){
                            var City = Parse.Object.extend("City"); 
                            var query = new Parse.Query(City);
                            query.equalTo("cityName",city);
                            query.find({
                              success: function(results) {          
                                var object = results[0]; 
                                var objectId=object.id;                                       
                                var city = new Parse.Object("City");                                 
                                city.id = object.id;                                

                                if(val!='add'){//Edit Attorney 
                                        counsellor.id=val;                                        
                                }
                                counsellor.set("city", city);                            
                                counsellor.save(null, {                             
                                    success: function(agency) { 
                                    }                            
                                });                            
                              },
                              error: function(error) {
                              }
                            });   
                        }
                        //State  
                        if(stat!=''){
                            var State = Parse.Object.extend("State"); 
                            var querys = new Parse.Query(State);
                            querys.equalTo("stateName",stat);
                            querys.find({
                                success: function(results) {            
                                    var obj = results[0];
                                    var state = new Parse.Object("State"); 
                                    state.id = obj.id;  

                                     if(val!='add'){//Edit Attorney 
                                        counsellor.id=val;                                        
                                    }
                                    counsellor.set("state", state);                                  
                                    counsellor.save(null, {                             
                                        success: function(agency) { 
                                        }                            
                                    });                                   
                                },
                                error: function(error) {
                                }
                            });   
                        }   
                          
                        var query = new Parse.Query(Counsellor);
                        query.equalTo("objectId", val);                
                        query.find({
                            success: function(results) {                         
                                var object = results[0];                                  
                                var val=self.props.counsellorid ; 
                                if(val!='add'){
                                    counsellor.id=val; 
                                }
                                //storing datas to parse
                                counsellor.set("image",parseFile);  
                                counsellor.set("CounsellorName",name);
                                counsellor.set("emailId",email);
                                counsellor.set("phoneNumber",phone);
                                counsellor.set("webAddress",web);
                                counsellor.set("description",des);
                                counsellor.set("street",street);
                                counsellor.set("country",country);
                                counsellor.set("pinCode",pin);
    
                                if(check==false){
                                    counsellor.set("sponsored",false);
                                }
                                else{
                                    counsellor.set("sponsored",true);
                                }                         
                                counsellor.save(null, {                             
                                    success: function(agency) { 
                                        self.setState({currenturl:'/counsellor',message:"Counsellor details have been saved successfully !"})
                                        self.handleShowAlertSuccess();
                                    }                            
                                });  
                                              
                            }
                        }); 
                        e.preventDefault();  
                    }//closing of onsuccess
            });            
    },
    handleAddImg:function(e){  //for adding image
         this.setState({parseFile:profilePhotoFileUpload});  
    },
    changePic:function(e){  // preview of uploaded image
        var output = document.getElementById("addimg");
        output.src = URL.createObjectURL(e.target.files[0]);    
    },
    changeCheckbox:function(e){ //onclick of sponsored checkbox
        this.setState({done:!this.state.done});
    },  
    render: function() {  
        return (
            <div>
                <div id="addDetailsContent" className="adddetails"> 
                    <div id="pinkDiv">
                          <input id="addheading" value={this.state.heading} disabled></input>
                    </div>                    
                    <div className="row">
                        <div className="commoncontent">
                            <div className="col-sm-4 col-xs-12 imagesection">
                                <div id="addimge" onClick={this.handleAddImg}>
                                    <img id="addimg" src={this.state.profpic} />
                                    <div className="fileUpload btn pic_select">
                                        <input id="addpic" value={this.state.addpic} disabled></input>
                                        <input type="file" id="profilePhotoFileUpload" accept="image/*" className="addpicture" onChange={this.changePic} />
                                    </div>
                                </div>
                                <div id="createdOnDiv"><span id="createdOnText"> Created on  :</span><input id="creat" value={this.state.date}></input> </div>
                            </div>
                            <div className="col-sm-8 col-xs-12">
                                <div id="addUserDetails">
                                    <form role="form" id="nameForm">
                                        <div className="nameinput">
                                            <div className="addname">
                                                <div className="form-group fc_formgroup">
                                                    <label className="inputFieldHead">Name</label>
                                                    <input type="text" className="form-control" id="addname" name="name" ref="name" value={this.state.name} onChange={this.handleCounsellor} placeholder="Name" />
                                                </div>
                                            </div>
                                            <div className="spons">
                                                <div className="form-check">
                                                    <input type="checkbox" id="checkbox" checked={this.state.done} onChange={this.handleCounsellor} onClick={this.changeCheckbox}/>
                                                    <label for="checkbox" className="inputFieldHead is_sponsored">Sponsored</label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group fc_formgroup clearFloat"> 
                                            <label className="inputFieldHead">Email</label>
                                            <input type="email" className="form-control" id="inputEmail" name="email" ref="mail" value={this.state.mail} onChange={this.handleCounsellor} placeholder="Email" />
                                        </div>
                                        <div className="form-group"> 
                                            <label className="inputFieldHead">Phone</label>
                                            <input type="" className="form-control" id="inputPhone" name="phone" ref="ph" value={this.state.phno}  onChange={this.handleCounsellor}  placeholder="Phone" />
                                        </div>
                                        <div className="form-group"> 
                                            <label className="inputFieldHead">Website</label>
                                            <input type="" className="form-control" name="url" id="inputWebAddress" ref="web"  value={this.state.webaddr} onChange={this.handleCounsellor} placeholder="Web Address" />
                                        </div>
                                        <div className="form-group"> 
                                            <label className="inputFieldHead">Street</label>
                                            <input type="" className="form-control" id="inputStreet" ref="street" value={this.state.street} onChange={this.handleCounsellor} placeholder="Street" />
                                        </div>
                                        <div className="form-group"> 
                                            <label className="inputFieldHead">City</label>
                                            <select className=" form-control" ref="city" value={this.state.city} onChange={this.handleCounsellor} id="inputCity"> //retrievng dropdown values of city
                                                <option value="" disabled selected>Select your city</option>
                                                { 
                                                    this.data.cities.map(function(c){
                                                        return (   
                                                                <option key={c.objectId} className="list-group-item">{c.cityName}</option>                                                                
                                                        )
                                                    })
                                                }
                                            </select>
                                        </div>
                                        <div className="form-group"> 
                                            <label className="inputFieldHead">State</label>
                                            <select className="form-control" ref="st" value={this.state.sta} onChange={this.handleCounsellor} id="inputState">  //retrievng dropdown values of state

                                                <option value="" disabled selected>Select your state</option>
                                                { 
                                                    this.data.sts.map(function(s){
                                                        return (   
                                                                <option key={s.objectId} className="list-group-item">{s.stateName}</option>                                                               
                                                        )
                                                    })
                                                }
                                            </select>
                                        </div>
                                        <div className="form-group"> 
                                            <label className="inputFieldHead">Country</label>
                                            <input type="" className="form-control" id="inputCountry" ref="country" value={this.state.country} onChange={this.handleCounsellor} placeholder="Country" />
                                        </div>
                                        <div className="form-group"> 
                                            <label className="inputFieldHead">Pincode</label>
                                            <input type="" className="form-control" id="inputPin" ref="pin" value={this.state.pin} onChange={this.handleCounsellor} placeholder="Pincode"  name="pin"/>
                                        </div>
                                        <div className="form-group"> 
                                            <label className="inputFieldHead">Short Description</label>
                                            <textarea className="form-control" name="description" ref="des" value={this.state.descrp} id="inputDescription" onChange={this.handleCounsellor} placeholder="Description"></textarea>
                                        </div>
                                        <div className="buttons">                                               
                                            <input type="submit" className="btn pull-right submitButton" id="submitButton" value={this.state.submit} onClick={this.addCounsellor}></input>
                                        </div>
                                    </form>
                                </div> 
                                {this.state.viewAlert.showAlert ? <Alert handleHideAlert={this.handleHideAlert} message={this.state.message} currenturl={this.state.currenturl} /> : null}
                            </div>
                        </div>
                    </div>                    
                </div>              
            </div>
        );
    }
});
module.exports=CounsellorDetails;