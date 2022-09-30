import React, { useState, useEffect, useRef } from 'react';
import './../App.css';
import i18n from './../utils/i18n';
import Speech from 'speak-tts';

const AboutTool = (props) => {

    const [language, setLanguage] = useState('en');
    const [adviceSpeech, setAdviceSpeech] = useState('');
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

        localStorage.removeItem('LoginData');
        let lang = localStorage.getItem('language');
        setLanguage(lang);

        let audioData = lang == 'en' ? 'Quick Risk Evaluation Tool for Micro Small and Medium-sized Enterprises (MSMEs) Introduction The COVID-19 pandemic has resulted in severe economic losses calling for a sustained period of interventions from both governments and the private sector to respond and recover. Micro, Small and Medium Enterprises (MSMEs) on one hand are at a high risk of being of severely impacted by the broader effects of the outbreak and on the other also the ones who are leading the fight to survival not only for their own business but also for the overall livelihood and well-being of their community. Among the host of challenges faced by MSME, the most notable is a lack of access to credit. For example, in Southeast Asia 33% of MSMEs lack access to loans and a line of credit1 and are thus more vulnerable to shocks compared to larger enterprises. In the event of bigger shocks, like COVID-19 the MSMEs face an existential risk due to their smaller set of – both financial and non-financial – resources.Most MSMEs do not have enough in-house technical expertise, nor access to expertise in their area to help them develop a business continuity and recovery plans. In order to support MSMEs in aligning their thinking towards risk proofing their businesses, the proposed quick self-risk estimation tool aims to: Scope of the tool To support business owners in identifying possible internal and external risks to their business from COVID-19.To provide a general evaluation of individual business risk (MSMEs) based on potential Impact (direct) and likelihood (possible indirect and wider impacts) of COVID-19.Strengthen risk awareness and communication between business owners.Limitation of the tool The tool does not undertake a comprehensive risk assessment of the MSME business, which requires more substantial analysis. Instead, this tool aims to provide a a quick general evaluation of the current situation in which a business in operating. A business owner may use this tool to evaluate the temporal change in the conditions and how that impacts the overall business risk. Based on the general evaluation, the UNDRR COVID-19 Small Business Continuity and Recovery Planning Toolkit can then be used to look at specific risk management actions.Target group Business owners belonging to Micro Small and Medium Scale Enterprises (MSMEs) in Asia Pacific region.Platform Mobile, Tablet and Computer Framework and Indicators In the COVID-19 pandemic, a business would experience two broad risks. Risks due to both internal factors and external factors as shown in figure 1. There are 4 factors integral to a business namely: a) Human Resource, b) operation; c) finance and Technology & d) innovation. These factors are managed by the business and necessary changes be made to them based on the changing scenario. While in the external risk, there are three factors that influence the outcome of a business namely: a) Government policies; b) Change in Market and c) other natural hazards. The external risks are often beyond the control of an individual businesses to manage. References 1.COSO (Committee of Sponsoring Organizations of the Treadway Commission), (2004). Enterprise Risk Management - Integrated Framework,Vol. 2. ,2.Ekwere N. (2016) FRAMEWORK OF EFFECTIVE RISK MANAGEMENT IN SMALL AND MEDIUM ENTERPRISES (SMEs): A LITERATURE REVIEW; Volume 20 Nov 1, 2016. 3.ILO (2020) The six-step COVID-19 business continuity plan for SMEs. 4.ISO 22301 Societal security: Business continuity management systems. 5.KPMG (2020) Covid-19 Response Assessment Tool accessed online at https://aspac.kpmgcovidresponse.com/ on 18.05.2020. 6.McGuinness W (2006). Managing the business risk of a pandemic: Lessons from the past and a checklist for the future, Discussion paper, Sustainable Future. 7.UAE (2020) Business Continuity Readiness Guidelines for UAE Organizations in the in the event of the Novel Coronavirus (COVID- 1 9), National Emergency Crisis and Disasters Management Authority (NECMA), March 2020. 8.UNDRR (2013) Global Assessment Report on Disaster Risk Reduction. 9.UNDRR (2020) COVID-19 Small Business Continuity and Recovery Planning Toolkit. 10.UNESCAP (nd) SMEs IN ASIA AND THE PACIFIC, Accessed on line at https://www.unescap.org/sites/default/files/7%20-%201.%20SMEs%20IN%20ASIA%20AND%20THE%20PACIFIC.pdf. 11.World Health Organisation (2018) A checklist for pandemic influenza risk and impact management.' : 'Información sobre la herramienta Introducción La pandemia de COVID-19 ha originado graves pérdidas económicas, por lo que se necesita un período sostenido de intervenciones, tanto de los gobiernos como del sector privado, para responder a la crisis y poder recuperarse. Por un lado, las micro, pequeñas y medianas empresas (MPYMES) corren un alto riesgo de resultar severamente afectadas por los efectos generales de la epidemia y, por otra parte, estas empresas son las que están encabezando la lucha por la supervivencia, no solo de sus propios negocios, sino también de los medios de vida en general, así como del bienestar de sus comunidades.Entre la serie de retos que enfrentan las MPYMES, el más destacado es la falta de acceso al crédito. Por ejemplo, en el sur asiático, el 33% de estas empresas carece de acceso a préstamos y a una línea de crédito. Por lo tanto, son más vulnerables a los choques, en comparación con las empresas más grandes. En el caso de choques más profundos, tal como el COVID-19, las MPYMES enfrentan un riesgo existencial debido a sus recursos más limitados, tanto financieros como no financieros.La mayoría de las MPYMES no tienen suficiente conocimiento especializado a nivel interno, ni acceso en sus áreas para ayudarles a elaborar planes de continuidad empresarial y de recuperación. Para apoyar a las MPYMES a que puedan alinear su razonamiento hacia la protección de sus negocios contra diversos riesgos, la herramienta propuesta para un cálculo rápido del riesgo busca lograr lo siguiente: Ámbito del a herramienta Apoyar a los propietarios de empresas para identificar riesgos internos y externos de sus negocios con respecto al COVID-19. Ofrecer una evaluación general de los riesgos de las empresas en un plano individual (MPYMES) con base en el posible impacto (directo) y la probabilidad (posibles efectos indirectos y más amplios) del COVID-19.Fortalecer y aumentar el grado de sensibilización y comunicación entre los propietarios de empresas y negocios.Limitaciones de la herramienta La herramienta no realiza una evaluación exhaustiva de los riesgos de los negocios de las MPYMES. En lugar de ello, esta herramienta busca ofrecer una evaluación rápida general sobre la situación actual en la que funciona un negocio. Los propietarios de empresas pueden usar esta herramienta para evaluar los cambios temporales en las condiciones y la forma en que esto repercute en los riesgos empresariales generales. Con base en la evaluación general, se puede utilizar el conjunto de herramientas para la planificación de la continuidad y la recuperación de las pequeñas empresas ante el COVID 19, de UNDRR (Small Business Continuity and Recovery Planning Toolkit), con el propósito de analizar acciones específicas para la gestión del riesgo. Grupo meta Propietarios de negocios que pertenecen a las micro, pequeñas y medianas empresas (MPYMES) en la región de Asia y el Pacífico.Plataforma Teléfono celular, tableta o computadora.Marco e indicadores En la pandemia del COVID-19, una empresa experimentaría dos riesgos muy amplios. Los riesgos debido a factores internos y los que obedecen a factores externos, según se muestran en el gráfico 1. Hay cuatro factores integrales en un negocio o empresa, a saber: a) recursos humanos, b) operaciones, c) finanzas y d) tecnología e innovación. Las empresas gestionan estos factores y los cambios necesarios que deben efectuarse, con base en las variaciones en el escenario existente. En el caso de los riesgos externos, hay tres factores que inciden en el resultado de un negocio, a saber: a) políticas gubernamentales, b) cambios en el mercado y c) otras amenazas naturales. Por lo general, los riesgos externos están fuera del control de una empresa individual para que los pueda gestionar.Referencias bibliográficas 1.COSO (Comité de Organizaciones Patrocinadoras de la Comisión Treadway), (2004). Enterprise Risk Management - Integrated Framework,Vol.2.  2.Ekwere N. (2016) Framework of Effective Risk Management in Small and Medium Enterprises (SMEs): A Literature Review; Vol 20. 1° de noviembre de 2016. 3.	ILO (2020) The six-step COVID-19 business continuity plan for SMEs. 4.	ISO 22301 Societal security: Business continuity management systems. 5.	KPMG (2020) Covid-19 Response Assessment Tool. Consultado en línea el 18 de mayo de 2020 en: https://aspac.kpmgcovidresponse.com. 6.McGuinness W (2006). Managing the business risk of a pandemic: Lessons from the past and a checklist for the future, Discussion paper, Sustainable Future. 7.	Organización Mundial de la Salud (2018). Lista de verificación para gestionar los riesgos y los efectos de una gripe pandémica. 8.	UAE (2020) Business Continuity Readiness Guidelines for UAE Organizations in the in the event of the Novel Coronavirus (COVID- 1 9), National Emergency Crisis and Disasters Management Authority (NECMA). Marzo de 2020. 9.	UNDRR (2013) Informe de Evaluación Global sobre Reducción del Riesgo de Desastres (GAR). 10.UNDRR (2020) COVID-19 Small Business Continuity and Recovery Planning Toolkit. 11.UNESCAP (sin fecha) SMEs in Asia And the Pacific. Consultado en línea en: https://www.unescap.org/sites/default/files/7%20-%201.%20SMEs%20IN%20ASIA%20AND %20THE%20PACIFIC.pdf';
        setAdviceSpeech(audioData);
        init();
    }, []);

    useEffect(() => {
        init();
    }, [adviceSpeech, language]);

    const init = () => {
        const speech = new Speech();
        speech.init({
            volume: 1,
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
            const lang = localStorage.getItem('language') == 'en' ? "en-IN" : "es-ES";//
            if (lang) speech.setLanguage(lang);
            speech.speak({
                text: localStorage.getItem('language') == 'en' ? 'Quick Risk Evaluation Tool for Micro Small and Medium-sized Enterprises (MSMEs) Introduction The COVID-19 pandemic has resulted in severe economic losses calling for a sustained period of interventions from both governments and the private sector to respond and recover. Micro, Small and Medium Enterprises (MSMEs) on one hand are at a high risk of being of severely impacted by the broader effects of the outbreak and on the other also the ones who are leading the fight to survival not only for their own business but also for the overall livelihood and well-being of their community. Among the host of challenges faced by MSME, the most notable is a lack of access to credit. For example, in Southeast Asia 33% of MSMEs lack access to loans and a line of credit1 and are thus more vulnerable to shocks compared to larger enterprises. In the event of bigger shocks, like COVID-19 the MSMEs face an existential risk due to their smaller set of – both financial and non-financial – resources.Most MSMEs do not have enough in-house technical expertise, nor access to expertise in their area to help them develop a business continuity and recovery plans. In order to support MSMEs in aligning their thinking towards risk proofing their businesses, the proposed quick self-risk estimation tool aims to: Scope of the tool To support business owners in identifying possible internal and external risks to their business from COVID-19.To provide a general evaluation of individual business risk (MSMEs) based on potential Impact (direct) and likelihood (possible indirect and wider impacts) of COVID-19.Strengthen risk awareness and communication between business owners.Limitation of the tool The tool does not undertake a comprehensive risk assessment of the MSME business, which requires more substantial analysis. Instead, this tool aims to provide a a quick general evaluation of the current situation in which a business in operating. A business owner may use this tool to evaluate the temporal change in the conditions and how that impacts the overall business risk. Based on the general evaluation, the UNDRR COVID-19 Small Business Continuity and Recovery Planning Toolkit can then be used to look at specific risk management actions.Target group Business owners belonging to Micro Small and Medium Scale Enterprises (MSMEs) in Asia Pacific region.Platform Mobile, Tablet and Computer Framework and Indicators In the COVID-19 pandemic, a business would experience two broad risks. Risks due to both internal factors and external factors as shown in figure 1. There are 4 factors integral to a business namely: a) Human Resource, b) operation; c) finance and Technology & d) innovation. These factors are managed by the business and necessary changes be made to them based on the changing scenario. While in the external risk, there are three factors that influence the outcome of a business namely: a) Government policies; b) Change in Market and c) other natural hazards. The external risks are often beyond the control of an individual businesses to manage. References 1.COSO (Committee of Sponsoring Organizations of the Treadway Commission), (2004). Enterprise Risk Management - Integrated Framework,Vol. 2. ,2.Ekwere N. (2016) FRAMEWORK OF EFFECTIVE RISK MANAGEMENT IN SMALL AND MEDIUM ENTERPRISES (SMEs): A LITERATURE REVIEW; Volume 20 Nov 1, 2016. 3.ILO (2020) The six-step COVID-19 business continuity plan for SMEs. 4.ISO 22301 Societal security: Business continuity management systems. 5.KPMG (2020) Covid-19 Response Assessment Tool accessed online at https://aspac.kpmgcovidresponse.com/ on 18.05.2020. 6.McGuinness W (2006). Managing the business risk of a pandemic: Lessons from the past and a checklist for the future, Discussion paper, Sustainable Future. 7.UAE (2020) Business Continuity Readiness Guidelines for UAE Organizations in the in the event of the Novel Coronavirus (COVID- 1 9), National Emergency Crisis and Disasters Management Authority (NECMA), March 2020. 8.UNDRR (2013) Global Assessment Report on Disaster Risk Reduction. 9.UNDRR (2020) COVID-19 Small Business Continuity and Recovery Planning Toolkit. 10.UNESCAP (nd) SMEs IN ASIA AND THE PACIFIC, Accessed on line at https://www.unescap.org/sites/default/files/7%20-%201.%20SMEs%20IN%20ASIA%20AND%20THE%20PACIFIC.pdf. 11.World Health Organisation (2018) A checklist for pandemic influenza risk and impact management.' : 'Información sobre la herramienta Introducción La pandemia de COVID-19 ha originado graves pérdidas económicas, por lo que se necesita un período sostenido de intervenciones, tanto de los gobiernos como del sector privado, para responder a la crisis y poder recuperarse. Por un lado, las micro, pequeñas y medianas empresas (MPYMES) corren un alto riesgo de resultar severamente afectadas por los efectos generales de la epidemia y, por otra parte, estas empresas son las que están encabezando la lucha por la supervivencia, no solo de sus propios negocios, sino también de los medios de vida en general, así como del bienestar de sus comunidades.Entre la serie de retos que enfrentan las MPYMES, el más destacado es la falta de acceso al crédito. Por ejemplo, en el sur asiático, el 33% de estas empresas carece de acceso a préstamos y a una línea de crédito. Por lo tanto, son más vulnerables a los choques, en comparación con las empresas más grandes. En el caso de choques más profundos, tal como el COVID-19, las MPYMES enfrentan un riesgo existencial debido a sus recursos más limitados, tanto financieros como no financieros.La mayoría de las MPYMES no tienen suficiente conocimiento especializado a nivel interno, ni acceso en sus áreas para ayudarles a elaborar planes de continuidad empresarial y de recuperación. Para apoyar a las MPYMES a que puedan alinear su razonamiento hacia la protección de sus negocios contra diversos riesgos, la herramienta propuesta para un cálculo rápido del riesgo busca lograr lo siguiente: Ámbito del a herramienta Apoyar a los propietarios de empresas para identificar riesgos internos y externos de sus negocios con respecto al COVID-19. Ofrecer una evaluación general de los riesgos de las empresas en un plano individual (MPYMES) con base en el posible impacto (directo) y la probabilidad (posibles efectos indirectos y más amplios) del COVID-19.Fortalecer y aumentar el grado de sensibilización y comunicación entre los propietarios de empresas y negocios.Limitaciones de la herramienta La herramienta no realiza una evaluación exhaustiva de los riesgos de los negocios de las MPYMES. En lugar de ello, esta herramienta busca ofrecer una evaluación rápida general sobre la situación actual en la que funciona un negocio. Los propietarios de empresas pueden usar esta herramienta para evaluar los cambios temporales en las condiciones y la forma en que esto repercute en los riesgos empresariales generales. Con base en la evaluación general, se puede utilizar el conjunto de herramientas para la planificación de la continuidad y la recuperación de las pequeñas empresas ante el COVID 19, de UNDRR (Small Business Continuity and Recovery Planning Toolkit), con el propósito de analizar acciones específicas para la gestión del riesgo. Grupo meta Propietarios de negocios que pertenecen a las micro, pequeñas y medianas empresas (MPYMES) en la región de Asia y el Pacífico.Plataforma Teléfono celular, tableta o computadora.Marco e indicadores En la pandemia del COVID-19, una empresa experimentaría dos riesgos muy amplios. Los riesgos debido a factores internos y los que obedecen a factores externos, según se muestran en el gráfico 1. Hay cuatro factores integrales en un negocio o empresa, a saber: a) recursos humanos, b) operaciones, c) finanzas y d) tecnología e innovación. Las empresas gestionan estos factores y los cambios necesarios que deben efectuarse, con base en las variaciones en el escenario existente. En el caso de los riesgos externos, hay tres factores que inciden en el resultado de un negocio, a saber: a) políticas gubernamentales, b) cambios en el mercado y c) otras amenazas naturales. Por lo general, los riesgos externos están fuera del control de una empresa individual para que los pueda gestionar.Referencias bibliográficas 1.COSO (Comité de Organizaciones Patrocinadoras de la Comisión Treadway), (2004). Enterprise Risk Management - Integrated Framework,Vol.2.  2.Ekwere N. (2016) Framework of Effective Risk Management in Small and Medium Enterprises (SMEs): A Literature Review; Vol 20. 1° de noviembre de 2016. 3.	ILO (2020) The six-step COVID-19 business continuity plan for SMEs. 4.	ISO 22301 Societal security: Business continuity management systems. 5.	KPMG (2020) Covid-19 Response Assessment Tool. Consultado en línea el 18 de mayo de 2020 en: https://aspac.kpmgcovidresponse.com. 6.McGuinness W (2006). Managing the business risk of a pandemic: Lessons from the past and a checklist for the future, Discussion paper, Sustainable Future. 7.	Organización Mundial de la Salud (2018). Lista de verificación para gestionar los riesgos y los efectos de una gripe pandémica. 8.	UAE (2020) Business Continuity Readiness Guidelines for UAE Organizations in the in the event of the Novel Coronavirus (COVID- 1 9), National Emergency Crisis and Disasters Management Authority (NECMA). Marzo de 2020. 9.	UNDRR (2013) Informe de Evaluación Global sobre Reducción del Riesgo de Desastres (GAR). 10.UNDRR (2020) COVID-19 Small Business Continuity and Recovery Planning Toolkit. 11.UNESCAP (sin fecha) SMEs in Asia And the Pacific. Consultado en línea en: https://www.unescap.org/sites/default/files/7%20-%201.%20SMEs%20IN%20ASIA%20AND %20THE%20PACIFIC.pdf',
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

    return (
        <section className="bg-img" style={{ height: '100%', backgroundColor: '#ffffff' }}>
            <img
                onClick={() => {
                    
                    window.history.back()
                }}
                className="backButtonForMobile"
                alt="back"
                src={require('./../assets/img/images/back.png')}
                style={{ display: (orientation === 0 && orientationMode === 'portrait') ? 'block' : 'none', height: 30, width: 30, position: 'absolute', top: '5vw', left: '5vw', zIndex: 999 }} />
            <div className="container-fluid">
                <div className="row head-img">
                    <div className="col-md-12 ">
                        <div className="row tabmargin">
                            <div className="col-md-3 col-3">
                                <a target="_blank" href='https://www.undrr.org/'><img alt="UNDRR" style={{ marginTop: '1vh', marginLeft: '2vw', width: '85%' }} src={require('./../assets/img/images/undrrlogocolor.png')} className="img-fluid" />
                                </a>
                            </div>
                            <div className="col-md-5 col-5" />
                            <div className="col-md-4 col-4" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <img onClick={() => props.history.replace({
                                    pathname: '/',
                                })
                                } alt="COVID-19 RESPONSE logo" src={(window.orientation == 90 || window.orientation == 270) && window.innerWidth < 850 ? require('./../assets/img/images/logo-covid-response.png') : require('./../assets/img/images/logo-covid-response1.png')} style={{ width: '85%' }} className="img-fluid hederside_logo" />
                            </div>
                        </div>
                    </div>
                </div>
            </div >
            <div className="row" style={{ backgroundColor: '#dedede', margin: '0px' }}>
                <div className="col-md-5 col-12 padd-0" style={{ width: '100vw', backgroundColor: '#dedede' }} >
                    <p style={{ color: '#234081', padding: '2vh', margin: 0, marginLeft: '1vw', fontFamily: 'Roboto' }}>
                        {
                            localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).toolName : ''
                        }
                    </p>
                </div>
                <div className="col-md-6 col-1 padd-0 AudioControl" style={{ backgroundColor: '#dedede', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }} >
                    <div  >
                        <p style={{ color: '#234081', padding: '2vh', margin: 0, marginLeft: '1vw', fontFamily: 'Roboto' }}>
                            {
                                localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).audioAssistance : ''
                            }
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
                            alt="Home"
                            style={{ height: 25, width: 25 }}
                            src={require('./../assets/img/home.png')} />
                    </button>
                </div>
            </div>
            <div className="container-fluid" style={{ height: '100%', backgroundColor: '#ffffff' }} >
                <div className="row">
                    <div className="col-md-1 col-1" ></div>

                    <div className="col-md-10 col-10">
                        <div style={{ height: '5vh' }}></div>
                        <header>
                            <h1 style={{ fontFamily: 'Roboto', marginBottom: '0rem', textAlign: 'center', fontSize: '1.5rem' }}>
                                <b>
                                    {
                                        localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).header : ''
                                    }
                                </b>
                            </h1>
                        </header>
                        <br />
                        <h6 style={{ fontFamily: 'Roboto', marginBottom: '0rem', textAlign: 'justify' }}>
                            <b>
                                {
                                    localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).introduction : ''
                                }
                            </b>
                        </h6>
                        <p style={{ fontFamily: 'Roboto', marginBottom: '0rem', textAlign: 'justify' }}>
                            {
                                localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).introLine1 : ''
                            }
                        </p>
                        <br />
                        <p style={{ fontFamily: 'Roboto', marginBottom: '0rem', textAlign: 'justify' }}>
                            {
                                localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).introLine2 : ''
                            }
                        </p>
                        <br />
                        <p style={{ fontFamily: 'Roboto', marginBottom: '0rem', textAlign: 'justify' }}>
                            {
                                localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).introLine3 : ''
                            }
                        </p>
                        <br />
                        <h6 style={{ fontFamily: 'Roboto', marginBottom: '0rem', textAlign: 'justify' }}>
                            <b>
                                {
                                    localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).scopeofTool : ''
                                }
                            </b>
                        </h6>
                        <ul>
                            <li>
                                <p style={{ fontFamily: 'Roboto', marginBottom: '0rem', textAlign: 'justify' }}>
                                    {
                                        localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).scopeLine1 : ''
                                    }
                                </p>
                            </li>
                            <li>
                                <p style={{ fontFamily: 'Roboto', marginBottom: '0rem', textAlign: 'justify' }}>
                                    {
                                        localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).scopeLine2 : ''
                                    }
                                </p>
                            </li>
                            <li>
                                <p style={{ fontFamily: 'Roboto', marginBottom: '0rem', textAlign: 'justify' }}>
                                    {
                                        localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).scopeLine3 : ''
                                    }
                                </p>
                            </li>
                        </ul>
                        <h6 style={{ fontFamily: 'Roboto', marginBottom: '0rem', textAlign: 'justify' }}>
                            <b>
                                {
                                    localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).limitationofTool : ''
                                }
                            </b>
                        </h6>
                        <p style={{ fontFamily: 'Roboto', marginBottom: '0rem', textAlign: 'justify' }}>
                            {
                                localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).limitationLine1 : ''
                            }
                        </p>
                        <br />
                        <h6 style={{ fontFamily: 'Roboto', marginBottom: '0rem', textAlign: 'justify' }}>
                            <b>
                                {
                                    localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).targetGroup : ''
                                }
                            </b>
                        </h6>
                        <p style={{ fontFamily: 'Roboto', marginBottom: '0rem', textAlign: 'justify' }}>
                            {
                                localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).targetGroupLine1 : ''
                            }
                        </p>
                        <br />
                        <h6 style={{ fontFamily: 'Roboto', marginBottom: '0rem', textAlign: 'justify' }}>
                            <b>
                                {
                                    localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).platform : ''
                                }
                            </b>
                        </h6>
                        <p style={{ fontFamily: 'Roboto', marginBottom: '0rem', textAlign: 'justify' }}>
                            {
                                localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).platformLine1 : ''
                            }
                        </p>
                        <br />
                        <h6 style={{ fontFamily: 'Roboto', marginBottom: '0rem', textAlign: 'justify' }}>
                            <b>
                                {
                                    localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).framework : ''
                                }
                            </b>
                        </h6>
                        <p style={{ fontFamily: 'Roboto', marginBottom: '0rem', textAlign: 'justify' }}>
                            {
                                localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).frameworkLine1 : ''
                            }
                        </p>
                        <img alt="concept" style={{ width: window.innerWidth < 481 ? '100%' : '60%', marginLeft: window.innerWidth > 1224 ? '20%' : '0%' }} src={require('./../assets/img/images/concept.png')} className="img-fluid" />
                        <h6 style={{ fontFamily: 'Roboto', marginBottom: '0rem', textAlign: 'center' }}>
                            <b>
                                {
                                    localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).frameworkLine2 : ''
                                }
                            </b>
                        </h6>
                        <br />
                        <table>
                            <tbody>
                                <tr>
                                    <th>
                                        {
                                            localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).tableHead1 : ''
                                        }
                                    </th>
                                    <th>
                                        {
                                            localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).tableHead2 : ''
                                        }
                                    </th>
                                    <th>
                                        {
                                            localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).tableHead3 : ''
                                        }
                                    </th>
                                    <th>
                                        {
                                            localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).tableHead4 : ''
                                        }
                                    </th>
                                </tr>
                                <tr>
                                    <td>
                                        {
                                            localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).row11 : ''
                                        }
                                    </td>
                                    <td>
                                        {
                                            localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).row12 : ''
                                        }
                                    </td>
                                    <td>
                                        {
                                            localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).row13 : ''
                                        }
                                    </td>
                                    <td>
                                        {
                                            localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).row14 : ''
                                        }
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        {
                                            localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).row21 : ''
                                        }
                                    </td>
                                    <td>
                                        {
                                            localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).row22 : ''
                                        }
                                    </td>
                                    <td>
                                        {
                                            localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).row23 : ''
                                        }
                                    </td>
                                    <td>
                                        {
                                            localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).row24 : ''
                                        }
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        {
                                            localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).row31 : ''
                                        }
                                    </td>
                                    <td>
                                        {
                                            localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).row32 : ''
                                        }
                                    </td>
                                    <td>
                                        {
                                            localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).row33 : ''
                                        }
                                    </td>
                                    <td>
                                        {
                                            localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).row34 : ''
                                        }
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        {
                                            localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).row41 : ''
                                        }
                                    </td>
                                    <td>
                                        {
                                            localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).row42 : ''
                                        }
                                    </td>
                                    <td></td>
                                    <td> </td>
                                </tr>
                            </tbody>
                        </table>
                        <br />
                        <h6 style={{ fontFamily: 'Roboto', marginBottom: '0rem', textAlign: 'justify' }}>
                            <b>
                                {
                                    localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).references : ''
                                }
                            </b>
                        </h6>
                        <ol>
                            <li>
                                <p style={{ fontFamily: 'Roboto', marginBottom: '0rem', textAlign: 'justify' }}>
                                    {
                                        localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).references1 : ''
                                    }
                                </p>
                            </li>
                            <li>
                                <p style={{ fontFamily: 'Roboto', marginBottom: '0rem', textAlign: 'justify' }}>
                                    {
                                        localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).references2 : ''
                                    }
                                </p>
                            </li>
                            <li>
                                <p style={{ fontFamily: 'Roboto', marginBottom: '0rem', textAlign: 'justify' }}>
                                    {
                                        localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).references3 : ''
                                    }
                                </p>
                            </li>
                            <li>
                                <p style={{ fontFamily: 'Roboto', marginBottom: '0rem', textAlign: 'justify' }}>
                                    {
                                        localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).references4 : ''
                                    }
                                </p>
                            </li>
                            <li>
                                <p style={{ fontFamily: 'Roboto', marginBottom: '0rem', textAlign: 'justify' }}>
                                    {
                                        localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).references5a + " " : ''
                                    }
                                    <a style={{ color: 'blue' }} href="https://aspac.kpmgcovidresponse.com/">
                                        {
                                            localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).references5b : ''
                                        }
                                    </a>
                                    {
                                        localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).references5c : ''
                                    }
                                </p>
                            </li>
                            <li>
                                <p style={{ fontFamily: 'Roboto', marginBottom: '0rem', textAlign: 'justify' }}>
                                    {
                                        localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).references6 : ''
                                    }
                                </p>
                            </li>
                            <li>
                                <p style={{ fontFamily: 'Roboto', marginBottom: '0rem', textAlign: 'justify' }}>
                                    {
                                        localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).references7 : ''
                                    }
                                </p>
                            </li>
                            <li>
                                <p style={{ fontFamily: 'Roboto', marginBottom: '0rem', textAlign: 'justify' }}>
                                    {
                                        localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).references8 : ''
                                    }
                                </p>
                            </li>
                            <li>
                                <p style={{ fontFamily: 'Roboto', marginBottom: '0rem', textAlign: 'justify' }}>
                                    {
                                        localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).references9 : ''
                                    }
                                </p>
                            </li>
                            <li>
                                <p style={{ fontFamily: 'Roboto', marginBottom: '0rem', textAlign: 'justify' }}>
                                    {
                                        localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).references10a + " " : ''
                                    }
                                    <a style={{ color: 'blue' }} href="https://www.unescap.org/sites/default/files/7%20-%201.%20SMEs%20IN%20ASIA%20AND%20THE%20PACIFIC.pdf">
                                        {
                                            localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).references10b + " " : ''
                                        }
                                    </a>
                                    <a style={{ color: 'blue' }} href="https://www.unescap.org/sites/default/files/7%20-%201.%20SMEs%20IN%20ASIA%20AND%20THE%20PACIFIC.pdf">
                                        {
                                            localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).references10c : ''
                                        }
                                    </a>
                                </p>
                            </li><li>
                                <p style={{ fontFamily: 'Roboto', marginBottom: '0rem', textAlign: 'justify' }}>
                                    {
                                        localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).references11 : ''
                                    }
                                </p>
                            </li>
                        </ol>
                        {
                            language == 'sp' ?
                                <p style={{ fontFamily: 'Roboto', marginBottom: '0rem', textAlign: 'justify' }}>
                                    El lanzamiento de esta herramienta en español ha sido posible gracias al apoyo financiero de la Oficina de los Estados Unidos de Asistencia en el Extranjero de USAID  (USAID BHA). (The publication of this tool in spanish has been possible with the support of USAID BHA)
                                </p>
                                : null
                        }
                    </div>
                    <div className="col-md-1 col-1"></div>
                </div>
            </div>
        </section >
    );
}

export default AboutTool;
