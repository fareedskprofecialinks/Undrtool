import React, { useState, useEffect } from 'react';
import './../App.css';
import Modal from 'react-bootstrap/Modal'
import { fetchRegisterService } from './../services/webServices';
import i18n from './../utils/i18n';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReactTooltip from 'react-tooltip';

const Registration = (props) => {
    const [show, setShow] = useState(false);
    const [submit, setSubmit] = useState(false);
    const [language, setLanguage] = useState('en');
    const [agreeed, setAgreeed] = useState(false);
    const [state, setState] = useState({
        userName: '',
        password: '',
        firstName: '',
        lastName: '',
        errormsg: '',
        firstNameError: true,
        lastNameError: true,
        userNameError: true,
        passwordError: true,
        invalidUser: false
    });
    const [position, setPosition] = useState([0, 0]);

    const [orientation, setOrientation] = useState(0)
    const [orientationMode, setOrientationMode] = useState('portrait')

    const lableStyle = {
        margin: 0, fontSize: 13, fontSize: 13., color: '#002a4a'
    };

    navigator.geolocation.getCurrentPosition((position) => {
        setPosition([position.coords.latitude, position.coords.longitude])

    })

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

        localStorage.removeItem('LoginData');
        let lang = localStorage.getItem('language');
        setLanguage(lang);
    }, []);

    const changePassword = (e) => {
        let val = e.target.value;
        let passwordReg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/;

        if (passwordReg.test(val)) {
            setState(prevState => {
                return { ...prevState, password: val, passwordError: false }
            })
        }
        else {
            setState(prevState => {
                return { ...prevState, password: val, passwordError: 'invalidPassword' }
            })
        }

    }
    const changeEmail = (e) => {

        let val = e.target.value;
        setState(prevState => {
            return { ...prevState, userName: val, userNameError: false }
        })
    }

    const changeFirstName = (e) => {

        let val = e.target.value;
        let regex = /^[a-zA-Z]{0,32}$/;
        if (regex.test(val)) {
            setState(prevState => {
                return { ...prevState, firstName: val, firstNameError: false }
            })
        }
    }

    const changeLastName = (e) => {

        let val = e.target.value;
        let regex = /^[a-zA-Z]{0,32}$/;
        if (regex.test(val)) {
            setState(prevState => {
                return { ...prevState, lastName: val, lastNameError: false }
            })
        }
    }
    const submitForm = (e) => {
        e.preventDefault()

        setSubmit(true)
        let payload = {

        }
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
        let passwordError = state.passwordError;
        if (state.password.length < 8 && state.password.length > 0) {
            passwordError = true;
            setState(prevState => {
                return { ...prevState, passwordError: 'passwordlengtherror' }
            })
        }
        else if (state.password.length == 0) {
            passwordError = true;
            setState(prevState => {
                return { ...prevState, passwordError: true }
            })
        }
        if (!passwordError && !emailError && !state.firstNameError && !state.lastNameError) {

            let payload = {
                email: state.userName,
                name: state.firstName,
                family_name: state.lastName,
                password: state.password
            } 
            fetchRegisterService(payload, (CB) => {
                if (CB.status == "Success") {
                    toast.success('User registered successfully', {
                        position: "top-center",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    })
                    props.history.replace({
                        pathname: 'login',
                    })
                }
                else if (CB.status == "Error") {
                    if (CB.code == '400') {
                        alert(CB.error)
                    } else {
                        setState(prevState => {
                            return { ...prevState, invalidUser: true }
                        })
                        if (CB.error && CB.error.email) {
                            setState(prevState => {
                                return { ...prevState, errormsg: CB.error.email && CB.error.email[0] }
                            })
                        }
                    }
                }
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
                <ToastContainer />
                <div className="row head-img" >
                    <div className="col-md-12 ">
                        <div className="row tabmargin">
                            <div className="col-md-3 col-3">
                                <a target="_blank" href='https://www.undrr.org/'><img alt="UNDRR logo" style={{ marginTop: '1vh', marginLeft: '2vw', width: '85%' }} src={require('./../assets/img/images/undrrlogocolor.png')} className="img-fluid" />
                                </a>
                            </div>
                            <div className="col-md-5 col-5" />
                            <div className="col-md-4 col-4" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <img onClick={() => props.history.replace({
                                    pathname: '/',
                                })
                                } alt="logo-covid-response" src={(window.orientation == 90 || window.orientation == 270) && window.innerWidth < 850 ? require('./../assets/img/images/logo-covid-response.png') : require('./../assets/img/images/logo-covid-response1.png')} style={{ width: '85%' }} className="img-fluid hederside_logo" />
                            </div>
                        </div>
                    </div>
                </div>


            </div >

            <div className="container-fluid loginback" >

                <div className="row alignLoginCard" >

                    <div className=" registerCard">

                        <div className=' fullscreenGrad' >

                            <div className="col-md-6 padd-0" >

                                <img
                                    style={{ margin: 'auto', display: 'block', height: '100%', width: '100%' }}
                                    className="Login-box-bg"
                                    alt="background"
                                    src={require('./../assets/img/images/login/Login-box-bg.png')} />

                            </div>

                            <div className="col-md-6 col-12" style={{ overflow: 'scroll' }}>
                                <p style={{ fontSize: 25, textAlign: 'center', color: '#002a4a', marginBottom: '0.5rem', padding: '5px', fontFamily: 'Roboto', width: '90%', borderBottom: '1px solid #002a4a' }}>
                                    {localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).register : ''}
                                </p>


                                <form action="" onSubmit={submitForm} >
                                    {
                                        state.invalidUser ?
                                            <p style={{ fontSize: 14, textAlign: 'center', color: '#002a4a', border: '0.5px solid red', backgroundColor: '#f5d5d2', fontFamily: 'Roboto', width: '90%', padding: '5px', margin: 0 }}>
                                                {
                                                    state.errormsg != ''
                                                        ?
                                                        state.errormsg
                                                        :
                                                        localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).error : ''
                                                }
                                            </p>
                                            :
                                            null
                                    }
                                    <div className="row" style={{ padding: '10px', width: '100%' }}>

                                        <div className={"col-md-12 col-12"} style={{ padding: '5px', width: '80%' }}>
                                            <label style={lableStyle} htmlFor={'FirstName'}>
                                                <strong>
                                                    {localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).firstNameLable : ''}
                                                </strong>
                                            </label>
                                            <div className="input-group ">
                                                <input
                                                    type="text"
                                                    placeholder={
                                                        // i18n[language == 'sp' ? 'sp' : 'en'].register.firstName
                                                        localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).firstName : ''
                                                    }
                                                    aria-label={'firstname'}
                                                    aria-required="true"
                                                    className="form-control"
                                                    value={state.firstName}
                                                    maxLength={50}
                                                    name='FirstName'
                                                    onChange={changeFirstName}
                                                    style={{ height: 40 }}
                                                    autoComplete={'off'}
                                                />

                                            </div>
                                            {
                                                submit && state.firstNameError
                                                    ?
                                                    <p style={{ paddingLeft: 10, color: 'red', margin: 0, fontSize: 12, fontFamily: 'Roboto' }}>
                                                        {localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).firstNameErr : ''}
                                                    </p>
                                                    :
                                                    null
                                            }
                                        </div>

                                        <div className={"col-md-12 col-12"} style={{ padding: '5px' }}>
                                            <label style={lableStyle} htmlFor={'LastName'}>
                                                <strong>
                                                    {localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).lastNameLable : ''}
                                                </strong>
                                            </label>
                                            <div className="input-group ">
                                                <input
                                                    type="text"
                                                    placeholder={
                                                        localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).lastName : ''
                                                    }
                                                    autoComplete={'off'}
                                                    className="form-control"
                                                    value={state.lastName}
                                                    maxLength={50}
                                                    name='LastName'
                                                    onChange={changeLastName}
                                                    aria-label={'lastname'}
                                                    aria-required="true"
                                                    style={{ height: 40 }} />

                                            </div>
                                            {
                                                submit && state.lastNameError
                                                    ?
                                                    <p style={{ paddingLeft: 10, color: 'red', margin: 0, fontSize: 12, fontFamily: 'Roboto' }}>
                                                        {localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).lastNameErr : ''}
                                                    </p> : null
                                            }
                                        </div>
                                        <div className={"col-md-12 col-12"} style={{ padding: '5px', width: '80%' }}>
                                            <label style={lableStyle} htmlFor={'email'}><strong>
                                                {localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).emailLable : ''}
                                            </strong></label>
                                            <div className="input-group ">
                                                <input
                                                    type="text"
                                                    placeholder={
                                                        localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).email : ''
                                                    }
                                                    autoComplete="off"
                                                    className="form-control"
                                                    maxLength={50}
                                                    name='email'
                                                    onChange={changeEmail}
                                                    aria-label={'email'}
                                                    aria-required="true"
                                                    style={{ height: 40 }} />
                                            </div>
                                            {
                                                submit && state.userNameError
                                                    ?
                                                    <p style={{ paddingLeft: 10, color: 'red', margin: 0, fontSize: 12, fontFamily: 'Roboto' }}>
                                                        {localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).emailErr : ''}
                                                    </p>
                                                    :
                                                    null
                                            }
                                        </div>
                                        <div className={"col-md-12 col-12"} style={{ padding: '5px' }}>
                                            <label style={lableStyle} htmlFor={'password'}>
                                                <strong>
                                                    {localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).passwordLable : ''}
                                                </strong></label>
                                            <div className="input-group ">
                                                <ReactTooltip />
                                                <input
                                                    type="text"
                                                    placeholder={
                                                        localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).password : ''
                                                    }
                                                    className="form-control"
                                                    maxLength={20}
                                                    name='password'
                                                    onChange={changePassword}
                                                    aria-label={'password'}
                                                    aria-required="true"
                                                    data-html={true}
                                                    data-tip="&amp;#8226; Use atleast 12 characters.<br />
                                                    &amp;#8226; Include both lowercase and uppercase characters.<br />
                                                    &amp;#8226; Include atleast one number or symbol.<br />
                                                    &amp;#8226; Password should not be based on any personal information such as user id, family name, pet, birthday, friends, co-workers, addresses, phone numbers, etc."
                                                    autoComplete={'off'}
                                                    style={{ height: 40 }} 
                                                />

                                            </div>
                                            {
                                                state.passwordError === 'invalidPassword' ? <p style={{ paddingLeft: 10, color: 'red', margin: 0, fontSize: 12, fontFamily: 'Roboto' }}>
                                                    {
                                                        'Use atleast 12 characters. Include both lowercase and uppercase characters. Include atleast one number or symbol'
                                                    }
                                                </p> : null
                                            }
                                            {
                                                submit && state.passwordError == true
                                                    ?
                                                    <p style={{ paddingLeft: 10, color: 'red', margin: 0, fontSize: 12, fontFamily: 'Roboto' }}>
                                                        {localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).passwordErr : ''}
                                                    </p>
                                                    :
                                                    null
                                            }
                                            {
                                                submit && state.passwordError == 'passwordlengtherror'
                                                    ?
                                                    <p style={{ paddingLeft: 10, color: 'red', margin: 0, fontSize: 12, fontFamily: 'Roboto' }}>
                                                        {localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).invalidpasswordErr : ''}
                                                    </p>
                                                    :
                                                    null
                                            }
                                        </div>
                                        <div className="" style={{ width: '100%', marginTop: '10px', justifyContent: 'center' }}>
                                            <input
                                                type='submit'
                                                value={
                                                    localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).signup : ''
                                                }
                                                autoComplete={'off'}
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
                                                {localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).haveaccount : ''}
                                                <a
                                                    style={{ textDecoration: 'underline', color: '#002a4a' }}
                                                    href="#">
                                                    {localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).signin : ''}
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

export default Registration;
