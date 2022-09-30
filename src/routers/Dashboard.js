import React, { useEffect, useState, useRef } from 'react';
import './../App.css';
import APICallingService from './../services/APICallingService';
import { fetchVisitorService } from './../services/webServices';

import config from './../config/config';
import DropdownList from './../components/DropdownList';
import IdleTimer from 'react-idle-timer';
import { fetchLanguageListService } from './../services/webServices';
import axios from 'axios';
const Dashboard = (props) => {

    const [language, setLanguage] = useState('En');
    const [languageFullName, setLanguageFullName] = useState('English');
    const [langData, setLangData] = useState([]);
    const [tempVariable, setTempVariable] = useState(false);
    const idleTimer = useRef(null);
    const [visitorCounter , setVisitorCounter] = useState(0);
    const [ip, setIP] = useState('');
    const helperMethod = (url, payload) => {
        return APICallingService.sendRequestForPostWithAuth(url, payload, '', (res) => {
        });
    }
    const getData = async () => {
        const res = await axios.get('https://geolocation-db.com/json/')
        console.log(res.data);
        setIP(res.data.IPv4)
        fetchVisitorService(res.data, (CB) => {
            console.log(CB);
            if (CB.status === "Success") {
                console.log(CB);
            }
        });
        let url = config.url.visitorcount
        let visitors = await APICallingService.sendRequestForGet(url,'', (res) => {  });
        console.log(visitors);
        setVisitorCounter(visitors.visitor_count)
      
    
    }
      
      useEffect( () => {
        //passing getData method to the lifecycle method
        getData()
    
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
                        if (res.status == "Success") {
                            localStorage.setItem(localStorageName, JSON.stringify(res.data));
                        } else {
                            alert('Something went wrong')
                        }
                    }
                    setLangData(tempData)
                    setTempVariable(true);
                }
            } else {
                alert('Something went wrong')
            }
        });
    }

    useEffect(() => {
        getLangList();
        localStorage.removeItem('LoginData');
        let lang = localStorage.getItem('language');
        let offsetTimeZone = new Date().getTimezoneOffset();
        debugger;
        if (lang == null) {
            if ((offsetTimeZone == 300) || (offsetTimeZone == 240) || (offsetTimeZone == 180)) {
                localStorage.setItem('language', 'Sp');
                setLanguage('Sp');
                setLanguageFullName('Spanish')
            }
            else {
                localStorage.setItem('language', 'En');
                setLanguage('En');
                setLanguageFullName('English')
            }
        }
        else {
            if (navigator.language) {
                let language = navigator.language;
                try {
                    language = language.split('-');
                    if (language[0] == 'es') {
                        setLanguage('Sp');
                        setLanguageFullName('Spanish');
                        localStorage.setItem('language', 'Sp');
                    }
                    else if (lang === 'Sp') {
                        setLanguage('Sp');
                        setLanguageFullName('Spanish');
                    }
                    else if (lang === 'En') {
                        setLanguage('En');
                        setLanguageFullName('English');
                    }
                    else if (lang === 'Od') {
                        setLanguage('Od');
                        setLanguageFullName('Odiya');
                    }
                    else if (lang === 'Hi') {
                        setLanguage('Hi');
                        setLanguageFullName('Hindi');
                    }
                    else if (lang === 'Fi') {
                        setLanguage('Fi');
                        setLanguageFullName('Filipino');
                    }
                    else {
                        if ((offsetTimeZone == 300) || (offsetTimeZone == 240) || (offsetTimeZone == 180)) {
                            localStorage.setItem('language', 'Sp');
                            setLanguage('Sp');
                            setLanguageFullName('Spanish');
                        }
                        else {
                            localStorage.setItem('language', 'En');
                            setLanguage('En');
                            setLanguageFullName('English');
                        }
                    }
                }
                catch (error) {
                }
            }
            else {
                if ((offsetTimeZone == 300) || (offsetTimeZone == 240) || (offsetTimeZone == 180)) {
                    localStorage.setItem('language', 'Sp');
                    setLanguage('Sp');
                    setLanguageFullName('Spanish');
                } else {
                    localStorage.setItem('language', 'En');
                    setLanguage('En');
                    setLanguageFullName('English');
                }
            }
        }
    }, []);

    const onTextChange = ({ target: { name, value } }) => {
        let lang = value.substring(0, 2);
        setLanguage(lang);
        setLanguageFullName(value)
        localStorage.setItem('language', lang);
    }

    const handleOnIdle = event => {
        console.log('user is idle', event);
        // console.log('last active', getLastActiveTime())
        localStorage.removeItem('LoginData');
        alert("Session is timeout");
        props.history.replace({
            pathname: 'login',
        })
    }

    return (
        <IdleTimer
            ref={idleTimer}
            timeout={1000 * 60 * 15}
            // onActive={handleOnActive}
            onIdle={handleOnIdle}
            // onAction={handleOnAction}
            debounce={250}
        >
            <>
                <section className="bg-img" >
                    <div className="container-fluid">
                        <div className="row " style={{ marginRight: '0px' }}>
                            <div className="col-md-12 col-8" style={{}}>
                                <div className="row tabmargin" style={{ marginRight: '0px' }}>
                                    <div className="col-md-3 col-3">
                                        <a target="_blank" href='https://www.undrr.org/'>
                                            <img
                                                style={{ marginTop: '1vh', marginLeft: '2vw', width: '85%' }}
                                                alt="COVID-19 RESPONSE logo"
                                                src={require('./../assets/img/images/undrrlogocolor.png')}
                                                className="img-fluid" />
                                        </a>
                                    </div>
                                    <div className="col-md-5 col-5" />
                                    <div className="col-md-4 col-4" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                        <img
                                            src={require('./../assets/img/images/logo-covid-response.png')}
                                            alt="COVID-19 RESPONSE logo"
                                            src={(window.orientation == 90 || window.orientation == 270) && window.innerWidth < 850 ? require('./../assets/img/images/logo-covid-response.png') : require('./../assets/img/images/logo-covid-response1.png')}
                                            style={{ width: '85%' }}
                                            className="img-fluid " />
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-12" style={{ justifyContent: 'flex-end', display: 'flex' }}>
                                <div className='visitor' style={{fontSize: 20,marginRight:20,marginTop:5}}>
                                 Visitor Count: {visitorCounter}
                                </div>
                                
                                <DropdownList
                                    value={languageFullName}
                                    name="language"
                                    onChange={onTextChange}
                                    placeholder="Select Language"
                                    className="w-100"
                                    wrapClass="wrap"
                                    isRequired={false}
                                    isDisabled={false}
                                    options={langData}
                                />
                            </div>
                            <div className='row container-fluid dashboardPrName' style={{ marginRight: '0px' }}>
                                <div className="col-md-6 abouttool" style={{}}>
                                    <div className='row'>
                                        <div className="col-md-6">
                                            <p className="toolPara" style={{ color: '#002a4a', fontSize: 15, fontFamily: 'Roboto', textAlign: 'justify' }}>
                                                {localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).toolInfo : ''}
                                            </p>
                                        </div>
                                        <div className="col-md-6"></div>
                                    </div>
                                </div>
                                <div className="col-md-6 mobileBanerTop">
                                    <h1 className={language == 'sp' ? 'bannerHeaderSP' : 'bannerHeader'}>
                                        {localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).toolName : ''}
                                    </h1>
                                    <p className='bannerHeader' style={{ fontSize: language == 'sp' ? '1.2rem' : '1.3rem' }}>
                                        {localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).forEnterprises : ''}
                                    </p>
                                    <div className='tooltourDiv fullWidthDiv'>
                                        <a
                                            style={{ cursor: 'pointer' }}
                                            className={language == 'sp' ? "pull-left btn1SP bannerbtn1" : "pull-left btn1 bannerbtn1"}
                                            onClick={() => {
                                                props.history.push('aboutTool')
                                            }}>
                                            {localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).aboutTool : ''}
                                        </a>
                                        <a
                                            style={{ cursor: 'pointer' }}
                                            className={language == 'sp' ? "pull-right btn1SP bannerbtn1" : "pull-right btn1 bannerbtn1"}
                                            onClick={() => {
                                                props.history.push('login')
                                            }}>
                                            {localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).takeMeSurvey : ''}
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div className="row footerLogo" style={{ marginRight: '0px' }} >
                                <div className="col-md-8 col-12" style={{ display: 'felx', flexDirection: 'row' }} >
                                    <p style={{ color: 'black', fontSize: 18, fontFamily: 'Roboto', marginLeft: '5px', marginBottom: 0, color: window.innerWidth < 481 ? 'white' : '#002a4a', marginLeft: window.innerWidth < 481 ? '0px' : '2vw' }}>
                                        {localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).inParnership : ''}
                                    </p>
                                    <div className="row">
                                        <div className="col-md-2 col-4">
                                            <img
                                                style={{ width: window.innerWidth < 481 ? '100%' : '100%' }}
                                                alt="RIKA"
                                                src={require("./../assets/img/images/rikalogo.png")}
                                                className="img-fluid" />
                                        </div>
                                        <div className="col-md-2 col-4">
                                            <img
                                                style={{ width: window.innerWidth < 481 ? '100%' : '100%' }}
                                                alt="Profecia Links"
                                                src={window.innerWidth < 481 ? require("./../assets/img/images/PLAD_white_small.png") : require("./../assets/img/images/PLAD_medium.png")}
                                                className="img-fluid" />
                                        </div>
                                        <div className="col-md-4 col-4">
                                            <img
                                                style={{ width: window.innerWidth < 481 ? '100%' : 'unset', height: window.innerWidth < 481 ? '100%' : 'unset', marginTop: window.innerWidth > 1024 ? '2vh' : '0px' }}
                                                src={window.innerWidth < 481 ? require("./../assets/img/images/partner-adbc.png") : require("./../assets/img/images/ADPC_fullname_logo.png")}
                                                alt="Asian Disaster Preparedness Center (ADPC)"
                                                className="img-fluid" />
                                        </div>
                                        <div className="col-md-4 col-1" />
                                    </div>
                                </div>
                                <div
                                    className="col-md-4 col-4"
                                    style={{ padding: 0 }} />
                            </div>
                        </div>
                    </div>
                </section>
            </>
        </IdleTimer>
    );
}

export default Dashboard;
