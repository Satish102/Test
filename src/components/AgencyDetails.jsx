var React = require('react'); //initialising  components
var Header = require('./header.jsx');
var Footer = require('./footer.jsx');
var Navigation = require('./Navigation.jsx');
var Alert = require('./alert.jsx'); //alert component
var History = require('react-router').History

Parse.initialize("MHBvhcmdlxO1KiNNhpJPMSBmDd1fDI8whzNcnUFk", "dQhzekGozWUAJqJHzQg5rvkTeKbbBZwZZ1R8UXVG"); 
var User = Parse.Object.extend("User"); 
var user = new Parse.User();  

var Agency = Parse.Object.extend("Agency"); 
var agency= new Agency();                
var AgencyDetails = React.createClass({    //parent component 
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
		                                <span id="content_head"> Agencies</span>
		                            </div>
		                        </div>
		                        <p className="border_line"></p>
		                        <div className="row"> 
		                            <div className="col-lg-3 ">
		                                <span> Agencies / <span id="addnew_pink">Agency details</span></span>
		                            </div>
		                        </div> 
		                    </div>  
		                    <div id="addDetailsContent" className="adddetails">
		                        <PinkArea />
		                        <div className="row">
		                            <div className="commoncontent">
		                                <AgencyContent agencyid={this.props.params.agencyid}/>                                                        
		                            </div>
		                        </div>                               
		                    </div>
		                </div>
		                <Footer />
		            </div> 
		        </div>
		    </div>
		);
	}
});
var PinkArea = React.createClass({     //component for heading
    render: function() { 
        return (  
            <div id="pinkDiv">
                <input id="addheading" disabled></input>
            </div> 
        )
    }
});  
var AgencyContent = React.createClass({  //component includes add.edit agency conetent area
    mixins: [History,ParseReact.Mixin],
    observe: function() { //fetches value from user and agency table
        var List=(new Parse.Query('User'))
        var agency = (new Parse.Query('Agency').include('agencyId'));
        return {
            AdminList:List ,  
            agency:agency               
        };
    },  
    getInitialState: function(){ 
        return { 
            name:'',
            mail: '',
            phno:'',
            newUsrName:'',emailPlchldr:'',imgVal:'',date:'',AgencyAdmin:[],objectIdPassed:'',
            submit:'',
            addpic:'',
            profpic:'',
            viewAlert:{showAlert: false},
            message:'',currenturl:''
        }
    },
    handlePhone:function(filteredText){                            
        this.setState({phno:filteredText})            
    },
    handleName:function(filteredText){
        this.setState({name:filteredText})
    },
    handleEmail:function(filteredText){
        this.setState({mail:filteredText   })
    },
    handleAdminTrash:function(filteredText){
        this.setState({AgencyAdmin:filteredText})
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
    componentDidMount: function() {
        var aid=localStorage.getItem('agencyId');
        var val=this.props.agencyid ; 
        var self=this;
        var adm=[];  

        self.setState({objectIdPassed:val}); 
        if(val=='add'){  //add agency page
            document.getElementById("saveAgencyButton").value     = 'Add';
            document.getElementById("addheading").value           = 'Add New Agency';
            document.getElementById("addpic").value               = 'Add Image +';
            document.getElementById("addpic").className           = 'addpic';
            document.getElementById("newUnameAgency").value       = 'Add new user name';
            document.getElementById("createdOnDiv").style.display ='none';  
            document.getElementById("mngeAgncyAdmn").style.display='none';      
        }
        else if(val!=undefined){//Edit Agency
            document.getElementById("createdOnDiv").style.display ='block';
            document.getElementById("saveAgencyButton").value     = 'Save';
            document.getElementById("addpic").value               ='Change Image +';
        	document.getElementById("addpic").className           ='changePic';
            document.getElementById("saveAgencyButton").className ='btn btn-warning pull-right';
            document.getElementById("newUnameAgency").value       ='User Name';                        
            self.setState({currenturl:'/agency'});
            var query = new Parse.Query(Agency);
            query.equalTo("objectId", val);
            query.find({
                success: function(results) {   
                    for (var i = 0; i < results.length; i++) {
                        var object = results[i];                                   
                        document.getElementById("addheading").value=object.get('agencyName'); 

                        var month =("0" + object.createdAt.getMonth()).slice(-2) 
                        var day =("0" + object.createdAt.getDate()).slice(-2);  
                        var year =object.createdAt.getFullYear();
                        var date = day+"-"+month+"-"+year;  
                        var oid=object.id; 
                        var agencyQuery = new Parse.Query(Agency);
                        agencyQuery.equalTo("objectId", oid);
                        var userQuery = new Parse.Query(Parse.User);
                        userQuery.matchesQuery("agencyId",  agencyQuery);
                        userQuery.find({
                            success: function(results) {    
                                for (var i = 0; i < results.length; i++) {                                        
                                    var object = results[i];  
                                    adm.push(object.get("username"));                                            
                                }
                                self.setState({AgencyAdmin:adm}); // AgencyAdmin has list of admins corresponding to current Agency. 
                            }
                        });
                    }   
                    var namePrev =object.get('agencyName');    
                    var emailPrev=object.get('emailid');
                    var phonePrev=object.get('phoneNumber');
                    var imgVal=object.get('agencyLogo');
                    if(imgVal==undefined){ //if no image in table, shows default image
                        document.getElementById("addimg").src="src/Images/img_default 130.jpg";
                    }
                    else{
                        document.getElementById("addimg").src=imgVal.url();                     
                    }
                    self.setState({name:namePrev}) 
                    self.setState({mail:emailPrev})
                    self.setState({phno:phonePrev})
                    self.setState({imgVal:imgVal})
                    self.setState({date:date})                                           
                },
                error: function(error) {
                    alert("Error: " + error.code + " " + error.message);
                }
            });
        }
        document.getElementById("agency").className='active';
        document.getElementById("imgactive_coun").style.display='none';
        document.getElementById("imgactive_attor").style.display='none';      
    },         
    handleAddBtn:function(e){  
        var self=this;
    $(document).ready(function() { //validation
        $('#agencyForm').bootstrapValidator({
            feedbackIcons: {
                valid: 'has-success',
                invalid: 'has-error',
                validating: 'glyphicon glyphicon-refresh'
            },
            fields: {
                name: {
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
                email: {
                    validators: {                              
                        notEmpty: {
                            message: 'Please enter the email Id'
                        },                              
                        regexp: {
                            regexp: '^[^@\\s]+@([^@\\s]+\\.)+[^@\\s]+$',
                            message: 'Please enter a valid email Id'
                        }
                    }
                },
                phone: {
                    validators: {   
                        stringLength: {
                            min: 10,
                            max:10,
                            message: 'Phone number should be 10 digits'
                        }, 
                        notEmpty: {
                                message: 'Please enter the contact number'
                            },                           
                        regexp: {
                            regexp:/^\d+$/ ,
                            message: 'Not valid phone.Enter only digits'
                        }
                    }
                },
            }
        })
            .on('success.form.bv', function(e) {
                $('#success_message').slideDown({ opacity: "show" }, "slow") 
                    $('#contact_form').data('bootstrapValidator').resetForm();
               
                $.post($form.attr('action'), $form.serialize(), function(result) {

                }, 'json');
            });
    }); 
             
                var val=self.props.agencyid ; 
                var name = self.state.name;
                var phone = self.state.phno;
                var email = self.state.mail; 
                var agency= new Agency();
                var fileUploadControl = $("#profilePhotoFileUpload")[0]; 
                if (fileUploadControl.files.length > 0) {
                    var file = fileUploadControl.files[0];
                    var picname = "photo.jpg";
                    var parseFile = new Parse.File(picname, file);
                    parseFile.save().then(function() {
                    }, function(error) {
                        self.setState({message:"Photo could not be saved. Please try again !"})
                        self.handleShowAlertFail();
                    });              
                                             
                }
                var query = new Parse.Query(Agency);
                query.equalTo("objectId", val);         
                query.find({
                    success: function(results) {  
                        var object = results[0];  
                        var val=self.props.agencyid ; 
                        if(val!='add'){
                            agency.id=val;
                    }  
                    agency.set("agencyName",name);                                      
                    agency.set("phoneNumber",phone); 
                    agency.set("emailid",email); 
                    agency.set("agencyLogo",parseFile);  
                    if(name.length===0 || name.length <= 2){
                        return;
                     } 
                     else if(phone.length<10 || email.length===0){
                        return;
                    }   
                    agency.save(null, {                             
                        success: function(agency) { 
                            self.setState({message:"Agency details have been saved successfully !"})
                            self.handleShowAlertSuccess();
                            document.getElementById("saveAgencyButton").value='Save'; 
                            document.getElementById("saveAgencyButton").className='btn pull-right';
                            document.getElementById("saveAgencyButton").disabled=true;  
                            document.getElementById("mngeAgncyAdmn").style.display='block';
                        },
                        error: function(error) {
                            self.handleShowAlertFail();
                        }  

                    });  
                },
                error: function(error) {
                    self.handleShowAlertFail();
                }
                });
       
    },
    render: function() {                         
        return (                     
            <div> 
                <AddImage handleAddImg={this.handleAddImg} handleImgSrc={this.handleImgSrc} imgVal={this.state.imgVal} dateVal={this.state.date}/>
                <div className="col-sm-8 col-xs-12">
                    <div id="addUserDetails">
                        <form id="agencyForm" role="form" >  
                            <NameEmail name={this.handleName} nameVal={this.state.name}  mail={this.handleEmail}  emailVal={this.state.mail}/>                                                                 
                            <div id="phoneEmail">
                                <Phone phno={this.handlePhone} phoneVal={this.state.phno} />
                                <div className="buttons">
                                    <input type="submit" className="btn pull-right " id="saveAgencyButton" onClick={this.handleAddBtn} />
                                </div>
                                <div className="clearFloat"></div>
                                <div id="mngeAgncyAdmn">
                                    <ManageAgncyAdmn  agencyid={this.props.agencyid} AgencyAdmin={this.state.AgencyAdmin} email={this.state.mail} objectIdPassed={this.state.objectIdPassed}/>
                                </div>
                            </div>                                          
                            <div className="clearFloat"></div>  
                        </form>
                    </div> 
                    {this.state.viewAlert.showAlert ? <Alert handleHideAlert={this.handleHideAlert} message={this.state.message} currenturl={this.state.currenturl} /> : null} 
                </div> 
            </div>                    
        )
    }
}); 

var AddImage = React.createClass({   
    changePic:function(e){  // preview of uploaded image
        var output = document.getElementById("addimg");
        output.src = URL.createObjectURL(e.target.files[0]);  
    },           
    render: function() {                  
        return (
            <div className="col-sm-4 col-xs-12 imagesection">
                <div id="addimge" onClick={this.handleAddImg}>
                    <img  id="addimg" ref="img" src="src/images/img_default 130.jpg" />
                    <div className="fileUpload btn pic_select">
                        <input id="addpic" disabled></input>
                        <input type="file" id="profilePhotoFileUpload" accept="image/*" className="addpicture" onChange={this.changePic}/>
                    </div>
                </div>
                <div id="createdOnDiv"><span id="createdOnText"> Created on:</span><input id="creat" value={this.props.dateVal}></input> </div>
            </div>
        )
    }
});  	     

var NameEmail = React.createClass({              
    handleName:function(e){ 
        this.props.name(this.refs.name.getDOMNode().value)            	
    }, 
    handleEmail:function(e){    
        this.props.mail(this.refs.mail.getDOMNode().value)
    },
    render: function() {                                    
        return (  
            <div>
	            <div className="form-group fc_formgroup">
	                <label className="inputFieldHead">Name</label>
	                <input type="text" className="form-control fc_formcontrol" name="name" id="addname" ref="name" onChange={this.handleName} placeholder="Name" value={this.props.nameVal}/>
	            </div>
	            <div className="form-group fc_formgroup clearFloat"> 
		            <label className="inputFieldHead">Email</label>
		            <input type="email" className="form-control fc_formcontrol" name="email" id="email" ref="mail"  onChange={this.handleEmail} placeholder="Email" value={this.props.emailVal}/>
		        </div>
		    </div>
        )
    }
}); 

var Phone = React.createClass({  
    getInitialState: function() {
        return {phoneArray: [''],plusCount:0}
    },                 
    handlePhone:function(e){    
        this.props.phno(this.refs.phone.getDOMNode().value)       
    },  
    render: function() { 
        return (   
            <div className="form-group fc_formgroup" id="phoneAgency">
                <label className="inputFieldHead">Phone</label>
                <input type="" className="form-control fc_formcontrol" name="phone" placeholder="Phone" onChange={this.handlePhone} ref="phone" id="phone" value={this.props.phoneVal}/>                          
            </div>  
        )
    }
}); 

var ManageAgncyAdmn = React.createClass({ 
    getInitialState: function() {
        return {emailArray: [''],plusCount:0,results:[''],newUsrName:''}
    },
    getDefaultProps: function() {
        return {
            emailCount:0,emailArray: ['']
        };
    },           
    render: function() {  
                         
        return (                  
            <div>                      
                <span id="mngeAgncyAdmnText">Manage Agency admin</span>  
                <span className="clearFloat"></span>
				<AgencyRow data={this.props.AgencyAdmin}  email={this.props.email} />                       
            </div>                  
        )
    }
}); 

var AgencyRow=React.createClass({ 
    getInitialState: function() {
        return {emailArray: [''],plusCount:0,results:[''],newUsrName:'',crntUser:''                   
        }
    },
    componentDidMount: function() {                
        this.setState({emailArray:this.props.data});
        var self = this;
		var usr2 = Parse.User.current();//gives current user
		usr2.fetch().then(function(fetchedUser){
			var uname2 = fetchedUser.getUsername();
			self.state.crntUser =uname2 ; 
		}, function(error){				   
		});
    },             
    handleEmailPlus:function(){   
        if (this.refs.mail.getDOMNode().value!="") { //Input field for agency username contains value
                        /********************USER SIGN UP********************/ 
            var self =this;
            this.setState({plusCount:2});  
            var query = new Parse.Query(Agency);
            var chk=this.props.email;
            query.equalTo("emailid",chk);
            query.find({
                success: function(results) {
                    for (var i = 0; i < results.length; i++) {
                        var object = results[i];                                      
                    }     
                    var user = new Parse.User();//////needed
                    var a = new Parse.Object("Agency"); 
                    a.id = object.id;
                    user.set("agencyId", a);  

                    var uname = self.state.newUsrName; 
                    var randomstring = Math.random().toString(36).slice(-8);  
                    var sessionToken= Parse.User.current().getSessionToken();
                    user.set("username", uname);
                    user.set("password", randomstring);
                    user.set("userType","AA");
                    user.set("email", uname);
                                    
                    user.signUp(null, { 
                        success: function (user) {								        
							Parse.User.become(sessionToken).then(function (user) {
								var newItems =self.state.emailArray.concat(self.refs.mail.getDOMNode().value);                                                                    
                                self.setState({emailArray:newItems});
                                var usr2 = Parse.User.current();
								usr2.fetch().then(function(fetchedUser){
    								var uname2 = fetchedUser.getUsername();
    								self.state.crntUser =uname2 ;
    								}, function(error){
								});	
                                document.getElementById("mail").value="";//clears input field 
						}, function (error) {									            
							alert('Agency admin could not be added. Please try again');
						});
                         //Send password to Agency Admin
                        var params={}
                        params.Body="<h5>Here are your credentials. Please change password on your first login</h5>"
                        params.Body=params.Body+'<h5>User Name:'+' '+uname+'</h5>'
                        params.Body=params.Body+'<h5> Password :'+' '+randomstring+'</h5>'
                        params.Subject='Foster Care Credentials - Confidential';
                        params.ToEmail=uname;
                        Parse.Cloud.run('sendMail', params, {
                            success: function() {
                            },
                             error: function(error) {
                            }
                        });
                        // End
					    },
                        error: function(user,error) {
                        }
                        });                                 
                },
                error: function(error) {
                }
            }); 	
        }
    }, 
    handleNewUsrName:function(e){  
        this.setState({newUsrName:this.refs.mail.getDOMNode().value});
    },
    render:function(){                
        var self=this;            	
        if(self.state.plusCount==0){
            this.state.emailArray = this.props.data;
        }  
        var list = this.state.emailArray.map(function(itm,i){
        if(itm.length==0){                		
            document.getElementById("agncyAdmnUL").className="agncyAdmnUL1";
        }
        else{                		
            document.getElementById("agncyAdmnUL").className="agncyAdmnUL2"; 
        }
        return(
            <div id="adminTrashBorder">
	           <div id="adminTrashDiv">
	                <div id="admnTrash">
			            <span id="adminList"> {itm} </span><br />			                            
			        </div>
	                <p id="borderLineBtm"></p>    
	            </div>
	       </div>
        )
    },self);
        return (
            <div>                             
                <ul id="agncyAdmnUL">{list} </ul>
                <input className="inputFieldHead" id="newUnameAgency" disabled></input>
                <div className="clearFloat"></div>
                <div className="emailPlus">                         
                    <div className="form-group fc_formgroup" id="emailAgency">
                        <input type="email" className="form-control fc_formcontrol" placeholder="Email ID" onChange={this.handleNewUsrName} ref="mail" id="mail"/>                               
                        <div  id="plusIcon" ref="phonePlus" onClick={this.handleEmailPlus}></div> 
                    </div>                                                     
                </div>
            </div>
        )    
    }
});	

module.exports=AgencyDetails;
