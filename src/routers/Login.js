import React, { useState, useEffect, useRef } from 'react';
import './../App.css';
import GoogleLogin from 'react-google-login';
import Recaptcha from 'react-recaptcha';
import Modal from 'react-bootstrap/Modal'
import FacebookLogin from './../components/FacebookLogin';
import config from './../config/config';
import i18n from './../utils/i18n';
import ClientCaptcha from "react-client-captcha"
import "react-client-captcha/dist/index.css"
import ReactTooltip from 'react-tooltip';

import { fetchLoginService } from './../services/webServices';

const Login = (props) => {
    const [show, setShow] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [submit, setSubmit] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [state, setState] = useState({
        userName: '',
        password: '',
        userNameError: true,
        passwordError: true,
        invalidUser: false,
        captchaCode: '',
        enteredCaptchaCode: '',
        enteredCaptchaCodeError: false
    });
    const [position, setPosition] = useState([0, 0]);
    const idleTimer = useRef(null);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [language, setLanguage] = useState('en');

    useEffect(() => {
        navigator.geolocation.getCurrentPosition((position) => {
            setPosition([position.coords.latitude, position.coords.longitude])
        })
        localStorage.removeItem('LoginData');
        let lang = localStorage.getItem('language');
        setLanguage(lang);
    }, []);

    const responseGoogle = (e) => {
        if (e.profileObj && e.profileObj.email) {
            let payload = {
                email: e.profileObj && e.profileObj.email,
                name: e.profileObj && e.profileObj.givenName,
                family_name: e.profileObj && e.profileObj.familyName,
                oauth_type: 'google'
            }
            fetchLoginService(payload, (CB) => {
                if (CB.status == "Success") {
                    config.setLoginData(CB.data)
                    // if (CB.data.score) {
                    //     props.history.replace({
                    //         pathname: 'dashboard',
                    //         state: {
                    //             pastResultData: CB.data.score ? JSON.parse(CB.data.score) : {
                    //                 HR: 0,
                    //                 OP: 0,
                    //                 FIN: 0,
                    //                 TI: 0,
                    //                 MKT: 0,
                    //                 GP: 0,
                    //                 HE: 0,
                    //                 Rint: 0,
                    //                 Rex: 0,
                    //                 Ro: 0
                    //             },
                    //             pastHazardResultData: CB.multihazard_data.score ? JSON.parse(CB.multihazard_data.score) : {
                    //                 HR: 0,
                    //                 OP: 0,
                    //                 FIN: 0,
                    //                 TI: 0,
                    //                 MKT: 0,
                    //                 GP: 0,
                    //                 HE: 0,
                    //                 Rint: 0,
                    //                 Rex: 0,
                    //                 Ro: 0,
                    //                 PI:0
                    //             }, 
                    //             pastResultData: CB.data.score ? JSON.parse(CB.data.score) : null,
                    //             pastHazardResultData: CB.multihazard_data.score ? JSON.parse(CB.multihazard_data.score) : null,
                    //             userId: CB.data.user_id,
                    //             position: CB.data.latitude ? [CB.data.latitude, CB.data.longitude] : position,
                    //             assesment_type: CB.data.assesment_type
                    //         }
                    //     })
                    // }
                    if (CB.data.score && CB.multihazard_data.score) {
                        props.history.replace({
                            pathname: 'dashboard',
                            state: {
                                pastResultData: CB.data.score ? JSON.parse(CB.data.score) : {
                                    HR: 0,
                                    OP: 0,
                                    FIN: 0,
                                    TI: 0,
                                    MKT: 0,
                                    GP: 0,
                                    HE: 0,
                                    Rint: 0,
                                    Rex: 0,
                                    Ro: 0
                                },
                                pastHazardResultData: CB.multihazard_data.score ? JSON.parse(CB.multihazard_data.score) : {
                                    HR: 0,
                                    OP: 0,
                                    FIN: 0,
                                    TI: 0,
                                    MKT: 0,
                                    GP: 0,
                                    HE: 0,
                                    Rint: 0,
                                    Rex: 0,
                                    Ro: 0,
                                    PI:0
                                }, 
                                userId: CB.data.user_id, 
                                position,
                                assesment_type: CB.data.assesment_type
                            }
                        })
                    }
                    else if (CB.data.score) {
                        props.history.replace({
                            pathname: 'dashboard',
                            state: {
                                pastResultData: CB.data.score ? JSON.parse(CB.data.score) : {
                                    HR: 0,
                                    OP: 0,
                                    FIN: 0,
                                    TI: 0,
                                    MKT: 0,
                                    GP: 0,
                                    HE: 0,
                                    Rint: 0,
                                    Rex: 0,
                                    Ro: 0
                                }, 
                                userId: CB.data.user_id, 
                                position,
                                assesment_type: CB.data.assesment_type
                            }
                        })
                    }
                    else if (CB.multihazard_data.score) {
                        props.history.replace({
                            pathname: 'dashboard',
                            state: {
                                resultData: CB.data.score ? JSON.parse(CB.data.score) : {
                                    HR: 0,
                                    OP: 0,
                                    FIN: 0,
                                    TI: 0,
                                    MKT: 0,
                                    GP: 0,
                                    HE: 0,
                                    Rint: 0,
                                    Rex: 0,
                                    Ro: 0
                                },
                                pastHazardResultData: CB.multihazard_data.score ? JSON.parse(CB.multihazard_data.score) : {
                                    HR: 0,
                                    OP: 0,
                                    FIN: 0,
                                    TI: 0,
                                    MKT: 0,
                                    GP: 0,
                                    HE: 0,
                                    Rint: 0,
                                    Rex: 0,
                                    Ro: 0,
                                    PI:0
                                },
                                userId: CB.data.user_id, 
                                position,
                                assesment_type: CB.data.assesment_type
                            }
                        })
                    }
                    else {
                        props.history.replace({
                            pathname: 'questionnaire',
                            state: { userId: CB.data.user_id }
                        })
                    }
                }
            });
        }
        else {
            alert('Please try later' + JSON.stringify(e))
        }
    }

    const responseFacebook = (e) => {
        let payload = {
            email: e.email ? e.email : e.id,
            name: e.name ? e.name : '',
            oauth_type: 'facebook'
        }
        fetchLoginService(payload, (CB) => {
            if (CB.status == "Success") {

                props.history.replace({
                    pathname: 'dashboard',
                    state: {
                        resultData: CB.data.score ? JSON.parse(CB.data.score) : {
                            HR: 0, OP: 0, FIN: 0, TI: 0, MKT: 0, GP: 0, HE: 0, Rint: 0, Rex: 0, Ro: 0
                        }, 
                        userId: CB.data.user_id, 
                        position,
                        assesment_type: CB.data.assesment_type 
                    }
                })
            }
        });
    }

    const changePassword = (e) => {
        const val = e.target.value;
        const passwordReg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/;

        if (passwordReg.test(val)) {
            setState(prevState => {
                return { ...prevState, password: val, passwordError: false, invalidUser: false }
            })
        }
        else { 
            setState(prevState => {
                return { ...prevState, password: val, passwordError: 'invalidPassword', invalidUser: false }
            })
        }
    }

    const changeEmail = (e) => {
        const val = e.target.value;
        setState(prevState => {
            return { ...prevState, userName: val, userNameError: false, invalidUser: false }
        })
    }

    const changeCaptcha = (e) => {
        let val = e.target.value;
        if (val === "") {
            setState(prevState => {
                return { ...prevState, enteredCaptchaCode: val, enteredCaptchaCodeError: true }
            })
        }
        else {
            setState(prevState => {
                return { ...prevState, enteredCaptchaCode: val, enteredCaptchaCodeError: false }
            })
        }
    }

    const setCode = captchaCode => {
        setState(prevState => {
            return { ...prevState, captchaCode: captchaCode, enteredCaptchaCode: '', enteredCaptchaCodeError: false }
        })
    }

    const submitForm = (e) => {
        e.preventDefault()

        setSubmit(true)

        let emailError = false, passwordError = state.passwordError;
        let filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        // debugger
        if (state.captchaCode === state.enteredCaptchaCode) {
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

            if (!state.password && (state.password.length < 8) && (state.password.length > 0)) {
                passwordError = true
                setState(prevState => {
                    return { ...prevState, passwordError: 'passwordlengtherror' }
                })
            }

            if (!passwordError && !emailError) {
                let payload = {
                    email: state.userName,
                    password: state.password,
                }

                fetchLoginService(payload, (CB) => {
                    if (CB.status == "Success") {
                        debugger
                        config.setLoginData(CB.data)
                        if (CB.data.score && CB.multihazard_data.score) {
                            props.history.replace({
                                pathname: 'dashboard',
                                state: {
                                    pastResultData: CB.data.score ? JSON.parse(CB.data.score) : {
                                        HR: 0,
                                        OP: 0,
                                        FIN: 0,
                                        TI: 0,
                                        MKT: 0,
                                        GP: 0,
                                        HE: 0,
                                        Rint: 0,
                                        Rex: 0,
                                        Ro: 0
                                    },
                                    pastHazardResultData: CB.multihazard_data.score ? JSON.parse(CB.multihazard_data.score) : {
                                        HR: 0,
                                        OP: 0,
                                        FIN: 0,
                                        TI: 0,
                                        MKT: 0,
                                        GP: 0,
                                        HE: 0,
                                        Rint: 0,
                                        Rex: 0,
                                        Ro: 0,
                                        PI:0
                                    }, 
                                    userId: CB.data.user_id, 
                                    position,
                                    assesment_type: CB.data.assesment_type
                                }
                            })
                        }
                        else if (CB.data.score) {
                            props.history.replace({
                                pathname: 'dashboard',
                                state: {
                                    pastResultData: CB.data.score ? JSON.parse(CB.data.score) : {
                                        HR: 0,
                                        OP: 0,
                                        FIN: 0,
                                        TI: 0,
                                        MKT: 0,
                                        GP: 0,
                                        HE: 0,
                                        Rint: 0,
                                        Rex: 0,
                                        Ro: 0
                                    }, 
                                    userId: CB.data.user_id, 
                                    position,
                                    assesment_type: CB.data.assesment_type
                                }
                            })
                        }
                        else if (CB.multihazard_data.score) {
                            props.history.replace({
                                pathname: 'dashboard',
                                state: {
                                    resultData: CB.data.score ? JSON.parse(CB.data.score) : {
                                        HR: 0,
                                        OP: 0,
                                        FIN: 0,
                                        TI: 0,
                                        MKT: 0,
                                        GP: 0,
                                        HE: 0,
                                        Rint: 0,
                                        Rex: 0,
                                        Ro: 0
                                    },
                                    pastHazardResultData: CB.multihazard_data.score ? JSON.parse(CB.multihazard_data.score) : {
                                        HR: 0,
                                        OP: 0,
                                        FIN: 0,
                                        TI: 0,
                                        MKT: 0,
                                        GP: 0,
                                        HE: 0,
                                        Rint: 0,
                                        Rex: 0,
                                        Ro: 0,
                                        PI:0
                                    },
                                    userId: CB.data.user_id, 
                                    position,
                                    assesment_type: CB.data.assesment_type
                                }
                            })
                        }
                    }
                    else if (CB.status == "Error") {
                        if (CB.code == '400') {
                            alert(CB.message)
                        } else {
                            setState(prevState => {
                                return { ...prevState, invalidUser: true }
                            })
                        }
                    }
                });
            }
        }
        else {
            setState(prevState => {
                return { ...prevState, enteredCaptchaCodeError: true }
            })
        }

    }

    const captchaLoaded = () => {
        console.log('captcha laoded')
    }

    return (
        <section className="bg-img" >
            <Modal
                size='lg'
                show={show}
                onHide={handleClose}
                backdrop="static"
                centered
                keyboard={false}
            >
                <Modal.Header >
                    <Modal.Title style={{ fontFamily: 'Roboto' }}>
                        {
                            localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).guestLogin : ''
                        }
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p style={{ fontFamily: 'Roboto' }}>
                        {
                            localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).guestLoginData : ''
                        }
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <div className="col-md-12" style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <button
                            onClick={() => {
                                setShow(false)
                            }} style={{ backgroundColor: '#002a4a' }} className='btn btn-primary' variant="primary">
                            {
                                localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).cancel : ''
                            }
                        </button>

                        <button
                            style={{ backgroundColor: '#002a4a' }}
                            onClick={() => {
                                setShow(false)
                                config.setLoginData({
                                    userId: null
                                })
                                props.history.replace({
                                    pathname: 'questionnaire',
                                    state: { guestUser: true, userId: null }
                                })
                            }} className='btn btn-primary' variant="primary">
                            {
                                localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).Proceed : ''
                            }
                        </button>
                    </div>
                </Modal.Footer>
            </Modal>
            <div className="container-fluid" style={{ borderBottom: '3px solid #dedede' }}>
                <div className="row head-img" >
                    <div className="col-md-12 ">
                        <div className="row tabmargin">
                            <div className="col-md-3 col-3">
                                <a target="_blank" href='https://www.undrr.org/'><img alt="UNDRR logo" style={{ marginTop: '1vh', marginLeft: '2vw', width: '85%' }} src={require('./../assets/img/images/undrrlogocolor.png')} className="img-fluid" />
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
                            <div className="col-md-6 padd-0 welcomeClass" >
                                {
                                    language == 'sp' ?
                                        <img
                                            style={{ margin: 'auto', display: 'block', height: '100%', width: '100%' }}
                                            alt="Login-box-bgsp"
                                            className="img-responsive"
                                            src={require('./../assets/img/images/login/Login-box-bgsp.jpg')} />
                                        :
                                        <img
                                            style={{ margin: 'auto', display: 'block', height: '100%', width: '100%' }}
                                            alt="Login-box-bg"
                                            className="img-responsive"
                                            src={require('./../assets/img/images/login/Login-box-bg.png')} />

                                }
                            </div>
                            <div className="col-md-6 col-12">
                                <p
                                    style={{ fontSize: 25, textAlign: 'center', color: '#002a4a', marginBottom: '0.5rem', fontFamily: 'Roboto', width: '90%', padding: '10px', borderBottom: '1px solid #002a4a' }}>
                                    {
                                        localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).login : ''
                                    }
                                </p>
                                <form action="" onSubmit={submitForm} >
                                    {
                                        state.invalidUser ?
                                            <p style={{ fontSize: 14, textAlign: 'center', color: '#002a4a', border: '0.5px solid red', backgroundColor: '#f5d5d2', fontFamily: 'Roboto', width: '90%', padding: '5px', margin: 0 }}>
                                                {
                                                    localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).errormsg : ''
                                                }
                                            </p>
                                            :
                                            null
                                    }
                                    <div className="row" style={{ padding: '10px', width: '100%' }}>
                                        <div className={"col-md-12 col-12"} style={{ padding: '5px', width: '80%' }}>
                                            <div className="input-group" style={{ marginBottom: 0 }}>
                                                <div className="input-group-prepend">
                                                    <span className="input-group-text" id="basic-addon1">
                                                        <img
                                                            className="img-responsive"
                                                            alt="mail"
                                                            src={require('./../assets/img/images/login/mail.png')} />
                                                    </span>
                                                </div>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    aria-label={'email'}
                                                    aria-required="true"
                                                    maxLength={50}
                                                    autoComplete="off"
                                                    placeholder={
                                                        localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).email : ''
                                                    }
                                                    aria-label="Username"
                                                    onChange={changeEmail}
                                                    aria-describedby="basic-addon1" />
                                            </div>
                                            {
                                                submit && state.userNameError
                                                    ?
                                                    <p style={{ paddingLeft: 10, color: 'red', margin: 0, fontSize: 12, fontFamily: 'Roboto' }}>
                                                        {
                                                            localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).erroremail : ''
                                                        }
                                                    </p>
                                                    :
                                                    null
                                            }
                                        </div>
                                        <div className={"col-md-12 col-12"} style={{ padding: '5px', marginTop: '10px' }}>
                                            <ReactTooltip />
                                            <div className="input-group " style={{ marginBottom: 0 }}>
                                                <div className="input-group-prepend">
                                                    <span className="input-group-text" id="basic-addon2">
                                                        <img
                                                            className="img-responsive"
                                                            alt="password"
                                                            src={require('./../assets/img/images/login/password.png')} />
                                                    </span>
                                                </div>
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    aria-label={'password'}
                                                    autoComplete="off"
                                                    aria-required="true"
                                                    className="form-control"
                                                    maxLength={50}
                                                    placeholder={
                                                        localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).enterPassword : ''
                                                    }
                                                    autocomplete="off"
                                                    onChange={changePassword}
                                                    data-html={true}
                                                    data-tip="&amp;#8226; Use atleast 12 characters.<br />
                                                    &amp;#8226; Include both lowercase and uppercase characters.<br />
                                                    &amp;#8226; Include atleast one number or symbol.<br />
                                                    &amp;#8226; Password should not be based on any personal information such as user id, family name, pet, birthday, friends, co-workers, addresses, phone numbers, etc."
                                                    aria-describedby="basic-addon2" 
                                                />
                                                <div class="input-group-append" onClick={() => setShowPassword(!showPassword)}>
                                                    <span class="input-group-text">
                                                        {
                                                            showPassword ?
                                                                <img
                                                                    className="img-responsive"
                                                                    alt="invisible"
                                                                    src={require('./../assets/img/images/login/invisible.png')} />
                                                                :
                                                                <img
                                                                    className="img-responsive"
                                                                    alt="eye"
                                                                    src={require('./../assets/img/images/login/eye.png')} />
                                                        }
                                                    </span>
                                                </div>
                                            </div>
                                            {
                                                state.passwordError === 'invalidPassword' ? <p style={{ paddingLeft: 10, color: 'red', margin: 0, fontSize: 12, fontFamily: 'Roboto' }}>
                                                    {
                                                        'Use atleast 12 characters. Include both lowercase and uppercase characters. Include atleast one number or symbol'
                                                    }
                                                </p> : null
                                            }
                                            {
                                                submit && state.passwordError === true ? <p style={{ paddingLeft: 10, color: 'red', margin: 0, fontSize: 12, fontFamily: 'Roboto' }}>
                                                    {
                                                        localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).password : ''
                                                    }
                                                </p> : null
                                            }
                                            {
                                                submit && state.passwordError === 'passwordlengtherror' ? <p style={{ paddingLeft: 10, color: 'red', margin: 0, fontSize: 12, fontFamily: 'Roboto' }}>
                                                    {
                                                        localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).invalidpassword : ''
                                                    }
                                                </p>
                                                    :
                                                    null
                                            }
                                        </div>
                                        <p onClick={() => {
                                            props.history.replace({
                                                pathname: 'forgot',
                                            })
                                        }} style={{ fontSize: 15, textDecoration: 'underline', width: '100%', marginBottom: '0.3rem', textAlign: 'right', cursor: 'pointer' }}><a style={{ color: '#002a4a' }}>
                                                {
                                                    localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).forgotpassword : ''
                                                }
                                            </a>
                                        </p>
                                        <div className={"col-md-12 col-12 d-flex"} style={{ padding: '5px', width: '100%' }}>
                                            <ClientCaptcha
                                                charsCount={6}
                                                captchaClassName="CaptchaClass"
                                                width={200}
                                                captchaCode={setCode}
                                                retryIcon={require("./../assets/img/reload.png")}
                                            />
                                        </div>
                                        <div className={"col-md-12 col-12"} style={{ padding: '5px', width: '80%' }}>
                                            <div className="input-group" style={{ marginBottom: 0 }}>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    aria-label={'Captcha'}
                                                    aria-required="true"
                                                    maxLength={6}
                                                    placeholder={
                                                        localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).codeInImage : "What code is in image?"
                                                    }
                                                    value={state.enteredCaptchaCode}
                                                    aria-label="Captcha"
                                                    onChange={changeCaptcha}
                                                    aria-describedby="basic-addon1" />
                                            </div>
                                            {
                                                submit && state.enteredCaptchaCodeError
                                                    ?
                                                    <p style={{ paddingLeft: 10, color: 'red', margin: 0, fontSize: 12, fontFamily: 'Roboto' }}>
                                                        {
                                                            localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).invalidCaptcha : "Invalid Captcha"
                                                        }
                                                    </p>
                                                    :
                                                    null
                                            }
                                        </div>
                                        <div
                                            className="row"
                                            style={{ width: '100%', marginTop: '10px', justifyContent: 'center', marginLeft: '0px', marginRight: '0px' }}>
                                            <input
                                                type='submit'
                                                value={
                                                    localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).login : ''
                                                }
                                                style={{ width: '100%', borderRadius: 5, padding: '5px', backgroundColor: '#002a4a' }} className="btn btn-primary" />
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
                                        {/* <Recaptcha
                                            sitekey="6Leb1BIbAAAAAO9PdMjd6-jXcs0yJBR5Sz8Ro0ju"
                                            render="explicit"
                                            onloadCallback={captchaLoaded}
                                        /> */}
                                    </div>
                                </form>
                                <div className='row' style={{ flexDirection: 'row', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                                    <span style={{ color: '#002a4a', fontFamily: 'Roboto', fontSize: 16, marginRight: '10px' }}>
                                        {
                                            localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).loginWith : ''
                                        }
                                    </span>
                                    <GoogleLogin
                                        clientId="465258312293-a5to6ra2jco7ftpu5fr4untmid0cjrpp.apps.googleusercontent.com"
                                        render={renderProps => (
                                            <div onClick={renderProps.onClick} style={{ borderRadius: 5, padding: '5px', backgroundColor: '#ffffff', marginRight: '10px', cursor: 'pointer' }}>
                                                <img className="img-responsive" alt="google" style={{ height: 30, width: 30, borderRadius: 15, boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)' }} src={require('./../assets/img/images/login/google.png')} />
                                            </div>
                                        )}
                                        buttonText="Login"
                                        onSuccess={(e) => { responseGoogle(e) }}
                                        onFailure={(e) => { responseGoogle(e) }}
                                    />
                                    <div style={{ height: 10 }} />
                                </div>
                                <div>
                                    <span
                                        onClick={() => {
                                            props.history.replace({
                                                pathname: 'registration',
                                            })
                                        }}
                                        style={{ fontSize: 14, textAlign: 'center', marginBottom: '0.3rem', color: '#002a4a' }}>
                                        {
                                            localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).dontaccount : ''
                                        }
                                        <a
                                            style={{ textDecoration: 'underline', color: '#002a4a' }}>
                                            {
                                                localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).signup : ''
                                            }
                                        </a>
                                    </span>
                                    <span
                                        style={{ marginLeft: 10, marginRight: 10, color: '#002a4a', }}>/</span>
                                    <span
                                        onClick={() => setShow(true)}
                                        style={{ color: '#000000', fontFamily: 'Roboto', fontSize: 14, color: '#002a4a' }}>
                                        <a style={{ color: '#002a4a' }} href="#">
                                            {
                                                localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).guest : ''
                                            }
                                        </a>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-12 col-12">
                    <p
                        style={{ fontSize: 10, textAlign: 'center', color: '#002a4a', marginBottom: '0.5rem', fontFamily: 'Roboto', width: '90%', padding: '10px', borderBottom: '1px solid #002a4a' }}>
                        Unauthorized access to this United Nations Computer System is prohibited by ST/SGB/2004/15 (''Use of information and communication technology resources and data" of 29 November 2004). Authorized users shall ensure that their use of Information and Communication Technology (ICT) resources and ICT data is consistent with their obligations as staff members or such other obligations as may apply to them. All use of ICT resources and ICT data is subject to monitoring and investigation as set forth in ST/SGB/2004/15. Use of this system by any user, authorized or unauthorized, constitutes consent to the applicable UN regulations and rules.
                    </p>
                </div>
            </div>
        </section>
    );
}

export default Login;
