import React, { useState, useEffect, useRef } from 'react';
import './../App.css';
import ReactSpeedometer from "../components/ReactSpeedometerComponent";
import ApexCharts from "react-apexcharts";
import 'leaflet/dist/leaflet.css';
import i18n from './../utils/i18n';
import _validator from './../config/validator';
import Speech from 'speak-tts';
import IdleTimer from 'react-idle-timer';

import { useIdleTimer } from 'react-idle-timer';
import { useMap, useGraphics } from 'esri-loader-hooks';
import { setDefaultOptions } from "esri-loader";
import { isString } from 'lodash';
import { getLocations, sendFeedback } from './../services/webServices';
import { geolocated } from "react-geolocated";
import { useLocation } from "react-router-dom";

setDefaultOptions({ css: true });

const ResultDashboard = (props) => {
    const position1 = [17.505, 75.09]
    const [position, setPosition] = useState([17, 75]);
    const [focusOn, setFocusOn] = useState(Array());
    const [nearme, setNearme] = useState(Array());
    const [adviceSpeech, setAdviceSpeech] = useState('');
    const [userId, setUserId] = useState('');
    const [assesmentType, setAssesmentType] = useState('');
    const [submitFeedback, setSubmitFeedback] = useState(false);
    const [fromResultPage, setFromResultPage] = useState(false);
    const [switchToCovidDashboard, setSwitchToCovidDashboard] = useState(true);

    const [state, setState] = useState({
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
    });

    const [stateMultiHazard, setStateMultiHazard] = useState({
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
        PI: 0,
        risk_value: 0,
        hazardsArray: []
    });

    const [pastData, setPastData] = useState({
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
    });

    const [pastDataMultiHazard, setPastDataMultiHazard] = useState({
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
        PI: 0,
        risk_value: 0,
        hazardsArray: []
    });

    const [feedbackForm, setFeedbackForm] = useState({
        fullName: '',
        email: '',
        phone: '',
        feedback: '',
        fullNameError: true,
        emailError: true,
        phoneError: true,
        feedbackError: true
    });

    const location = useLocation();
    // const [language, setLanguage] = useState('en');
    const [language, setLanguage] = useState('');
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

        navigator.geolocation.getCurrentPosition((position) => {
            setPosition([position.coords.latitude, position.coords.longitude])
        })
    }, [])

    useEffect(() => {
        init();
    }, [adviceSpeech]);

    const graphics = [];

    useEffect(() => {
        let language = localStorage.getItem('language');
        debugger;
        setLanguage(language);
        if (location.state && (location.state.pastResultData || location.state.pastHazardResultData)) {
            if (location.state.pastResultData) {
                setPastData(location.state.pastResultData);
                setState(
                    prevState => {
                        return { ...prevState, Ro: location.state.pastResultData.Ro ? location.state.pastResultData.Ro : 0 }
                    }
                )
            }
            if (location.state.pastHazardResultData) {
                // setStateMultiHazard(location.state.pastResultData);
                setPastDataMultiHazard(location.state.pastHazardResultData);

                setStateMultiHazard(
                    prevState => {
                        return { ...prevState, risk_value: location.state.pastHazardResultData.risk_value ? location.state.pastHazardResultData.risk_value : 0, Ro: location.state.pastHazardResultData.risk_value ? location.state.pastHazardResultData.risk_value : 0, hazardsArray: location.state.pastHazardResultData.hazardsArray ? location.state.pastHazardResultData.hazardsArray : [] }
                    }
                )
            }

            setUserId(location.state.userId ? location.state.userId : '');
            let temp, arr = [], Ro;

            if (switchToCovidDashboard) {
                temp = location.state.pastResultData ? location.state.pastResultData : location.state.resultData;
                arr = [];
                let HR = (temp.HR * 100) / 12, OP = (temp.OP * 100) / 14, FIN = (temp.FIN * 100) / 10, TI = (temp.TI * 100) / 5, MKT = (temp.MKT * 100) / 6, GP = (temp.GP * 100) / 10, HE = (temp.HE * 100) / 4;
                Ro = temp.Ro ? temp.Ro : 0;
                if (HR > 60) {
                    // arr.push(i18n[language == 'sp' ? 'sp' : 'en'].questionnaire.HR)
                    arr.push(localStorage.getItem(`LangDataFor${language}`)
                        ?
                        JSON.parse(localStorage.getItem(`LangDataFor${language}`)).HR
                        :
                        '')
                }
                if (OP >= 60) {
                    // arr.push(i18n[language == 'sp' ? 'sp' : 'en'].questionnaire.OP)
                    arr.push(localStorage.getItem(`LangDataFor${language}`)
                        ?
                        JSON.parse(localStorage.getItem(`LangDataFor${language}`)).OP
                        :
                        '')
                }
                if (FIN >= 60) {
                    // arr.push(i18n[language == 'sp' ? 'sp' : 'en'].questionnaire.FIN)
                    arr.push(localStorage.getItem(`LangDataFor${language}`)
                        ?
                        JSON.parse(localStorage.getItem(`LangDataFor${language}`)).FIN
                        :
                        '')
                }
                if (TI >= 60) {
                    // arr.push(i18n[language == 'sp' ? 'sp' : 'en'].questionnaire.TI)
                    arr.push(localStorage.getItem(`LangDataFor${language}`)
                        ?
                        JSON.parse(localStorage.getItem(`LangDataFor${language}`)).TI
                        :
                        '')
                }
                if (MKT >= 60) {
                    // arr.push(i18n[language == 'sp' ? 'sp' : 'en'].questionnaire.MKT)
                    arr.push(localStorage.getItem(`LangDataFor${language}`)
                        ?
                        JSON.parse(localStorage.getItem(`LangDataFor${language}`)).MKT
                        :
                        '')
                }
                if (GP >= 60) {
                    // arr.push(i18n[language == 'sp' ? 'sp' : 'en'].questionnaire.GP)
                    arr.push(localStorage.getItem(`LangDataFor${language}`)
                        ?
                        JSON.parse(localStorage.getItem(`LangDataFor${language}`)).GP
                        :
                        '')
                }
                if (HE >= 60) {
                    // arr.push(i18n[language == 'sp' ? 'sp' : 'en'].questionnaire.EXH)
                    arr.push(localStorage.getItem(`LangDataFor${language}`)
                        ?
                        JSON.parse(localStorage.getItem(`LangDataFor${language}`)).EXH
                        :
                        '')
                }
            }
            else {
                temp = location.state.pastHazardResultData ? location.state.pastHazardResultData : location.state.resultData;
                arr = [];
                debugger
                let HR = (temp.HR * 100) / 31, OP = (temp.OP * 100) / 29, FIN = (temp.FIN * 100) / 10, TI = (temp.TI * 100) / 13, MKT = (temp.MKT * 100) / 15, GP = (temp.GP * 100) / 6, HE = (temp.HE * 100) / 4, PI = (temp.PI * 100) / 9;
                Ro = temp.Ro ? temp.Ro : 0;
                if (HR >= 60) {
                    // arr.push(i18n[language == 'sp' ? 'sp' : 'en'].questionnaire.HR)
                    arr.push(localStorage.getItem(`LangDataFor${language}`)
                        ?
                        JSON.parse(localStorage.getItem(`LangDataFor${language}`)).HR
                        :
                        '')
                }
                if (OP >= 60) {
                    // arr.push(i18n[language == 'sp' ? 'sp' : 'en'].questionnaire.OP)
                    arr.push(localStorage.getItem(`LangDataFor${language}`)
                        ?
                        JSON.parse(localStorage.getItem(`LangDataFor${language}`)).OP
                        :
                        '')
                }
                // alert(FIN)
                if (FIN >= 60) {
                    // arr.push(i18n[language == 'sp' ? 'sp' : 'en'].questionnaire.FIN)
                    arr.push(localStorage.getItem(`LangDataFor${language}`)
                        ?
                        JSON.parse(localStorage.getItem(`LangDataFor${language}`)).FIN
                        :
                        '')
                }
                if (TI >= 60) {
                    // arr.push(i18n[language == 'sp' ? 'sp' : 'en'].questionnaire.TI)
                    arr.push(localStorage.getItem(`LangDataFor${language}`)
                        ?
                        JSON.parse(localStorage.getItem(`LangDataFor${language}`)).TI
                        :
                        '')
                }
                if (MKT >= 60) {
                    // arr.push(i18n[language == 'sp' ? 'sp' : 'en'].questionnaire.MKT)
                    arr.push(localStorage.getItem(`LangDataFor${language}`)
                        ?
                        JSON.parse(localStorage.getItem(`LangDataFor${language}`)).MKT
                        :
                        '')
                }
                if (GP >= 60) {
                    // arr.push(i18n[language == 'sp' ? 'sp' : 'en'].questionnaire.GP)
                    arr.push(localStorage.getItem(`LangDataFor${language}`)
                        ?
                        JSON.parse(localStorage.getItem(`LangDataFor${language}`)).GP
                        :
                        '')
                }
                // if (HE >= 60) {
                //     // arr.push(i18n[language == 'sp' ? 'sp' : 'en'].questionnaire.EXH)
                //     arr.push(localStorage.getItem(`LangDataFor${language}`)
                //         ?
                //         JSON.parse(localStorage.getItem(`LangDataFor${language}`)).EXH
                //         :
                //         '')
                // }
                if (PI >= 60) {
                    // arr.push(i18n[language == 'sp' ? 'sp' : 'en'].questionnaire.EXH)
                    arr.push(localStorage.getItem(`LangDataFor${language}`)
                        ?
                        "Physical Infrastructure"
                        // JSON.parse(localStorage.getItem(`LangDataFor${language}`)).PI
                        :
                        '')
                }
            }

            setFocusOn(arr);
            let array = [];
            let urlAppend = `latitude=${location.state.position[0]}&longitude=${location.state.position[1]}&radius=50000000000`

            getLocations(urlAppend, (CB) => {
                if (CB.status == 'Success') {
                    let data = CB.data;
                    if (data.length) {
                        for (let index = 0; index < data.length; index++) {
                            const element = data[index];
                            let score = isString(element.score) ? JSON.parse(element.score) : element.score;
                            if (element.longitude != 0 && element.latitude != 0) {
                                array.push(
                                    {
                                        geometry: {
                                            type: "point",
                                            longitude: element.longitude,
                                            latitude: element.latitude
                                        },
                                        symbol: {
                                            type: "picture-marker",
                                            url: score && score.Ro < 1.99
                                                ?
                                                require('./../assets/img/Location/green.png')
                                                :
                                                ((score && score.Ro > 1.99) && (score && score.Ro < 5.2))
                                                    ?
                                                    require('./../assets/img/Location/orange.png')
                                                    :
                                                    require('./../assets/img/Location/red.png'),
                                            // url: require('./../assets/img/Location/green.png'),
                                        },
                                        user_id: element.user_id
                                    }
                                )
                            }
                        }
                    }
                    array.push({
                        geometry: {
                            type: "point",
                            longitude: location.state && location.state.position ? location.state.position[1] : 0,
                            latitude: location.state && location.state.position ? location.state.position[0] : 0
                        },
                        symbol: {
                            type: "picture-marker",
                            url: Ro < 1.99
                                ?
                                require('./../assets/img/Location/green.png')
                                :
                                ((Ro > 1.99) && (Ro < 5.2))
                                    ?
                                    require('./../assets/img/Location/orange.png')
                                    :
                                    require('./../assets/img/Location/red.png'),
                            // url: require('./../assets/img/Location/green.png'),
                        },
                        user_id: null
                    })
                    setNearme(array)
                } else {
                    array.push({
                        geometry: {
                            type: "point",
                            longitude: location.state && location.state.position ? location.state.position[1] : 0,
                            latitude: location.state && location.state.position ? location.state.position[0] : 0
                        },
                        symbol: {
                            type: "picture-marker",
                            url: Ro < 1.99 ? require('./../assets/img/Location/green.png') : ((Ro > 1.99) && (Ro < 5.2)) ? require('./../assets/img/Location/orange.png') : require('./../assets/img/Location/red.png'),
                            // url: require('./../assets/img/Location/green.png'),
                        },
                        user_id: null
                    })
                    setNearme(array)
                }
            });

            // let adviceSpeech = i18n[language == 'sp' ? 'sp' : 'en'].resultDashboard.adviceforYou;
            let adviceSpeech = localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).adviceforYou : '';

            if (switchToCovidDashboard) {
                if (temp.Ro > 6.81) {
                    // adviceSpeech = adviceSpeech + i18n[language == 'sp' ? 'sp' : 'en'].resultDashboard.veryHighRisk + '-' + i18n[language == 'sp' ? 'sp' : 'en'].resultDashboard.veryHighRiskData;
                    adviceSpeech = adviceSpeech + localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).veryHighRisk : '' + '-' + localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).veryHighRiskData : ''
                }
                else if ((temp.Ro >= 5.21) && (temp.Ro <= 6.81)) {
                    // adviceSpeech = adviceSpeech + i18n[language == 'sp' ? 'sp' : 'en'].resultDashboard.highRisk + '-' + i18n[language == 'sp' ? 'sp' : 'en'].resultDashboard.highRiskData
                    adviceSpeech = adviceSpeech + localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).highRisk : '' + '-' + localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).highRiskData : ''
                }
                else if ((temp.Ro > 3.59) && (temp.Ro < 5.21)) {
                    // adviceSpeech = adviceSpeech + i18n[language == 'sp' ? 'sp' : 'en'].resultDashboard.mediumRisk + '-' + i18n[language == 'sp' ? 'sp' : 'en'].resultDashboard.mediumRiskData
                    adviceSpeech = adviceSpeech + localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).mediumRisk : '' + '-' + localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).mediumRiskData : ''
                }
                else if ((temp.Ro >= 1.99) && (temp.Ro <= 3.59)) {
                    // adviceSpeech = adviceSpeech + i18n[language == 'sp' ? 'sp' : 'en'].resultDashboard.lowRisk + '-' + i18n[language == 'sp' ? 'sp' : 'en'].resultDashboard.lowRiskData
                    adviceSpeech = adviceSpeech + localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).lowRisk : '' + '-' + localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).lowRiskData : ''
                }
                else if (temp.Ro < 1.99) {
                    // adviceSpeech = adviceSpeech + i18n[language == 'sp' ? 'sp' : 'en'].resultDashboard.veryLowRisk + '-' + i18n[language == 'sp' ? 'sp' : 'en'].resultDashboard.veryLowRiskData
                    adviceSpeech = adviceSpeech + localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).veryLowRisk : '' + '-' + localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).veryLowRiskData : ''
                }
            }
            else {
                if (temp.Ro > 520) {
                    // adviceSpeech = adviceSpeech + i18n[language == 'sp' ? 'sp' : 'en'].resultDashboard.veryHighRisk + '-' + i18n[language == 'sp' ? 'sp' : 'en'].resultDashboard.veryHighRiskData;
                    adviceSpeech = adviceSpeech + localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).veryHighRisk : '' + '-' + localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).veryHighRiskData : ''
                }
                else if ((temp.Ro >= 390) && (temp.Ro <= 520)) {
                    // adviceSpeech = adviceSpeech + i18n[language == 'sp' ? 'sp' : 'en'].resultDashboard.highRisk + '-' + i18n[language == 'sp' ? 'sp' : 'en'].resultDashboard.highRiskData
                    adviceSpeech = adviceSpeech + localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).highRisk : '' + '-' + localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).highRiskData : ''
                }
                else if ((temp.Ro > 260) && (temp.Ro < 390)) {
                    // adviceSpeech = adviceSpeech + i18n[language == 'sp' ? 'sp' : 'en'].resultDashboard.mediumRisk + '-' + i18n[language == 'sp' ? 'sp' : 'en'].resultDashboard.mediumRiskData
                    adviceSpeech = adviceSpeech + localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).mediumRisk : '' + '-' + localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).mediumRiskData : ''
                }
                else if ((temp.Ro >= 130) && (temp.Ro <= 260)) {
                    // adviceSpeech = adviceSpeech + i18n[language == 'sp' ? 'sp' : 'en'].resultDashboard.lowRisk + '-' + i18n[language == 'sp' ? 'sp' : 'en'].resultDashboard.lowRiskData
                    adviceSpeech = adviceSpeech + localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).lowRisk : '' + '-' + localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).lowRiskData : ''
                }
                else if (temp.Ro < 130) {
                    // adviceSpeech = adviceSpeech + i18n[language == 'sp' ? 'sp' : 'en'].resultDashboard.veryLowRisk + '-' + i18n[language == 'sp' ? 'sp' : 'en'].resultDashboard.veryLowRiskData
                    adviceSpeech = adviceSpeech + localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).veryLowRisk : '' + '-' + localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).veryLowRiskData : ''
                }
            }

            let focusOn = ''
            arr.map((item, index) => {
                return index >= (arr.length - 1) ? focusOn = focusOn + item + '' : focusOn = focusOn + item + ', '
            })
            // adviceSpeech = adviceSpeech + i18n[language == 'sp' ? 'sp' : 'en'].resultDashboard.focusOn + focusOn + i18n[language == 'sp' ? 'sp' : 'en'].resultDashboard.focusOnsecond
            adviceSpeech = adviceSpeech + localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).focusOn : '' + focusOn + localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).focusOnsecond : ''
            adviceSpeech = adviceSpeech + 'As the business has high exposure to disasters, emergency plan and detailed disaster control measures for the business should be made available to the workers employed.'
            // adviceSpeech = adviceSpeech + i18n[language == 'sp' ? 'sp' : 'en'].resultDashboard.statement1 + i18n[language == 'sp' ? 'sp' : 'en'].resultDashboard.statement2a + i18n[language == 'sp' ? 'sp' : 'en'].resultDashboard.statement2b + i18n[language == 'sp' ? 'sp' : 'en'].resultDashboard.statement3a + i18n[language == 'sp' ? 'sp' : 'en'].resultDashboard.statement3b
            adviceSpeech = adviceSpeech + localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).statement1 : '' + localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).statement2a : '' + localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).statement2b : '' + localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).statement3a : '' + localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).statement3b : ''

            setAdviceSpeech(adviceSpeech);
        }

        if (location.state && (location.state.resultData || location.state.hazardresultData || location.state.guestUser)) {

            if (location.state.resultData && location.state.assesment_type && (location.state.assesment_type !== 'multihazard')) {
                setState(location.state.resultData);
            }
            if (location.state.hazardresultData) {
                setStateMultiHazard(location.state.hazardresultData);
            }

            if (location.state.pastData) {
                setPastData(location.state.pastData);
            }
            if (location.state.pastDataMultiHazard) {
                setPastDataMultiHazard(location.state.pastDataMultiHazard);
            }
            setUserId(location.state.userId ? location.state.userId : '');

            setAssesmentType(location.state.assesment_type ? location.state.assesment_type : 'covid')
            let switchToCovidDashboardtemp = switchToCovidDashboard;
            if (!fromResultPage) {
                setSwitchToCovidDashboard(location.state.assesment_type == 'multihazard' ? false : true);   
                switchToCovidDashboardtemp = location.state.assesment_type == 'multihazard' ? false : true;
            }
            let temp, arr = [], Ro;

            if (switchToCovidDashboardtemp) {
                temp = location.state.pastResultData ? location.state.pastResultData : location.state.resultData;
                arr = [];
                let HR = (temp.HR * 100) / 12, OP = (temp.OP * 100) / 14, FIN = (temp.FIN * 100) / 10, TI = (temp.TI * 100) / 5, MKT = (temp.MKT * 100) / 6, GP = (temp.GP * 100) / 10, HE = (temp.HE * 100) / 4;
                Ro = temp.Ro ? temp.Ro : 0;
                if (HR > 60) {
                    // arr.push(i18n[language == 'sp' ? 'sp' : 'en'].questionnaire.HR)
                    arr.push(localStorage.getItem(`LangDataFor${language}`)
                        ?
                        JSON.parse(localStorage.getItem(`LangDataFor${language}`)).HR
                        :
                        '')
                }
                if (OP >= 60) {
                    // arr.push(i18n[language == 'sp' ? 'sp' : 'en'].questionnaire.OP)
                    arr.push(localStorage.getItem(`LangDataFor${language}`)
                        ?
                        JSON.parse(localStorage.getItem(`LangDataFor${language}`)).OP
                        :
                        '')
                }
                if (FIN >= 60) {
                    // arr.push(i18n[language == 'sp' ? 'sp' : 'en'].questionnaire.FIN)
                    arr.push(localStorage.getItem(`LangDataFor${language}`)
                        ?
                        JSON.parse(localStorage.getItem(`LangDataFor${language}`)).FIN
                        :
                        '')
                }
                if (TI >= 60) {
                    // arr.push(i18n[language == 'sp' ? 'sp' : 'en'].questionnaire.TI)
                    arr.push(localStorage.getItem(`LangDataFor${language}`)
                        ?
                        JSON.parse(localStorage.getItem(`LangDataFor${language}`)).TI
                        :
                        '')
                }
                if (MKT >= 60) {
                    // arr.push(i18n[language == 'sp' ? 'sp' : 'en'].questionnaire.MKT)
                    arr.push(localStorage.getItem(`LangDataFor${language}`)
                        ?
                        JSON.parse(localStorage.getItem(`LangDataFor${language}`)).MKT
                        :
                        '')
                }
                if (GP >= 60) {
                    // arr.push(i18n[language == 'sp' ? 'sp' : 'en'].questionnaire.GP)
                    arr.push(localStorage.getItem(`LangDataFor${language}`)
                        ?
                        JSON.parse(localStorage.getItem(`LangDataFor${language}`)).GP
                        :
                        '')
                }
                if (HE >= 60) {
                    // arr.push(i18n[language == 'sp' ? 'sp' : 'en'].questionnaire.EXH)
                    arr.push(localStorage.getItem(`LangDataFor${language}`)
                        ?
                        JSON.parse(localStorage.getItem(`LangDataFor${language}`)).EXH
                        :
                        '')
                }
            }
            else {
                temp = location.state.pastHazardResultData ? location.state.pastHazardResultData : location.state.resultData;
                arr = [];
                debugger
                let HR = (temp.HR * 100) / 31, OP = (temp.OP * 100) / 29, FIN = (temp.FIN * 100) / 10, TI = (temp.TI * 100) / 13, MKT = (temp.MKT * 100) / 15, GP = (temp.GP * 100) / 6, HE = (temp.HE * 100) / 4, PI = (temp.PI * 100) / 9;
                // Ro = temp.Ro ? parseFloat(temp.Ro) : 0;
                Ro = temp.risk_value;
                if (HR > 60) {
                    // arr.push(i18n[language == 'sp' ? 'sp' : 'en'].questionnaire.HR)
                    arr.push(localStorage.getItem(`LangDataFor${language}`)
                        ?
                        JSON.parse(localStorage.getItem(`LangDataFor${language}`)).HR
                        :
                        '')
                }
                if (OP >= 60) {
                    // arr.push(i18n[language == 'sp' ? 'sp' : 'en'].questionnaire.OP)
                    arr.push(localStorage.getItem(`LangDataFor${language}`)
                        ?
                        JSON.parse(localStorage.getItem(`LangDataFor${language}`)).OP
                        :
                        '')
                }
                if (FIN >= 60) {
                    // arr.push(i18n[language == 'sp' ? 'sp' : 'en'].questionnaire.FIN)
                    arr.push(localStorage.getItem(`LangDataFor${language}`)
                        ?
                        JSON.parse(localStorage.getItem(`LangDataFor${language}`)).FIN
                        :
                        '')
                }
                if (TI >= 60) {
                    // arr.push(i18n[language == 'sp' ? 'sp' : 'en'].questionnaire.TI)
                    arr.push(localStorage.getItem(`LangDataFor${language}`)
                        ?
                        JSON.parse(localStorage.getItem(`LangDataFor${language}`)).TI
                        :
                        '')
                }
                if (MKT >= 60) {
                    // arr.push(i18n[language == 'sp' ? 'sp' : 'en'].questionnaire.MKT)
                    arr.push(localStorage.getItem(`LangDataFor${language}`)
                        ?
                        JSON.parse(localStorage.getItem(`LangDataFor${language}`)).MKT
                        :
                        '')
                }
                if (GP >= 60) {
                    // arr.push(i18n[language == 'sp' ? 'sp' : 'en'].questionnaire.GP)
                    arr.push(localStorage.getItem(`LangDataFor${language}`)
                        ?
                        JSON.parse(localStorage.getItem(`LangDataFor${language}`)).GP
                        :
                        '')
                }
                // if (HE >= 60) {
                //     // arr.push(i18n[language == 'sp' ? 'sp' : 'en'].questionnaire.EXH)
                //     arr.push(localStorage.getItem(`LangDataFor${language}`)
                //         ?
                //         JSON.parse(localStorage.getItem(`LangDataFor${language}`)).EXH
                //         :
                //         '')
                // }
                if (PI >= 60) {
                    // arr.push(i18n[language == 'sp' ? 'sp' : 'en'].questionnaire.EXH)
                    arr.push(localStorage.getItem(`LangDataFor${language}`)
                        ?
                        "Physical Infrastructure"
                        // JSON.parse(localStorage.getItem(`LangDataFor${language}`)).PI
                        :
                        '')
                }
            }
            // let temp = location.state.pastResultData ? location.state.pastResultData : location.state.resultData, arr = [];
            // let HR = (temp.HR * 100) / 12, OP = (temp.OP * 100) / 14, FIN = (temp.FIN * 100) / 10, TI = (temp.TI * 100) / 5, MKT = (temp.MKT * 100) / 6, GP = (temp.GP * 100) / 10, HE = (temp.HE * 100) / 4;
            // let Ro = temp.Ro ? temp.Ro : 0;
            // if (HR > 60) {
            //     // arr.push(i18n[language == 'sp' ? 'sp' : 'en'].questionnaire.HR)
            //     arr.push(localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).HR : '')
            // }
            // if (OP >= 60) {
            //     // arr.push(i18n[language == 'sp' ? 'sp' : 'en'].questionnaire.OP)
            //     arr.push(localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).OP : '')
            // }
            // if (FIN >= 60) {
            //     // arr.push(i18n[language == 'sp' ? 'sp' : 'en'].questionnaire.FIN)
            //     arr.push(localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).FIN : '')
            // }
            // if (TI >= 60) {
            //     // arr.push(i18n[language == 'sp' ? 'sp' : 'en'].questionnaire.TI)
            //     arr.push(localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).TI : '')
            // }
            // if (MKT >= 60) {
            //     // arr.push(i18n[language == 'sp' ? 'sp' : 'en'].questionnaire.MKT)
            //     arr.push(localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).MKT : '')
            // }
            // if (GP >= 60) {
            //     // arr.push(i18n[language == 'sp' ? 'sp' : 'en'].questionnaire.GP)
            //     arr.push(localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).GP : '')
            // }
            // if (HE >= 60) {
            //     // arr.push(i18n[language == 'sp' ? 'sp' : 'en'].questionnaire.EXH)
            //     arr.push(localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).EXH : '')
            // }
            setFocusOn(arr);
            let array = [];
            let urlAppend = `latitude=${location.state.position[0]}&longitude=${location.state.position[1]}&radius=50000000000`

            if (location.state.assesment_type == 'multihazard') {
                setStateMultiHazard(location.state.resultData)
            }
            getLocations(urlAppend, (CB) => {
                if (CB.status == 'Success') {
                    let data = CB.data;
                    if (data.length) {
                        for (let index = 0; index < data.length; index++) {
                            const element = data[index];
                            let score = isString(element.score) ? JSON.parse(element.score) : element.score;
                            if (element.longitude != 0 && element.latitude != 0) {
                                array.push(
                                    {
                                        geometry: {
                                            type: "point",
                                            longitude: element.longitude,
                                            latitude: element.latitude
                                        },
                                        symbol: {
                                            type: "picture-marker",
                                            url: score && score.Ro < 1.99 ? require('./../assets/img/Location/green.png') : ((score && score.Ro > 1.99) && (score && score.Ro < 5.2)) ? require('./../assets/img/Location/orange.png') : require('./../assets/img/Location/red.png'),
                                            // url:  require('./../assets/img/Location/green.png'),
                                        },
                                        user_id: element.user_id
                                    }
                                )
                            }
                        }
                    }
                    array.push({
                        geometry: {
                            type: "point",
                            longitude: location.state && location.state.position ? location.state.position[1] : 0,
                            latitude: location.state && location.state.position ? location.state.position[0] : 0
                        },
                        symbol: {
                            type: "picture-marker",
                            // url: Ro < 1.99 ? require('./../assets/img/Location/green.png') : ((Ro > 1.99) && (Ro < 5.2)) ? require('./../assets/img/Location/orange.png') : require('./../assets/img/Location/red.png'),
                            url: require('./../assets/img/Location/green.png'),
                        },
                        user_id: null
                    })
                    setNearme(array)

                } else {
                    array.push({
                        geometry: {
                            type: "point",
                            longitude: location.state && location.state.position ? location.state.position[1] : 0,
                            latitude: location.state && location.state.position ? location.state.position[0] : 0
                        },
                        symbol: {
                            type: "picture-marker",
                            // url: Ro < 1.99 ? require('./../assets/img/Location/green.png') : ((Ro > 1.99) && (Ro < 5.2)) ? require('./../assets/img/Location/orange.png') : require('./../assets/img/Location/red.png'),
                            url: require('./../assets/img/Location/green.png'),
                        },
                        user_id: null
                    })
                    setNearme(array)

                }
            });

            let adviceSpeech = i18n[language == 'sp' ? 'sp' : 'en'].resultDashboard.adviceforYou;
            // if (temp.Ro > 6.81) {
            //     // adviceSpeech = adviceSpeech + i18n[language == 'sp' ? 'sp' : 'en'].resultDashboard.veryHighRisk + '-' + i18n[language == 'sp' ? 'sp' : 'en'].resultDashboard.veryHighRiskData
            //     adviceSpeech = adviceSpeech + localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).veryHighRisk : '' + '-' + localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).veryHighRiskData : ''
            // }
            // else if ((temp.Ro >= 5.21) && (temp.Ro <= 6.81)) {
            //     // adviceSpeech = adviceSpeech + i18n[language == 'sp' ? 'sp' : 'en'].resultDashboard.highRisk + '-' + i18n[language == 'sp' ? 'sp' : 'en'].resultDashboard.highRiskData
            //     adviceSpeech = adviceSpeech + localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).highRisk : '' + '-' + localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).highRiskData : ''
            // }
            // else if ((temp.Ro > 3.59) && (temp.Ro < 5.21)) {
            //     // adviceSpeech = adviceSpeech + i18n[language == 'sp' ? 'sp' : 'en'].resultDashboard.mediumRisk + '-' + i18n[language == 'sp' ? 'sp' : 'en'].resultDashboard.mediumRiskData
            //     adviceSpeech = adviceSpeech + localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).mediumRisk : '' + '-' + localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).mediumRiskData : ''
            // }
            // else if ((temp.Ro >= 1.99) && (temp.Ro <= 3.59)) {
            //     // adviceSpeech = adviceSpeech + i18n[language == 'sp' ? 'sp' : 'en'].resultDashboard.lowRisk + '-' + i18n[language == 'sp' ? 'sp' : 'en'].resultDashboard.lowRiskData
            //     adviceSpeech = adviceSpeech + localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).lowRisk : '' + '-' + localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).lowRiskData : ''
            // }
            // else if (temp.Ro < 1.99) {
            //     // adviceSpeech = adviceSpeech + i18n[language == 'sp' ? 'sp' : 'en'].resultDashboard.veryLowRisk + '-' + i18n[language == 'sp' ? 'sp' : 'en'].resultDashboard.veryLowRiskData
            //     adviceSpeech = adviceSpeech + localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).veryLowRisk : '' + '-' + localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).veryLowRiskData : ''
            // }
            if (switchToCovidDashboardtemp) {
                if (temp.Ro > 6.81) {
                    // adviceSpeech = adviceSpeech + i18n[language == 'sp' ? 'sp' : 'en'].resultDashboard.veryHighRisk + '-' + i18n[language == 'sp' ? 'sp' : 'en'].resultDashboard.veryHighRiskData;
                    adviceSpeech = adviceSpeech + localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).veryHighRisk : '' + '-' + localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).veryHighRiskData : ''
                }
                else if ((temp.Ro >= 5.21) && (temp.Ro <= 6.81)) {
                    // adviceSpeech = adviceSpeech + i18n[language == 'sp' ? 'sp' : 'en'].resultDashboard.highRisk + '-' + i18n[language == 'sp' ? 'sp' : 'en'].resultDashboard.highRiskData
                    adviceSpeech = adviceSpeech + localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).highRisk : '' + '-' + localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).highRiskData : ''
                }
                else if ((temp.Ro > 3.59) && (temp.Ro < 5.21)) {
                    // adviceSpeech = adviceSpeech + i18n[language == 'sp' ? 'sp' : 'en'].resultDashboard.mediumRisk + '-' + i18n[language == 'sp' ? 'sp' : 'en'].resultDashboard.mediumRiskData
                    adviceSpeech = adviceSpeech + localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).mediumRisk : '' + '-' + localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).mediumRiskData : ''
                }
                else if ((temp.Ro >= 1.99) && (temp.Ro <= 3.59)) {
                    // adviceSpeech = adviceSpeech + i18n[language == 'sp' ? 'sp' : 'en'].resultDashboard.lowRisk + '-' + i18n[language == 'sp' ? 'sp' : 'en'].resultDashboard.lowRiskData
                    adviceSpeech = adviceSpeech + localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).lowRisk : '' + '-' + localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).lowRiskData : ''
                }
                else if (temp.Ro < 1.99) {
                    // adviceSpeech = adviceSpeech + i18n[language == 'sp' ? 'sp' : 'en'].resultDashboard.veryLowRisk + '-' + i18n[language == 'sp' ? 'sp' : 'en'].resultDashboard.veryLowRiskData
                    adviceSpeech = adviceSpeech + localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).veryLowRisk : '' + '-' + localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).veryLowRiskData : ''
                }
            }
            else {
                debugger
                if (Ro > 520) {
                    // adviceSpeech = adviceSpeech + i18n[language == 'sp' ? 'sp' : 'en'].resultDashboard.veryHighRisk + '-' + i18n[language == 'sp' ? 'sp' : 'en'].resultDashboard.veryHighRiskData;
                    adviceSpeech = adviceSpeech + localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).veryHighRisk : '' + '-' + localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).veryHighRiskData : ''
                }
                else if ((Ro >= 390) && (Ro <= 520)) {
                    // adviceSpeech = adviceSpeech + i18n[language == 'sp' ? 'sp' : 'en'].resultDashboard.highRisk + '-' + i18n[language == 'sp' ? 'sp' : 'en'].resultDashboard.highRiskData
                    adviceSpeech = adviceSpeech + localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).highRisk : '' + '-' + localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).highRiskData : ''
                }
                else if ((Ro > 260) && (Ro < 390)) {
                    // adviceSpeech = adviceSpeech + i18n[language == 'sp' ? 'sp' : 'en'].resultDashboard.mediumRisk + '-' + i18n[language == 'sp' ? 'sp' : 'en'].resultDashboard.mediumRiskData
                    adviceSpeech = adviceSpeech + localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).mediumRisk : '' + '-' + localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).mediumRiskData : ''
                }
                else if ((Ro >= 130) && (Ro <= 260)) {
                    // adviceSpeech = adviceSpeech + i18n[language == 'sp' ? 'sp' : 'en'].resultDashboard.lowRisk + '-' + i18n[language == 'sp' ? 'sp' : 'en'].resultDashboard.lowRiskData
                    adviceSpeech = adviceSpeech + localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).lowRisk : '' + '-' + localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).lowRiskData : ''
                }
                else if (Ro < 130) {
                    // adviceSpeech = adviceSpeech + i18n[language == 'sp' ? 'sp' : 'en'].resultDashboard.veryLowRisk + '-' + i18n[language == 'sp' ? 'sp' : 'en'].resultDashboard.veryLowRiskData
                    adviceSpeech = adviceSpeech + localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).veryLowRisk : '' + '-' + localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).veryLowRiskData : ''
                }
            }
            let focusOn = ''
            arr.map((item, index) => {
                return index >= (arr.length - 1) ? focusOn = focusOn + item + '' : focusOn = focusOn + item + ', '
            })
            // adviceSpeech = adviceSpeech + i18n[language == 'sp' ? 'sp' : 'en'].resultDashboard.focusOn + focusOn + i18n[language == 'sp' ? 'sp' : 'en'].resultDashboard.focusOnsecond
            adviceSpeech = adviceSpeech + localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).focusOn : '' + focusOn + localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).focusOnsecond : ''

            // adviceSpeech = adviceSpeech + i18n[language == 'sp' ? 'sp' : 'en'].resultDashboard.statement1 + i18n[language == 'sp' ? 'sp' : 'en'].resultDashboard.statement2a + i18n[language == 'sp' ? 'sp' : 'en'].resultDashboard.statement2b + i18n[language == 'sp' ? 'sp' : 'en'].resultDashboard.statement3a + i18n[language == 'sp' ? 'sp' : 'en'].resultDashboard.statement3b
            // setAdviceSpeech(adviceSpeech);
            adviceSpeech = adviceSpeech + localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).statement1 : '' + localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).statement2a : '' + localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).statement2b : '' + localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).statement3a : '' + localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).statement3b : ''
        }
        init();
    }, [location, switchToCovidDashboard ]);

    let chartState = {
        series: location.state && location.state.pastResultData
            ?
            [
                {
                    // name: i18n[language == 'sp' ? 'sp' : 'en'].resultDashboard.highScorePossible,
                    name: localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).highScorePossible : '',
                    data: [12, 14, 10, 5, 10, 6, 4]
                },
                {
                    // name: i18n[language == 'sp' ? 'sp' : 'en'].resultDashboard.lastevaluatedScore,
                    name: localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).lastevaluatedScore : '',
                    data: [pastData.HR, pastData.OP, pastData.FIN, pastData.TI, pastData.GP, pastData.MKT, pastData.HE]
                },
                {
                    // name: i18n[language == 'sp' ? 'sp' : 'en'].resultDashboard.lowScorePossible,
                    name: localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).lowScorePossible : '',
                    data: [1, 1, 1, 0, 0, 0, 0]
                }
            ]
            :
            location.state && location.state.guestUser ?
                [
                    {
                        // name: i18n[language == 'sp' ? 'sp' : 'en'].resultDashboard.highScorePossible,
                        name: localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).highScorePossible : '',
                        data: [12, 14, 10, 5, 10, 6, 4]
                    },
                    {
                        // name: i18n[language == 'sp' ? 'sp' : 'en'].resultDashboard.yourScore,
                        name: localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).yourScore : '',
                        data: [state.HR, state.OP, state.FIN, state.TI, state.GP, state.MKT, state.HE]
                    },
                    {
                        // name: i18n[language == 'sp' ? 'sp' : 'en'].resultDashboard.lowScorePossible,
                        name: localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).lowScorePossible : '',
                        data: [1, 1, 1, 0, 0, 0, 0]
                    }
                ]
                :
                [
                    {
                        // name: i18n[language == 'sp' ? 'sp' : 'en'].resultDashboard.highScorePossible,
                        name: localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).highScorePossible : '',
                        data: [12, 14, 10, 5, 10, 6, 4]
                    },
                    {
                        // name: i18n[language == 'sp' ? 'sp' : 'en'].resultDashboard.yourScore,
                        name: localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).yourScore : '',
                        data: [state.HR, state.OP, state.FIN, state.TI, state.GP, state.MKT, state.HE]
                    },
                    {
                        // name: i18n[language == 'sp' ? 'sp' : 'en'].resultDashboard.lastevaluatedScore,
                        name: localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).lastevaluatedScore : '',
                        data: [pastData.HR, pastData.OP, pastData.FIN, pastData.TI, pastData.GP, pastData.MKT, pastData.HE]
                    },
                    {
                        // name: i18n[language == 'sp' ? 'sp' : 'en'].resultDashboard.lowScorePossible,
                        name: localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).lowScorePossible : '',
                        data: [1, 1, 1, 0, 0, 0, 0]
                    }
                ],
        options: {
            chart: {
                width: '100%',
                type: 'line',
                dropShadow: {
                    enabled: true,
                    color: '#000',
                    top: 18,
                    left: 7,
                    blur: 10,
                    opacity: 0.2
                },
                toolbar: {
                    show: false
                },
                animations: {
                    enabled: true,
                    easing: 'easeinout',
                    speed: 800,
                    animateGradually: {
                        enabled: true,
                        delay: 150
                    },
                    dynamicAnimation: {
                        enabled: true,
                        speed: 350
                    }
                }
            },
            colors: ((location.state && location.state.pastResultData) || (location.state && location.state.guestUser)) ? ['#FF0000', '#4c4ce4', '#76F013'] : ['#FF0000', '#000080', '#4c4ce4', '#76F013'],
            dataLabels: {
                enabled: true,
            },
            stroke: {
                width: ((location.state && location.state.pastResultData) || (location.state && location.state.guestUser)) ? [3, 5, 3] : [3, 5, 3, 3],
                curve: 'smooth',
                dashArray: ((location.state && location.state.pastResultData) || (location.state && location.state.guestUser)) ? [3, 0, 3] : [3, 0, 0, 3]
            },
            title: {
                // text: i18n[language == 'sp' ? 'sp' : 'en'].resultDashboard.legends,
                text: localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).legends : '',
                align: 'left'
            },
            grid: {
                borderColor: '#e7e7e7',
                row: {
                    colors: ['#f3f3f3', 'transparent'],
                    opacity: 0.5
                },
            },
            markers: {
                size: 1
            },
            xaxis: {
                categories: [localStorage.getItem('language').toLowerCase() == 'en' ? 'HR' : 'HR', 'OP', 'FIN', 'TI', localStorage.getItem('language').toLowerCase() == 'en' ? 'GP' : 'PG', 'M', 'EX'],
                // categories: ['A', 'B', 'C', 'D', 'E']
            },
            yaxis: {
                min: 0,
                max: 15
            },
            legend: {
                position: 'top',
                horizontalAlign: 'right',
                floating: true,
                offsetY: -25,
                offsetX: -5
            },
        },
    }

    let chartStateMultiHazard = {
        series: location.state && location.state.pastHazardResultData
            ?
            [
                {
                    // name: i18n[language == 'sp' ? 'sp' : 'en'].resultDashboard.highScorePossible,
                    name: localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).highScorePossible : '',
                    // data: [31, 29, 10, 13, 6, 15, 7, 9]
                    data: [31, 29, 10, 13, 6, 15, 9]
                },
                {
                    // name: i18n[language == 'sp' ? 'sp' : 'en'].resultDashboard.lastevaluatedScore,
                    name: localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).lastevaluatedScore : '',
                    // data: [pastDataMultiHazard.HR, pastDataMultiHazard.OP, pastDataMultiHazard.FIN, pastDataMultiHazard.TI, pastDataMultiHazard.GP, pastDataMultiHazard.MKT, pastDataMultiHazard.HE, pastDataMultiHazard.PI]
                    data: [parseInt(pastDataMultiHazard.HR), parseInt(pastDataMultiHazard.OP), parseInt(pastDataMultiHazard.FIN), parseInt(pastDataMultiHazard.TI), parseInt(pastDataMultiHazard.GP), parseInt(pastDataMultiHazard.MKT), parseInt(pastDataMultiHazard.PI)]
                },
                {
                    // name: i18n[language == 'sp' ? 'sp' : 'en'].resultDashboard.lowScorePossible,
                    name: localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).lowScorePossible : '',
                    // data: [3, 0, 0, 1, 0, 3, 1, 2]
                    data: [3, 0, 0, 1, 0, 3, 2]
                }
            ]
            :
            location.state && location.state.guestUser ?
                [
                    {
                        // name: i18n[language == 'sp' ? 'sp' : 'en'].resultDashboard.highScorePossible,
                        name: localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).highScorePossible : '',
                        // data: [31, 29, 10, 13, 6, 15, 7, 9]
                        data: [31, 29, 10, 13, 6, 15, 9]
                    },
                    {
                        // name: i18n[language == 'sp' ? 'sp' : 'en'].resultDashboard.yourScore,
                        name: localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).yourScore : '',
                        // data: [stateMultiHazard.HR, stateMultiHazard.OP, stateMultiHazard.FIN, stateMultiHazard.TI, stateMultiHazard.GP, stateMultiHazard.MKT, stateMultiHazard.HE, stateMultiHazard.PI]
                        data: [parseInt(stateMultiHazard.HR), parseInt(stateMultiHazard.OP), parseInt(stateMultiHazard.FIN), parseInt(stateMultiHazard.TI), parseInt(stateMultiHazard.GP), parseInt(stateMultiHazard.MKT), parseInt(stateMultiHazard.PI)]
                    },
                    {
                        // name: i18n[language == 'sp' ? 'sp' : 'en'].resultDashboard.lowScorePossible,
                        name: localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).lowScorePossible : '',
                        // data: [3, 0, 0, 1, 0, 3, 1, 2]
                        data: [3, 0, 0, 1, 0, 3, 2]
                    }
                ]
                :
                [
                    {
                        // name: i18n[language == 'sp' ? 'sp' : 'en'].resultDashboard.highScorePossible,
                        name: localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).highScorePossible : '',
                        // data: [31, 29, 10, 13, 6, 15, 7, 9]
                        data: [31, 29, 10, 13, 6, 15, 9]
                    },
                    {
                        // name: i18n[language == 'sp' ? 'sp' : 'en'].resultDashboard.yourScore,
                        name: localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).yourScore : '',
                        // data: [stateMultiHazard.HR, stateMultiHazard.OP, stateMultiHazard.FIN, stateMultiHazard.TI, stateMultiHazard.GP, stateMultiHazard.MKT, stateMultiHazard.HE, stateMultiHazard.PI]
                        data: [parseInt(stateMultiHazard.HR), parseInt(stateMultiHazard.OP), parseInt(stateMultiHazard.FIN), parseInt(stateMultiHazard.TI), parseInt(stateMultiHazard.GP), parseInt(stateMultiHazard.MKT), parseInt(stateMultiHazard.PI)]
                    },
                    {
                        // name: i18n[language == 'sp' ? 'sp' : 'en'].resultDashboard.lastevaluatedScore,
                        name: localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).lastevaluatedScore : '',
                        // data: [pastDataMultiHazard.HR, pastDataMultiHazard.OP, pastDataMultiHazard.FIN, pastDataMultiHazard.TI, pastDataMultiHazard.GP, pastDataMultiHazard.MKT, pastDataMultiHazard.HE, pastDataMultiHazard.PI]
                        data: [parseInt(pastDataMultiHazard.HR), parseInt(pastDataMultiHazard.OP), parseInt(pastDataMultiHazard.FIN), parseInt(pastDataMultiHazard.TI), parseInt(pastDataMultiHazard.GP), parseInt(pastDataMultiHazard.MKT), parseInt(pastDataMultiHazard.PI)]
                    },
                    {
                        // name: i18n[language == 'sp' ? 'sp' : 'en'].resultDashboard.lowScorePossible,
                        name: localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).lowScorePossible : '',
                        // data: [3, 0, 0, 1, 0, 3, 1, 2]
                        data: [3, 0, 0, 1, 0, 3, 2]
                    }
                ],
        options: {
            chart: {
                width: '100%',
                type: 'line',
                dropShadow: {
                    enabled: true,
                    color: '#000',
                    top: 18,
                    left: 7,
                    blur: 10,
                    opacity: 0.2
                },
                toolbar: {
                    show: false
                },
                animations: {
                    enabled: true,
                    easing: 'easeinout',
                    speed: 800,
                    animateGradually: {
                        enabled: true,
                        delay: 150
                    },
                    dynamicAnimation: {
                        enabled: true,
                        speed: 350
                    }
                }
            },
            colors: ((location.state && location.state.pastResultData) || (location.state && location.state.guestUser)) ? ['#FF0000', '#4c4ce4', '#76F013'] : ['#FF0000', '#000080', '#4c4ce4', '#76F013'],
            dataLabels: {
                enabled: true,
            },
            stroke: {
                width: ((location.state && location.state.pastResultData) || (location.state && location.state.guestUser)) ? [3, 5, 3] : [3, 5, 3, 3],
                curve: 'smooth',
                dashArray: ((location.state && location.state.pastResultData) || (location.state && location.state.guestUser)) ? [3, 0, 3] : [3, 0, 0, 3]
            },
            title: {
                text: localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).legends : '',
                align: 'left'
            },
            grid: {
                borderColor: '#e7e7e7',
                row: {
                    colors: ['#f3f3f3', 'transparent'],
                    opacity: 0.5
                },
            },
            markers: {
                size: 1
            },
            xaxis: {
                categories: [localStorage.getItem('language').toLowerCase() == 'en' ? 'HR' : 'HR', 'OP', 'FIN', 'TI', localStorage.getItem('language').toLowerCase() == 'en' ? 'GP' : 'PG', 'M', 'PI'],
                // categories: ['A', 'B', 'C', 'D', 'E']
            },
            yaxis: {
                min: 0,
                max: 35
            },
            legend: {
                position: 'top',
                horizontalAlign: 'right',
                floating: true,
                offsetY: -25,
                offsetX: -5
            },
        },
    }
    const submitFeedbackForm = (e) => {
        e.preventDefault()
        setSubmitFeedback(true);

        if (feedbackForm.fullName == '') {
            setFeedbackForm(prevState => {
                return {
                    ...prevState, fullNameError: true
                }
            })
        }
        if (feedbackForm.email == '') {
            if (!_validator.verifyEmail(feedbackForm.email)) {
                setFeedbackForm(prevState => {
                    return {
                        ...prevState, emailError: true
                    }
                })
            }
        }
        if (feedbackForm.feedback == '') {
            setFeedbackForm(prevState => {
                return {
                    ...prevState, feedbackError: true
                }
            })
        }
        if (!feedbackForm.fullNameError && !feedbackForm.emailError && !feedbackForm.feedbackError &&
            feedbackForm.fullName != '' && feedbackForm.email != '' && feedbackForm.feedback != '') {
            let payload = {
                name: feedbackForm.fullName,
                email: feedbackForm.email,
                phone: feedbackForm.phone,
                feedback: feedbackForm.feedback
            }
            sendFeedback(payload, (CB) => {
                if (CB.status == 'Success') {
                    alert('Thank you for feedback')
                }
                setSubmitFeedback(false)
                setFeedbackForm(prevState => {
                    return {
                        ...prevState, feedback: '', feedbackError: true, fullName: '', fullNameError: true,
                        phone: '', phoneError: true, email: '', emailError: true
                    }
                })
            });

        }
    }

    if (nearme.length) {
        for (let index = 0; index < nearme.length; index++) {
            const element = nearme[index];
            if (location.state.userId == null || location.state.userId == undefined || location.state.userId == '') {
                graphics.push(element);
            } else if (element.user_id != userId) {
                graphics.push(element);
            }
        }

    }

    const map = {
        basemap: "streets-vector",
        ground: "world-elevation"
    };

    const options = {
        view: {
            center: location.state && location.state.position ? [location.state.position[1], location.state.position[0]] : [1, 1],
            zoom: 12
        }
    };
    const [ref, view] = useMap(map, options);

    useGraphics(view, graphics);

    const init = () => {
        const speech = new Speech();
        speech.init({
            volume: 0.5,
            lang: "es-ES",
            rate: 1,
            pitch: 1,
            listeners: {
                onvoiceschanged: voices => {
                }
            }
        })
            .then(data => {
                prepareSpeakButton(speech);
            })
            .catch(e => {
                console.error("An error occured while initializing : ", e);
            });
    }

    const prepareSpeakButton = (speech) => {
        const speakButton = document.getElementById("play");
        const pauseButton = document.getElementById("pause");
        const resumeButton = document.getElementById("resume");
        speakButton.addEventListener("click", () => {
            const lang = language == 'en' ? "en-GB" : "es-ES";
            if (lang) speech.setLanguage(lang);
            speech.speak({
                text: adviceSpeech,
                queue: false,
                listeners: {
                    onstart: () => {
                    },
                    onend: () => {
                    },
                    onresume: () => {
                    },
                    onboundary: event => {
                    }
                }
            })
                .then(data => {
                })
                .catch(e => {
                    console.error("An error occurred :", e);
                });
        });

        pauseButton.addEventListener("click", () => {
            speech.pause();
        });

        resumeButton.addEventListener("click", () => {
            speech.resume();
        });
    }

    const onTextChange = ({ target: { name, value } }) => {
        switch (name) {
            case "email":
                if (_validator.verifyEmail(value)) {
                    if (_validator.verifyEmail(value)) {
                        setFeedbackForm(prevState => {
                            return { ...prevState, email: value, emailError: false }
                        })
                    }
                } else {

                }
                break;
            default:
                break;
        }
    }

    const handleOnIdle = event => {
        console.log('user is idle', event)
        console.log('last active', getLastActiveTime())
        localStorage.removeItem('LoginData');
        props.history.replace({
            pathname: 'login',
        })
    }

    const handleOnActive = event => {
    }

    const handleOnAction = event => {
    }

    const { getRemainingTime, getLastActiveTime } = useIdleTimer({
        timeout: 1000 * 60 * 15,
        onIdle: handleOnIdle,
        onActive: handleOnActive,
        onAction: handleOnAction,
        debounce: 500,
        crossTab: true
    })

    return (
        <section className="bg-img" style={{ height: '100%', backgroundColor: '#ffffff' }}>
            <div className="container-fluid">
                <div className="row head-img">
                    <div className="col-md-12 ">
                        <div className="row tabmargin">
                            <div className="col-md-3 col-3">
                                <a target="_blank" href='https://www.undrr.org/'>
                                    <img
                                        alt="undrrlogocolor"
                                        style={{ marginTop: '1vh', marginLeft: '2vw', width: '85%' }}
                                        src={require('./../assets/img/images/undrrlogocolor.png')}
                                        className="img-fluid" />
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
            </div>
            <div className="row" style={{ backgroundColor: '#dedede', margin: '0px' }}>
                <div className="col-md-3 col-12 padd-0" style={{ width: '100vw', backgroundColor: '#dedede' }} >
                    <p style={{ color: '#234081', padding: '2vh', margin: 0, marginLeft: '1vw', fontFamily: 'Roboto' }}>
                        {localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).toolName : ''}
                    </p>
                </div>
                <div className="col-md-5 col-1 padd-0 AudioControl" style={{ backgroundColor: '#dedede', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }} >
                    <div>
                        <p style={{ color: '#234081', padding: '2vh', margin: 0, marginLeft: '1vw', fontFamily: 'Roboto' }}>
                            {localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).audioAssistance : ''}
                        </p>
                    </div>
                    <div className='AudioControl' style={{ backgroundColor: '#234081', padding: '5px', borderRadius: 5, display: 'flex', flexDirection: 'row' }}>
                        <div id="play" className='play'></div>
                        <div id="pause" className='pause'></div>
                        <div id="resume" className='resume'></div>
                    </div>
                </div>
                <div
                    className="col-md-1"
                    style={{ width: '100vw', backgroundColor: '#dedede', display: 'flex', alignItems: 'center', justifyContent: 'center' }} >
                    <button
                        className='btn btn-primary'
                        style={{ backgroundColor: '#224483' }}
                        onClick={() => {
                            window.history.back()
                        }}>
                        <img
                            alt="home"
                            style={{ height: 25, width: 25 }}
                            src={require('./../assets/img/home.png')} />
                    </button>
                </div>
                <div
                    className="col-md-2"
                    style={{ display: 'flex', justifyContent: 'center', padding: '5px' }}>
                    <button onClick={() => {
                        if (location.state && (location.state.pastResultData || location.state.pastHazardResultData)) {
                            props.history.replace({
                                pathname: 'questionnaire',
                                state: { userId: userId, prevData: pastData, prevMultiHazardData: pastDataMultiHazard }
                            })
                        }
                        else {
                            props.history.replace({
                                pathname: 'questionnaire',
                                state: { userId: userId }
                            })
                        }
                    }} className='btn btn-primary' style={{ backgroundColor: '#224483' }} type="submit">
                        {localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).retakesurvey : ''}
                    </button>
                </div>
                <div
                    className="col-md-1 backButtonForMobile"
                    style={{ width: '100vw', backgroundColor: '#dedede', display: 'flex', alignItems: 'center', justifyContent: 'center' }} >
                    <button
                        className='btn btn-primary'
                        style={{ backgroundColor: '#224483' }}
                        onClick={() => {
                            localStorage.removeItem('LoginData');
                            props.history.replace({
                                pathname: 'login',
                            })
                        }}>
                        {localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).logout : ''}
                    </button>
                </div>
            </div >
            <div className="container-fluid padd-0" style={{ height: '100%', backgroundColor: '#ffffff' }}>
                <div className="row">
                    <div className="col-md-8 col-6"></div>
                    {/* <div className="col-md-4 col-6" style={{ display: 'flex', justifyContent: 'center', padding: '5px' }}>
                        <button onClick={() => {
                            if (location.state && location.state.pastResultData) {
                                props.history.replace({
                                    pathname: 'questionnaire',
                                    state: { userId: userId, prevData: pastData }
                                })
                            }
                            else {
                                props.history.replace({
                                    pathname: 'questionnaire',
                                    state: { userId: userId }
                                })
                            }
                        }} className='btn btn-primary' style={{ backgroundColor: '#224483' }} type="submit">
                            {localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).retakesurvey : ''}
                        </button>
                    </div> */}
                </div>
                <div className="row" style={{ height: 50, justifyContent: 'center', alignItems: 'center' }}>
                    <div style={{ position: 'absolute', right: '5vw', flexDirection: 'row', display: 'flex', alignItems: 'center' }}>
                        <p className='m-0'>
                            {
                                !switchToCovidDashboard ?
                                    "Covid-19 Dashboard"
                                    :
                                    <b>Covid-19 Dashboard</b>
                            }
                        </p>
                        <button
                            className='btn btn-primary'
                            style={{ backgroundColor: '#224483', marginLeft: 10, marginRight: 10 }}
                            onClick={() => {
                                setSwitchToCovidDashboard(!switchToCovidDashboard);
                                setFromResultPage(true);
                            }}>
                            <img
                                alt="home"
                                style={{ height: 25, width: 25 }}
                                src={require('./../assets/img/switch.png')} />
                        </button>
                        <p className='m-0'>
                            {
                                !switchToCovidDashboard ?
                                    <b>Multi-Hazards Dashboard</b>
                                    :
                                    "Multi-Hazards Dashboard"
                            }
                        </p>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 col-12">
                        <div className="row" style={{ justifyContent: 'center' }}>
                            <div className="col-md-10 col-10">
                                <div className="fields-container">
                                    <div className="col-md-12 top-20 login-heading">
                                        <label className="card-title" >
                                            {localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).riskScore : ''}
                                        </label>
                                    </div>
                                    <div className="col-md-12 login-wht-box" style={{ padding: '10px' }}>
                                        <div className='row commonCards' style={{ height: '50vh', display: 'flex', justifyContent: 'center' }}>
                                            {
                                                language == 'En' || language == 'en'
                                                    ?
                                                    switchToCovidDashboard ?

                                                        <ReactSpeedometer
                                                            minValue={0}
                                                            maxValue={10}
                                                            value={state.Ro}
                                                            customSegmentStops={[0, 1.99, 3.59, 5.20, 6.81, 10]}
                                                            currentValueText={localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).score + " : ${value}" : ''}
                                                        />
                                                        :
                                                        <ReactSpeedometer
                                                            minValue={0}
                                                            maxValue={1110}
                                                            value={parseInt(stateMultiHazard.risk_value)}
                                                            customSegmentStops={[0, 130, 260, 390, 520, 1110]}
                                                            currentValueText={localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).score + " : ${value}" : ''}
                                                        />
                                                    :
                                                    null
                                            }
                                            {
                                                language == 'Hi'
                                                    ?
                                                    <ReactSpeedometer
                                                        fluidWidth={true}
                                                        minValue={0}
                                                        maxValue={10}
                                                        value={state.Ro}
                                                        // value={5}
                                                        customSegmentStops={[0, 1.99, 3.59, 5.20, 6.81, 10]}
                                                        customSegmentLabels={[
                                                            {
                                                                // text: localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).veryLow : 'Very Low',
                                                                text: 'दंतकथाएं',
                                                                position: "INSIDE",
                                                                color: "#002a4a",
                                                                fontSize: "16px"
                                                            },
                                                            {
                                                                // text: localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).low : 'Low',
                                                                text: 'कम',
                                                                position: "INSIDE",
                                                                color: "#002a4a",
                                                                fontSize: "16px"
                                                            },
                                                            {
                                                                // text: localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).medium : 'Medium',
                                                                text: 'मध्यम',
                                                                position: "INSIDE",
                                                                color: "#002a4a",
                                                                fontSize: "16px"
                                                            },
                                                            {
                                                                // text: localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).high : 'High',
                                                                text: 'उच्च',
                                                                position: "INSIDE",
                                                                color: "#002a4a",
                                                                fontSize: "16px"
                                                            },
                                                            {
                                                                // text: localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).veryHigh : 'Very High',
                                                                text: 'बहुत ऊँचा',
                                                                position: "INSIDE",
                                                                color: "#002a4a",
                                                                fontSize: "16px"
                                                            },
                                                        ]}
                                                        width={300}
                                                        height={300}
                                                        segmentColors={[
                                                            "#76F013",
                                                            "#38761D",
                                                            "#FF9900",
                                                            "#E06666",
                                                            "#FF0000",
                                                        ]}
                                                        // currentValueText="Current Value: #{value}"
                                                        // currentValueText={i18n[language == 'sp' ? 'sp' : 'en'].resultDashboard.score + " : ${value}"}
                                                        currentValueText={localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).score + " : ${value}" : ''}
                                                        needleColor="#002a4a"
                                                        needleTransitionDuration={4000}
                                                        needleTransition="easeElastic"
                                                        textColor={'black'}
                                                    />
                                                    :
                                                    null
                                            }
                                            {
                                                language == 'Sp'
                                                    ?
                                                    <ReactSpeedometer
                                                        fluidWidth={true}
                                                        minValue={0}
                                                        maxValue={10}
                                                        value={state.Ro}
                                                        // value={5}
                                                        customSegmentStops={[0, 1.99, 3.59, 5.20, 6.81, 10]}
                                                        customSegmentLabels={[
                                                            {
                                                                // text: localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).veryLow : 'Very Low',
                                                                text: 'Muy alto',
                                                                position: "INSIDE",
                                                                color: "#002a4a",
                                                                fontSize: "16px"
                                                            },
                                                            {
                                                                // text: localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).low : 'Low',
                                                                text: 'Bajo',
                                                                position: "INSIDE",
                                                                color: "#002a4a",
                                                                fontSize: "16px"
                                                            },
                                                            {
                                                                // text: localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).medium : 'Medium',
                                                                text: 'Medio',
                                                                position: "INSIDE",
                                                                color: "#002a4a",
                                                                fontSize: "16px"
                                                            },
                                                            {
                                                                // text: localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).high : 'High',
                                                                text: 'Alto',
                                                                position: "INSIDE",
                                                                color: "#002a4a",
                                                                fontSize: "16px"
                                                            },
                                                            {
                                                                // text: localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).veryHigh : 'Very High',
                                                                text: 'Muy alto',
                                                                position: "INSIDE",
                                                                color: "#002a4a",
                                                                fontSize: "16px"
                                                            },
                                                        ]}
                                                        width={300}
                                                        height={300}
                                                        segmentColors={[
                                                            "#76F013",
                                                            "#38761D",
                                                            "#FF9900",
                                                            "#E06666",
                                                            "#FF0000",
                                                        ]}
                                                        // currentValueText="Current Value: #{value}"
                                                        // currentValueText={i18n[language == 'sp' ? 'sp' : 'en'].resultDashboard.score + " : ${value}"}
                                                        currentValueText={localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).score + " : ${value}" : ''}
                                                        needleColor="#002a4a"
                                                        needleTransitionDuration={4000}
                                                        needleTransition="easeElastic"
                                                        textColor={'black'}
                                                    />
                                                    :
                                                    null
                                            }
                                            {
                                                language == 'Od'
                                                    ?
                                                    <ReactSpeedometer
                                                        fluidWidth={true}
                                                        minValue={0}
                                                        maxValue={10}
                                                        value={state.Ro}
                                                        // value={5}
                                                        customSegmentStops={[0, 1.99, 3.59, 5.20, 6.81, 10]}
                                                        customSegmentLabels={[
                                                            {
                                                                // text: localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).veryLow : 'Very Low',
                                                                text: 'ବହୁତ କମ୍',
                                                                position: "INSIDE",
                                                                color: "#002a4a",
                                                                fontSize: "16px"
                                                            },
                                                            {
                                                                // text: localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).low : 'Low',
                                                                text: 'କମ ଧରଣର',
                                                                position: "INSIDE",
                                                                color: "#002a4a",
                                                                fontSize: "16px"
                                                            },
                                                            {
                                                                // text: localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).medium : 'Medium',
                                                                text: 'ମଧ୍ୟମ ଧରଣର',
                                                                position: "INSIDE",
                                                                color: "#002a4a",
                                                                fontSize: "16px"
                                                            },
                                                            {
                                                                // text: localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).high : 'High',
                                                                text: 'ଉଚ୍ଚ ଧରଣର',
                                                                position: "INSIDE",
                                                                color: "#002a4a",
                                                                fontSize: "16px"
                                                            },
                                                            {
                                                                // text: localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).veryHigh : 'Very High',
                                                                text: 'ବହୁତ ଉଚ୍ଚ ଧରଣର',
                                                                position: "INSIDE",
                                                                color: "#002a4a",
                                                                fontSize: "16px"
                                                            },
                                                        ]}
                                                        width={300}
                                                        height={300}
                                                        segmentColors={[
                                                            "#76F013",
                                                            "#38761D",
                                                            "#FF9900",
                                                            "#E06666",
                                                            "#FF0000",
                                                        ]}
                                                        // currentValueText="Current Value: #{value}"
                                                        // currentValueText={i18n[language == 'sp' ? 'sp' : 'en'].resultDashboard.score + " : ${value}"}
                                                        currentValueText={localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).score + " : ${value}" : ''}
                                                        needleColor="#002a4a"
                                                        needleTransitionDuration={4000}
                                                        needleTransition="easeElastic"
                                                        textColor={'black'}
                                                    />
                                                    :
                                                    null
                                            }
                                            {
                                                language == 'Fi'
                                                    ?
                                                    <ReactSpeedometer
                                                        fluidWidth={true}
                                                        minValue={0}
                                                        maxValue={10}
                                                        value={state.Ro}
                                                        // value={5}
                                                        customSegmentStops={[0, 1.99, 3.59, 5.20, 6.81, 10]}
                                                        customSegmentLabels={[
                                                            {
                                                                text: 'Napakababa',
                                                                position: "INSIDE",
                                                                color: "#002a4a",
                                                                fontSize: "16px"
                                                            },
                                                            {
                                                                text: 'Mababa',
                                                                position: "INSIDE",
                                                                color: "#002a4a",
                                                                fontSize: "16px"
                                                            },
                                                            {
                                                                text: 'Katamtaman',
                                                                position: "INSIDE",
                                                                color: "#002a4a",
                                                                fontSize: "16px"
                                                            },
                                                            {
                                                                text: 'Mataas',
                                                                position: "INSIDE",
                                                                color: "#002a4a",
                                                                fontSize: "16px"
                                                            },
                                                            {
                                                                text: 'Napakataas',
                                                                position: "INSIDE",
                                                                color: "#002a4a",
                                                                fontSize: "16px"
                                                            },
                                                        ]}
                                                        width={300}
                                                        height={300}
                                                        segmentColors={[
                                                            "#76F013",
                                                            "#38761D",
                                                            "#FF9900",
                                                            "#E06666",
                                                            "#FF0000",
                                                        ]}
                                                        // currentValueText="Current Value: #{value}"
                                                        // currentValueText={i18n[language == 'sp' ? 'sp' : 'en'].resultDashboard.score + " : ${value}"}
                                                        currentValueText={localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).score + " : ${value}" : ''}
                                                        needleColor="#002a4a"
                                                        needleTransitionDuration={4000}
                                                        needleTransition="easeElastic"
                                                        textColor={'black'}
                                                    />
                                                    :
                                                    null
                                            }
                                        </div>
                                    </div>
                                </div >
                            </div>
                        </div >
                    </div >
                    <div className="col-md-6 col-12 ">
                        <div className="row" style={{ justifyContent: 'center' }}>
                            <div className="col-md-10 col-10">
                                <div className="fields-container">
                                    <div className="col-md-12 top-20 login-heading">
                                        <label className="card-title" >
                                            {localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).riskCategory : ''}
                                        </label>
                                    </div>
                                    <div className="col-md-12 login-wht-box">
                                        <div className='row commonCards' style={{ height: '52vh', overflow: 'scroll' }}>
                                            <ApexCharts
                                                options={
                                                    !switchToCovidDashboard ? chartStateMultiHazard.options : chartState.options
                                                }
                                                series={
                                                    !switchToCovidDashboard ? chartStateMultiHazard.series : chartState.series
                                                }
                                                height='80%'
                                                type="line"
                                                width={window.innerWidth < 481 ? "300" : ((window.innerWidth > 481) && (window.innerWidth < 1224)) ? "400" : "500"}
                                            />

                                            <div style={{ fontFamily: 'Roboto', color: '#002a4a', fontSize: 14, paddingLeft: '15px', paddingRight: '15px', marginTop: '-20px' }}>
                                                {
                                                    !switchToCovidDashboard ?
                                                        <>
                                                            <strong>
                                                                {localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).HR : ''},
                                                                {localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).OP : ''},
                                                                {localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).FIN : ''},
                                                            </strong>
                                                            <br />
                                                            <strong>
                                                                {localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).TI : ''},
                                                                {i18n[language == 'sp' ? 'sp' : 'en'].resultDashboard.GP},
                                                            </strong>
                                                            <br />
                                                            <strong>
                                                                {localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).MKT : ''},
                                                                {!switchToCovidDashboard ? null : "EX - Exposure to Other Hazards"}
                                                                {/* {localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).EXH : ''} */}
                                                                {!switchToCovidDashboard ? ' PI - Physical Infrastructure' : null}
                                                            </strong>
                                                        </>
                                                        :
                                                        <>
                                                            <strong>
                                                                {localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).HR : ''},
                                                                {localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).OP : ''},
                                                                {localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).FIN : ''},
                                                            </strong>
                                                            <br />
                                                            <strong>
                                                                {localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).TI : ''},
                                                                {i18n[language == 'sp' ? 'sp' : 'en'].resultDashboard.GP},
                                                            </strong>
                                                            <br />
                                                            <strong>
                                                                {localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).MKT : ''},
                                                                {!switchToCovidDashboard ? null : "EX - Exposure to Other Hazards"}
                                                                {/* {localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).EXH : ''} */}
                                                                {!switchToCovidDashboard ? ' PI - Physical Infrastructure' : null}
                                                            </strong>
                                                        </>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div >
                            </div >
                        </div >
                    </div >
                </div >
                <div style={{ height: 40 }} />
                <div className="row">
                    <div className="col-md-6 col-12">
                        <div className="row" style={{ justifyContent: 'center' }}>
                            <div className="col-md-10 col-10">
                                <div className="fields-container">
                                    <div className="col-md-12 top-20 login-heading">
                                        <label className="card-title" >
                                            {localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).riskAroundYou : ''}
                                        </label>
                                    </div>
                                    <div className="col-md-12 login-wht-box padd-0 commonCards mapCard">
                                        {
                                            navigator.onLine ?
                                                <div className='row commonCards ' ref={ref} style={{ width: '99%', height: '100%', margin: 0 }}>
                                                </div>
                                                :
                                                <div className='row commonCards ' style={{ width: '99%', height: '100%', margin: 0 }}>
                                                </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-12">
                        <div className="row" style={{ justifyContent: 'center' }}>
                            <div className="col-md-10 col-10">
                                <div className="fields-container">
                                    <div className="col-md-12 top-20 login-heading">
                                        <label className="card-title" >
                                            {localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).advice : ''}
                                        </label>
                                    </div>
                                    <div className="col-md-12 login-wht-box" style={{ padding: '10px' }}>
                                        {
                                            switchToCovidDashboard ?
                                                <div className='row commonCards' style={{ width: '100%', margin: 0, overflow: 'scroll' }}>
                                                    {
                                                        state.Ro > 6.81 ?
                                                            <p style={{ color: '#002a4a', fontSize: 15, marginBottom: 0, fontFamily: 'Roboto' }}>
                                                                <span>&#10146;</span><span style={{ fontWeight: 'bold', fontSize: 16, color: '#FF0000' }}>
                                                                    {localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).veryHighRisk : ''}
                                                                    -
                                                                </span>
                                                                {localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).veryHighRiskData : ''}
                                                            </p>
                                                            : null
                                                    }
                                                    {
                                                        (state.Ro >= 5.21) && (state.Ro <= 6.81) ?
                                                            <p style={{ color: '#002a4a', fontSize: 15, marginBottom: 0, fontFamily: 'Roboto' }}>
                                                                <span>&#10146;</span><span style={{ fontWeight: 'bold', fontSize: 16, color: '#E06666' }}>
                                                                    {localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).highRisk : ''}
                                                                    -
                                                                </span>
                                                                {localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).highRiskData : ''}
                                                            </p>
                                                            : null
                                                    }
                                                    {
                                                        (state.Ro > 3.59) && (state.Ro < 5.21) ?
                                                            <p style={{ color: '#002a4a', fontSize: 15, marginBottom: 0, fontFamily: 'Roboto' }}>
                                                                <span>&#10146;</span><span style={{ fontWeight: 'bold', fontSize: 16, color: '#FF9900' }}>
                                                                    {localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).mediumRisk : ''}
                                                                    -
                                                                </span>
                                                                {localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).mediumRiskData : ''}
                                                            </p>
                                                            : null
                                                    }
                                                    {
                                                        (state.Ro >= 1.99) && (state.Ro <= 3.59) ?
                                                            <p style={{ color: '#002a4a', fontSize: 15, marginBottom: 0, fontFamily: 'Roboto' }}>
                                                                <span>&#10146;</span><span style={{ fontWeight: 'bold', fontSize: 16, color: '#38761D' }}>
                                                                    {localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).lowRisk : ''}
                                                                    -
                                                                </span>
                                                                {localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).lowRiskData : ''}
                                                            </p>
                                                            : null
                                                    }
                                                    {
                                                        state.Ro < 1.99 ?
                                                            <p style={{ color: '#002a4a', fontSize: 15, marginBottom: 0, fontFamily: 'Roboto' }}>
                                                                <span>&#10146;</span>
                                                                <span style={{ fontWeight: 'bold', fontSize: 16, color: 'blue' }}>
                                                                    {localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).veryLowRisk : ''}
                                                                    -
                                                                </span>
                                                                {localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).veryLowRiskData : ''}
                                                            </p>
                                                            : null
                                                    }
                                                    {
                                                        focusOn.length ?
                                                            <p style={{ color: '#002a4a', fontSize: 16, marginBottom: 0, fontFamily: 'Roboto' }}>
                                                                <span>&#10146;</span>
                                                                {localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).focusOn : ''}
                                                                {focusOn.map((item, index) => {
                                                                    return <strong style={{ color: '#E06666' }}>{item} {index >= (focusOn.length - 1) ? '' : ', '}</strong>
                                                                })}
                                                                <span style={{ color: '#002a4a', fontSize: 15, marginBottom: 0, fontFamily: 'Roboto' }}>
                                                                    {localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).focusOnsecond : ''}
                                                                </span>
                                                            </p>
                                                            : null
                                                    }
                                                    <p style={{ color: '#002a4a', fontSize: 16, marginBottom: 0, fontFamily: 'Roboto' }}>
                                                        <i>
                                                            {localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).statement1 : ''}
                                                        </i>
                                                    </p>
                                                    <p style={{ color: '#002a4a', fontSize: 16, marginBottom: 0, fontFamily: 'Roboto' }}>
                                                        <span>&#10146;</span>
                                                        {localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).statement2a : ''}
                                                        :-
                                                        <a
                                                            style={{ color: 'blue' }}
                                                            target="_"
                                                            href={
                                                                localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).statement2b : ''
                                                            }
                                                        >
                                                            {localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).statement2b : ''}
                                                        </a>
                                                        {
                                                            true
                                                                ?
                                                                <React.Fragment>
                                                                    <br />
                                                                    <a
                                                                        target="_"
                                                                        href={
                                                                            localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).statement2c : ''
                                                                        }
                                                                    >
                                                                        {localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).statement2c : ''}
                                                                    </a>
                                                                </React.Fragment>
                                                                :
                                                                null
                                                        }
                                                        {
                                                            true
                                                                ?
                                                                <React.Fragment>
                                                                    <br />
                                                                    <a
                                                                        target="_"
                                                                        href={localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).statement2d : ''}
                                                                    >
                                                                        {localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).statement2d : ''}
                                                                    </a>
                                                                </React.Fragment>
                                                                :
                                                                null
                                                        }
                                                    </p>
                                                    <p style={{ color: '#002a4a', fontSize: 16, marginBottom: 0, fontFamily: 'Roboto' }}>
                                                        <span>&#10146;</span>
                                                        {localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).statement3a : ''}
                                                        :-
                                                        <a
                                                            style={{ color: 'blue' }}
                                                            target="_"
                                                            href={
                                                                localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).statement3b : ''
                                                            }
                                                        >
                                                            {localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).statement3b : ''}
                                                        </a>
                                                    </p>
                                                </div>
                                                :
                                                <div className='row commonCards' style={{ width: '100%', margin: 0, overflow: 'scroll' }}>
                                                    {
                                                        stateMultiHazard.risk_value > 520 ?
                                                            <p style={{ color: '#002a4a', fontSize: 15, marginBottom: 0, fontFamily: 'Roboto' }}>
                                                                <span>&#10146;</span><span style={{ fontWeight: 'bold', fontSize: 16, color: '#FF0000' }}>
                                                                    {localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).veryHighRisk : ''}
                                                                    -
                                                                </span>
                                                                {localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).veryHighRiskData : ''}
                                                            </p>
                                                            : null
                                                    }
                                                    {
                                                        (stateMultiHazard.risk_value >= 390) && (stateMultiHazard.risk_value <= 520) ?
                                                            <p style={{ color: '#002a4a', fontSize: 15, marginBottom: 0, fontFamily: 'Roboto' }}>
                                                                <span>&#10146;</span><span style={{ fontWeight: 'bold', fontSize: 16, color: '#E06666' }}>
                                                                    {localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).highRisk : ''}
                                                                    -
                                                                </span>
                                                                {localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).highRiskData : ''}
                                                            </p>
                                                            : null
                                                    }
                                                    {
                                                        (stateMultiHazard.risk_value > 260) && (stateMultiHazard.risk_value < 390) ?
                                                            <p style={{ color: '#002a4a', fontSize: 15, marginBottom: 0, fontFamily: 'Roboto' }}>
                                                                <span>&#10146;</span><span style={{ fontWeight: 'bold', fontSize: 16, color: '#FF9900' }}>
                                                                    {localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).mediumRisk : ''}
                                                                    -
                                                                </span>
                                                                {localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).mediumRiskData : ''}
                                                            </p>
                                                            : null
                                                    }
                                                    {
                                                        (stateMultiHazard.risk_value >= 130) && (stateMultiHazard.risk_value <= 260) ?
                                                            <p style={{ color: '#002a4a', fontSize: 15, marginBottom: 0, fontFamily: 'Roboto' }}>
                                                                <span>&#10146;</span><span style={{ fontWeight: 'bold', fontSize: 16, color: '#38761D' }}>
                                                                    {localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).lowRisk : ''}
                                                                    -
                                                                </span>
                                                                {localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).lowRiskData : ''}
                                                            </p>
                                                            : null
                                                    }
                                                    {
                                                        stateMultiHazard.risk_value < 130 ?
                                                            <p style={{ color: '#002a4a', fontSize: 15, marginBottom: 0, fontFamily: 'Roboto' }}>
                                                                <span>&#10146;</span>
                                                                <span style={{ fontWeight: 'bold', fontSize: 16, color: 'blue' }}>
                                                                    {localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).veryLowRisk : ''}
                                                                    -
                                                                </span>
                                                                {localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).veryLowRiskData : ''}
                                                            </p>
                                                            : null
                                                    }
                                                    {
                                                        focusOn.length ?
                                                            <p style={{ color: '#002a4a', fontSize: 16, marginBottom: 0, fontFamily: 'Roboto' }}>
                                                                <span>&#10146;</span>
                                                                {localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).focusOn : ''}
                                                                {focusOn.map((item, index) => {
                                                                    return <strong style={{ color: '#E06666' }}>{item} {index >= (focusOn.length - 1) ? '' : ', '}</strong>
                                                                })}
                                                                <span style={{ color: '#002a4a', fontSize: 15, marginBottom: 0, fontFamily: 'Roboto' }}>
                                                                    {localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).focusOnsecond : ''}
                                                                </span>
                                                            </p>
                                                            : null
                                                    }
                                                    <p style={{ color: '#002a4a', fontSize: 16, marginBottom: 0, fontFamily: 'Roboto' }}>
                                                        <i>
                                                            {localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).statement1 : ''}
                                                        </i>
                                                    </p>
                                                    <p style={{ color: '#002a4a', fontSize: 16, marginBottom: 0, fontFamily: 'Roboto' }}>
                                                        <span>&#10146;</span> {"As the business has high exposure to disasters, emergency plan and detailed disaster control measures for the business should be made available to the workers employed."}
                                                    </p>
                                                    <p style={{ color: '#002a4a', fontSize: 16, marginBottom: 0, fontFamily: 'Roboto' }}>
                                                        <span>&#10146;</span>
                                                        {localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).statement2a : ''}
                                                        :-
                                                        <a
                                                            style={{ color: 'blue' }}
                                                            target="_"
                                                            href={
                                                                localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).statement2b : ''
                                                            }
                                                        >
                                                            {localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).statement2b : ''}
                                                        </a>
                                                        {
                                                            true
                                                                ?
                                                                <React.Fragment>
                                                                    <br />
                                                                    <a
                                                                        target="_"
                                                                        href={
                                                                            localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).statement2c : ''
                                                                        }
                                                                    >
                                                                        {localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).statement2c : ''}
                                                                    </a>
                                                                </React.Fragment>
                                                                :
                                                                null
                                                        }
                                                        {
                                                            true
                                                                ?
                                                                <React.Fragment>
                                                                    <br />
                                                                    <a
                                                                        target="_"
                                                                        href={localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).statement2d : ''}
                                                                    >
                                                                        {localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).statement2d : ''}
                                                                    </a>
                                                                </React.Fragment>
                                                                :
                                                                null
                                                        }
                                                    </p>
                                                    {/* <p style={{ color: '#002a4a', fontSize: 16, marginBottom: 0, fontFamily: 'Roboto' }}>
                                                        <span>&#10146;</span>
                                                        {localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).statement3a : ''}
                                                        :-
                                                        <a
                                                            style={{ color: 'blue' }}
                                                            target="_"
                                                            href={
                                                                localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).statement3b : ''
                                                            }
                                                        >
                                                            {localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).statement3b : ''}
                                                        </a>
                                                    </p> */}
                                                </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container-fluid padd-0" style={{ height: '100%', backgroundColor: '#ffffff' }} >
                <div className="row">
                    <div className="container-contact100">
                        <div className="wrap-contact100">
                            <form className="contact100-form validate-form">
                                <span className="contact100-form-title">
                                    {localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).feedbackForm : ''}
                                </span>
                                <div className="wrap-input100 validate-input bg1" data-validate="Please Type Your Name">
                                    <span className="label-input100">
                                        {localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).fullName : ''} *
                                    </span>
                                    <input
                                        className="input100"
                                        maxLength={50}
                                        type="text"
                                        onChange={(e) => {
                                            let val = e.target.value
                                            let regex = /^[\u0621-\u064AA-Za-z \n]{0,50}$/;
                                            if (regex.test(val)) {
                                                setFeedbackForm(prevState => {
                                                    return { ...prevState, fullName: val, fullNameError: false }
                                                })
                                            }

                                        }}
                                        aria-label={'name'}
                                        aria-required="true"
                                        value={feedbackForm.fullName}
                                        name="name"
                                        placeholder={
                                            localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).fullNamePlaceholder : ''
                                        } />
                                    {
                                        submitFeedback && feedbackForm.fullNameError
                                            ?
                                            <p
                                                style={{ paddingLeft: 5, color: 'red', fontSize: 12 }}>
                                                {localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).fullNameErr : ''}
                                            </p>
                                            :
                                            null
                                    }
                                </div>
                                <div className="wrap-input100 validate-input bg1 rs1-wrap-input100" data-validate="Enter Your Email (e@a.x)">
                                    <span className="label-input100">{i18n[language == 'sp' ? 'sp' : 'en'].resultDashboard.email} *</span>
                                    <input
                                        placeholder={
                                            localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).emailPlaceholder : ''
                                        }
                                        aria-label={'email'}
                                        aria-required="true"
                                        className="input100"
                                        maxLength={50}
                                        value={feedbackForm.email}
                                        onChange={(e) => {
                                            let val = e.target.value;
                                            setFeedbackForm(prevState => {
                                                return { ...prevState, email: val, emailError: false }
                                            })
                                        }}
                                    />
                                    {
                                        submitFeedback && feedbackForm.emailError ?
                                            <p style={{ paddingLeft: 5, color: 'red', fontSize: 12 }}>
                                                {localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).emailErr : ''}
                                            </p>
                                            :
                                            null
                                    }
                                </div>
                                <div className="wrap-input100 bg1 rs1-wrap-input100">
                                    <span className="label-input100">
                                        {localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).phoneNumber : ''}
                                    </span>
                                    <input
                                        className="input100"
                                        maxLength={12}
                                        value={feedbackForm.phone}
                                        onChange={(e) => {
                                            let val = e.target.value;
                                            let regex = /^[0-9]{0,32}$/;
                                            if (regex.test(val)) {
                                                setFeedbackForm(prevState => {
                                                    return { ...prevState, phone: val, phoneError: false }
                                                })
                                            }
                                        }}
                                        aria-label={'phone'}
                                        aria-required="true"
                                        type="text"
                                        name="phone"
                                        placeholder={
                                            localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).phoneNumberPlaceholder : ''
                                        }
                                    />
                                </div>
                                <div className="wrap-input100 validate-input bg0 rs1-alert-validate" data-validate="Please Type Your Message">
                                    <span className="label-input100">
                                        {localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).feedbackmsg : ''}*
                                    </span>
                                    <textarea className="input100"
                                        aria-label={'message'}
                                        aria-required="true"
                                        maxLength={250}
                                        name="message"
                                        value={feedbackForm.feedback}
                                        onChange={(e) => {
                                            let val = e.target.value;
                                            let regex = /^[a-zA-Z0-9 ]{0,250}$/;
                                            if (regex.test(val)) {
                                                setFeedbackForm(prevState => {
                                                    return { ...prevState, feedback: val, feedbackError: false }
                                                })
                                            }
                                        }}
                                        placeholder={
                                            localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).feedbackmsgPlaceholder : ''
                                        }
                                    >
                                    </textarea>
                                    {
                                        submitFeedback && feedbackForm.feedbackError
                                            ?
                                            <p style={{ paddingLeft: 5, color: 'red', fontSize: 12 }}>
                                                {localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).feedbackmsgErr : ''}
                                            </p>
                                            :
                                            null
                                    }
                                </div>
                                <div className="container-contact100-form-btn">
                                    <button
                                        onClick={submitFeedbackForm}
                                        className="contact100-form-btn">

                                        <span>
                                            {localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).submit : ''}
                                        </span>

                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default geolocated({
    positionOptions: {
        enableHighAccuracy: false,
    },
    userDecisionTimeout: 5000,
})(ResultDashboard);
