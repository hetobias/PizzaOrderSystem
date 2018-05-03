import React, {Component} from 'react';
import './DeliveryHome.css';
import { BrowserRouter as Router,Redirect, Route, Switch,Link} from 'react-router-dom';
import * as firebase from 'firebase'
import {Avatar,
        Button,
        Card,
        CardActions,
        CardContent,
        CardHeader,
        Divider,
        Dialog,
        DialogTitle,
        DialogContent,
        DialogContentText,
        IconButton, 
        InputAdornment,
        LinearProgress, 
        List,
        ListItem,
        ListItemText,
        MenuItem,
        Snackbar, 
        TextField, 
        Typography } from 'material-ui';
import MenuIcon from 'material-ui-icons/Menu';
import Logout from 'material-ui-icons/ExitToApp';
import User from 'material-ui-icons/Face';
import Details from 'material-ui-icons/LibraryBooks';
import axios from 'axios';
import Close from 'material-ui-icons/Close';
import Comment from 'material-ui-icons/Comment';

class DeliveryHome extends Component{
  constructor(props) {
        super(props);
        this.state = {
            deliverer:{
                delivererID: '',
                name: '',
                shopID: '',
                orderID: '',
                avgRating:'',
                rating:'',
                warning: '',
                comment:'',  
                warned: false
            },
            
            user:{
                displayName:'',
                profilePic:null,
                cuid: null
            },
            
            userData:{
              orderList: null,
              orders:null,
              ordersLoading:true,
              ordersMessage: 'Getting Your Orders ...'
            },
            showDetails:false,
            selectedIndex: null,
            processing: false,
            notify: false,
            notifyMessage: '',
            step1complete: false,
            selectedShop: null,
            
        };
        this.fireBaseListener = null;
        this.authListener = this.authListener.bind(this);
        this.showDetails = this.showDetails.bind(this);
        this.hideDetails = this.hideDetails.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.updateCustomer = this.updateCustomer.bind(this);
  }
    
    handleChange(e) {
        this.setState({
        [e.target.name]: e.target.value
      });
    }
    
     handleSubmit(e) {
      e.preventDefault();
  /*    const itemsRef = firebase.database().ref('TestByMelvin');
      const item = {
      comment: this.state.comment
  }
      itemsRef.push(item);
      this.setState({
      comment:''
  });
 
*/
         
  }
   
    componentDidMount(){
       this.authListener();
    }
    
    componentWillUnmount(){
     this.fireBaseListener && this.fireBaseListener();
     this.authListener = undefined;
    }
    
    authListener(){
        this.fireBaseListener = firebase.auth().onAuthStateChanged((user) =>{
           if(user){
               firebase.database().ref(`Users/${user.uid}/`).once('value', 
                    (snap)=>{
                        this.setState({
                            user: {
                                displayName: user.displayName,
                                profilePicture: user.photoURL,
                                uid: user.uid
                            },
                            userData : {
                                variant: snap.val().type,
                                orderList: snap.val().orders
                                
                            }
                        })
               
              
               
                    // if (snap.val()){
                    //         axios.post('https://us-central1-pos-tagmhaxt.cloudfunctions.net/getUserOrderData',{orders: snap.val().orders})
                    //         .then((result)=>{
                    //             if (result.data.orderData.length >= 1){
                    //                 const old = this.state.userData;
                    //                 old['orders'] = result.data.orderData;
                    //                 old['ordersMessage'] = '';
                    //                 old['ordersLoading'] = false;
                    //                 this.setState({
                    //                     userData : old
                    //                 });
                    //             } else {
                    //                 const old = this.state.userData;
                    //                 old['ordersLoading'] = false;
                    //                 old['ordersMessage'] = "You don't have any orders yet.";
                    //                 this.setState({
                    //                     userData: old
                    //                 })
                    //             }
                    //         }).catch((error)=>{
                    //             var old = this.state.userData;
                    //             old['ordersLoading'] = false;
                    //             old['ordersMesage'] = "Couldn't get your orders 😟";
                    //             this.setState({
                    //                 userData: old                               
                    //             })
                    //         })
                    //     }
                   
               })
            }
        });
    }
    
    updateCustomer(index){      
        const uid = this.state.userData.orders[index].uid;
        firebase.database().ref(`Users/${uid}`).once('value').then ((snap) =>{
            if(snap.val()){
                var customerData = snap.val();
                var a = customerData.averageRating * customerData.ratingCount;
                var b = a + this.state.userData.orders[index].customerRating;
                var c = b / (customerData.ratingCount +1);
                customerData.averageRating = c;
                customerData.ratingCount +=1;
                firebase.database().ref(`Users/$(uid)`).set(customerData).then (()=>{firebase.database().ref(`Orders/${this.state.userData.orderList[index]}`).set(this.state.userData.orders[index]).then(()=>{
                        this.setState({
                            processing:false                
                        })
                    })
                })
            }                                                         
        })
    }
    
    showDetails(index){
        this.setState({
            selectedIndex: index,
            showDetails:true
        })
    }
    
    hideDetails(){
        this.setState({
            selectedIndex:null,
            showDetails: false
        })
    }
   
    render() {
        const cardDescription = {
        maxWidth: 345,
        border: '5px solid black',      
};
        
        return ( 
            <div style={{padding:'50px 100px'}}>
                <div className="signup-page"> 
                    <div className="customer-header" data-aos = "fade-up">
                        <Avatar 
                            alt={this.state.user.displayName}
                            src={this.state.user.profilePicture}
                            className="user-avatar"/>
                        
                        <Typography variant="display2">
                            Welcome, {this.state.user.displayName}  
                        </Typography>
                        <Button size="small"><User style={{marginRight:'5px'}} />Account</Button>
                        <Button onClick={()=>{firebase.auth().signOut();}} size="small"><Logout style={{marginRight:'5px'}}/>signout</Button>
                    <Divider />
                    </div>
                </div>

          {/* past order section */}
            
                <div style={{marginTop:'25px',textAlign:'center'}}>
                        <Typography variant="display1" className="push-down" color ="inherit" data-aos ="fade-up">
                            Your Past Orders 
                        </Typography>  

                        <Typography variant="subheading" className="push-down">
                            Check details, rate and leave comments for your past orders.
                        </Typography>
                    <Divider style ={{marginTop:'10px'}}/>
                </div>
           
            <div className="past-orders" data-aos="fade-up">

            
            </div>
               
{/*=============CURRENT ORDERS=============*/}

                <div className="signup-page" style={{marginTop:'25px',textAlign:'center'}}> 
                   
                        <Typography className="push-down" color ="inherit" variant="display2">
                            Your Current Orders  
                        </Typography>
                        
                    <Divider />
                    
                </div>


                <div className="column" data-aos ="flip-up"> 
                    <Card  data-aos ="flip-up" style ={cardDescription} >
                        <CardContent>
                            <Typography gutterBottom variant="headline" component= "h2">
                                Rater Name
                            </Typography>
                                <form onSubmit={this.handleSubmit}>
                                    <input name="comment" value = {this.state.comment} onChange={this.handleChange} placeholder ="Write A Comment" />
                                        <Button type ="submit" style={{marginLeft:'10px'}}variant ="raised" color ="secondary" >Add Rating</Button>
                                </form>
                        </CardContent>
                    </Card>  
                </div>
        </div>

        );
    }
};

export default DeliveryHome;