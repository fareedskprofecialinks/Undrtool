import React, { useState, useEffect } from 'react';
import i18n from './../utils/i18n';
import './../App.css';
import { fetchforgotService } from './../services/webServices';

const ForgotPassword = (props) => {
    const [submit, setSubmit] = useState(false);
    const [state, setState] = useState({
        userName: '',
        userNameError: true,
        invalidEmail: false
    });
    const [language, setLanguage] = useState('en');
    const [orientation, setOrientation] = useState(0)
    const [orientationMode, setOrientationMode] = useState('portrait')

    useEffect(() => {
        if (window.matchMedia("(orientation: portrait)").matches) {
            setOrientationMode('portrait')
        }

        if (window.matchMedia("(orientation: landscape)").matches) {
            setOrientationMode('landscape')
        }
    }, [orientation])

    useEffect(() => {
        window.onorientationchange = function (event) {
            setOrientation(event.target.screen.orientation.angle)
        };
        let lang = localStorage.getItem('language');
        setLanguage(lang);
    }, [])

    const changeEmail = (e) => {

        let val = e.target.value;
        setState(prevState => {
            return { ...prevState, userName: val, userNameError: false }
        })
    }

    const submitForm = (e) => {
        e.preventDefault()

        setSubmit(true)

        let emailError = false;
        let filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

        if (filter.test(state.userName)) {
            setState(prevState => {
                return { ...prevState, userNameError: false }
            })
        }
        else {
            emailError = true;
            setState(prevState => {
                return { ...prevState, userNameError: true }
            })
        }

        if (!emailError) {

            let payload = {
                email: state.userName
            }

            fetchforgotService(payload, (CB) => {
                if (CB.status == "Success") {
                    language == 'sp'
                        ?
                        alert('Email enviado')
                        :
                        alert('Email sent')
                } else {
                    language == 'sp'
                        ?
                        alert('Correo electrónico no enviado')
                        :
                        alert('Email not sent')
                }
                props.history.replace({
                    pathname: 'login',
                })
            });
        }

    }

    return (
        <section className="bg-img" >
            <img
                onClick={() => {
                    props.history.replace({
                        pathname: 'login',
                    })
                }}
                className="backButtonForMobile"
                alt="back"
                src={require('./../assets/img/images/back.png')}
                style={{ display: (orientation === 0 && orientationMode === 'portrait') ? 'block' : 'none', height: 30, width: 30, position: 'absolute', top: '5vw', left: '5vw', zIndex: 999 }} />
            <div className="container-fluid" style={{ borderBottom: '3px solid #dedede' }}>
                <div className="row head-img" >
                    <div className="col-md-12">
                        <div className="row tabmargin">
                            <div className="col-md-3 col-3">
                                <a target="_blank" href='https://www.undrr.org/'>
                                    <img a
                                        alt="undrrlogocolor"
                                        style={{ marginTop: '1vh', marginLeft: '2vw', width: '85%' }}
                                        src={require('./../assets/img/images/undrrlogocolor.png')}
                                        className="img-fluid" />
                                </a>
                            </div>
                            <div className="col-md-5 col-5" />
                            <div className="col-md-4 col-4" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <img
                                    onClick={() => props.history.replace({
                                        pathname: '/',
                                    })
                                    }
                                    alt="logo-covid-response"
                                    src={(window.orientation == 90 || window.orientation == 270) && window.innerWidth < 850 ? require('./../assets/img/images/logo-covid-response.png') : require('./../assets/img/images/logo-covid-response1.png')} style={{ width: '85%' }} className="img-fluid hederside_logo" />
                            </div>
                        </div>
                    </div>
                </div>
            </div >
            <div className="container-fluid loginback" >
                <div className="row alignLoginCard" >
                    <div className=" loginCard">
                        <div className=' fullscreenGrad' >
                            <div className="col-md-6 padd-0" >
                                <img
                                    style={{ margin: 'auto', display: 'block', height: '100%', width: '100%' }} alt="Login-box-bg"
                                    className="img-responsive"
                                    src={require('./../assets/img/images/login/Login-box-bg.png')} />
                            </div>
                            <div className="col-md-6 col-12">
                                <p style={{ fontSize: 25, padding: '5px', color: '#002a4a', textAlign: 'center', marginBottom: '0.5rem', fontFamily: 'Roboto', width: '90%', borderBottom: '1px solid gray' }}>
                                    {
                                        localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).forgotPassword : ''
                                    }
                                </p>
                                <form action="" onSubmit={submitForm} >
                                    {
                                        state.invalidEmail ?
                                            <p style={{ fontSize: 14, textAlign: 'center', color: 'gray', border: '0.5px solid red', backgroundColor: '#f5d5d2', fontFamily: 'Roboto', width: '90%', padding: '5px', margin: 0 }}>
                                                {
                                                    localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).error : ''
                                                }
                                            </p>
                                            :
                                            null
                                    }
                                    <div className="row" style={{ padding: '10px', width: '100%' }}>
                                        <div className={"col-md-12 col-12"} style={{ padding: '5px', width: '80%' }}>
                                            <div className="input-group ">
                                                <span className="input-group-text" id="basic-addon1">
                                                    <img
                                                        className="img-responsive"
                                                        alt="mail"
                                                        src={require('./../assets/img/images/login/mail.png')} />
                                                </span>
                                                <input
                                                    type="text"
                                                    placeholder={
                                                        localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).error : ''
                                                    }
                                                    aria-label={'email'}
                                                    aria-required="true"
                                                    className="form-control"
                                                    maxLength={50}
                                                    name='email'
                                                    onChange={changeEmail}
                                                    value={state.userName}
                                                    style={{ height: 40 }}
                                                />
                                            </div>
                                            {
                                                submit && state.userNameError
                                                    ?
                                                    <p style={{ paddingLeft: 10, color: 'red', margin: 0, fontSize: 12, fontFamily: 'Roboto' }}>
                                                        {
                                                            localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).invalidemail : ''
                                                        }
                                                    </p>
                                                    :
                                                    null
                                            }
                                        </div>
                                        <div className="" style={{ width: '100%', marginTop: '10px' }}>
                                            <input
                                                type='submit'
                                                value={
                                                    localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).submit : ''
                                                }
                                                style={{ width: '100%', borderRadius: 5, padding: '5px', margin: 'auto', fontSize: 16, backgroundColor: '#224483' }}
                                                className="btn btn-primary" />
                                        </div>
                                        <div
                                            className="row"
                                            style={{ width: '100%', marginTop: '10px', justifyContent: 'center', marginLeft: '0px', marginRight: '0px' }}>
                                            <button
                                                onClick={() => {
                                                    window.history.back()
                                                }}
                                                style={{ width: '100%' }}
                                                type="button"
                                                class="btn btn-light">
                                                {
                                                    localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).cancel : ''
                                                }
                                            </button>
                                        </div>
                                        <div
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                width: '100%'
                                            }}>
                                            <span
                                                onClick={() => {
                                                    props.history.replace({
                                                        pathname: 'login',
                                                    })
                                                }}
                                                style={{
                                                    fontSize: 14,
                                                    textAlign: 'center',
                                                    marginBottom: '0.3rem',
                                                    color: '#002a4a'
                                                }}>
                                                {
                                                    localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).haveaccount : ''
                                                }
                                                <a
                                                    style={{ textDecoration: 'underline', color: '#002a4a' }}
                                                    href="#">
                                                    {
                                                        localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).signin : ''
                                                    }
                                                </a>
                                            </span>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div >
            </div >
        </section >
    );
}

export default ForgotPassword;
