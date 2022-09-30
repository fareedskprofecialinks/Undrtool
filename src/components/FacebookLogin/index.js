import React, { Component } from 'react';

class FacebookLogin extends Component{

    constructor(props){
        super(props);
    }
    
    componentDidMount(){
        (function(d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) return;
            js = d.createElement(s); js.id = id;
            js.src = "//connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
        
        window.fbAsyncInit = function() {
            window.FB.init({
              appId      : '258517175483494',
              status: true,
              cookie     : true,  
              xfbml      : true,  
              version: 'v3.2'
            });
        };
    }
    
    facebookLogin = () => {
        window.FB.login(
            this.checkLoginState(), 
            { scope : 'name,email,picture, public_profile,'} //Add scope whatever you need about the facebook user
        );
    }
    
    checkLoginState() {
        window.FB.getLoginStatus(function(response) {
            this.statusChangeCallback(response);
        }.bind(this));
    }
    
    statusChangeCallback(response) {
        if (response.status === 'connected') {
            this.fetchDataFacebook();
        } else if (response.status === 'not_authorized') {
        } else {
        }
    }
    
    fetchDataFacebook = () => {
        window.FB.api('/me', (user) =>{
            this.props.callback(user);
        });
    }

    render(){
        return(
            <img className="img-responsive"  title="facebook login" alt="facebook" onClick={ () => this.facebookLogin() } style={{ height: 30, width: 30, borderRadius: 15, boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)' }} src={require('./../../assets/img/images/login/facebook.png')} />
        )
    }
}

export default FacebookLogin;