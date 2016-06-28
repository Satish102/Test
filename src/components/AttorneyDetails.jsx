var React = require('react'); //initialising components
var Header = require('./header.jsx');
var Footer = require('./footer.jsx');
var Navigation = require('./Navigation.jsx');
var Alert = require('./alert.jsx'); //alert component
var History = require('react-router').History

Parse.initialize("MHBvhcmdlxO1KiNNhpJPMSBmDd1fDI8whzNcnUFk", "dQhzekGozWUAJqJHzQg5rvkTeKbbBZwZZ1R8UXVG"); 
var Attorneys = Parse.Object.extend("Attorneys");  
var attorney= new Attorneys();
var City = Parse.Object.extend("City");

var AttorneyDetails = React.createClass({ //main component of add/edit attorney page
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
                                        <span id="content_head"> Attorneys</span>
                                    </div>
                                </div>
                                <p className="border_line"></p>
                                <div className="row"> 
                                    <div className="col-lg-3 ">
                                        <span> Attorneys / <span id="addnew_pink">Attorney Details</span></span>
                                    </div>
                                </div> 
                            </div>
                            <Save attorneyid={this.props.params.attorneyid} />
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
        done:false,picSelect:0,parseFile:'',date:'',
        profpic:'',
        heading:'',
        submit:'',
        addpic:'',
        viewAlert:{showAlert: false},
        message:'',currenturl:''
        };
    },
    handleAttorney: function(e){ //setting states of variables w.r.t input values
        this.setState({name:this.refs.name.getDOMNode().value,mail:this.refs.mail.getDOMNode().value,phno:this.refs.ph.getDOMNode().value,webaddr:this.refs.web.getDOMNode().value,street:this.refs.street.getDOMNode().value,country:this.refs.country.getDOMNode().value,pin:this.refs.pin.getDOMNode().value,descrp:this.refs.des.getDOMNode().value});
        this.setState({city:this.refs.city.getDOMNode().value});
        this.setState({sta:this.refs.st.getDOMNode().value});          
    },
    componentDidMount: function() { //fetches values from parse for editing purpose
        document.getElementById("attorney").className='active';
        document.getElementById("imgactive_coun").style.display='none';
        document.getElementById("imgactive_agency").style.display='none';
        var val=this.props.attorneyid ;
        var self=this;        
        if(val=='add'){  
            self.setState({submit:'Add',addpic:'Add Image +',heading:'Add New Attorney',profpic:"src/Images/img_default 130.jpg"})          
            document.getElementById("addpic").className='addpic';
            document.getElementById("createdOnDiv").style.display='none';
        } 
        else if(val!=undefined){//Edit Attorney 
            self.setState({submit:'Save',addpic:'Change Image +'})
            document.getElementById("createdOnDiv").style.display='block';
            document.getElementById("addpic").className='changePic';             
            var query = new Parse.Query(Attorneys);
            query.equalTo("objectId", val);
            query.find({
                success: function(results) {   
                    for (var i = 0; i < results.length; i++) {
                        var object = results[i];

                        var month =("0" + object.createdAt.getMonth()).slice(-2) 
                        var day =("0" + object.createdAt.getDate()).slice(-2);  
                        var year =object.createdAt.getFullYear();
                        var date = day+"-"+month+"-"+year; 

                        var name=object.get('attorneyName');
                        var mail=object.get('emailId');
                        var phno=object.get('phoneNumber');
                        var webaddr=object.get('webAddress');
                        var street=object.get('street'); 
                        var country=object.get('country');
                        var pin=object.get('pinCode');
                        var descrp=object.get('description'); 
                        var heading=object.get('attorneyName');
                        self.setState({name:name,mail:mail,phno:phno,webaddr:webaddr,street:street,country:country,pin:pin,descrp:descrp,heading:heading})
                        var sta=object.get('state');
                        if(sta!=undefined){ //for setting state of 'state'
                            var statePrev =object.get('state').get('stateName'); 
                            self.setState({sta:statePrev})
                        } 
                        var city=object.get('city');
                        if(city!=undefined){ //for stting state of city 
                            var cityPrev =object.get('city').get('cityName'); 
                             self.setState({city:cityPrev})
                        }
                        if(object.get('sponsored')==true){ //for setting state of checkbox 
                             self.setState({done:true})
                        }   
                        else{
                            self.setState({done:false})
                        }

                        var imgVal=object.get('image');
                        if(imgVal==undefined){ //if no image in table, shows default image
                             self.setState({profpic:"src/Images/img_default 130.jpg"})
                        }
                        else{
                            self.setState({profpic:imgVal.url()})           
                        }
                    }
                    self.setState({date:date})                
                },
                error: function(error) {
                    alert("Error: " + error.code + " " + error.message);
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
    addAttorney: function(e){  //function saves the values into the parse db  
        var self=this;
        $('#nameForm').bootstrapValidator({ //validation
            feedbackIcons: {
                valid: 'has-success',
                invalid: 'has-error',
                validating: 'glyphicon glyphicon-refresh'
            },
            fields: {
                name: { //name validation
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
                    }
                },
                description: { //fdescription validation
                    validators: {
                        stringLength: {                                   
                            min:0,
                            message: 'Maximum 500 characters'
                        }

                    }
                },
                phone: { //phone validation
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
                            message: 'Example: www.fc.com'
                        },
                        notEmpty: {
                            message: 'Please enter agency website'
                        },
                    }
                },
                pin: {// pincode validation
                    validators: {                               
                        regexp: {
                            regexp:/^\d{5}$/,
                            message: 'Not valid pin.Enter a 5 digit pincode'
                        }
                    }
                }
            },
            onSuccess: function(e, data) {//after validation  to save data to parse
                var attorney= new Attorneys();
                var fileUploadControl = $("#profilePhotoFileUpload")[0];//uploading photo
                    if (fileUploadControl.files.length > 0) {
                        var file = fileUploadControl.files[0];
                        var name = "photo.jpg";
                        var parseFile = new Parse.File(name, file);
                        parseFile.save().then(function() {
                        }, function(error) {
                            self.setState({message:"Sorry, Unable to save photo...!!"})
                            self.handleShowAlertSuccess();
                        });
                    }
                var nme  = self.state.name;          
                var email = self.state.mail; 
                var phone = self.state.phno; 
                var web = self.state.webaddr;
                var street = self.state.street;
                var country = self.state.country;
                var pin = self.state.pin;
                var city=self.state.city;               
                var des = self.state.descrp;
                var stat = self.state.sta;
                var check=self.state.done;  
                var val=self.props.attorneyid ;
                //City
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
                            attorney.id=val;                                
                        }
                        attorney.set("city", city);                         
                        attorney.save(null, {                             
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
                                attorney.id=val;                                
                            }
                            attorney.set("state", state);                           
                            attorney.save(null, {                             
                                    success: function(agency) { 
                                    }                            
                            });                           
                        },
                        error: function(error) {
                        }
                    });   
                }        
                var query = new Parse.Query(Attorneys);
                query.equalTo("objectId", val);                
                query.find({
                    success: function(results) {                         
                        var object = results[0]; 

                        var val=self.props.attorneyid ;
                        if(val!='add'){
                            attorney.id=val;                       
                        }
                        attorney.set("image",parseFile);
                        attorney.set("attorneyName",nme);
                        attorney.set("emailId",email);
                        attorney.set("phoneNumber",phone);
                        attorney.set("webAddress",web);
                        attorney.set("description",des);
                        attorney.set("street",street);
                        attorney.set("country",country);
                        attorney.set("pinCode",pin);
                        if(check==false){
                            attorney.set("sponsored",false);
                        }
                        else{
                            attorney.set("sponsored",true);
                        }  
                        attorney.save(null, {                             
                            success: function(agency) {                                         
                                self.setState({currenturl:'/attorney',message:"Attorney details have been saved successfully !"})
                                self.handleShowAlertSuccess();      
                            },
                            error: function(error) {
                                self.handleShowAlertFail();    
                            }                           
                        });
                    }
                }); 
                e.preventDefault(); 
            }//closing of onsuccess
        });  
    },    
    handleAddImg:function(e){  
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
                    <div className="whitesection">
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
                                        <form id="nameForm" role="form" >
                                            <div className="nameinput" >
                                                <div className="addname">
                                                    <div className="form-group fc_formgroup">
                                                        <label className="inputFieldHead">Name</label>
                                                        <input type="text" className="form-control" name="name" id="addname" ref="name" value={this.state.name} onChange={this.handleAttorney} placeholder="Name" />
                                                    </div>
                                                </div>
                                                <div className="spons">
                                                    <div className="form-check">
                                                        <input type="checkbox" id="checkbox" checked={this.state.done} onChange={this.handleAttorney} onClick={this.changeCheckbox}/>
                                                        <label for="checkbox" className="inputFieldHead is_sponsored">Sponsored</label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="form-group fc_formgroup clearFloat"> 
                                                <label className="inputFieldHead">Email</label>
                                                <input type="email" className="form-control" name="email" value={this.state.mail} id="inputEmail" ref="mail" onChange={this.handleAttorney} placeholder="Email" />
                                            </div>
                                            <div className="form-group fc_formgroup"> 
                                                <label className="inputFieldHead">Phone</label>
                                                <input type="" className="form-control" id="inputPhone" name="phone" ref="ph" value={this.state.phno} onChange={this.handleAttorney}  placeholder="Phone" />
                                            </div>
                                            <div className="form-group fc_formgroup"> 
                                                <label className="inputFieldHead">Website</label>
                                                <input type="" className="form-control" name="url" id="inputWebAddress" ref="web" value={this.state.webaddr} onChange={this.handleAttorney} placeholder="Web Address" />
                                            </div>
                                            <div className="form-group fc_formgroup"> 
                                                <label className="inputFieldHead">Street</label>
                                                <input type="" className="form-control" id="inputStreet" ref="street" value={this.state.street} onChange={this.handleAttorney} placeholder="Street" />
                                            </div>
                                            <div className="form-group fc_formgroup"> 
                                                <label className="inputFieldHead">City</label>
                                                <select className=" form-control" ref="city" onChange={this.handleAttorney} id="inputCity"> //retrievng dropdown values of city
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
                                            <div className="form-group fc_formgroup"> 
                                                <label className="inputFieldHead">State</label>
                                                <select className="form-control" ref="st" onChange={this.handleAttorney} id="inputState">  //retrievng dropdown values of state
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
                                            <div className="form-group fc_formgroup"> 
                                                <label className="inputFieldHead">Country</label>
                                                <input type="" className="form-control" id="inputCountry" ref="country" value={this.state.country} onChange={this.handleAttorney} placeholder="Country" />
                                            </div>
                                            <div className="form-group fc_formgroup"> 
                                                <label className="inputFieldHead">Pincode</label>
                                                <input type="" className="form-control" id="inputPin" ref="pin" value={this.state.pin} onChange={this.handleAttorney} placeholder="Pincode" name="pin"/>
                                            </div>
                                            <div className="form-group fc_formgroup"> 
                                                <label className="inputFieldHead">Short Description</label>
                                                <textarea className="form-control" ref="des" name="description" id="inputDescription" value={this.state.descrp} onChange={this.handleAttorney} placeholder="Description"></textarea>
                                            </div>
                                            <div className="buttons">                                               
                                                <input type="submit" className="btn pull-right submitButton" id="submitButton" value={this.state.submit} onClick={this.addAttorney}></input>
                                            </div>
                                        </form>
                                    </div> 
                                    {this.state.viewAlert.showAlert ? <Alert handleHideAlert={this.handleHideAlert} message={this.state.message} currenturl={this.state.currenturl} /> : null} 
                                </div>
                            </div>
                        </div>
                    </div>
                </div>              
            </div>
        );
    }
});

module.exports=AttorneyDetails;