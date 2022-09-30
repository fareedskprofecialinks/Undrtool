import React, { useState, useEffect } from 'react';
import './../App.css';

import { changePasswordService, fetchLanguageListService } from './../services/webServices';
import { useLocation } from "react-router-dom";

import i18n from './../utils/i18n';
import ReactTooltip from 'react-tooltip';
import APICallingService from './../services/APICallingService';
import config from './../config/config';

const ChangePassword = (props) => {
    const [submit, setSubmit] = useState(false);
    const [token, setToken] = useState('');
    const [state, setState] = useState({
        password: '',
        passwordError: true,
    });
    const location = useLocation();

    const [language, setLanguage] = useState('en');

    useEffect(() => {
        getLangList();
    }, []);

    const getLangList = () => {
        fetchLanguageListService(async (CB) => {
            if (CB.status == "Success") {
                let data = CB.data;
                let tempData = [];
                if (data && data.length > 0) {
                    for (let index = 0; index < data.length; index++) {
                        let element = data[index];

                        let obj = {};
                        obj.id = element.id;
                        obj.Name = element.language;
                        obj.language = element.language;
                        obj.file_name = element.file_name;
                        obj.direction = element.direction;
                        obj.status = element.status;
                        obj.created_at = element.created_at;
                        obj.flag = element.flag;
                        obj.file_path = element.file_path;
                        obj.flag_path = element.flag_path;

                        let tempFileName = element.file_name.split('.');
                        let fileName = tempFileName[0];
                        let nameCapitalized = fileName.charAt(0).toUpperCase() + fileName.slice(1);
                        let localStorageName = `LangDataFor${nameCapitalized}`;
                        let url = config.url.languageUrl
                        let payload = {
                            filename: element.file_path
                        }
                        tempData.push(obj)

                        let res = await APICallingService.sendRequestForPostWithAuth(url, payload, '', (res) => { });
                        
                        localStorage.removeItem('LoginData');
                        let lang = localStorage.getItem('language');
                        if (lang) {
                            setLanguage(lang);
                        } else {
                            localStorage.setItem('language', 'En');
                            setLanguage('En');
                        }

                        if (res.status == "Success") {
                            localStorage.setItem(localStorageName, JSON.stringify(res.data));
                        } else {
                            alert('Something went wrong')
                        }
                    }
                }
            } else {
                alert('Something went wrong')
            }
        });
    }

    useEffect(() => {
        let pathToken = location.search.split("=");
        if (pathToken.length > 0)
            setToken(pathToken[1]);
    }, [location]);

    const changepassword = (e) => {
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

    const submitForm = (e) => {
        e.preventDefault()
        setSubmit(true)
        let passwordError = state.passwordError;
        if (state.password.length < 8) {
            passwordError = true;
            setState(prevState => {
                return { ...prevState, passwordError: 'passwordlengtherror' }
            })
        }
        if (!passwordError) {

            let payload = {
                password: state.password,
                token: token
            }

            changePasswordService(payload, token, (CB) => {
                if (CB.status == "Success") {
                    language == 'sp'
                        ?
                        alert('¡Contraseña actualizada exitosamente!')
                        :
                        alert('Password updated successfully!')
                    props.history.replace({
                        pathname: 'login',
                    })
                } else {
                    language == 'sp'
                        ?
                        alert('Enlace de contraseña no válido')
                        :
                        alert('Invalid password link')
                }
            });
        }

    }

    return (
        <section className="bg-img" >
            <div className="container-fluid" style={{ borderBottom: '3px solid #dedede' }}>
                <div className="row head-img" >
                    <div className="col-md-12 ">
                        <div className="row tabmargin">
                            <div className="col-md-3 col-3">
                                <a target="_blank" href='https://www.undrr.org/'>
                                    <img
                                        style={{ marginTop: '1vh', marginLeft: '2vw', width: '85%' }}
                                        src={require('./../assets/img/images/undrrlogocolor.png')}
                                        alt="COVID-19 RESPONSE logo"
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
                                    alt="COVID-19 RESPONSE logo"
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
                                    style={{ margin: 'auto', display: 'block', height: '100%', width: '100%' }} className="img-responsive"
                                    alt="Login-box-bg"
                                    src={require('./../assets/img/images/login/Login-box-bg.png')} />
                            </div>
                            <div className="col-md-6 col-12">
                                <p style={{ fontSize: 25, padding: '5px', color: '#002a4a', textAlign: 'center', marginBottom: '0.5rem', fontFamily: 'Roboto', width: '90%', borderBottom: '1px solid #002a4a' }}>
                                    {
                                        localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).changePassword : ''
                                    }
                                </p>
                                <form action="" onSubmit={submitForm} >
                                    <div className="row" style={{ padding: '10px', width: '100%' }}>

                                        <div className={"col-md-12 col-12"} style={{ padding: '5px', width: '80%' }}>
                                            <ReactTooltip />
                                            <div className="input-group ">

                                                <span className="input-group-text" id="basic-addon1">
                                                    <img
                                                        className="img-responsive"
                                                        alt="password"
                                                        src={require('./../assets/img/images/login/password.png')} />
                                                </span>
                                                <input
                                                    type="text"
                                                    placeholder={
                                                        localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).password : ''
                                                    }
                                                    aria-label={'password'}
                                                    aria-required="true"
                                                    className="form-control"
                                                    maxLength={50}
                                                    name='password'
                                                    onChange={changepassword}
                                                    value={state.password}
                                                    style={{ height: 40 }}
                                                    data-html={true}
                                                    data-tip="&amp;#8226; Use atleast 12 characters.<br />
                                                    &amp;#8226; Include both lowercase and uppercase characters.<br />
                                                    &amp;#8226; Include atleast one number or symbol.<br />
                                                    &amp;#8226; Password should not be based on any personal information such as user id, family name, pet, birthday, friends, co-workers, addresses, phone numbers, etc."
                                                />
                                            </div>
                                            {
                                                state.passwordError === 'invalidPassword' ? <p style={{ paddingLeft: 10, color: 'red', margin: 0, fontSize: 12, fontFamily: 'Roboto' }}>
                                                    {
                                                        'Use atleast 12 characters. Include both lowercase and uppercase characters. Include atleast one number and special character'
                                                    }
                                                </p> : null
                                            }
                                            {
                                                submit && state.passwordError
                                                    ?
                                                    <p style={{ paddingLeft: 10, color: 'red', margin: 0, fontSize: 12, fontFamily: 'Roboto' }}>
                                                        {
                                                            localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).passwordErr : ''
                                                        }
                                                    </p>
                                                    :
                                                    null
                                            }
                                            {
                                                submit && state.passwordError == 'passwordlengtherror'
                                                    ?
                                                    <p style={{ paddingLeft: 10, color: 'red', margin: 0, fontSize: 12, fontFamily: 'Roboto' }}>
                                                        {
                                                            localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).invalidpasswordErr : ''
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
                                                style={{ width: '100%', borderRadius: 5, padding: '5px', margin: 'auto', backgroundColor: '#002a4a' }}
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
                                    </div>
                                </form >
                            </div>
                        </div>
                    </div>
                </div >
            </div >
        </section >
    );
}

export default ChangePassword;
