import React, { useState, useEffect, useRef } from 'react';
import './../App.css';
import "react-sweet-progress/lib/style.css";
import CurrencyFormat from 'react-currency-format';
import i18n from './../utils/i18n';
import Speech from 'speak-tts';
import IdleTimer from 'react-idle-timer';
import { geolocated } from "react-geolocated";
import { CountryDropdown, RegionDropdown, CountryRegionData } from 'react-country-region-selector';
import { Modal, Popover, Overlay, ProgressBar } from 'react-bootstrap';
import { saveQuesionsService } from './../services/webServices';
import { Progress } from 'react-sweet-progress';
import { useLocation } from "react-router-dom";
import { useIdleTimer } from 'react-idle-timer';

var _ = require('lodash');

const Questionnaire = (props) => {

    const allQuestionArray = {
        'En': [
            { que: 'Select business type?', type: 'select', options: [{ name: 'Manufacturing' }, { name: 'Transportation and Supply Chain' }, { name: 'Hospitality' }, { name: 'Food and Beverage' }, { name: 'Software/IT ' }, { name: 'Construction and Real estate' }, { name: 'Agribusiness' }, { name: 'Consultancy' }, { name: 'Education' }, { name: 'Travel and Tourism' }, { name: 'Media and Entertainment' }, { name: 'Electronics and Telecommunication' }, { name: 'Healthcare' }, { name: 'Microfinance institutions' }, { name: 'Retail and Wholesale' }, { name: 'NGO/NPO' }] },
            { que: 'Are you one of the owners of the business?', type: 'radio', options: [{ name: 'Yes' }, { name: 'No' }] },
            { que: 'Is one of the owners of the business a female?', type: 'radio', options: [{ name: 'Yes' }, { name: 'No' }] },
            { que: 'What is the total number of offices/manufacturing units/stores/ warehouses the business has?', type: 'textinput' },
            { que: 'What is the business’s annual revenue (in local currency)?', type: 'textinput' },
            { que: 'What is the total number of staff/employees/workers the business has?', type: 'textinput' },
            { que: 'Type of business?', type: 'select', options: [{ name: 'Sole proprietor' }, { name: 'Partnership' }, { name: 'Limited Liability Company' }, { name: 'Corporation' }, { name: 'Cooperative / Trust / Society' }, { name: 'Not yet registered' }, { name: 'NGO/NPO' }] },
            { que: 'Country?', type: 'select' },
            { que: 'Province?', type: 'select' },
            { que: 'Postal/Zip/Pin code? (optional)', type: 'textinput' },

            { que: 'Does the business have a Business Continuity Plan (BCP)?', type: 'radio', options: [{ name: 'Yes, It has a plan and it considers health emergencies (pandemic/outbreak)' }, { name: 'Yes, It has a plan but it does not consider health emergencies (pandemic/outbreak)' }, { name: 'It does not have a Business Continuity Plan' }, { name: 'I am unaware of the term "Business Continuity Plan"' }, { name: `I don’t know if it has a BCP.` }] },
            { que: `Has the business implemented its Business Continuity Plan (BCP)?`, type: 'radio', options: [{ name: 'Yes (fully)' }, { name: 'Yes (partly)' }, { name: 'No' }], conditional: true },
            { que: `What has been COVID-19's impact on the business? `, type: 'checkbox', options: [{ title: 'Impact on production and services', innerOptions: ['Increase', ' Decline', ' No change'] }, { title: 'Impact on market access', innerOptions: ['Increase', 'Decline', 'No change'] }, { title: 'Impact on cashflow and sales', innerOptions: ['Increase', 'Decline', 'No change'] }, { title: 'Overall impact on employees (e.g. productivity, retention)', innerOptions: ['Positive', 'Negative', 'Mixed', 'No change'] }] },
            { que: 'How long do you think it will take for the business to fully recover from the present situation?', type: 'radio', options: [{ name: 'Already fully recovered' }, { name: 'Less than 6 months' }, { name: 'Between 6 months to 1 year' }, { name: 'More than 1 year' }, { name: 'Not sure/Cannot predict' }] },

            { que: 'How worried are you that the business operations would be impacted by employee unavailability or absenteeism?', type: 'radio', options: [{ name: 'Not at all worried as most of the systems are automated or employees are available', score: 0 }, { name: 'Not so worried as family members and/or friends can or are filling any employee shortages', score: 1 }, { name: 'Worried as the business relies on employees and the business has no other support', score: 2 }] },
            { que: `Are the employees permanent/regular or temporary? \n (Permanent means no fixed end date of employment/have access to superannuation and eligible for company benefits such as pension fund, employer contribution; and Temporary means they are paid by a daily wage or short term contract).`, type: 'radio', options: [{ name: 'All of the employees are permanent or come from amongst the family members', score: 0 }, { name: 'Majority of the employees are permanent or come from amongst the family members (more than 50%)', score: 1 }, { name: 'Approximately there are equal numbers of permanent and temporary employees', score: 1 }, { name: 'Majority of the employees are temporary (more than 50%)', score: 2 }, { name: 'All of the employees are temporary', score: 3 }] },
            { que: 'How would you describe most of the employees in the business? ', multipleText: true, type: 'checkbox', options: [{ name: 'Family members' }, { name: `Friends and neighbours` }, { name: 'Seasonal / Migrant workers / Casual workers / Daily wagers' }, { name: 'Others' }] },
            { que: 'What are the actions the business has  taken /or efforts made to ensure the well-being of the employees? ', multipleText: true, type: 'checkbox', options: [{ name: 'Employees may work remotely/ office space transformed to minimise physical contact', score: 1 }, { name: `Management regularly engages with employee and effectively communicates with them on company's position to COVID-19 and its possible implications`, score: 1 }, { name: 'Management periodically conducts employee support programs to help them with mental and physical wellbeing', score: 1 }, { name: 'Management encourages employees to acquire new skill sets and knowledge to fill in for other employees who are unable to come to work and/or to increase their personal skills', score: 1 }, { name: 'Management guaranteeing income/salary of the employees even if the business has to temporarily close or downsize the operation.', score: 1 }, { name: 'None of these', score: 5 }] },
            { que: 'Does the business require close physical contact or distance with people?', type: 'radio', options: [{ name: 'a. Close physical distance to customers and clients (shops, restaurants etc.)', score: 1 }, { name: 'b. Close physical distance to other employees (manufacturing units, shops, etc.)', score: 1 }, { name: 'c. Both a & b', score: 2 }, { name: 'd. None of these', score: 0 }] },
            { que: 'What kind of Human Resource issues is the business facing due to COVID-19 pandemic? ', multipleText: true, type: 'checkbox', options: [{ name: 'Absenteeism among the employees due to concern over the use of public transportation irrespective of lockdown' }, { name: 'Migration leading to shortage of daily wage workers' }, { name: 'Absenteeism caused by mental and physical stress among employees coming to work leading to reduced working hours or productivity' }, { name: 'Absenteeism among the employees due to lockdown' }, { name: 'Absenteeism due to family members/child care' }, { name: 'None of these' }] },

            { que: 'If the business is highly dependent on Information Technology (IT), has it prepared for / or reviewed existing strategies for possible cyber security threats to the business?', type: 'radio', options: [{ name: 'Yes', score: 1 }, { name: 'No', score: 2 }, { name: 'There is no awareness on such threats', score: 2 }, { name: 'Not applicable', score: 0 }] },
            { que: 'Is the business using technology and /or innovative IT solutions (Digital transaction, virtual office, remote learning, virtual visits/tours, telemedicine, webinar, mobile application) to manage the disruptions or ensure business continuity?', type: 'radio', options: [{ name: 'Yes, most of these', score: 1 }, { name: 'Some of these', score: 2 }, { name: 'No, there has not been any thought about these before', score: 3 }, { name: 'Not applicable for the business', score: 0 }] },
            { que: 'Is there any impact on the business operations due to disruption in basic utility services like electricity, gas, water, telecommunication (mobile, telephone, internet), banking and postal service in your area?', type: 'radio', options: [{ name: 'Business is highly impacted', score: 3 }, { name: 'Business is somewhat impacted', score: 2 }, { name: 'Business had minimal impact', score: 1 }, { name: 'No impact on the business', score: 0 }] },
            { que: 'What kind of supply chain (flow of goods and services linking manufacturer, vendor/supplier, and customer) issues have affected the business? ', multipleText: true, type: 'checkbox', options: [{ name: 'Goods and services have sold out or are unavailable', score: 1 }, { name: 'Vendors/suppliers/raw materials/products have been inaccessible or unavailable', score: 1 }, { name: 'Logistics/transport issues', score: 1 }, { name: 'No current impact on supply chain', score: 0 }] },
            { que: 'Which of these are being promoted in the business for COVID-19 pandemic safety? ', multipleText: true, type: 'checkbox', options: [{ name: 'Workplace sanitisation (e.g. increased cleaning of surfaces, installation of hand sanitising units, etc)', score: 1 }, { name: 'Promoting of good hygiene among staff (wearing mask, washing hands)', score: 1 }, { name: 'Regular temperature checks of employees and customers', score: 1 }, { name: 'Maintaining physical distancing at work place  (e.g. marking the floor to indicate distance between customers and staff, retrofitting of front desks to increase distance between people, etc)', score: 1 }, { name: 'Provision of office transportation facilities to work for employees', score: 1 }, { name: 'Staggering work shifts or introducing work from home policies to minimize employee density in the business/ office', score: 1 }, { name: 'None of these', score: 5 }] },
            { que: 'How do you describe the equipment and machinery status which are indispensable to the business?', type: 'radio', options: [{ name: 'There is no access to the office(s)/manufacturing unit(s)/warehouse(s)/store(s)/other establishment(s)', score: 3 }, { name: 'There is no Annual Maintenance Contract (AMC) and many of the machinery/ equipment need regular maintenance', score: 3 }, { name: 'There is an Annual Maintenance Contract (AMC) in place for most of the machinery/ equipment', score: 2 }, { name: 'The business is not dependent on any such machinery/ equipment which may be rendered unserviceable due to lack of maintenance', score: 1 }, { name: 'The business is not dependent on any such machinery/ equipment', score: 0 }] },
            { que: 'What kind of existing financial liabilities did the business have before COVID-19 pandemic? ', multipleText: true, type: 'checkbox', options: [{ name: 'High operational cost', score: 1 }, { name: 'Pending taxes, cess, interest due to change in government’s financial policies (custom duty, tax, import/export regulations, etc.)', score: 1 }, { name: 'Existing debt/ loans/ or any other financial burden', score: 1 }, { name: 'None of these', score: 0 }] },
            { que: 'How long can the business continue to operate with its present financial position (asset, shares, cash, government support)?', type: 'radio', options: [{ name: 'It cannot continue any further', score: 4 }, { name: 'It can sustain for 1-2 month', score: 3 }, { name: 'It can sustain for 3-6 months', score: 2 }, { name: 'It can sustain for 6 -12 months', score: 1 }] },
            { que: 'Is the business insured?', type: 'radio', options: [{ name: 'The business is insured with disaster insurance cover that includes pandemics', score: 0 }, { name: 'The business is insured with disaster insurance but it does not cover pandemics', score: 1 }, { name: 'Only a part of the business is insured for disasters and pandemics', score: 2 }, { name: 'The business currently does not have or has never purchased any insurance', score: 3 }, { name: 'The business does not have access to any insurance', score: 3 }] },
            { que: 'What does the business insurance cover?', type: 'checkbox', options: [{ name: 'Earthquakes' }, { name: 'Floods' }, { name: 'Fires' }, { name: 'Cyclones/typhoons/tornados' }, { name: 'Pandemics/outbreaks/epidemics/endemics' }, { name: 'Terrorist attacks' }, { name: 'Volcanoes' }, { name: 'Droughts' }, { name: 'Crop damages' }, { name: 'Others' }, { name: 'None of these' }] },
            { que: `How effective has been the government's COVID-19 stimulus package for the business?`, type: 'radio', options: [{ name: 'Very effective', score: 0 }, { name: 'Somewhat effective', score: 1 }, { name: 'Not effective', score: 2 }, { name: 'No such package by the government provided or accessed yet', score: 2 }, { name: 'The business is not eligible for such package(s)', score: 2 }, { name: 'There is no awareness of such packages', score: 2 }] },
            { que: 'What is the impact of any lockdown on the business?', type: 'radio', options: [{ name: 'The business has completely shut down', score: 3 }, { name: 'Business is operating at minimum capacity after an initial shutdown', score: 2 }, { name: 'Business is operating at reduced capacity without any shutdown', score: 1 }, { name: 'Business is operating at full capacity after an initial shutdown', score: 1 }, { name: 'No impact on business operations / There was no lockdown', score: 0 }] },
            { que: `What has been the impact of the government's regulations on the business? `, multipleText: true, type: 'checkbox', options: [{ name: 'Difficult to procure raw materials and other supplies', score: 1 }, { name: 'Difficult to sell products in the market / accessing customers', score: 1 }, { name: 'Delay in approval and quality checking of new products', score: 1 }, { name: 'Increase in cost of using public utilities (e.g. electricity, water, etc)', score: 1 }, { name: 'Shortage/Unavailability/ rise in cost of human resource', score: 1 }, { name: 'None whatsoever', score: 0 }] },
            { que: 'Under the COVID-19 scenario which of these market conditions are true for the business? ', multipleText: true, type: 'checkbox', options: [{ name: 'There is a drop in consumer demand', score: 1 }, { name: 'Reliance on traditional/manual methods for customer outreach instead of digital platforms/ e-commerce', score: 1 }, { name: 'No scope for diversifying products and services to take advantage of the change in market demand', score: 1 }, { name: 'The physical market is now in a high-risk zone and it has become unserviceable', score: 1 }, { name: 'The market has become more competitive', score: 1 }, { name: 'Inability to communicate with clients and suppliers', score: 1 }, { name: 'None of these', score: 0 }] },
            { que: 'Which of these hazards have a high likelihood of impacting the business in near future? ', multipleText: true, type: 'checkbox', options: [{ name: 'Earthquakes', score: 1 }, { name: 'Cyclones/typhoons/storms and wind damages', score: 1 }, { name: 'Floods', score: 1 }, { name: 'Landslides', score: 1 }, { name: 'Industrial fires/forest fires', score: 1 }, { name: 'Droughts', score: 1 }, { name: 'Heat waves/cold waves', score: 1 }, { name: 'Chemical leaks', score: 1 }, { name: 'Conflicts and social unrests', score: 1 }, { name: 'None of these', score: 0 }] },
        ],
        'Sp': [
            { que: '¿Seleccionar tipo de negocio?', type: 'select', options: [{ name: 'Fabricación' }, { name: 'Transporte y cadena de suministro' }, { name: 'Hospitalidad' }, { name: 'Alimentos y bebidas' }, { name: 'Software / Tecnología de información ' }, { name: 'Construction and Real estate' }, { name: 'Agroindustria' }, { name: 'Consultoría' }, { name: 'Educación' }, { name: 'Viaje y Turismo' }, { name: 'Medios de comunicación y entretenimiento' }, { name: 'Electrónica y Telecomunicación' }, { name: ' Cuidado de la salud' }, { name: 'Instituciones microfinancieras' }, { name: 'Minorista y mayorista' }, { name: 'ONG / NPO' }] },
            { que: '¿Es usted uno de los dueños del negocio?', type: 'radio', options: [{ name: 'Si' }, { name: 'No' }] },
            { que: '¿Alguno de los dueños del negocio es mujer?', type: 'radio', options: [{ name: 'Si' }, { name: 'No' }] },
            { que: '¿Cuál es el número total de oficinas / unidades de fabricación / tiendas / almacenes que tiene la empresa?', type: 'textinput' },
            { que: '¿Cuáles son los ingresos anuales de la empresa (en moneda local)?', type: 'textinput' },
            { que: '¿Cuál es la cantidad total de personal / empleados / trabajadores que tiene la empresa?', type: 'textinput' },
            { que: '¿ Tipo de negocio ?', type: 'select', options: [{ name: 'Propietario único' }, { name: 'Alianza empresarial' }, { name: 'De responsabilidad limitada' }, { name: 'Corporación' }, { name: 'Cooperativa / Fideicomiso / Sociedad' }, { name: 'Empresa aún no registrada' }, { name: 'ONG / NPO' }] },
            { que: '¿Seleccionar país ?', type: 'select' },
            { que: '¿Seleccionar provincia?', type: 'select' },
            { que: '¿Código postal / postal / PIN?', type: 'textinput' },

            { que: ' ¿Tiene la empresa un Plan de Continuidad Comercial (BCP)?', type: 'radio', options: [{ name: ' Sí, tiene plan y toma en cuenta emergencias sanitarias (pandemia / brote)' }, { name: 'Sí, tiene plan pero no toma en cuenta emergencias de salud (pandemia / brote)' }, { name: 'No cuenta con Plan de Continuidad Comercial' }, { name: 'No conozco el término "Plan de continuidad comercial"' }, { name: `No sé si tiene BCP.` }] },
            { que: `¿La empresa ha implementado su Plan de Continuidad del Negocio (BCP)?`, type: 'radio', options: [{ name: 'Sí (completamente)' }, { name: 'Sí (en parte)' }, { name: 'No' }], conditional: true },
            { que: ` ¿Cuál ha sido el impacto de COVID-19 en el negocio?`, type: 'checkbox', options: [{ title: 'Impacto en la producción y los servicios', innerOptions: ['Incremento', ' Disminución', ' Ningún cambio'] }, { title: 'Impacto en el acceso al mercado', innerOptions: ['Incremento', 'Disminución', 'Ningún cambio'] }, { title: 'Impacto en el flujo de caja y ventas', innerOptions: ['Incremento', 'Disminución', 'Ningún cambio'] }, { title: ' Impacto general en los empleados (productividad, retención)', innerOptions: ['Positivo', 'Negativo', 'Mezclado', 'Ningún cambio'] }] },
            { que: '¿Cuánto tiempo cree que le llevará a la empresa recuperarse por completo de la situación actual?', type: 'radio', options: [{ name: 'Ya completamente recuperado' }, { name: 'Menos de 6 meses' }, { name: 'Entre 6 meses y 1 año' }, { name: ' Más de 1 año' }, { name: 'No estoy seguro / No puedo predecir' }] },

            { que: '¿Qué tanto le preocupa que sus operaciones empresariales o comerciales resulten afectadas debido al absentismo o a la falta de disponibilidad de los empleados? ', type: 'radio', options: [{ name: 'Sin preocupación, ya que la mayoría de los sistemas están automatizados o los empleados están disponibles.', score: 0 }, { name: 'No me preocupa mucho, ya que mis familiares y amigos pueden o ya están llenando los vacíos por la escasez de empleados', score: 1 }, { name: 'Me preocupa, ya que la empresa depende de los empleados y no cuenta con ningún otro apoyo.', score: 2 }] },
            { que: `¿Son los empleados permanentes/regulares o temporales? (Permanente significa que no tienen una fecha fija para dejar de trabajar/tienen acceso a sus pensiones y reúnen los requisitos necesarios para obtener beneficios y prestaciones de la empresa, tales como fondos de pensión, contribuciones del empleador, etc., mientras que temporal significa que se les paga una remuneración diaria o tienen un contrato de corto plazo). `, type: 'radio', options: [{ name: 'Todos los empleados son permanentes o son miembros de la familia', score: 0 }, { name: 'La mayoría de los empleados son permanentes o son miembros de la familia (más del 50%). ', score: 1 }, { name: 'Hay aproximadamente una cantidad igual de empleados permanentes y temporales. ', score: 1 }, { name: 'La mayoría de los empleados son temporales (más del 50%). ', score: 2 }, { name: 'Todos los empleados son temporales.', score: 3 }] },
            { que: '¿Cómo describiría a la mayoría de los empleados de la empresa? ', multipleText: true, type: 'checkbox', options: [{ name: 'Familiares' }, { name: `Amigos y vecinos` }, { name: 'Trabajadores migrantes/ estacionales / ocasionales / con un sueldo diario.' }, { name: 'Otros' }] },
            { que: '¿Cuáles son las medidas que ha tomado o los esfuerzos que ha realizado la empresa para velar por el bienestar de los empleados?  ', multipleText: true, type: 'checkbox', options: [{ name: 'Los empleados pueden trabajar de forma remota/ espacio de oficina que se ha transformado de forma tal que se minimiza el contacto físico.', score: 1 }, { name: `La gerencia interactúa con regularidad con los empleados y se comunica eficazmente con ellos sobre la posición de la empresa frente al COVID-19 y sus posibles implicaciones.`, score: 1 }, { name: 'Cada cierto tiempo, la gerencia ejecuta programas de apoyo a los empleados para ayudarles con su bienestar físico y mental.', score: 1 }, { name: 'La gerencia anima a los empleados a adquirir nuevas destrezas y conocimiento, a fin de sustituir a otros empleados que no puedan presentarse a trabajar o para desarrollar sus habilidades personales.', score: 1 }, { name: 'La gerencia garantiza los ingresos/los salarios de los empleados, aun si la empresa tiene que cerrar sus puertas temporalmente o reducir sus operaciones o actividades.', score: 1 }, { name: 'Ninguna de las anteriores.', score: 5 }] },
            { que: '¿Requiere la empresa que haya una distancia o un contacto físico cercano con las personas? ', type: 'radio', options: [{ name: 'a. Un contacto físico cercano con los clientes y los usuarios (tiendas, restaurantes, etc.) ', score: 1 }, { name: 'b. Una distancia física cercana con otros empleados (unidades de producción o fabricación, talleres, etc.) ', score: 1 }, { name: 'c. Tanto a como b', score: 2 }, { name: 'd. Ninguna de las anteriores.', score: 0 }] },
            { que: '¿Qué tipo de problemas de recursos humanos está enfrentando la empresa debido a la pandemia del COVID-19? ', multipleText: true, type: 'checkbox', options: [{ name: 'Absentismo entre los empleados debido a preocupaciones relacionadas con el uso de transporte público, independientemente del cierre general o la cuarentena.' }, { name: 'Emigración, lo que da origen a la falta de jornaleros.' }, { name: 'Absentismo ocasionado por la tensión física o emocional entre los empleados que se presentan a trabajar, lo que ocasiona que se reduzcan las horas de trabajo o la productividad.' }, { name: 'Absentismo entre los empleados debido al cierre general o la cuarentena.' }, { name: 'Absentismo por tener que cuidar a sus niños o familiares.' }, { name: 'Ninguna de las anteriores.' }] },

            { que: 'Si esta empresa depende altamente de las tecnologías de información (TI), ¿ha elaborado o analizado estrategias para abordar posibles amenazas a su ciberseguridad?', type: 'radio', options: [{ name: 'Sí.', score: 1 }, { name: 'No.', score: 2 }, { name: 'No se tiene conocimiento sobre estas amenazas', score: 2 }, { name: 'No es pertinente', score: 0 }] },
            { que: '¿Está la empresa utilizando tecnología y soluciones innovadoras de tecnologías de información (TI), tales como transacciones digitales, oficinas virtuales, aprendizaje a distancia, visitas/ giras virtuales, telemedicina, seminarios en línea y aplicaciones móviles, para abordar las interrupciones o velar por la continuidad empresarial? ', type: 'radio', options: [{ name: 'Sí, la mayoría de estas.', score: 1 }, { name: 'Algunas de estas.', score: 2 }, { name: 'No, no se ha pensado en esta posibilidad.', score: 3 }, { name: 'No es pertinente para esta empresa.', score: 0 }] },
            { que: '¿Ha surgido algún impacto en las operaciones o actividades de la empresa debido a una interrupción en los servicios básicos, tales como electricidad, gas, agua, telecomunicaciones (teléfonos celulares, Internet, líneas telefónicas fijas), servicios bancarios y postales en su área? ', type: 'radio', options: [{ name: 'La empresa ha resultado sumamente afectada.', score: 3 }, { name: 'La empresa ha resultado afectada hasta cierto punto.', score: 2 }, { name: 'La empresa ha experimentado un impacto mínimo.', score: 1 }, { name: 'La empresa no ha experimentado ningún impacto. ', score: 0 }] },
            { que: '¿Qué tipo de problemas en la cadena de suministro (movimiento de bienes y servicios, vínculos entre el fabricante, el proveedor/ distribuidor y el cliente) han repercutido en la empresa? ', multipleText: true, type: 'checkbox', options: [{ name: 'Los bienes y servicios están agotados o no están disponibles.', score: 1 }, { name: 'Los distribuidores/ proveedores/materias primas/ productos no han estado disponibles o accesibles.', score: 1 }, { name: 'Hay problemas logísticos/de transporte.', score: 1 }, { name: 'Actualmente, no se experimenta ningún impacto en la cadena de suministro.', score: 0 }] },
            { que: '¿Cuáles de estas medidas se están promoviendo para la seguridad en la empresa debido a la pandemia del COVID-19? ', multipleText: true, type: 'checkbox', options: [{ name: 'Hay tareas para desinfectar el lugar de trabajo (por ejemplo, se limpian más las superficies, se instalan unidades de desinfectantes de manos, etc.)', score: 1 }, { name: 'Se promueve una higiene adecuada entre el personal (el uso de máscaras, lavado frecuente de manos, etc.)', score: 1 }, { name: 'Se toma con regularidad la temperatura de los empleados y los clientes.', score: 1 }, { name: 'Se mantiene una distancia física en el lugar de trabajo (por ejemplo, se colocan marcas en el suelo para indicar cuál debe ser la distancia entre los clientes y el personal, se reacondiciona el área de la recepción para aumentar la distancia entre las personas, etc.)', score: 1 }, { name: 'Se pone a disposición servicios de transporte a la oficina para los empleados.', score: 1 }, { name: 'Hay horarios laborales escalonados o se introducen políticas para trabajar a distancia (desde la casa), a fin de minimizar la cantidad de empleados en la empresa/ la oficina.', score: 1 }, { name: 'Ninguna de las anteriores.', score: 5 }] },
            { que: '¿De qué forma describe la condición del equipo y la maquinaria que son indispensables para la empresa?', type: 'radio', options: [{ name: 'No hay acceso a la/las oficina(s)/ unidad(es) de producción/ bodega(s) /tienda(s)/otra(s) instalaciones(s)', score: 3 }, { name: 'No hay un contrato de mantenimiento anual (CMA) y gran parte del equipo/ la maquinaria necesita mantenimiento con regularidad.', score: 3 }, { name: 'Hay un contrato de mantenimiento anual (CMA) para la mayor parte del equipo/ la maquinaria.', score: 2 }, { name: 'La empresa no depende actualmente de este tipo de equipo/ maquinaria, que podría quedar inservible debido a la falta de mantenimiento.', score: 1 }, { name: 'La empresa no depende de ningún tipo de este equipo/ maquinaria.', score: 0 }] },
            { que: '¿Qué tipo de pasivos u obligaciones financieras tenía la empresa antes de la pandemia del COVID-19? ', multipleText: true, type: 'checkbox', options: [{ name: 'Un alto costo operativo.', score: 1 }, { name: 'Impuestos pendientes, intereses por cambios en las políticas financieras del gobierno (derechos de aduana, impuestos, regulaciones a las importaciones y exportaciones, etc.)', score: 1 }, { name: 'Deudas/préstamos existentes o cualquier otra carga financiera.', score: 1 }, { name: 'Ninguna de las anteriores.', score: 0 }] },
            { que: '¿Por cuánto tiempo puede funcionar la empresa con su situación financiera actual (activos, acciones, efectivo, ayuda del gobierno)? ', type: 'radio', options: [{ name: 'Ya no puede continuar.', score: 4 }, { name: 'Puede mantener sus operaciones durante 1-2 meses.', score: 3 }, { name: 'Puede mantener sus operaciones durante 3-6 meses.', score: 2 }, { name: 'Puede mantener sus operaciones durante 6 -12 meses.', score: 1 }] },
            { que: '¿Está asegurada la empresa?', type: 'radio', options: [{ name: 'La empresa está asegurada con una cobertura en caso de desastres, la cual incluye pandemias.', score: 0 }, { name: 'La empresa está asegurada con una cobertura en caso de desastres, pero no incluye pandemias.', score: 1 }, { name: 'Solo una parte de la empresa está asegurada en caso de desastres y pandemias. ', score: 2 }, { name: 'Actualmente, la empresa no tiene o nunca ha adquirido un seguro.', score: 3 }, { name: 'La empresa no tiene acceso a ningún seguro.', score: 3 }] },
            { que: '¿Qué cubre el seguro de la empresa?', type: 'checkbox', options: [{ name: 'Terremotos.' }, { name: 'Inundaciones.' }, { name: 'Incendios.' }, { name: 'Ciclones/ tifones/ tornados.' }, { name: 'Pandemias/ brotes/ epidemias/ endemias.' }, { name: 'Ataques terroristas' }, { name: 'Actividades volcánicas.' }, { name: 'Sequías.' }, { name: 'Daños a cultivos.' }, { name: 'Otros.' }, { name: 'Ninguna de las anteriores.' }] },
            { que: `¿Qué tan eficaz ha sido el paquete de estímulo del gobierno para las empresas debido al COVID-19?`, type: 'radio', options: [{ name: 'Muy eficaz.', score: 0 }, { name: 'Algo eficaz.', score: 1 }, { name: 'No ha sido eficaz.', score: 2 }, { name: 'El gobierno no ha ofrecido este tipo de paquete o todavía no se tiene acceso al mismo.', score: 2 }, { name: 'La empresa no reúne los requisitos necesarios para obtener este/estos paquete(s).', score: 2 }, { name: 'No se tiene conocimiento sobre estos paquetes.', score: 2 }] },
            { que: '¿Cuáles son los efectos de un cierre general o cuarentena en la empresa?', type: 'radio', options: [{ name: 'La empresa ha tenido que cerrar totalmente.', score: 3 }, { name: 'La empresa está funcionando a una capacidad mínima después del cierre inicial.', score: 2 }, { name: 'La empresa está funcionando a una capacidad reducida sin ningún cierre.', score: 1 }, { name: 'La empresa está funcionando a capacidad plena después de un cierre inicial.', score: 1 }, { name: 'No se ha experimentado ningún impacto en las actividades u operaciones de la empresa / no hubo ningún cierre.', score: 0 }] },
            { que: `¿Cuáles han sido los efectos de las regulaciones del gobierno en la empresa?`, multipleText: true, type: 'checkbox', options: [{ name: 'Dificultades para adquirir materia prima y otros suministros. ', score: 1 }, { name: 'Dificultades para vender productos en el mercado/ tener acceso a clientes.', score: 1 }, { name: 'Retrasos en las aprobaciones y el control de calidad de nuevos productos.', score: 1 }, { name: 'Aumento en el costo del uso de servicios públicos (por ejemplo, electricidad, agua, etc.)', score: 1 }, { name: 'Escasez/ indisponibilidad/ aumento en el costo de los recursos humanos.', score: 1 }, { name: 'Ningún efecto.', score: 0 }] },
            { que: 'Bajo el escenario del COVID-19, ¿cuáles de estas condiciones de mercado son pertinentes para la empresa? ', multipleText: true, type: 'checkbox', options: [{ name: 'Se observa una menor demanda de los consumidores.', score: 1 }, { name: 'Se recurre a métodos manuales/tradicionales para llegar a los clientes, en lugar de plataformas digitales/ comercio electrónico.', score: 1 }, { name: 'No hay margen para diversificar productos y servicios, y aprovechar los cambios en la demanda del mercado.', score: 1 }, { name: 'Ahora, el mercado físico se encuentra en una zona de alto riesgo y no es apto. ', score: 1 }, { name: 'El mercado ahora es más competitivo. ', score: 1 }, { name: 'No hay capacidad para comunicarse con los clientes y los proveedores. ', score: 1 }, { name: 'Ninguna de las anteriores.', score: 0 }] },
            { que: '¿Cuáles de estas amenazas presentan una alta probabilidad de repercutir en la empresa en el futuro inmediato? ', multipleText: true, type: 'checkbox', options: [{ name: 'Terremotos.', score: 1 }, { name: 'Ciclones/ tifones/ tormentas y daños debido a vientos.', score: 1 }, { name: 'Inundaciones.', score: 1 }, { name: 'Derrumbes.', score: 1 }, { name: 'Incendios industriales/ forestales.', score: 1 }, { name: 'Sequías', score: 1 }, { name: 'Olas de calor/ frío ', score: 1 }, { name: 'Fuga de productos químicos.', score: 1 }, { name: 'Conflictos y disturbios sociales.', score: 1 }, { name: 'Ninguna de las anteriores.', score: 0 }] },
        ],
        'Od': [
            { que: 'ବ୍ୟବସାୟ ଟି କେଉଁ ପ୍ରକାର ର ବାଛନ୍ତୁ', type: 'select', options: [{ name: 'ଉତ୍ପାଦନ ଭିତ୍ତିକ' }, { name: 'ପରିବହନ ଓ ଯୋଗାଣ ଶୃଙ୍ଖଳା' }, { name: 'ଅତିଥେୟତା' }, { name: 'ଖାଦ୍ୟ ଓ ପାନୀୟ' }, { name: 'ସଫ୍ଟୱେର  / ସୂଚନା ପ୍ରଯୁକ୍ତି ' }, { name: 'ନିର୍ମାଣ କ୍ଷେତ୍ର' }, { name: 'କୃଷି ବ୍ୟବସାୟ ' }, { name: 'କନ୍ସଲଟାନ୍ସି' }, { name: 'ଶିକ୍ଷା' }, { name: 'ଭ୍ରମଣ ଓ ପର୍ଯ୍ୟଟନ' }, { name: 'ମିଡ଼ିଆ ଓ ମନୋରଞ୍ଜନ ଶିଳ୍ପ' }, { name: 'ଇଲେକ୍ଟ୍ରୋନିକ୍ସ ଓ ଟେଲି ଯୋଗାଯୋଗ' }, { name: 'ସ୍ଵାସ୍ଥ୍ୟସେବା' }, { name: 'ମାଇକ୍ରୋ ଫାଇନାନ୍ସ ସଂସ୍ଥା' }, { name: 'ରିଟେଲ ଓ ପାଇକାରୀ ବ୍ୟବସାୟ' }, { name: 'ଏନଜିଓ / ଏନପିଓ' }] },
            { que: 'ଆପଣ କଣ ଏହି ବ୍ୟବସାୟ ର ଜଣେ ମାଲିକ ଅଟନ୍ତି କି ?', type: 'radio', options: [{ name: 'ହଁ' }, { name: 'ନା' }] },
            { que: 'କୌଣସି ମହିଳା ଏହି ବ୍ୟବସାୟ ର ମାଲିକ ଅଟନ୍ତି କି ?', type: 'radio', options: [{ name: 'ହଁ' }, { name: 'ନା' }] },
            { que: 'ଏହି ବ୍ୟବସାୟ ଟି ମାଲିକାନା ରେ କେତେ ଗୋଟି କାର୍ଯ୍ୟାଳୟ / ଉତ୍ପାଦନ ୟୁନିଟ / ଷ୍ଟୋର / ଗୋଦାମ ଘର ରହିଅଛି ', type: 'textinput' },
            { que: 'ଏହି ବ୍ୟବସାୟ ଟିର ବାର୍ଷିକ ରାଜସ୍ଵ କେତେ ଅଟେ (ସ୍ଥାନୀୟ ମୁଦ୍ରା ହିସାବରେ) ?', type: 'textinput' },
            { que: 'ଏହି ବ୍ୟବସାୟ ଟି ରେ କେତେ ଜଣ କର୍ମଚାରୀ / ଶ୍ରମିକ କାମ କରୁଅଛନ୍ତି ?', type: 'textinput' },
            { que: 'ବ୍ୟବସାୟ ଟି କେଉଁ ପ୍ରକାର ର ?', type: 'select', options: [{ name: 'ବ୍ୟକ୍ତିଗତ ମାଲିକାନା ରେ ଅଛି' }, { name: 'ଯୌଥ ମାଲିକାନା ରେ ଥିବା ବ୍ୟବସାୟ' }, { name: 'ସୀମିତ ଦାୟିତ୍ Company କମ୍ପାନୀ |' }, { name: 'ନିଗମ' }, { name: 'ସମବାୟ / ଟ୍ରଷ୍ଟ / ସୋସାଇଟି' }, { name: 'ଏପର୍ଯ୍ୟନ୍ତ ପଞ୍ଜିକରଣ ହୋଇନାହିଁ' }, { name: 'ଏନଜିଓ / NPO' }] },
            { que: 'ଦେଶ', type: 'select' },
            { que: 'ରାଜ୍ୟ', type: 'select' },
            { que: 'ପୋଷ୍ଟ ଅଫିସ ପିନ କୋଡ଼ (ଇଚ୍ଛାଧୀନ )', type: 'textinput' },

            {
                que: 'ଏହି ବ୍ୟବସାୟଟି ପାଇଁ କୌଣସି ବ୍ୟବସାୟ ନିରନ୍ତରତା ଯୋଜନା ଅଛି କି ?',
                type: 'radio',
                options: [
                    { name: 'ହଁ , ଏହି ଯୋଜନା ଅଛି ଓ ଏହା ସ୍ଵାସ୍ଥ୍ୟ ଜନିତ ଅପାତକାଳୀନ ସ୍ଥିତି (ମହାମାରୀ ସ୍ଥିତି) କୁ ପରିଚାଳନା କରି ପାରିବ' },
                    { name: 'ହଁ , ଏହି ଯୋଜନା ଅଛି, କିନ୍ତୁ ଏହା ସ୍ଵାସ୍ଥ୍ୟ ଜନିତ ଅପାତକାଳୀନ ସ୍ଥିତି (ମହାମାରୀ ସ୍ଥିତି) କୁ ପରିଚାଳନା କରି ପାରିବ  ନାହିଁ' },
                    { name: 'ଏହାର ବ୍ୟବସାୟ ନିରନ୍ତର ଯୋଜନା ନାହିଁ |' },
                    { name: 'ମୁଁ ବ୍ୟବସାୟ ନିରନ୍ତରତା ଯୋଜନା ବିଷୟରେ ସଚେତନ ନୁହେଁ' },
                    { name: `ମୁଁ ବ୍ୟବସାୟ ନିରନ୍ତରତା ଯୋଜନା ବିଷୟରେ ଜାଣି ନାହିଁ` },
                ]
            },

            { que: `ବ୍ୟବସାୟ ନିରନ୍ତରତା ଯୋଜନାକୁ ସଂସ୍ଥା ତରଫରୁ କାର୍ଯ୍ୟକାରୀ କରାଯାଇଛି କି ?`, type: 'radio', options: [{ name: 'ହଁ (ସମ୍ପୂର୍ଣ ଭାବରେ )' }, { name: 'ହଁ (ଆଂଶିକ ଭାବରେ )' }, { name: 'ନା' }], conditional: true },
            { que: `ବ୍ୟବସାୟ ଟି ଉପରେ କୋଭିଡ ୧୯ ଏ କଣ ପ୍ରଭାବ ପଡ଼ିଅଛି ?`, type: 'checkbox', options: [{ title: 'ଉତ୍ପାଦନ ଓ ସେବା ଯୋଗାଣରେ ପଡିଥିବା ପ୍ରଭାବ', innerOptions: ['ପ୍ରଭାବ ବଢ଼ିଅଛି', 'ପ୍ରଭାବ କମି ଅଛି', 'କିଛି ପ୍ରଭାବ ପଡ଼ିନାହିଁ'] }, { title: 'ବଜାର ରେ ପହଞ୍ଚି କିଣା ବିକା କରିବା ଉପରେ ପଡିଥିବା ପ୍ରଭାବ', innerOptions: ['ପ୍ରଭାବ ବଢ଼ିଅଛି', 'ପ୍ରଭାବ କମି ଅଛି', 'କିଛି ପ୍ରଭାବ ପଡ଼ିନାହିଁ '] }, { title: 'ବଜାର ରେ ପହଞ୍ଚି କିଣା ବିକା କରିବା ଉପରେ ପଡିଥିବା ପ୍ରଭାବ', innerOptions: ['ପ୍ରଭାବ ବଢ଼ିଅଛି', 'ପ୍ରଭାବ କମି ଅଛି', 'କିଛି ପ୍ରଭାବ ପଡ଼ିନାହିଁ'] }, { title: 'କର୍ମଚାରୀ ମାନଙ୍କ ଉପରେ ମୋଟାମୋଟି ଭାବରେ ପଡିଥିବା ପ୍ରଭାବ (ଯେପରି :- କାର୍ଯ୍ୟ ଦକ୍ଷତା , ସ୍ଥାୟୀ ଭାବରେ ରହିବା )', innerOptions: ['ସକାରାତ୍ମକ ପ୍ରଭାବ', 'ନକାରାତ୍ମକ ପ୍ରଭାବ', 'ମିଶ୍ର ପ୍ରଭାବ', 'କିଛି ପ୍ରଭାବ ପଡ଼ିନାହିଁ'] }] },
            { que: 'ଆପଣଙ୍କ ମତରେ ବର୍ତମାନ ସ୍ଥିତିରୁ ବାହାରି ପୂର୍ବ ସ୍ଥିତିକୁ ଆସିବା ପାଇଁ ବ୍ୟବସାୟକୁ ଆଉ କେତେ ସମୟ ଲାଗିବ ?', type: 'radio', options: [{ name: 'ବ୍ୟବସାୟ ସ୍ଥିତି ରେ ସୁଧାର ଆସି ସାରିଛି' }, { name: 'ବ୍ୟବସାୟ ସ୍ଥିତି ସୁଧୁରିବାକୁ ୬ ମାସରୁ କମ ସମୟ ଲାଗିବ' }, { name: '୬ ରୁ ୧ ବର୍ଷ ସମୟ ଲାଗିବ' }, { name: '୧ ବର୍ଷରୁ ଅଧିକ ସମୟ ଲାଗିବ' }, { name: 'ବ୍ୟବସାୟ ସ୍ଥିତିରେ ସୁଧାର ଆସିବାକୁ କେତେ ସମୟ ଲାଗିବ ଜଣା ନାହିଁ / ଅନୁମାନ କରାଯାଇ ପାରିବ ନାହିଁ' }] },

            { que: 'ଆପଣ କେତେ ଚିନ୍ତିତ ଯେ କର୍ମଚାରୀଙ୍କ ଅଭାବ କିମ୍ବା ଅନୁପସ୍ଥିତି ଦ୍ଵାରା ବ୍ୟବସାୟ କାର୍ଯ୍ୟ ପ୍ରଭାବିତ ହେବ?', type: 'radio', options: [{ name: 'ଅଧିକାଂଶ କାର୍ଯ୍ୟ ସ୍ଵୟଂଚାଳିତ କିମ୍ବା କର୍ମଚାରୀ ଉପଲବ୍ଧ ଥିବାରୁ ସେଥିପାଇଁ ଆଦୌ ଚିନ୍ତିତ ନୁହଁନ୍ତି |', score: 0 }, { name: 'ପରିବାର ସଦସ୍ୟ ଏବଂ/କିମ୍ବା ସାଙ୍ଗମାନେ କୌଣସି କର୍ମଚାରୀଙ୍କ ଅଭାବ ପୂରଣ କରୁଅଛନ୍ତି କିମ୍ବା ଅଭାବ ପୁରାଣ କରିପାରିବେ', score: 1 }, { name: 'ବ୍ୟବସାୟ କର୍ମଚାରୀଙ୍କ ଉପରେ ନିର୍ଭର କରୁଥିବାରୁ ଚିନ୍ତିତ ଏବଂ ବ୍ୟବସାୟ ପାଇଁ ଅନ୍ୟ କୌଣସି ସମର୍ଥନ ନାହିଁ |', score: 2 }] },
            {
                que: `କର୍ମଚାରୀ ମାନେ ସ୍ଥାୟୀ/ନିୟମିତ କିମ୍ବା ଅସ୍ଥାୟୀ କିପରି ଭାବରେ କାର୍ଯ୍ୟ କରୁଅଛନ୍ତି?
            (ସ୍ଥାୟୀ ର ଅର୍ଥ ହେଉଛି କର୍ମଚାରୀ କୌଣସି ନିର୍ଦ୍ଧିଷ୍ଟ ସମୟ ପାଇଁ ନିୟୋଜିତ ନୁହନ୍ତି / ଅବସର ବୟସ ପର୍ଯ୍ୟନ୍ତ କାର୍ଯ୍ୟ କରିପାରିବେ ଏବଂ କମ୍ପାନୀ ତରଫରୁ ଅବସର କାଳୀନ ସୁବିଧା ଯେପରି ପେନସନ ସୁବିଧା, ଭବିଷ୍ୟ ନିଧି ପାଣ୍ଠି ସୁବିଧା ଇତ୍ୟାଦି ପାଇଁ ଯୋଗ୍ୟ ଏବଂ ଅସ୍ଥାୟୀ ର ଅର୍ଥ ହେଉଛି କର୍ମଚାରୀ ମାନେ ଦୈନିକ ମଜୁରୀ ପାଇଁ କାମ କରୁଛନ୍ତି କିମ୍ବା ସ୍ଵଳ୍ପ ସମୟ ପାଇଁ ଚୁକ୍ତିଭିତ୍ତିକ କର୍ମଚାରୀ ଅଟନ୍ତି)`, type: 'radio', options: [{ name: 'ସମସ୍ତ କର୍ମଚାରୀ ମାନେ ସ୍ଥାୟୀ ଅଥବା ସେମାନେ ପରିବାର ସଦସ୍ୟ ମାନଙ୍କ ମଧ୍ୟରୁ ଅଛନ୍ତି', score: 0 }, { name: 'କର୍ମଚାରୀମାନଙ୍କ ମଧ୍ୟରୁ ଅଧିକାଂଶ ସ୍ଥାୟୀ ଅଟନ୍ତି ଅଥବା ପରିବାର ସଦସ୍ୟ ମାନଙ୍କ ଭିତରୁ ଅଛନ୍ତି (୫୦ ପ୍ରତିଶତରୁ ଅଧିକ)', score: 1 }, { name: 'ସ୍ଥାୟୀ ଓ ଅସ୍ଥାୟୀ ଭାବରେ କାମ କରୁଥିବା କର୍ମଚାରୀ ପ୍ରାୟତଃ ସମାନ ଅଛନ୍ତି', score: 1 }, { name: 'କାମ କରୁଥିବା ଅଧିକାଂଶ କର୍ମଚାରୀ ଅସ୍ଥାୟୀ ଅଟନ୍ତି (୫୦ ପ୍ରତିଶତରୁ ଅଧିକ)', score: 2 }, { name: 'ସମସ୍ତ କର୍ମଚାରୀ ଅସ୍ଥାୟୀ ଅଟନ୍ତି', score: 3 }]
            },
            { que: 'ଆପଣଙ୍କ ମତରେ ବ୍ୟବସାୟରେ କାର୍ଯ୍ୟ କରୁଥିବା କର୍ମଚାରୀ ମାନଙ୍କ ମଧ୍ୟରୁ ଅଧିକାଂଶ କେଉଁ ପ୍ରକାର ର ଅଟନ୍ତି ? (ଏକରୁ ଅଧିକ ଉତ୍ତର ମଧ୍ୟ ଚୟନ କରିପାରିବେ)', multipleText: true, type: 'checkbox', options: [{ name: 'ପରିବାର ସଦସ୍ୟ' }, { name: `ବନ୍ଧୁ ଅଥବା ପଡୋଶୀ` }, { name: 'ଋତୁକାଳୀନ / ପ୍ରବାସୀ ଶ୍ରମିକ / ଅସ୍ଥାୟୀ କର୍ମଚାରୀ / ଦିନ ମଜୁରିଆ' }, { name: 'ଅନ୍ୟ କିଛି' }] },
            { que: 'କର୍ମଚାରୀମାନଙ୍କ ସୁବିଧା ଓ ଉତ୍ତମ ଜୀବନ କୁ ସୁନିଶ୍ଚିତ କରିବା ପାଇଁ ବ୍ୟବସାୟ / ଉଦ୍ୟୋଗ ତରଫରୁ କଣ ସବୁ ପଦକ୍ଷେପ ନିଅ ଯାଇଅଛି ? (ଏକ ରୁ ଅଧିକ ଉତ୍ତର ଚୟନ କରାଯାଇପାରିବ)', multipleText: true, type: 'checkbox', options: [{ name: 'କର୍ମଚାରୀମାନେ ଘରୁ ରହି କାମ କରିବା ପାଇଁ ବ୍ୟବସ୍ଥା କରାଯାଇଛି', score: 1 }, { name: `ଏହି ଉଦ୍ୟୋଗ ର ପରିଚାଳନା କର୍ତ୍ତୃପକ୍ଷ କୋଭିଡ ୧୯ ର ପ୍ରଭାବ ଓ ଏଥିପାଇଁ ସଂସ୍ଥା ତରଫରୁ ନିଅ ଯାଇଥିବା ପଦକ୍ଷେପ ସମ୍ପର୍କ ରେ ନିୟମିତ ଭାବରେ କର୍ମଚାରୀମାନଙ୍କ ସହିତ ଯୋଗାଯୋଗରେ ରହୁଛନ୍ତି |`, score: 1 }, { name: 'କର୍ମଚାରୀମାନଙ୍କ ମାନସିକ ଓ ଶାରୀରିକ ସୁସ୍ଥତା କୁ ସୁନିଶ୍ଚିତ କରିବା ପାଇଁ ସଂସ୍ଥା ତରଫରୁ ନିୟମିତ ଭାବରେ ସହାୟତା କାର୍ଯ୍ୟକ୍ରମ କରାଯାଉଅଛି |', score: 1 }, { name: 'କାର୍ଯ୍ୟକ୍ଷେତ୍ରକୁ ଆସିପାରୁନଥିବା କର୍ମଚାରୀମାନଙ୍କ କାର୍ଯ୍ୟକୁ ଭରଣା କରିବା ପାଇଁ ତଥା ଅନ୍ୟମାନେ ଯେଉଁମାନେଆଗ୍ରହୀ ଅଛନ୍ତି, ସେମାନଙ୍କର ନୂତନ ଦକ୍ଷତା କୌଶଳ ଆହରଣ କରିବା ନିମନ୍ତେ ଉଦ୍ୟୋଗର ପରିଚାଳନା କର୍ତ୍ତୃପକ୍ଷଙ୍କ ତରଫରୁ ପ୍ରୋତ୍ସାହିତ କରାଯାଉଅଛି |', score: 1 }, { name: 'ଉଦ୍ୟୋଗ / ବ୍ୟବସାୟ ସାମୟିକ ଭାବରେ ବନ୍ଦ ରହିବା କିମ୍ବା ଉତ୍ପାଦନ କରିବା ସ୍ଥିତିରେ ମଧ୍ୟ କର୍ମଚାରୀମାନଙ୍କ ରୋଜଗାର / ବେତନକୁ ସଂସ୍ଥା ତରଫରୁ ସୁନିଶ୍ଚିତ କରାଯାଇଅଛି |', score: 1 }, { name: 'ଏଥି ମଧ୍ୟରୁ କିଛି ବି ନୁହେଁ |', score: 5 }] },
            { que: 'ବ୍ୟବସାୟ ଚଳାଇବା ପାଇଁ ଲୋକମାନଙ୍କ ସହିତ ଘନିଷ୍ଠ ଭାବରେ ସମ୍ପର୍କ କିମ୍ବା ଲୋକଙ୍କ ଠାରୁ ଦୂରତା ରକ୍ଷା କରିବା, କଣ ଆବଶ୍ୟକ ଅଟେ ?', type: 'radio', options: [{ name: 'ଉପଭୋକ୍ତା ଓ ଗ୍ରାହକ ମାନଙ୍କ ଠାରୁ (ଯେପରି ଦୋକାନ, ରେଷ୍ଟୁରାଣ୍ଟ ଇତ୍ୟାଦି) ନିକଟତମ ଦୂରତା ରକ୍ଷା କରିବା ଉଚିତ', score: 1 }, { name: 'ଅନ୍ୟ କର୍ମଚାରୀ ମାନଙ୍କ ଠାରୁ (ଯେପରି ଉତ୍ପାଦନ କେନ୍ଦ୍ର, ଦୋକାନ ଇତ୍ୟାଦି) ନିକଟତମ ଦୂରତା ରକ୍ଷା କରିବା ଉଚିତ', score: 1 }, { name: 'ଉଭୟ ଏ ଏବଂ ବି', score: 2 }, { name: 'ଏଥି ମଧ୍ୟରୁ କିଛି ନୁହେଁ', score: 0 }] },
            { que: 'କୋଭିଡ ୧୯ ମହାମାରୀ କାରଣରୁ ଆପଣଙ୍କ ବ୍ୟବସାୟଟି କେଉଁ ପ୍ରକାର ମାନବ ସମ୍ବଳ ଜନିତ ସମସ୍ୟା ର ସମ୍ମୁଖୀନ ହେଉଛି ? (ଏକ ରୁ ଅଧିକ ଉତ୍ତର ଚୟନ କରି ପାରିବେ)', multipleText: true, type: 'checkbox', options: [{ name: 'ତାଲା ବନ୍ଦ ସମୟରେ ସାଧାରଣ ପରିବହନ ବ୍ୟବସ୍ଥା ବନ୍ଦ ହେବା କାରଣକୁ ନେଇ କର୍ମଚାରୀମାନଙ୍କ ଅନୁପସ୍ଥିତି ବଢୁଛି' }, { name: 'ପ୍ରବାସୀ ଶ୍ରମିକ ଭାବରେ ଲୋକ ମାନେ ଯିବା ହେତୁ ଦିନ ମଜୁରିଆ ଶ୍ରମିକ ପାଇବାରେ ସମସ୍ୟା ଆସୁଛି' }, { name: 'କାମକୁ ଆସୁଥିବା କର୍ମଚାରୀ ମାନଙ୍କ ମଧ୍ୟରେ ମାନସିକ ଚିନ୍ତା ଓ ଅବସାଦ କାରଣରୁ ଦୈନିକ କାର୍ଯ୍ୟ ସମୟ ଅଥବା କର୍ମଚାରୀଙ୍କ କାର୍ଯ୍ୟ ଦକ୍ଷତା ପ୍ରଭାବିତ ହେଉଛି' }, { name: 'ତାଲା ବନ୍ଦ କାରଣରୁ କର୍ମଚାରୀ ମାନକ ମଧ୍ୟରେ ଅନୁପସ୍ଥିତି ବଢୁଛି' }, { name: 'ଘର ର ସଦସ୍ୟ କିମ୍ବା ପିଲା ମାନଙ୍କ ଯତ୍ନ ପାଇଁ କର୍ମଚାରୀ ଅନୁପସ୍ଥିତ ରହୁଛନ୍ତି' }, { name: 'ଏଥି ମଧ୍ୟରୁ କିଛି ନୁହେଁ' }] },

            { que: 'ଯଦି ବ୍ୟବସାୟ ଟି ସୂଚନା ପ୍ରଯୁକ୍ତି ଉପରେ ବହୁଳ ଭାବରେ ନିର୍ଭର କରୁଛି , ତେବେ ସାଇବର ସୁରକ୍ଷା ପ୍ରତି ରହିଥିବା ବିପଦ କୁ ନେଇ ସମୀକ୍ଷା କିମ୍ବା କୌଣସି ପ୍ରାକ ବ୍ୟବସ୍ଥା କରିଛନ୍ତି କି ?', type: 'radio', options: [{ name: 'ହଁ', score: 1 }, { name: 'ନା', score: 2 }, { name: 'ଏଭଳି ବିପଦ ରହିଥିବା ନେଇ କୌଣସି ସଚେତନତା ନାହିଁ', score: 2 }, { name: 'ଏଥିପାଇଁ ପ୍ରଯୁଜ୍ୟ ନୁହେଁ', score: 0 }] },
            { que: 'ବ୍ୟବସାୟ ରେ ଆସୁଥିବା କୌଣସି ବ୍ୟାଘାତ କୁ ପରିଚାଳନା ଏବଂ ବ୍ୟବସାୟର ନିରନ୍ତରତାକୁ ସୁନିଶ୍ଚିତ କରିବା ପାଇଁ କୌଣସି ପ୍ରଯୁକ୍ତି ବିଦ୍ୟା ଏବଂ ଅଭିନବ ସୂଚନା ପ୍ରଯୁକ୍ତି ସମାଧାନ ଯେପରି (ଡିଜିଟାଲ ନେଣଦେଣ , ଭରଚୁଆଲ କାର୍ଯ୍ୟାଳୟ , ରିମୋଟ ଶିକ୍ଷା , ଭରଚୁଆଲ ଭ୍ରମଣ , ଟେଲି ମେଡ଼ିସିନ, ୱେବିନାର , ମୋବାଇଲ ଆପ୍ଲିକେସନ ) ଇତ୍ୟାଦି ବ୍ୟବସ୍ଥା ବ୍ୟବହାର ହେଉଛି କି ?', type: 'radio', options: [{ name: 'ହଁ, ଏଥିରୁ ଅଧିକାଂଶ', score: 1 }, { name: 'ଏଥି ମଧ୍ୟ ରୁ ଅଳ୍ପ କିଛି', score: 2 }, { name: 'ନା, ଏଥି ମଧ୍ୟରୁ କିଛି ବ୍ୟବହାର କରିବା ପାଇଁ ପୂର୍ବରୁ କୌଣସି ଚିନ୍ତା କରାଯାଇ ନାହିଁ', score: 3 }, { name: 'ଏହି ବ୍ୟବସାୟ ପାଇଁ ଏସବୁ ଆବଶ୍ୟକ ନୁହେଁ', score: 0 }] },
            { que: 'ବିଦ୍ୟୁତ୍, ଗ୍ୟାସ୍, ଜଳ, ଟେଲିକମ୍ (ମୋବାଇଲ୍, ଟେଲିଫୋନ୍, ଇଣ୍ଟରନେଟ୍), ବ୍ୟାଙ୍କିଙ୍ଗ୍ ଏବଂ ଡାକ ସେବା ଭଳି ମୌଳିକ ଉପଯୋଗୀ ସେବାରେ ବ୍ୟାଘାତ ହେତୁ ବ୍ୟବସାୟ କାର୍ଯ୍ୟ ଉପରେ କୌଣସି ପ୍ରଭାବ ପଡୁଅଛି କି ?', type: 'radio', options: [{ name: 'ବ୍ୟବସାୟ ଅତ୍ୟଧିକ ପ୍ରଭାବିତ |', score: 3 }, { name: 'ବ୍ୟବସାୟ କିଛି ମାତ୍ରାରେ ପ୍ରଭାବିତ ହୋଇଛି |', score: 2 }, { name: 'ବ୍ୟବସାୟ ଉପରେ ସର୍ବନିମ୍ନ ପ୍ରଭାବ ଥିଲା |', score: 1 }, { name: 'ବ୍ୟବସାୟ ଉପରେ କୌଣସି ପ୍ରଭାବ ପଡିନାହିଁ |', score: 0 }] },
            { que: 'ଯୋଗାଣ ଶୃଙ୍ଖଳା ନେଇ ରହିଥିବା ସମସ୍ୟା ଯେପରି (ଉତ୍ପାଦନକାରୀ, ବିକ୍ରେତା, ଯୋଗାଣକାରୀ , ଏବଂ ଗ୍ରାହକ ମାନଙ୍କ ସହିତ ଯୋଗାଯୋଗ ବିଛିନ୍ନ ହେତୁ ଦ୍ରବ୍ୟ ଓ ସେବା ର ପ୍ରବାହ ରେ ସମସ୍ୟା) ହେତୁ ଆପଣଙ୍କ ବ୍ୟବସାୟ ଉପରେ କୌଣସି ପ୍ରଭାବ ପଡିଅଛି କି?', multipleText: true, type: 'checkbox', options: [{ name: 'ଦ୍ରବ୍ୟ ଏବଂ ସେବା ବିକ୍ରି ହୋଇଯାଇଛି କିମ୍ବା ଉପଲବ୍ଧ ନାହିଁ |', score: 1 }, { name: 'ବିକ୍ରେତା / ଯୋଗାଣକାରୀ / କଞ୍ଚାମାଲ / ଉତ୍ପାଦ ଉପଲବ୍ଧ ନାହିଁ କିମ୍ବା ପାଇବାରେ ସମସ୍ୟା ହେଉଛି', score: 1 }, { name: 'ଲଜିଷ୍ଟିକ୍ସ / ପରିବହନ ସମସ୍ୟା |', score: 1 }, { name: 'ଯୋଗାଣ ଶୃଙ୍ଖଳା ଉପରେ କୌଣସି ସାମ୍ପ୍ରତିକ ପ୍ରଭାବ ନାହିଁ', score: 0 }] },
            { que: 'କୋଭିଡ ୧୯ ମହାମାରୀ ସମୟରେ ସୁରକ୍ଷା କୁ ସୁନିଶ୍ଚିତ କରିବା ପାଇଁ ଏଥି ମଧ୍ୟରୁ କେଉଁଗୁଡିକ ବ୍ୟବସାୟ କ୍ଷେତ୍ରରେ ପ୍ରୋତ୍ସାହିତ ହେଉଛି? (ଏକାଧିକ ଉତ୍ତର ଚୟନ କରାଯାଇପାରିବ)', multipleText: true, type: 'checkbox', options: [{ name: 'କର୍ମକ୍ଷେତ୍ର କୁ ସାନିଟାଈଜ କରିବା (ଯଥା ଚଟାଣ ଓ ଅନ୍ୟସ୍ଥାନ ସଫା କରିବା, ହାତ ସାନିଟାଇଜିଂ ୟୁନିଟ୍ ସ୍ଥାପନ ଇତ୍ୟାଦି)', score: 1 }, { name: 'କର୍ମଚାରୀଙ୍କ ମଧ୍ୟରେ ଉତ୍ତମ ସ୍ଵଛତା କୁ ପ୍ରୋତ୍ସାହିତ କରିବା (ମାସ୍କ ପିନ୍ଧିବା, ହାତ ଧୋଇବା)', score: 1 }, { name: 'କର୍ମଚାରୀ ଏବଂ ଗ୍ରାହକଙ୍କ ନିୟମିତ ତାପମାତ୍ରା ଯାଞ୍ଚ|', score: 1 }, { name: 'କାର୍ଯ୍ୟକ୍ଷେତ୍ରରେ ଶାରୀରିକ ଦୂରତା ବଜାୟ ରଖିବା (ଯଥା ଗ୍ରାହକ ଏବଂ କର୍ମଚାରୀଙ୍କ ମଧ୍ୟରେ ଦୂରତା ସୂଚାଇବା ପାଇଁ ଚଟାଣକୁ ଚିହ୍ନିତ କରିବା, ଲୋକଙ୍କ ମଧ୍ୟରେ ଦୂରତା ରକ୍ଷା କରିବା ପାଇଁ ସମ୍ମୁଖ ଡେସ୍କ ର ରିଟ୍ରୋଫିଟ୍ ଇତ୍ୟାଦି)', score: 1 }, { name: 'କାର୍ଯ୍ୟକ୍ଷେତ୍ରକୁ ଆସିବା ପାଇଁ କର୍ମଚାରୀମାନଙ୍କ ପାଇଁ ପରିବହନ ସୁବିଧା ଯୋଗାଇବା |', score: 1 }, { name: 'ବ୍ୟବସାୟ କ୍ଷେତ୍ର / କାର୍ଯ୍ୟାଳୟରେ କର୍ମଚାରୀଙ୍କ ଘନତାକୁ କମ୍ କରିବା ପାଇଁ କାର୍ଯ୍ୟ ନୀତି ବଦଳାଇବା କିମ୍ବା ଘରୁ ରହି କାର୍ଯ୍ୟ କରିବା ନୀତିକୁ ଆପଣାଇବା |', score: 1 }, { name: 'ଏଗୁଡ଼ିକ ମଧ୍ୟରୁ କୌଣସି ଟି ନୁହେଁ |', score: 5 }] },
            { que: 'ଉଦ୍ୟୋଗ / ବ୍ୟବସାୟ କାର୍ଯ୍ୟ ପାଇଁ ଅପରିହାର୍ଯ୍ୟ ରହିଥିବା ଯନ୍ତ୍ରପାତି / ଉପକରଣର ସ୍ଥିତିକୁ ଆପଣ କିପରି ଭାବରେ ବର୍ଣନା କରିବେ ?', type: 'radio', options: [{ name: 'କାର୍ଯ୍ୟାଳୟ / ଉତ୍ପାଦନ ୟୁନିଟ ଗୁଡିକ / ଗୋଦାମ / ଷ୍ଟୋର / ଅନ୍ୟାନ୍ୟ ପ୍ରତିଷ୍ଠାନ ଗୁଡିକୁ ପହଂଚିବା ସୁବିଧା ନାହିଁ', score: 3 }, { name: 'ଯନ୍ତ୍ରପାତି ଗୁଡିକ ପାଇଁ ବାର୍ଷିକ ରକ୍ଷଣାବେକ୍ଷଣ ଚୁକ୍ତିନାମା (AMC) ନାହିଁ ଏବଂ ଅନେକ ଯନ୍ତ୍ରପାତି / ଉପକରଣ ନିୟମିତ ରକ୍ଷଣାବେକ୍ଷଣ ଆବଶ୍ୟକ କରେ |', score: 3 }, { name: 'ଅଧିକାଂଶ ଯନ୍ତ୍ରପାତି / ଉପକରଣ ପାଇଁ ଏକ ବାର୍ଷିକ ରକ୍ଷଣାବେକ୍ଷଣ ଚୁକ୍ତି ( AMC ) ଅଛି |', score: 2 }, { name: 'ଏହି ଉଦ୍ୟୋଗ / ବ୍ୟବସାୟ ଟି ଏପରି କୌଣସି ଯନ୍ତ୍ରପାତି / ଉପକରଣ ଉପରେ ନିର୍ଭରଶୀଳ ନୁହେଁ ଯାହା ରକ୍ଷଣାବେକ୍ଷଣ ଅଭାବରୁ ବନ୍ଦ ହୋଇପାରେ |', score: 1 }, { name: 'ଏହି ଉଦ୍ୟୋଗ / ବ୍ୟବସାୟଟି କୌଣସି ଯନ୍ତ୍ରପାତି / ଉପକରଣ ଉପରେ ନିର୍ଭରଶୀଳ ନୁହେଁ |', score: 0 }] },
            { que: 'କୋଭିଡ ୧୯ ମହାମାରୀ ପୂର୍ବରୁ ବ୍ୟବସାୟ ଉପରେ କେଉଁ ପ୍ରକାରର ଆର୍ଥିକ ବୋଝ ରହିଥିଲା? (ଏକରୁ ଅଧିକ ଉତ୍ତର ଚୟନ କରାଯାଇପାରିବ)', multipleText: true, type: 'checkbox', options: [{ name: 'ଉଚ୍ଚ ପରିଚାଳନାଗତ ଖର୍ଚ', score: 1 }, { name: 'ସରକାରଙ୍କ ଆର୍ଥିକ ନିୟମାବଳୀରେ ଯେପରି (କଷ୍ଟମ ଡ୍ୟୁଟି, ଟ୍ୟାକ୍ସ, ଆମଦାନୀ / ରପ୍ତାନି ନିୟମାବଳୀ ଇତ୍ୟାଦି) ରେ ପରିବର୍ତ୍ତନ ହେତୁ ଟିକସ, ସୁଧ ଇତ୍ୟାଦି ବକେୟା ରହିଥିଲା |', score: 1 }, { name: 'ପୂର୍ବର କରଜ / ଋଣ / ଅଥବା ଅନ୍ୟ କୌଣସି ଆର୍ଥିକ ବୋଝ', score: 1 }, { name: 'ଏଥି ମଧ୍ୟରୁ କିଛି ବି ନୁହେଁ', score: 0 }] },
            { que: 'ବ୍ୟବସାୟ ର ବର୍ତ୍ତମାନର ଆର୍ଥିକ ସ୍ଥିତି ଯେପରି (ରହିଥିବା ସମ୍ପତ୍ତି, ଅଂଶଧନ, ନଗଦ, ସରକାରୀ ସହାୟତା) ସହିତ କେତେ ଦିନ ପର୍ଯ୍ୟନ୍ତ ଚାଲି ପାରିବାରେ ସକ୍ଷମ ହେବ ?', type: 'radio', options: [{ name: 'ଏହା ଆଉ ଆଗକୁ ଚାଲି ପାରିବ ନାହିଁ', score: 4 }, { name: 'ଏହା ୧ ରୁ ୨ ମାସ ପର୍ଯ୍ୟନ୍ତ ଚାଲିପାରିବ', score: 3 }, { name: 'ଏହା ୩ ରୁ ୬ ମାସ ପର୍ଯ୍ୟନ୍ତ ଚାଲିପାରିବ', score: 2 }, { name: 'ଏହା ୬ ରୁ ୧୨ ମାସ ପର୍ଯ୍ୟନ୍ତ ଚାଲିପାରିବ', score: 1 }] },
            { que: 'ବ୍ୟବସାୟ ଟି ବୀମାଭୁକ୍ତ ହୋଇଛି କି?', type: 'radio', options: [{ name: 'ବ୍ୟବସାୟ ଟି ବିପର୍ଯ୍ୟୟ ବୀମା ସୁରକ୍ଷା ସହିତ ବୀମାଭୁକ୍ତ ହୋଇଛି ଯେଉଁଥିରେ ମହାମାରୀ ଅନ୍ତର୍ଭୁକ୍ତ |', score: 0 }, { name: 'ବ୍ୟବସାୟଟି ବିପର୍ଯ୍ୟୟ ବୀମା ସୁରକ୍ଷା ସହିତ ବୀମାଭୁକ୍ତ ହୋଇଛି କିନ୍ତୁ ଏଥିରେ ମହାମାରୀ ଅନ୍ତର୍ଭୁକ୍ତ ନୁହେଁ', score: 1 }, { name: 'ବ୍ୟବସାୟର କିଛି ଅଂଶ ବିପର୍ଯ୍ୟୟ ଏବଂ ମହାମାରୀ ପାଇଁ ଉଦ୍ଧିଷ୍ଟ ବୀମା ସୁରକ୍ଷା ଅନ୍ତର୍ଭୁକ୍ତ ଅଟେ', score: 2 }, { name: 'ବ୍ୟବସାୟଟି ପାଇଁ ବର୍ତମାନ କିମ୍ବା ପୂର୍ବରୁ ମଧ୍ୟ କୌଣସି ବୀମା ସୁବିଧା କ୍ରୟ କରାଯାଇ ନାହିଁ', score: 3 }, { name: 'ବ୍ୟବସାୟ ଟି ପାଇଁ କୌଣସି ବୀମା ସୁବିଧା ନାହିଁ', score: 3 }] },
            { que: 'ବ୍ୟବସାୟ ବୀମା ସୁରକ୍ଷା ମଧ୍ୟରେ କ’ଣ ସବୁ ଅନ୍ତର୍ଭୁକ୍ତ ?', type: 'checkbox', options: [{ name: 'ଭୂମିକମ୍ପ' }, { name: 'ବନ୍ୟା' }, { name: 'ଅଗ୍ନିକାଣ୍ଡ' }, { name: 'ସାମୁଦ୍ରିକ ଝଡ / ବାତ୍ୟା / ଘୁର୍ଣ୍ଣି ଝଡ ଆଦି' }, { name: 'ସର୍ବତ୍ର ବ୍ୟାପୁଥିବା ମହାମାରୀ / ପ୍ରକୋପ / ମହାମାରୀ / ସ୍ଥାନୀୟ ସଂକ୍ରମଣ' }, { name: 'ଆତଙ୍କବାଦୀ ଆକ୍ରମଣ' }, { name: 'ଆଗ୍ନେୟଗିରି ଉଦ୍ଗିରଣ' }, { name: 'ମରୁଡ଼ି' }, { name: 'ଫସଲ କ୍ଷତି' }, { name: 'ଅନ୍ୟ କିଛି' }, { name: 'ଏଥି ମଧ୍ୟରୁ କିଛି ବି ନୁହେଁ |' }] },
            { que: `ବ୍ୟବସାୟ ପାଇଁ ସରକାରଙ୍କ ତରଫରୁ ଦିଆଯାଇଥିବା କୋଭିଡ ୧୯ ସହାୟତା ପ୍ୟାକେଜ କେତେ ପ୍ରଭାବଶାଳୀ ହୋଇଛି?`, type: 'radio', options: [{ name: 'ବହୁତ ପ୍ରଭାବଶାଳୀ', score: 0 }, { name: 'କିଛି ମାତ୍ରାରେ ପ୍ରଭାବଶାଳୀ', score: 1 }, { name: 'ପ୍ରଭାବଶାଳୀ ନୁହେଁ |', score: 2 }, { name: 'ସରକାର ଏପର୍ଯ୍ୟନ୍ତ କୌଣସି ସହାୟତା ପ୍ୟାକେଜ୍ ପ୍ରଦାନ କରିନାହାଁନ୍ତି କିମ୍ବା ସେ ସୁବିଧା ପାଇ ନାହାନ୍ତି', score: 2 }, { name: 'ଏହିପରି ସହାୟତା ପ୍ୟାକେଜ୍ (ଗୁଡିକ) ପାଇଁ ବ୍ୟବସାୟ ଟି ଯୋଗ୍ୟ ନୁହେଁ', score: 2 }, { name: 'ଏହି ସବୁ ସହାୟତା ପ୍ୟାକେଜଗୁଡ଼ିକ ବିଷୟରେ କୌଣସି ସଚେତନତା କରାଯାଇନାହିଁ', score: 2 }] },
            { que: 'ବ୍ୟବସାୟ ଟି ଉପରେ ତାଲା ବନ୍ଦ ର କୌଣସି ପ୍ରଭାବ ପଡିଅଛି କି ?', type: 'radio', options: [{ name: 'ବ୍ୟବସାୟ ସମ୍ପୂର୍ଣ୍ଣ ବନ୍ଦ ହୋଇଯାଇଛି', score: 3 }, { name: 'ପ୍ରାରମ୍ଭିକ ପର୍ଯ୍ୟାୟ ରେ ବନ୍ଦ ପରେ ବ୍ୟବସାୟ ସର୍ବନିମ୍ନ କ୍ଷମତାରେ କାର୍ଯ୍ୟ କରୁଛି', score: 2 }, { name: 'ବ୍ୟବସାୟଟି ଆଦୌ ବନ୍ଦ ନକରି କମ କ୍ଷମତାରେ କାର୍ଯ୍ୟ କରୁଛି', score: 1 }, { name: 'ପ୍ରାରମ୍ଭିକ ପର୍ଯ୍ୟାୟ ରେ ବନ୍ଦ ପରେ ବ୍ୟବସାୟ ଟି ପୂର୍ଣ୍ଣ କ୍ଷମତା ସହିତ କାର୍ଯ୍ୟ କରୁଛି', score: 1 }, { name: 'ବ୍ୟବସାୟ ଟି ଉପରେ ତାଲା ବନ୍ଦ ର କୌଣସି ପ୍ରଭାବ ପଡି ନାହିଁ / ଅଥବା ସେଠାରେ ତାଲା ବନ୍ଦ ହୋଇ ନଥିଲା', score: 0 }] },
            { que: `ବ୍ୟବସାୟ ଉପରେ ସରକାରୀ ନିୟମାବଳୀର କଣ ସବୁ ପ୍ରଭାବ ପଡି ଅଛି ? ( ଏକରୁ ଅଧିକ ଉତ୍ତର ଚୟନ କରାଯାଇପାରିବ)`, multipleText: true, type: 'checkbox', options: [{ name: 'କଞ୍ଚାମାଲ ଏବଂ ଅନ୍ୟାନ୍ୟ ସାମଗ୍ରୀ କିଣିବା କଷ୍ଟକର ହୋଇଛି', score: 1 }, { name: 'ବଜାରରେ ଉତ୍ପାଦ ସବୁ କୁ ବିକ୍ରୟ କରିବା / ଗ୍ରାହକଙ୍କୁ ଯୋଗାଯୋଗ କରିବା କଷ୍ଟକର ହୋଇଛି', score: 1 }, { name: 'ନୂତନ ଉତ୍ପାଦଗୁଡିକର ଅନୁମୋଦନ ଏବଂ ଗୁଣାତ୍ମକ ମାନ ପାଇଁ ଥିବା ଯାଞ୍ଚ ପ୍ରକ୍ରିୟା ରେ ବିଳମ୍ବ |', score: 1 }, { name: 'ସାଧାରଣ ଉପଯୋଗୀତା (ଯଥା ବିଦ୍ୟୁତ୍, ଜଳ, ଇତ୍ୟାଦି) ବ୍ୟବହାର କରିବା ମୂଲ୍ୟ ରେ ବୃଦ୍ଧି |', score: 1 }, { name: 'ମାନବ ସମ୍ବଳର ଅଭାବ / ଉପଲବ୍ଧତା ଅଥବା ମଜୁରୀ ରେ ବୃଦ୍ଧି', score: 1 }, { name: 'ଏଥି ମଧ୍ୟରୁ କିଛି ବି ନୁହେଁ', score: 0 }] },
            { que: 'କୋଭିଡ ୧୯ ପରିସ୍ଥିତି କୁ ନେଇ ଏହି ବଜାର ଅବସ୍ଥା ମଧ୍ୟରୁ କେଉଁଟି ବ୍ୟବସାୟ ପାଇଁ ସତ୍ୟ ଅଟେ ? (ଏକ ରୁ ଅଧିକ ଉତ୍ତର ଚୟନ କରାଯାଇପାରିବ)', multipleText: true, type: 'checkbox', options: [{ name: 'ଗ୍ରାହକଙ୍କ ମଧ୍ୟରେ ଚାହିଦା ହ୍ରାସ ପାଇଛି', score: 1 }, { name: 'ଡିଜିଟାଲ୍ ପ୍ଲାଟଫର୍ମ / ଇ-ବାଣିଜ୍ୟ ପରିବର୍ତ୍ତେ ଗ୍ରାହକମାନଙ୍କ ପାଖରେ ପହଞ୍ଚିବା ପାଇଁ ପାରମ୍ପରିକ ପଦ୍ଧତି ଉପରେ ନିର୍ଭରଶୀଳ', score: 1 }, { name: 'ବଜାର ଚାହିଦା ପରିବର୍ତ୍ତନର ଲାଭ ଉଠାଇବା ପାଇଁ ଉତ୍ପାଦ ଏବଂ ସେବାଗୁଡିକୁ ବିବିଧ କରିବା ପାଇଁ କୌଣସି ସୁଯୋଗ ନାହିଁ', score: 1 }, { name: 'କ୍ରେତା ବିକ୍ରେତା ଉପସ୍ଥିତ ରହି ଚାଲୁଥିବା ବଜାର ପ୍ରକ୍ରିୟା ବର୍ତମାନ ଏକ ବିପଦପୂର୍ଣ୍ଣ ସ୍ଥିତିରେ ଅଛି ଓ ଏଠାରେ କୌଣସି ସେବା ମିଳୁନାହିଁ', score: 1 }, { name: 'ବଜାର ଅଧିକ ପ୍ରତିଯୋଗିତାମୂଳକ ହୋଇପାରିଛି', score: 1 }, { name: 'ଗ୍ରାହକ ଏବଂ ଯୋଗାଣକାରୀଙ୍କ ସହିତ ଯୋଗାଯୋଗ ସମ୍ଭବ ହୋଇପାରୁ ନାହିଁ', score: 1 }, { name: 'ଏଗୁଡିକ ମଧ୍ୟରୁ କୌଣସି ଟି ବି ନୁହେଁ', score: 0 }] },
            { que: 'ନିମ୍ନରେ ଦିଆଯାଇଥିବା ବିପଦଗୁଡିକ ମଧ୍ୟରୁ କେଉଁଟି ନିକଟ ଭବିଷ୍ୟତରେ ବ୍ୟବସାୟକୁ ପ୍ରଭାବିତ କରିବାର ଅଧିକ ସମ୍ଭାବନା ରହି ଅଛି? (ଏକ ରୁ ଅଧିକ ଉତ୍ତର ଚୟନ କରାଯାଇପାରିବ)', multipleText: true, type: 'checkbox', options: [{ name: 'ଭୂକମ୍ପ', score: 1 }, { name: 'ବାତ୍ୟା / ଟାଇଫୁନ୍ / ସାମୁଦ୍ରିକ ଝଡ ଓ ପବନ ଯୋଗୁ ହେବାକୁ ଥିବା କ୍ଷତି', score: 1 }, { name: 'ବନ୍ୟା', score: 1 }, { name: 'ଭୂସ୍ଫଳନ', score: 1 }, { name: 'ଶିଳ୍ପ କ୍ଷେତ୍ରରେ ଅଗ୍ନିକାଣ୍ଡ / ଜଙ୍ଗଲ ରେ ଅଗ୍ନିକାଣ୍ଡ|', score: 1 }, { name: 'ମରୁଡ଼ି', score: 1 }, { name: 'ଅତ୍ୟଧିକ ଗରମ / ଅତ୍ୟଧିକ ଶୀତ |', score: 1 }, { name: 'ରାସାୟନିକ ନିର୍ଗମନ', score: 1 }, { name: 'ବିବାଦ ଏବଂ ସାମାଜିକ ଅସ୍ଥିରତା |', score: 1 }, { name: 'ଏଥି ମଧ୍ୟରୁ କିଛି ବି ନୁହେଁ', score: 0 }] },
        ],
        'Hi': [
            { que: 'व्यवसाय का प्रकार चुनें?', type: 'select', options: [{ name: 'विनिर्माण' }, { name: 'परिवहन और आपूर्ति श्रृंखला' }, { name: 'सत्कार' }, { name: 'खाद्य और पेय पदार्थ' }, { name: 'सॉफ्टवेयर / आईटी' }, { name: 'निर्माण और अचल संपत्ति' }, { name: 'कृषि व्यवसाय' }, { name: 'कंसल्टेंसी' }, { name: 'शिक्षा' }, { name: 'यात्रा और पर्यटन' }, { name: 'मीडिया और मनोरंजन' }, { name: 'इलेक्ट्रॉनिक्स और दूरसंचार' }, { name: 'स्वास्थ्य देखभाल' }, { name: 'माइक्रोफाइनेंस संस्थान' }, { name: 'खुदरा और थोक' }, { name: 'एनजीओ / एनपीओ' }] },
            { que: 'क्या आप व्यवसाय के मालिकों में से एक हैं?', type: 'radio', options: [{ name: 'हां' }, { name: 'नहीं' }] },
            { que: 'क्या व्यवसाय के मालिकों में से एक महिला है?', type: 'radio', options: [{ name: 'हां' }, { name: 'नहीं' }] },
            { que: 'व्यवसाय के पास कार्यालयों / विनिर्माण इकाइयों / दुकानों / गोदामों की कुल संख्या कितनी है?', type: 'textinput' },
            { que: 'व्यवसाय का वार्षिक राजस्व (स्थानीय मुद्रा में) क्या है?', type: 'textinput' },
            { que: 'व्यवसाय में कर्मचारियों ध् कर्मचारियों ध् कर्मचारियों की कुल संख्या कितनी है?', type: 'textinput' },
            { que: 'व्यापार के प्रकार?', type: 'select', options: [{ name: 'एकमात्र स्वामी' }, { name: 'साझेदारी' }, { name: 'सीमित देयता कंपनी' }, { name: 'निगम' }, { name: 'सहकारी / ट्रस्ट / सोसायटी' }, { name: 'अभी तक पंजीकृत नहीं किया गया' }, { name: 'एनजीओ / एनपीओ' }] },
            { que: 'देश चुनें?', type: 'select' },
            { que: 'प्रांत का चयन करें', type: 'select' },
            { que: 'पोस्टल / जिप / पिन कोड? (ऐच्छिक)', type: 'textinput' },
        
            { que: 'क्या व्यवसाय में व्यवसाय निरंतरता योजना (BCP) है?', type: 'radio', options: [{ name: 'हां, इसकी एक योजना है और यह स्वास्थ्य आपात स्थिति (महामारी / प्रकोप) पर विचार करता है' }, { name: 'हां, इसकी एक योजना है लेकिन यह स्वास्थ्य आपात स्थिति (महामारी / प्रकोप) पर विचार नहीं करता है' }, { name: 'इसके पास व्यावसायिक निरंतरता योजना नहीं है' }, { name: 'मैं "व्यवसाय निरंतरता योजना" शब्द से अनजान हूँ' }, { name: `अगर बीसीपी है तो मैं नहीं जानता` }] },
            { que: `क्या व्यवसाय ने अपनी व्यवसाय निरंतरता योजना (BCP) लागू की है?`, type: 'radio', options: [{ name: 'हां (पूरी तरह से)' }, { name: 'हाँ (आंशिक रूप से)' }, { name: 'नहीं' }], conditional: true },
            { que: `COVID -19 का व्यापार पर क्या प्रभाव पड़ा है?`, type: 'checkbox', options: [{ title: 'उत्पादन और सेवाओं पर प्रभाव', innerOptions: ['बढ़ना', 'गढाना', 'कोई परिवर्तन नहीं होता है'] }, { title: 'बाजार पहुंच पर प्रभाव', innerOptions: ['बढ़ना', 'गढाना', 'कोई परिवर्तन नहीं होता है'] }, { title: 'कैशफ्लो और बिक्री पर प्रभाव', innerOptions: ['बढ़ना', 'गढाना', 'कोई परिवर्तन नहीं होता है'] }, { title: 'कर्मचारियों पर कुल प्रभाव (उत्पादकता, प्रतिधारण)', innerOptions: ['सकारात्मक', 'नकारात्मक', 'मिश्रित', 'कोई परिवर्तन नहीं होता है'] }] },
            { que: 'आपको क्या लगता है कि व्यवसाय को वर्तमान स्थिति से पूरी तरह से उबरने में कितना समय लगेगा?', type: 'radio', options: [{ name: 'पहले से ही पूरी तरह से बरामद' }, { name: '6 महीने से कम' }, { name: '6 महीने से 1 वर्ष के बीच' }, { name: '1 वर्ष से अधिक' }, { name: 'निश्चित नहीं / भविष्यवाणी नहीं कर सकता' }] },
        
            { que: 'आप इस बात से चिंतित हैं कि व्यावसायिक संचालन कर्मचारी की अनुपलब्धता या अनुपस्थिति से प्रभावित होगा?', type: 'radio', options: [{ name: 'बिल्कुल भी चिंतित नहीं हैं क्योंकि अधिकांश सिस्टम स्वचालित हैं या कर्मचारी उपलब्ध हैं', score: 0 }, { name: 'परिवार के सदस्यों और ध् या दोस्तों के रूप में इतना चिंतित नहीं है या किसी भी कर्मचारी की कमी को भर सकता है', score: 1 }, { name: 'चिंता की बात यह है कि व्यवसाय कर्मचारियों पर निर्भर करता है और व्यवसाय के पास कोई अन्य सहायता नहीं है', score: 2 }] },
            { que: `क्या कर्मचारी स्थायी / नियमित या अस्थायी हैं? \n (स्थायी का मतलब रोजगार की कोई निश्चित अंतिम तिथि नहीं है / कंपनी के लाभ जैसे पेंशन फंड, नियोक्ता योगदान, और अस्थायी साधनों के लिए योग्य है, और अस्थायी साधनों का भुगतान वे दैनिक वेतन या अल्पकालिक अनुबंध द्वारा किया जाता है ।).`, type: 'radio', options: [{ name: 'सभी कर्मचारी स्थायी हैं या परिवार के सदस्यों के बीच से आते हैं', score: 0 }, { name: 'कर्मचारियों में से अधिकांश स्थायी हैं या परिवार के सदस्यों (50% से अधिक) से आते हैं', score: 1 }, { name: 'लगभग स्थायी और अस्थायी कर्मचारियों की समान संख्या है', score: 1 }, { name: 'कर्मचारियों की अधिकांश संख्या अस्थायी है (50% से अधिक)', score: 2 }, { name: 'सभी कर्मचारी अस्थायी हैं', score: 3 }] },
            { que: 'आप व्यवसाय के अधिकांश कर्मचारियों का वर्णन कैसे करेंगे?', multipleText: true, type: 'checkbox', options: [{ name: 'परिवार के सदस्य' }, { name: `मित्र और पड़ोसी` }, { name: 'मौसमी / प्रवासी कामगार / कैजुअल कर्मचारी / रोजगार' }, { name: 'अन्य' }] },
            { que: 'व्यवसाय ने क्या कार्य किए हैं / कर्मचारियों की भलाई सुनिश्चित करने के लिए किए गए प्रयास?', multipleText: true, type: 'checkbox', options: [{ name: 'कर्मचारी शारीरिक संपर्क को कम करने के लिए रूपांतरित / कार्यालय स्थान को बदल सकते हैं', score: 1 }, { name: `प्रबंधन नियमित रूप से कर्मचारी के साथ जुड़ता है और कंपनी की स्थिति पर COVID-19 और इसके संभावित प्रभावों के बारे में उनसे प्रभावी ढंग से संवाद करता है`, score: 1 }, { name: 'प्रबंधन समय-समय पर मानसिक और शारीरिक भलाई के लिए उनकी सहायता के लिए कर्मचारी सहायता कार्यक्रम आयोजित करता है', score: 1 }, { name: 'प्रबंधन कर्मचारियों को नए कौशल सेट और ज्ञान प्राप्त करने के लिए प्रोत्साहित करता है ताकि वे उन अन्य कर्मचारियों को भर सकें जो काम पर आने में असमर्थ हैं और / या अपने कौशल को बढ़ाने के लिए', score: 1 }, { name: 'प्रबंधन कर्मचारियों के आय ध् वेतन की गारंटी देता है, भले ही व्यवसाय को अस्थायी रूप से बंद करना हो या संचालन को कम करना हो।', score: 1 }, { name: 'इनमें से कोई नहीं', score: 5 }] },
            { que: 'क्या व्यवसाय को लोगों के साथ निकट शारीरिक संपर्क या दूरी की आवश्यकता होती है?', type: 'radio', options: [{ name: '1. ग्राहकों और ग्राहकों के लिए भौतिक दूरी (दुकानें, रेस्तरां आदि)', score: 1 }, { name: '2. अन्य कर्मचारियों (विनिर्माण इकाइयों, दुकानों, आदि) के लिए भौतिक दूरी को बंद करें', score: 1 }, { name: '3. दोनों उपरोक्त', score: 2 }, { name: '4. इनमें से कोई नहीं', score: 0 }] },
            { que: 'कोविड -19 महामारी के कारण किस तरह के मानव संसाधन मुद्दों का सामना करना पड़ रहा है?', multipleText: true, type: 'checkbox', options: [{ name: 'लॉकडाउन के बावजूद सार्वजनिक परिवहन के उपयोग पर चिंता के कारण कर्मचारियों के बीच अनुपस्थिति' }, { name: 'दैनिक वेतन भोगी श्रमिकों की कमी के कारण प्रवासन' }, { name: 'काम के घंटे या उत्पादकता कम करने के लिए आने वाले कर्मचारियों के बीच मानसिक और शारीरिक तनाव के कारण अनुपस्थिति' }, { name: 'तालाबंदी के कारण कर्मचारियों में अनुपस्थिति' }, { name: 'परिवार के सदस्यों / बच्चे की देखभाल के कारण अनुपस्थिति' }, { name: 'इनमें से कोई नहीं' }] },
        
            { que: 'यदि व्यवसाय सूचना प्रौद्योगिकी (आईटी) पर अत्यधिक निर्भर है, तो क्या इसने व्यवसाय के लिए संभावित साइबर सुरक्षा खतरों के लिए मौजूदा रणनीतियों की तैयारी की है या समीक्षा की है?', type: 'radio', options: [{ name: 'हाँ', score: 1 }, { name: 'नहीं', score: 2 }, { name: 'ऐसे खतरों के बारे में कोई जागरूकता नहीं है', score: 2 }, { name: 'लागू नहीं है', score: 0 }] },
            { que: 'क्या व्यवधानों का प्रबंधन करने या व्यवसाय की निरंतरता सुनिश्चित करने के लिए प्रौद्योगिकी और / या अभिनव आईटी समाधानों (डिजिटल लेनदेन, आभासी कार्यालय, दूरस्थ शिक्षा, आभासी दौरे / पर्यटन, टेलीमेडिसिन, वेबिनार, मोबाइल एप्लिकेशन) का उपयोग कर व्यापार किया जाता है?', type: 'radio', options: [{ name: 'हाँ, इनमें से अधिकांश', score: 1 }, { name: 'इनमें से कुछ', score: 2 }, { name: 'नहीं, पहले इन के बारे में कोई विचार नहीं किया गया है', score: 3 }, { name: 'व्यवसाय के लिए लागू नहीं है', score: 0 }] },
            { que: 'क्या आपके क्षेत्र में बिजली, गैस, पानी, दूरसंचार (मोबाइल, टेलीफोन, इंटरनेट), बैंकिंग और डाक सेवा जैसी बुनियादी उपयोगिता सेवाओं में व्यवधान के कारण व्यवसाय के संचालन पर कोई प्रभाव पड़ा है?', type: 'radio', options: [{ name: 'व्यवसाय अत्यधिक प्रभावित होता है', score: 3 }, { name: 'व्यवसाय कुछ हद तक प्रभावित है', score: 2 }, { name: 'व्यवसाय पर न्यूनतम प्रभाव पड़ा', score: 1 }, { name: 'व्यवसाय पर कोई प्रभाव नहीं', score: 0 }] },
            { que: 'निर्माता, विक्रेता / आपूर्तिकर्ता और ग्राहक को जोड़ने वाली आपूर्ति श्रृंखला (माल और सेवाओं का प्रवाह) किस तरह के मुद्दों ने व्यापार को प्रभावित किया है? (एकाधिक उत्तर चुने जा सकते हैं)', multipleText: true, type: 'checkbox', options: [{ name: 'माल और सेवाएँ बिक चुकी हैं या अनुपलब्ध हैं', score: 1 }, { name: 'विक्रेताओं / आपूर्तिकर्ताओं / कच्चे माल / उत्पादों को दुर्गम या अनुपलब्ध किया गया है', score: 1 }, { name: 'रसद / परिवहन के मुद्दे', score: 1 }, { name: 'आपूर्ति श्रृंखला पर कोई मौजूदा प्रभाव नहीं', score: 0 }] },
            { que: 'COVID-19 महामारी सुरक्षा के लिए व्यवसाय में इनमें से किसे बढ़ावा दिया जा रहा है?', multipleText: true, type: 'checkbox', options: [{ name: 'कार्यस्थल सैनिटेशन (उदाहरण के लिए सतहों की सफाई में वृद्धि, हाथ की सफाई इकाइयों की स्थापना, आदि)', score: 1 }, { name: 'कर्मचारियों के बीच अच्छी स्वच्छता को बढ़ावा देना (मास्क पहनना, हाथ धोना)', score: 1 }, { name: 'कर्मचारियों और ग्राहकों के नियमित तापमान की जाँच', score: 1 }, { name: 'कार्य स्थल पर शारीरिक गड़बड़ी को बनाए रखना (जैसे ग्राहकों और कर्मचारियों के बीच की दूरी को इंगित करने के लिए फर्श को चिह्नित करना, लोगों के बीच की दूरी बढ़ाने के लिए फ्रंट डेस्क की रेट्रोफिटिंग)', score: 1 }, { name: 'कर्मचारियों के लिए काम करने के लिए कार्यालय परिवहन सुविधाओं का प्रावधान', score: 1 }, { name: 'व्यवसाय/कार्यालय में कर्मचारियों के घनत्व को कम करने के लिए चौंका देने वाला कार्य शिफ्ट या घर से काम करने की नीतियां शुरू करना', score: 1 }, { name: 'इनमें से कोई नहीं', score: 5 }] },
            { que: 'आप उपकरण और मशीनरी की स्थिति का वर्णन कैसे करते हैं जो व्यवसाय के लिए अपरिहार्य हैं?', type: 'radio', options: [{ name: 'कार्यालय / निर्माण इकाई (गोदामों) / स्टोर / दुकानों (अन्य) तक कोई पहुंच नहीं है ।', score: 3 }, { name: 'कोई वार्षिक रखरखाव अनुबंध (एएमसी) नहीं है और कई मशीनरी/उपकरणों को नियमित रखरखाव की आवश्यकता होती है', score: 3 }, { name: 'अधिकांश मशीनरी / उपकरण के लिए वार्षिक रखरखाव अनुबंध (एएमसी)  है', score: 2 }, { name: 'व्यवसाय किसी भी ऐसी मशीनरी / उपकरण पर निर्भर नहीं है जिसे रखरखाव की कमी के कारण अप्रमाणित किया जा सकता है', score: 1 }, { name: 'व्यवसाय ऐसी किसी भी मशीनरी / उपकरण पर निर्भर नहीं है ', score: 0 }] },
            { que: 'COVID-19 महामारी से पहले किस तरह की मौजूदा वित्तीय देनदारियां थीं?', multipleText: true, type: 'checkbox', options: [{ name: 'उच्च परिचालन लागत', score: 1 }, { name: 'लंबित करों, सरकार की वित्तीय नीतियों (कस्टम ड्यूटी, टैक्स, आयात / निर्यात नियमों आदि) में बदलाव के कारण ब्याज ।', score: 1 }, { name: 'मौजूदा ऋण / ऋण / या कोई अन्य वित्तीय बोझ ', score: 1 }, { name: 'इनमें से कोई नहीं', score: 0 }] },
            { que: 'व्यवसाय अपनी वर्तमान वित्तीय स्थिति (संपत्ति, शेयर, नकदी, सरकारी समर्थन) के साथ कब तक काम करना जारी रख सकता है?', type: 'radio', options: [{ name: 'यह आगे भी जारी नहीं रह सकता है', score: 4 }, { name: 'यह 1-2 महीने तक कायम रह सकता है', score: 3 }, { name: 'यह 3-6 महीने तक कायम रह सकता है', score: 2 }, { name: 'यह 6 -12 महीने तक बना रह सकता है', score: 1 }] },
            { que: 'क्या व्यवसाय का बीमा है?', type: 'radio', options: [{ name: 'व्यवसाय में आपदा बीमा कवर के साथ बीमा किया जाता है जिसमें महामारी शामिल है', score: 0 }, { name: 'आपदा बीमा से व्यवसाय का बीमा होता है लेकिन यह महामारी को कवर नहीं करता है', score: 1 }, { name: 'आपदा और महामारी के लिए व्यवसाय का केवल एक हिस्सा बीमाकृत है', score: 2 }, { name: 'वर्तमान में व्यवसाय के पास कोई बीमा नहीं है या नहीं है', score: 3 }, { name: 'व्यवसाय में किसी भी बीमा तक पहुंच नहीं है', score: 3 }] },
            { que: 'व्यवसाय बीमा क्या कवर करता है?', type: 'checkbox', options: [{ name: 'भूकंप' }, { name: 'बाढ़' }, { name: 'आग' }, { name: 'चक्रवात / टाइफून / बवंडर' }, { name: 'महामारी / प्रकोप / महामारी / अंतःविषय' }, { name: 'आतंकवादी हमले' }, { name: 'ज्वालामुखी' }, { name: 'सूखा' }, { name: 'फसल क्षति' }, { name: 'अन्य' }, { name: 'इनमें से कोई नहीं' }] },
            { que: `व्यवसाय के लिए सरकार का COVID-19 प्रोत्साहन पैकेज कितना प्रभावी रहा है?`, type: 'radio', options: [{ name: 'बहुत प्रभावी है', score: 0 }, { name: 'कुछ हद तक प्रभावी', score: 1 }, { name: 'प्रभावी नहीं है', score: 2 }, { name: 'सरकार द्वारा ऐसा कोई पैकेज अभी तक प्रदान या एक्सेस नहीं किया गया है', score: 2 }, { name: 'व्यवसाय ऐसे पैकेज के लिए योग्य नहीं है', score: 2 }, { name: 'ऐसे पैकेजों के बारे में कोई जानकारी नहीं है', score: 2 }] },
            { que: 'किसी भी लॉकडाउन का व्यवसाय पर क्या प्रभाव पड़ता है?', type: 'radio', options: [{ name: 'व्यवसाय पूरी तरह से बंद हो गया है', score: 3 }, { name: 'शुरुआती बंद के बाद न्यूनतम क्षमता पर कारोबार चल रहा है', score: 2 }, { name: 'व्यवसाय बिना किसी बंद के कम क्षमता पर चल रहा है', score: 1 }, { name: 'शुरुआती बंद के बाद व्यापार पूरी क्षमता से चल रहा है', score: 1 }, { name: 'व्यवसाय संचालन पर कोई प्रभाव नहीं / कोई लॉकडाउन नहीं था', score: 0 }] },
            { que: `सरकार के नियमों का व्यवसाय पर क्या प्रभाव पड़ा है?`, multipleText: true, type: 'checkbox', options: [{ name: 'कच्चे माल और अन्य आपूर्ति की खरीद के लिए मुश्किल', score: 1 }, { name: 'बाजार में उत्पाद बेचने / ग्राहकों तक पहुँचने में कठिनाई', score: 1 }, { name: 'नए उत्पादों की स्वीकृति और गुणवत्ता की जाँच में देरी', score: 1 }, { name: 'सार्वजनिक उपयोगिताओं (जैसे बिजली, पानी, आदि) का उपयोग करने की लागत में वृद्धि', score: 1 }, { name: 'मानव संसाधन की लागत में कमी / अनुपलब्धता / वृद्धि', score: 1 }, { name: 'जो भी हो', score: 0 }] },
            { que: 'COVID-19 परिदृश्य के तहत व्यवसाय के लिए इनमें से कौन सी बाजार की स्थिति सही है?', multipleText: true, type: 'checkbox', options: [{ name: 'उपभोक्ता मांग में गिरावट है', score: 1 }, { name: 'डिजिटल प्लेटफॉर्म / ई-कॉमर्स के बजाय ग्राहक के लिए पारंपरिक / मैनुअल तरीकों पर रिलायंस', score: 1 }, { name: 'बाजार की मांग में बदलाव का लाभ उठाने के लिए उत्पादों और सेवाओं में विविधता लाने की कोई गुंजाइश नहीं है', score: 1 }, { name: 'भौतिक बाजार अब उच्च जोखिम वाले क्षेत्र में है और यह अबाधित हो गया है', score: 1 }, { name: 'बाजार अधिक प्रतिस्पर्धी हो गया है', score: 1 }, { name: 'ग्राहकों और आपूर्तिकर्ताओं के साथ संवाद करने में असमर्थता', score: 1 }, { name: 'इनमें से कोई नहीं', score: 0 }] },
            { que: 'इन खतरों में से कौन सा निकट भविष्य में व्यापार को प्रभावित करने की उच्च संभावना है?', multipleText: true, type: 'checkbox', options: [{ name: 'भूकंप', score: 1 }, { name: 'चक्रवात / आंधी / तूफान और पवन क्षति', score: 1 }, { name: 'बाढ़', score: 1 }, { name: 'भूस्खलन', score: 1 }, { name: 'औद्योगिक आग / जंगल की आग', score: 1 }, { name: 'सूखा', score: 1 }, { name: 'गर्मी की लहरें / ठंडी लहरें', score: 1 }, { name: 'रासायनिक रिसाव', score: 1 }, { name: 'संघर्ष और सामाजिक अशांति', score: 1 }, { name: 'इनमें से कोई नहीं', score: 0 }] },
        ]
    };

    let aa = [
        `Question number 1  Select business type? option1 Agribusiness  option 2 Construction and Real estate option 3 Consultancy  option 4 Education  option 5 Electronics and Telecommunication  option 6 Food and Beverage option 7 Healthcare option 8 Hospitality option 9  Manufacturing  option 10 Media and Entertainment  option 11 Microfinance institutions  option 12 Retail and wholesale  option 13  Software/IT option 14 Transportation and Supply Chain  option 15  Travel and Tourism option 16 NGO/NPO`,
        `Question number 2  Are you one of the owners of the business? option1  Yes  option 2 No`,
        `Question number 3  Is one of the owners of the business a female? option1 Yes  option 2 No`,
        `Question number 4  What is the total number of offices/manufacturing units/stores/ warehouses the business has?`,
        `Question number 5  What is the business’s annual revenue (in local currency)?`,
        `Question number 6  What is the total number of staff/employees/workers the business has?`,
        `Question number 7  Type of business ? option1 Cooperative / Trust / Society  option 2 Corporation  option 3 Limited Liability Company option 4 Not yet registered option 5 Partnership option 6  Sole proprietor options 7 NGO/NPO `,
        `Question number 8  Select Country ?`,
        `Question number 9  Select Province ?`,
        `Question number 10 Postal/Zip/Pin code? `,
        `Question number 11 Does the business have a Business Continuity Plan (BCP)? option1 Yes, It has a plan and it considers health emergencies (pandemic/outbreak)  option 2 Yes, It has a plan but it does not consider health emergencies (pandemic/outbreak) option 3 It does not have a Business Continuity Plan option 4 I am unaware of the term "Business Continuity Plan" option 5 I don’t know if it has a BCP.`,
        `Question number 12 Has the business implemented its Business Continuity Plan(BCP)? option1  Yes (fully) option 2 Yes (partly) option 3 No`,
        `Question number 13 What has been COVID-19's impact on the business? 1 Impact on production and services option1 Increase option2 Decline option3 No change  2 Impact on market access option1 Increase option2 Decline option3 No change  3 Impact on cashflow and sales option1 Increase option2 Decline option3 No change  4 Overall impact on employees (productivity, retention) option1 Positive option2 Negative option3 Mixed option 4 No change`,
        `Question number 14 How long do you think it will take for the business to fully recover from the present situation? option1  Already fully recovered  option 2 Less than 6 months option 3 Between 6 months to 1 year option 4 More than 1 year option 5 Not sure/Cannot predict `,
        `Question number 15 How worried are you that the business operations would be impacted by employee unavailability or absenteeism? option1  Not at all worried as most of my systems are automated or staff are available  option 2 Not so worried as family members and/or friends can or are filling any employee shortages option 3 Worried as the business relies on staff and the business has no other support `,
        `Question number 16 Are the employees permanent/regular or temporary? (Permanent means no fixed end date of employment/have access to superannuation and eligible for company benefits such as pension fund, employer contribution; and temporary means they are paid by a daily wage or short term contract). option1 All of the employees are permanent or come from amongst the family members option 2  Approximately there are equal numbers of permanent and temporary employees option 3 Majority of the employees are permanent or come from amongst the family members (more than 50%) option 4 Majority of the employees are temporary (more than 50%) option 5 All of the employees are temporary `,
        `Question number 17 How would you describe most of the employees in the business? multiple answers can be selected option1  Family members  option 2 Friends and neighbours option 3 Seasonal / Migrant workers / Casual workers / Daily wagers  option 4 Others `,
        `Question number 18 What are the actions the business has  taken /or efforts made to ensure the well-being of the employees? multiple answers can be selected option1 Employees may work remotely/ office space transformed to minimise physical contact  option 2 Management regularly engages with employee and effectively communicates with them on company's position to COVID-19 and its possible implications option 3 Management periodically conducts employee support programs to help them with mental and physical wellbeing option 4 Management encourages employees to acquire new skill sets and knowledge to fill in for other employees who are unable to come to work and/or to increase their personal skills  option 5 Management guaranteeing income/salary of the employees even if the business has to temporarily close or downsize the operation option 6 None of these`,
        `Question number 19 Does the business require close physical contact or distance with people? option1  Close physical distance to customers and clients (shops, restaurants etc)  option 2 Close physical distance to other employees (manufacturing units, shops, etc) option 3 Both option1 and 2 option 4 None of these`,
        `Question number 20 What kind of Human Resource issues is the business facing due to COVID-19 pandemic? multiple answers can be selected option1 Absenteeism among the employees due to concern over the use of public transportation irrespective of lockdown  option 2 Migration leading to shortage of daily wage workers option 3 Absenteeism caused by mental and physical stress among employees coming to work leading to reduced working hours or productivity option 4 Absenteeism among the employees due to lockdown option 5 Absenteeism due to family members/child care option 6 None of these`,
        `Question number 21 If the business is highly dependent on Information Technology (IT), has it prepared for / or reviewed existing strategies for possible cyber security threats to the business? option1  Yes  option 2 No option 3 There is no awareness on such threats option 4 Not Applicable`,
        `Question number 22 Is the business using technology and /or innovative IT solutions (Digital transaction, virtual office, remote learning, virtual visits/tours, telemedicine, webinar, mobile application) to manage the disruptions or ensure business continuity? option1  'Yes, most of these  option 2 Some of these option 3No, there has not been any thought about these before option 4 Not applicable for the business`,
        `Question number 23 Is there any impact on the business operations due to disruption in basic utility services like electricity, gas, water, telecommunication (mobile, telephone, internet), banking and postal service in your area? option1 Business is highly impacted  option 2 Business is somewhat impacted option 3 Business had minimal impact option 4 No impact on the business`,
        `Question number 24 What kind of supply chain (flow of goods and services linking manufacturer, vendor/supplier, and customer) issues have affected the business? multiple answers can be selected option1 Goods and services have sold out or are unavailable  option 2 Vendors/suppliers/raw materials/products have been inaccessible or unavailable option 3 Logistics/transport issues option 4 No current impact on supply chain`,
        `Question number 25 Which of these are being promoted in the business for COVID-19 pandemic safety? multiple answers can be selected option1 Workplace sanitisation (e.g. increased cleaning of surfaces, installation of hand sanitising units, etc)  option 2 Promoting of good hygiene among staff (wearing mask, washing hands) option 3 Regular temperature checks of employees and customers option 4 Maintaining physical distancing at work place  (e.g. marking the floor to indicate distance between customers and staff, retrofitting of front desks to increase distance between people, etc) option 5 Provision of office transportation facilities to work for employees option 6 Staggering work shifts or introducing work from home policies to minimize employee density in the business/ office option 7 None of these`,
        `Question number 26 How do you describe the equipment and machinery status which are indispensable to the business? option1 There is no access to the office/manufacturing unit/warehouse/store/other establishment  option 2 There is no Annual Maintenance Contract (AMC) and many of the machinery/ equipment need regular maintenance option 3 There is an Annual Maintenance Contract (AMC) in place for most of the machinery/ equipment option 4 The business is not dependent on any such machinery/ equipment which may be rendered unserviceable due to lack of maintenance option 5 The business is not dependent on any such machinery/ equipment`,
        `Question number 27 What kind of existing financial liabilities did the business have before COVID-19 pandemic? multiple answers can be selected option1 High operational cost option 2 Pending taxes, cess, interest due to change in government’s financial policies (custom duty, tax, import/export regulations, etc.) option 3 Existing debt/ loans/ or any other financial burden option 4 None of these`,
        `Question number 28 How long can the business continue to operate with its present financial position (asset, shares, cash, government support)? option1 It cannot continue any further  option 2 It can sustain for 1-2 month option 3 It can sustain for 3-6 months option 4 It can sustain for 6 -12 months`,
        `Question number 29 Is the business insured ? option1 The business is insured with disaster insurance cover that includes pandemics  option 2 The business is insured with disaster insurance but it does not cover pandemics  option 3 Only a part of the business is insured for disasters and pandemics option 4 The business currently does not have or has never purchased any insurance option 5 The business does not have access to any insurance`,
        `Question number 30 What does the business insurance cover? multiple answers can be selected option1 Earthquakes  option 2 Floods option 3 Fires option 4 Cyclones/typhoons/tornados option 5 Pandemics/outbreaks/epidemics/endemics option 6 Terrorist attacks option 7 Volcanoes option 8 Droughts option 9 Crop damages option 10 Others option 11 None of these`,
        `Question number 31 How effective has been the government's COVID-19 stimulus package for the business? option1 Very effective  option 2 Somewhat effective option 3 Not effective option 4No such package by the government provided or accessed yet option 5 The business is not eligible for such package(s) option 6 There is no awareness of such packages`,
        `Question number 32 What is the impact of any lockdown on the business? option1 The business has completely shut down option 2 Business is operating at minimum capacity after an initial shutdown  option 3 Business is operating at reduced capacity without any shutdown option 4 Business is operating at full capacity after an initial shutdown option 5 No impact on business operations / There was no lockdown`,
        `Question number 33 What has been the impact of the government's regulations on the business? multiple answers can be selected option1 Difficult to procure raw materials and other supplies  option 2 Difficult to sell products in the market / accessing customers option 3 Delay in approval and quality checking of new products  option 4 Increase in cost of using public utilities (e.g. electricity, water, etc) option 5 Shortage/unavailability/ rise in cost of human resource option 6 None whatsoever`,
        `Question number 34 Under the COVID-19 scenario which of these market conditions are true for the business? multiple answers can be selected option1 There is a drop in consumer demand  option 2 Reliance on traditional/manual methods for customer outreach instead of digital platforms/ e-commerce option 3 No scope for diversifying products and services to take advantage of the change in market demand  option 4 The physical market is now in a high-risk zone and it has become unserviceable option 5 The market has become more competitive option 6 Inability to communicate with clients and suppliers option 7 None of these`,
        `Question number 35 Which of these hazards have a high likelihood of impacting the business in near future? multiple answers can be selected option1 Earthquakes  option 2 Cyclones/typhoons/storms and wind damage option 3 Floods option 4 Landslides  option 5 Industrial fires/forest fires option 6 Droughts option 7 Heat waves/cold waves option 8 Chemical leaks option 9 Conflicts and social unrests option 10 None of these`,
    ];

    // const questionArray = [
    //     { que: 'Select business type?', type: 'select', options: [{ name: 'Manufacturing' }, { name: 'Transportation and Supply Chain' }, { name: 'Hospitality' }, { name: 'Food and Beverage' }, { name: 'Software/IT ' }, { name: 'Construction and Real estate' }, { name: 'Agribusiness' }, { name: 'Consultancy' }, { name: 'Education' }, { name: 'Travel and Tourism' }, { name: 'Media and Entertainment' }, { name: 'Electronics and Telecommunication' }, { name: 'Healthcare' }, { name: 'Microfinance institutions' }, { name: 'Retail and Wholesale' }, { name: 'NGO/NPO' }] },
    //     { que: 'Are you one of the owners of the business?', type: 'radio', options: [{ name: 'Yes' }, { name: 'No' }] },
    //     { que: 'Is one of the owners of the business a female?', type: 'radio', options: [{ name: 'Yes' }, { name: 'No' }] },
    //     { que: 'What is the total number of offices/manufacturing units/stores/ warehouses the business has?', type: 'textinput' },
    //     { que: 'What is the business’s annual revenue (in local currency)?', type: 'textinput' },
    //     { que: 'What is the total number of staff/employees/workers the business has?', type: 'textinput' },
    //     { que: 'Type of business?', type: 'select', options: [{ name: 'Sole proprietor' }, { name: 'Partnership' }, { name: 'Limited Liability Company' }, { name: 'Corporation' }, { name: 'Cooperative / Trust / Society' }, { name: 'Not yet registered' }, { name: 'NGO/NPO' }] },
    //     { que: 'Country?', type: 'select' },
    //     { que: 'Province?', type: 'select' },
    //     { que: 'Postal/Zip/Pin code? (optional)', type: 'textinput' },

    //     { que: 'Does the business have a Business Continuity Plan (BCP)?', type: 'radio', options: [{ name: 'Yes, It has a plan and it considers health emergencies (pandemic/outbreak)' }, { name: 'Yes, It has a plan but it does not consider health emergencies (pandemic/outbreak)' }, { name: 'It does not have a Business Continuity Plan' }, { name: 'I am unaware of the term "Business Continuity Plan"' }, { name: `I don’t know if it has a BCP.` }] },
    //     { que: `Has the business implemented its Business Continuity Plan (BCP)?`, type: 'radio', options: [{ name: 'Yes (fully)' }, { name: 'Yes (partly)' }, { name: 'No' }], conditional: true },
    //     { que: `What has been COVID-19's impact on the business? `, type: 'checkbox', options: [{ title: 'Impact on production and services', innerOptions: ['Increase', ' Decline', ' No change'] }, { title: 'Impact on market access', innerOptions: ['Increase', 'Decline', 'No change'] }, { title: 'Impact on cashflow and sales', innerOptions: ['Increase', 'Decline', 'No change'] }, { title: 'Overall impact on employees (e.g. productivity, retention)', innerOptions: ['Positive', 'Negative', 'Mixed', 'No change'] }] },
    //     { que: 'How long do you think it will take for the business to fully recover from the present situation?', type: 'radio', options: [{ name: 'Already fully recovered' }, { name: 'Less than 6 months' }, { name: 'Between 6 months to 1 year' }, { name: 'More than 1 year' }, { name: 'Not sure/Cannot predict' }] },

    //     { que: 'How worried are you that the business operations would be impacted by employee unavailability or absenteeism?', type: 'radio', options: [{ name: 'Not at all worried as most of the systems are automated or employees are available', score: 0 }, { name: 'Not so worried as family members and/or friends can or are filling any employee shortages', score: 1 }, { name: 'Worried as the business relies on employees and the business has no other support', score: 2 }] },
    //     { que: `Are the employees permanent/regular or temporary? \n (Permanent means no fixed end date of employment/have access to superannuation and eligible for company benefits such as pension fund, employer contribution; and Temporary means they are paid by a daily wage or short term contract).`, type: 'radio', options: [{ name: 'All of the employees are permanent or come from amongst the family members', score: 0 }, { name: 'Majority of the employees are permanent or come from amongst the family members (more than 50%)', score: 1 }, { name: 'Approximately there are equal numbers of permanent and temporary employees', score: 1 }, { name: 'Majority of the employees are temporary (more than 50%)', score: 2 }, { name: 'All of the employees are temporary', score: 3 }] },
    //     { que: 'How would you describe most of the employees in the business? ', multipleText: true, type: 'checkbox', options: [{ name: 'Family members' }, { name: `Friends and neighbours` }, { name: 'Seasonal / Migrant workers / Casual workers / Daily wagers' }, { name: 'Others' }] },
    //     { que: 'What are the actions the business has  taken /or efforts made to ensure the well-being of the employees? ', multipleText: true, type: 'checkbox', options: [{ name: 'Employees may work remotely/ office space transformed to minimise physical contact', score: 1 }, { name: `Management regularly engages with employee and effectively communicates with them on company's position to COVID-19 and its possible implications`, score: 1 }, { name: 'Management periodically conducts employee support programs to help them with mental and physical wellbeing', score: 1 }, { name: 'Management encourages employees to acquire new skill sets and knowledge to fill in for other employees who are unable to come to work and/or to increase their personal skills', score: 1 }, { name: 'Management guaranteeing income/salary of the employees even if the business has to temporarily close or downsize the operation.', score: 1 }, { name: 'None of these', score: 5 }] },
    //     { que: 'Does the business require close physical contact or distance with people?', type: 'radio', options: [{ name: 'a. Close physical distance to customers and clients (shops, restaurants etc.)', score: 1 }, { name: 'b. Close physical distance to other employees (manufacturing units, shops, etc.)', score: 1 }, { name: 'c. Both a & b', score: 2 }, { name: 'd. None of these', score: 0 }] },
    //     { que: 'What kind of Human Resource issues is the business facing due to COVID-19 pandemic? ', multipleText: true, type: 'checkbox', options: [{ name: 'Absenteeism among the employees due to concern over the use of public transportation irrespective of lockdown' }, { name: 'Migration leading to shortage of daily wage workers' }, { name: 'Absenteeism caused by mental and physical stress among employees coming to work leading to reduced working hours or productivity' }, { name: 'Absenteeism among the employees due to lockdown' }, { name: 'Absenteeism due to family members/child care' }, { name: 'None of these' }] },

    //     { que: 'If the business is highly dependent on Information Technology (IT), has it prepared for / or reviewed existing strategies for possible cyber security threats to the business?', type: 'radio', options: [{ name: 'Yes', score: 1 }, { name: 'No', score: 2 }, { name: 'There is no awareness on such threats', score: 2 }, { name: 'Not applicable', score: 0 }] },
    //     { que: 'Is the business using technology and /or innovative IT solutions (Digital transaction, virtual office, remote learning, virtual visits/tours, telemedicine, webinar, mobile application) to manage the disruptions or ensure business continuity?', type: 'radio', options: [{ name: 'Yes, most of these', score: 1 }, { name: 'Some of these', score: 2 }, { name: 'No, there has not been any thought about these before', score: 3 }, { name: 'Not applicable for the business', score: 0 }] },
    //     { que: 'Is there any impact on the business operations due to disruption in basic utility services like electricity, gas, water, telecommunication (mobile, telephone, internet), banking and postal service in your area?', type: 'radio', options: [{ name: 'Business is highly impacted', score: 3 }, { name: 'Business is somewhat impacted', score: 2 }, { name: 'Business had minimal impact', score: 1 }, { name: 'No impact on the business', score: 0 }] },
    //     { que: 'What kind of supply chain (flow of goods and services linking manufacturer, vendor/supplier, and customer) issues have affected the business? ', multipleText: true, type: 'checkbox', options: [{ name: 'Goods and services have sold out or are unavailable', score: 1 }, { name: 'Vendors/suppliers/raw materials/products have been inaccessible or unavailable', score: 1 }, { name: 'Logistics/transport issues', score: 1 }, { name: 'No current impact on supply chain', score: 0 }] },
    //     { que: 'Which of these are being promoted in the business for COVID-19 pandemic safety? ', multipleText: true, type: 'checkbox', options: [{ name: 'Workplace sanitisation (e.g. increased cleaning of surfaces, installation of hand sanitising units, etc)', score: 1 }, { name: 'Promoting of good hygiene among staff (wearing mask, washing hands)', score: 1 }, { name: 'Regular temperature checks of employees and customers', score: 1 }, { name: 'Maintaining physical distancing at work place  (e.g. marking the floor to indicate distance between customers and staff, retrofitting of front desks to increase distance between people, etc)', score: 1 }, { name: 'Provision of office transportation facilities to work for employees', score: 1 }, { name: 'Staggering work shifts or introducing work from home policies to minimize employee density in the business/ office', score: 1 }, { name: 'None of these', score: 5 }] },
    //     { que: 'How do you describe the equipment and machinery status which are indispensable to the business?', type: 'radio', options: [{ name: 'There is no access to the office(s)/manufacturing unit(s)/warehouse(s)/store(s)/other establishment(s)', score: 3 }, { name: 'There is no Annual Maintenance Contract (AMC) and many of the machinery/ equipment need regular maintenance', score: 3 }, { name: 'There is an Annual Maintenance Contract (AMC) in place for most of the machinery/ equipment', score: 2 }, { name: 'The business is not dependent on any such machinery/ equipment which may be rendered unserviceable due to lack of maintenance', score: 1 }, { name: 'The business is not dependent on any such machinery/ equipment', score: 0 }] },
    //     { que: 'What kind of existing financial liabilities did the business have before COVID-19 pandemic? ', multipleText: true, type: 'checkbox', options: [{ name: 'High operational cost', score: 1 }, { name: 'Pending taxes, cess, interest due to change in government’s financial policies (custom duty, tax, import/export regulations, etc.)', score: 1 }, { name: 'Existing debt/ loans/ or any other financial burden', score: 1 }, { name: 'None of these', score: 0 }] },
    //     { que: 'How long can the business continue to operate with its present financial position (asset, shares, cash, government support)?', type: 'radio', options: [{ name: 'It cannot continue any further', score: 4 }, { name: 'It can sustain for 1-2 month', score: 3 }, { name: 'It can sustain for 3-6 months', score: 2 }, { name: 'It can sustain for 6 -12 months', score: 1 }] },
    //     { que: 'Is the business insured?', type: 'radio', options: [{ name: 'The business is insured with disaster insurance cover that includes pandemics', score: 0 }, { name: 'The business is insured with disaster insurance but it does not cover pandemics', score: 1 }, { name: 'Only a part of the business is insured for disasters and pandemics', score: 2 }, { name: 'The business currently does not have or has never purchased any insurance', score: 3 }, { name: 'The business does not have access to any insurance', score: 3 }] },
    //     { que: 'What does the business insurance cover?', type: 'checkbox', options: [{ name: 'Earthquakes' }, { name: 'Floods' }, { name: 'Fires' }, { name: 'Cyclones/typhoons/tornados' }, { name: 'Pandemics/outbreaks/epidemics/endemics' }, { name: 'Terrorist attacks' }, { name: 'Volcanoes' }, { name: 'Droughts' }, { name: 'Crop damages' }, { name: 'Others' }, { name: 'None of these' }] },
    //     { que: `How effective has been the government's COVID-19 stimulus package for the business?`, type: 'radio', options: [{ name: 'Very effective', score: 0 }, { name: 'Somewhat effective', score: 1 }, { name: 'Not effective', score: 2 }, { name: 'No such package by the government provided or accessed yet', score: 2 }, { name: 'The business is not eligible for such package(s)', score: 2 }, { name: 'There is no awareness of such packages', score: 2 }] },
    //     { que: 'What is the impact of any lockdown on the business?', type: 'radio', options: [{ name: 'The business has completely shut down', score: 3 }, { name: 'Business is operating at minimum capacity after an initial shutdown', score: 2 }, { name: 'Business is operating at reduced capacity without any shutdown', score: 1 }, { name: 'Business is operating at full capacity after an initial shutdown', score: 1 }, { name: 'No impact on business operations / There was no lockdown', score: 0 }] },
    //     { que: `What has been the impact of the government's regulations on the business? `, multipleText: true, type: 'checkbox', options: [{ name: 'Difficult to procure raw materials and other supplies', score: 1 }, { name: 'Difficult to sell products in the market / accessing customers', score: 1 }, { name: 'Delay in approval and quality checking of new products', score: 1 }, { name: 'Increase in cost of using public utilities (e.g. electricity, water, etc)', score: 1 }, { name: 'Shortage/Unavailability/ rise in cost of human resource', score: 1 }, { name: 'None whatsoever', score: 0 }] },
    //     { que: 'Under the COVID-19 scenario which of these market conditions are true for the business? ', multipleText: true, type: 'checkbox', options: [{ name: 'There is a drop in consumer demand', score: 1 }, { name: 'Reliance on traditional/manual methods for customer outreach instead of digital platforms/ e-commerce', score: 1 }, { name: 'No scope for diversifying products and services to take advantage of the change in market demand', score: 1 }, { name: 'The physical market is now in a high-risk zone and it has become unserviceable', score: 1 }, { name: 'The market has become more competitive', score: 1 }, { name: 'Inability to communicate with clients and suppliers', score: 1 }, { name: 'None of these', score: 0 }] },
    //     { que: 'Which of these hazards have a high likelihood of impacting the business in near future? ', multipleText: true, type: 'checkbox', options: [{ name: 'Earthquakes', score: 1 }, { name: 'Cyclones/typhoons/storms and wind damages', score: 1 }, { name: 'Floods', score: 1 }, { name: 'Landslides', score: 1 }, { name: 'Industrial fires/forest fires', score: 1 }, { name: 'Droughts', score: 1 }, { name: 'Heat waves/cold waves', score: 1 }, { name: 'Chemical leaks', score: 1 }, { name: 'Conflicts and social unrests', score: 1 }, { name: 'None of these', score: 0 }] },
    // ]

    let spaa = [
        `número de pregunta 1  ¿Seleccionar tipo de negocio? opción 1 Agribusiness  opción 2  Construcción e Inmobiliaria opción 3 Consultoría  opción 4 Educación  opción 5 Electrónica y Telecomunicación  opción 6 Alimentos y bebidas opción 7  Cuidado de la salud opción 8 Hospitalidad opción 9  Fabricación  opción 10 Medios de comunicación y entretenimiento  opción 11 Instituciones microfinancieras  opción 12 Minorista y mayorista  opción 13  Software / Tecnología de información opción 14 Transporte y cadena de suministro  opción 15  Viaje y Turismo opción 16 ONG / NPO`,
        `número de pregunta 2  ¿Es usted uno de los dueños del negocio? opción1  Sí  opción 2 No`,
        `número de pregunta 3   ¿Alguno de los dueños del negocio es mujer? opción1 Sí  opción 2 No`,
        `número de pregunta 4   ¿Cuál es el número total de oficinas / unidades de fabricación / tiendas / almacenes que tiene la empresa?`,
        `número de pregunta 5  ¿Cuáles son los ingresos anuales de la empresa (en moneda local)?`,
        `número de pregunta 6   ¿Cuál es la cantidad total de personal / empleados / trabajadores que tiene la empresa?`,
        `número de pregunta 7  ¿ Tipo de negocio ? opción1 Cooperativa / Fideicomiso / Sociedad  opción 2 Corporación  opción 3 De responsabilidad limitada opción 4 Empresa aún no registrada opción 5 Alianza empresarial opción 6  Propietario único opcións 7 ONG / NPO `,
        `número de pregunta 8  ¿Seleccionar país ?`,
        `número de pregunta 9  ¿Seleccionar provincia?`,
        `número de pregunta 10  ¿Código postal / postal / PIN?`,
        `número de pregunta 11  ¿Tiene la empresa un Plan de Continuidad Comercial (BCP)? opción1 Sí, tiene plan y toma en cuenta emergencias sanitarias (pandemia / brote)  opción 2 Sí, tiene plan pero no toma en cuenta emergencias de salud (pandemia / brote) opción 3 No cuenta con Plan de Continuidad Comercial" opción 4 No conozco el término "Plan de continuidad comercial" opción 5 No sé si tiene BCP.`,
        `número de pregunta 12 ¿La empresa ha implementado su Plan de Continuidad del Negocio (BCP)? opción1   Sí (completamente) opción 2 Sí (en parte) opción 3 No`,
        `número de pregunta 13  ¿Cuál ha sido el impacto de COVID-19 en el negocio? 1 Impacto en la producción y los servicios opción1 Incremento opción2 Disminución opción3 Ningún cambio  2 Impacto en el acceso al mercado opción1 Incremento opción2 Disminución opción3 Ningún cambio  3 Impacto en el flujo de caja y ventas opción1 Incremento opción2 Disminución opción3 Ningún cambio  4  Impacto general en los empleados (productividad, retención) opción1 Positivo opción2 Negativo opción3 Mezclado opción 4 Ningún cambio`,
        `número de pregunta 14  ¿Cuánto tiempo cree que le llevará a la empresa recuperarse por completo de la situación actual? opción1  Ya completamente recuperado  opción 2  Menos de 6 meses opción 3 Entre 6 meses y 1 año opción 4 Más de 1 año opción 5  No estoy seguro / No puedo predecir`,
        `número de pregunta 15 ¿Qué tanto le preocupa que sus operaciones empresariales o comerciales resulten afectadas debido al absentismo o a la falta de disponibilidad de los empleados? opción1 Sin preocupación, ya que la mayoría de los sistemas están automatizados o los empleados están disponibles.  opción 2 No me preocupa mucho, ya que mis familiares y amigos pueden o ya están llenando los vacíos por la escasez de empleados. opción 3 Me preocupa, ya que la empresa depende de los empleados y no cuenta con ningún otro apoyo. `,
        `número de pregunta 16 ¿Son los empleados permanentes/regulares o temporales? (Permanente significa que no tienen una fecha fija para dejar de trabajar/tienen acceso a sus pensiones y reúnen los requisitos necesarios para obtener beneficios y prestaciones de la empresa, tales como fondos de pensión, contribuciones del empleador, etc., mientras que temporal significa que se les paga una remuneración diaria o tienen un contrato de corto plazo). opción1 Todos los empleados son permanentes o son miembros de la familia opción 2  La mayoría de los empleados son permanentes o son miembros de la familia (más del 50%).  opción 3 Hay aproximadamente una cantidad igual de empleados permanentes y temporales.  opción 4 La mayoría de los empleados son temporales (más del 50%).  opción 5 Todos los empleados son temporales. `,
        `número de pregunta 17 ¿Cómo describiría a la mayoría de los empleados de la empresa? (Se pueden escoger varias respuestas). opción1 Familiares  opción 2 Amigos y vecinos opción 3 Trabajadores migrantes/ estacionales / ocasionales / con un sueldo diario. opción 4 Otros `,
        `número de pregunta 18 ¿Cuáles son las medidas que ha tomado o los esfuerzos que ha realizado la empresa para velar por el bienestar de los empleados? (Se pueden escoger varias respuestas). opción1 Los empleados pueden trabajar de forma remota/ espacio de oficina que se ha transformado de forma tal que se minimiza el contacto físico. opción 2 La gerencia interactúa con regularidad con los empleados y se comunica eficazmente con ellos sobre la posición de la empresa frente al COVID-19 y sus posibles implicaciones. opción 3 Cada cierto tiempo, la gerencia ejecuta programas de apoyo a los empleados para ayudarles con su bienestar físico y mental.  opción 4 La gerencia anima a los empleados a adquirir nuevas destrezas y conocimiento, a fin de sustituir a otros empleados que no puedan presentarse a trabajar o para desarrollar sus habilidades personales.  opción 5 La gerencia garantiza los ingresos/los salarios de los empleados, aun si la empresa tiene que cerrar sus puertas temporalmente o reducir sus operaciones o actividades.  opción 6 Ninguna de las anteriores.`,
        `número de pregunta 19 ¿Requiere la empresa que haya una distancia o un contacto físico cercano con las personas?  opción 1  a. Un contacto físico cercano con los clientes y los usuarios (tiendas, restaurantes, etc.)   opción 2 b. Una distancia física cercana con otros empleados (unidades de producción o fabricación, talleres, etc.)  opción 3 c. Tanto a como b.  opción 4 d. Ninguna de las anteriores.`,
        `número de pregunta 20 ¿Qué tipo de problemas de recursos humanos está enfrentando la empresa debido a la pandemia del COVID-19? (Se pueden escoger varias respuestas).  opción1 Absentismo entre los empleados debido a preocupaciones relacionadas con el uso de transporte público, independientemente del cierre general o la cuarentena  opción 2 Emigración, lo que da origen a la falta de jornaleros.  opción 3 Absentismo ocasionado por la tensión física o emocional entre los empleados que se presentan a trabajar, lo que ocasiona que se reduzcan las horas de trabajo o la productividad.  opción 4 Absentismo entre los empleados debido al cierre general o la cuarentena.  opción 5 Absentismo por tener que cuidar a sus niños o familiares.  opción 6 Ninguna de las anteriores.`,
        `número de pregunta 21 Si esta empresa depende altamente de las tecnologías de información (TI), ¿ha elaborado o analizado estrategias para abordar posibles amenazas a su ciberseguridad?  opción1  Sí  opción 2 No opción 3 No se tiene conocimiento sobre estas amenazas opción 4 No es pertinente.`,
        `número de pregunta 22 ¿Está la empresa utilizando tecnología y soluciones innovadoras de tecnologías de información (TI), tales como transacciones digitales, oficinas virtuales, aprendizaje a distancia, visitas/ giras virtuales, telemedicina, seminarios en línea y aplicaciones móviles, para abordar las interrupciones o velar por la continuidad empresarial?  opción1  Sí, la mayoría de estas.  opción 2 Algunas de estas opción 3 No, no se ha pensado en esta posibilidad.  opción 4 No es pertinente para esta empresa.`,
        `número de pregunta 23 ¿Ha surgido algún impacto en las operaciones o actividades de la empresa debido a una interrupción en los servicios básicos, tales como electricidad, gas, agua, telecomunicaciones (teléfonos celulares, Internet, líneas telefónicas fijas), servicios bancarios y postales en su área?  opción1 La empresa ha resultado sumamente afectada.  opción 2 La empresa ha resultado afectada hasta cierto punto.  opción 3 La empresa ha experimentado un impacto mínimo. opción 4 La empresa no ha experimentado ningún impacto.`,
        `número de pregunta 24 ¿Qué tipo de problemas en la cadena de suministro (movimiento de bienes y servicios, vínculos entre el fabricante, el proveedor/ distribuidor y el cliente) han repercutido en la empresa? (Se pueden escoger varias respuestas). opción 1 Los bienes y servicios están agotados o no están disponibles  opción 2 Los distribuidores/ proveedores/materias primas/ productos no han estado disponibles o accesibles.  opción 3 Hay problemas logísticos/de transporte. opción 4 Actualmente, no se experimenta ningún impacto en la cadena de suministro. `,
        `número de pregunta 25 ¿Cuáles de estas medidas se están promoviendo para la seguridad en la empresa debido a la pandemia del COVID-19? (Se pueden escoger varias respuestas). opción 1 Hay tareas para desinfectar el lugar de trabajo (por ejemplo, se limpian más las superficies, se instalan unidades de desinfectantes de manos, etc.)  opción 2 Se promueve una higiene adecuada entre el personal (el uso de máscaras, lavado frecuente de manos, etc.)  opción 3 Se toma con regularidad la temperatura de los empleados y los clientes. opción 4 Se mantiene una distancia física en el lugar de trabajo (por ejemplo, se colocan marcas en el suelo para indicar cuál debe ser la distancia entre los clientes y el personal, se reacondiciona el área de la recepción para aumentar la distancia entre las personas, etc.)  opción 5 Se pone a disposición servicios de transporte a la oficina para los empleados. opción 6 Hay horarios laborales escalonados o se introducen políticas para trabajar a distancia (desde la casa), a fin de minimizar la cantidad de empleados en la empresa/ la oficina. opción 7 Ninguna de las anteriores.`,
        `número de pregunta 26 ¿De qué forma describe la condición del equipo y la maquinaria que son indispensables para la empresa? opción1 No hay acceso a la/las oficina(s)/ unidad(es) de producción/ bodega(s) /tienda(s)/otra(s) instalaciones(s).   opción 2 No hay un contrato de mantenimiento anual (CMA) y gran parte del equipo/ la maquinaria necesita mantenimiento con regularidad.  opción 3 Hay un contrato de mantenimiento anual (CMA) para la mayor parte del equipo/ la maquinaria.  opción 4 La empresa no depende actualmente de este tipo de equipo/ maquinaria, que podría quedar inservible debido a la falta de mantenimiento.  opción 5 ●	La empresa no depende de ningún tipo de este equipo/ maquinaria.`,
        `número de pregunta 27 ¿Qué tipo de pasivos u obligaciones financieras tenía la empresa antes de la pandemia del COVID-19? (Se pueden escoger varias respuestas). (Se pueden escoger varias respuestas) opción 1 Un alto costo operativo. opción 2 Impuestos pendientes, intereses por cambios en las políticas financieras del gobierno (derechos de aduana, impuestos, regulaciones a las importaciones y exportaciones, etc.) opción 3 Deudas/préstamos existentes o cualquier otra carga financiera.  opción 4 Ninguna de las anteriores.`,
        `número de pregunta 28 ¿Por cuánto tiempo puede funcionar la empresa con su situación financiera actual (activos, acciones, efectivo, ayuda del gobierno)? opción 1 Ya no puede continuar.  opción 2 Puede mantener sus operaciones durante 1-2 meses. opción 3 Puede mantener sus operaciones durante 3-6 meses. opción 4 Puede mantener sus operaciones durante 6 -12 meses.`,
        `número de pregunta 29 ¿Está asegurada la empresa? opción 1 La empresa está asegurada con una cobertura en caso de desastres, la cual incluye pandemias. opción 2 La empresa está asegurada con una cobertura en caso de desastres, pero no incluye pandemias.  opción 3 Solo una parte de la empresa está asegurada en caso de desastres y pandemias.  opción 4 Actualmente, la empresa no tiene o nunca ha adquirido un seguro.  opción 5 La empresa no tiene acceso a ningún seguro. `,
        `número de pregunta 30 ¿Qué cubre el seguro de la empresa? (Se pueden escoger varias respuestas). opción 1 Terremotos.  opción 2 Inundaciones. opción 3 Incendios. opción 4 Ciclones/ tifones/ tornados. opción 5 Pandemias/ brotes/ epidemias/ endemias. opción 6 Ataques terroristas opción 7 Actividades volcánicas. opción 8 Sequías. opción 9 Daños a cultivos. opción 10 Otros. opción 11 Ninguna de las anteriores.`,
        `número de pregunta 31 ¿Qué tan eficaz ha sido el paquete de estímulo del gobierno para las empresas debido al COVID-19?  opción 1 Muy eficaz.  opción 2 Algo eficaz. opción 3 No ha sido eficaz. opción 4 El gobierno no ha ofrecido este tipo de paquete o todavía no se tiene acceso al mismo.  opción 5 La empresa no reúne los requisitos necesarios para obtener este/estos paquete(s).  opción 6 No se tiene conocimiento sobre estos paquetes. `,
        `número de pregunta 32 ¿Cuáles son los efectos de un cierre general o cuarentena en la empresa?  opción 1 La empresa ha tenido que cerrar totalmente.  opción 2 La empresa está funcionando a una capacidad mínima después del cierre inicial.   opción 3  La empresa está funcionando a una capacidad reducida sin ningún cierre opción 4 La empresa está funcionando a capacidad plena después de un cierre inicial.  opción 5 No se ha experimentado ningún impacto en las actividades u operaciones de la empresa / no hubo ningún cierre. `,
        `número de pregunta 33 ¿Cuáles han sido los efectos de las regulaciones del gobierno en la empresa? (Se pueden escoger varias respuestas). opción 1 Dificultades para adquirir materia prima y otros suministros.   opción 2 Dificultades para vender productos en el mercado/ tener acceso a clientes.  opción 3 Retrasos en las aprobaciones y el control de calidad de nuevos productos.  opción 4 Aumento en el costo del uso de servicios públicos (por ejemplo, electricidad, agua, etc.)  opción 5 Escasez/ indisponibilidad/ aumento en el costo de los recursos humanos.  opción 6 Ningún efecto. `,
        `número de pregunta 34 Bajo el escenario del COVID-19, ¿cuáles de estas condiciones de mercado son pertinentes para la empresa? (Se pueden escoger varias respuestas). opción 1 Se observa una menor demanda de los consumidores.   opción 2 Se recurre a métodos manuales/tradicionales para llegar a los clientes, en lugar de plataformas digitales/ comercio electrónico. opción 3 No hay margen para diversificar productos y servicios, y aprovechar los cambios en la demanda del mercado.  opción 4 Ahora, el mercado físico se encuentra en una zona de alto riesgo y no es apto.  opción 5 El mercado ahora es más competitivo.  opción 6 No hay capacidad para comunicarse con los clientes y los proveedores.  opción 7 Ninguna de las anteriores.`,
        `número de pregunta 35 ¿Cuáles de estas amenazas presentan una alta probabilidad de repercutir en la empresa en el futuro inmediato? (Se pueden escoger varias respuestas). opción1 Terremotos.  opción 2 Ciclones/ tifones/ tormentas y daños debido a vientos.  opción 3  Inundaciones. opción 4 Derrumbes.  opción 5 Incendios industriales/ forestales. opción 6 Sequías. opción 7 Olas de calor/ frío  opción 8 Fuga de productos químicos. opción 9 Conflictos y disturbios sociales. opción 10 Ninguna de las anteriores.`,
    ];

    // const spQuestionArray = [
    //     { que: '¿Seleccionar tipo de negocio?', type: 'select', options: [{ name: 'Fabricación' }, { name: 'Transporte y cadena de suministro' }, { name: 'Hospitalidad' }, { name: 'Alimentos y bebidas' }, { name: 'Software / Tecnología de información ' }, { name: 'Construction and Real estate' }, { name: 'Agroindustria' }, { name: 'Consultoría' }, { name: 'Educación' }, { name: 'Viaje y Turismo' }, { name: 'Medios de comunicación y entretenimiento' }, { name: 'Electrónica y Telecomunicación' }, { name: ' Cuidado de la salud' }, { name: 'Instituciones microfinancieras' }, { name: 'Minorista y mayorista' }, { name: 'ONG / NPO' }] },
    //     { que: '¿Es usted uno de los dueños del negocio?', type: 'radio', options: [{ name: 'Si' }, { name: 'No' }] },
    //     { que: '¿Alguno de los dueños del negocio es mujer?', type: 'radio', options: [{ name: 'Si' }, { name: 'No' }] },
    //     { que: '¿Cuál es el número total de oficinas / unidades de fabricación / tiendas / almacenes que tiene la empresa?', type: 'textinput' },
    //     { que: '¿Cuáles son los ingresos anuales de la empresa (en moneda local)?', type: 'textinput' },
    //     { que: '¿Cuál es la cantidad total de personal / empleados / trabajadores que tiene la empresa?', type: 'textinput' },
    //     { que: '¿ Tipo de negocio ?', type: 'select', options: [{ name: 'Propietario único' }, { name: 'Alianza empresarial' }, { name: 'De responsabilidad limitada' }, { name: 'Corporación' }, { name: 'Cooperativa / Fideicomiso / Sociedad' }, { name: 'Empresa aún no registrada' }, { name: 'ONG / NPO' }] },
    //     { que: '¿Seleccionar país ?', type: 'select' },
    //     { que: '¿Seleccionar provincia?', type: 'select' },
    //     { que: '¿Código postal / postal / PIN?', type: 'textinput' },

    //     { que: ' ¿Tiene la empresa un Plan de Continuidad Comercial (BCP)?', type: 'radio', options: [{ name: ' Sí, tiene plan y toma en cuenta emergencias sanitarias (pandemia / brote)' }, { name: 'Sí, tiene plan pero no toma en cuenta emergencias de salud (pandemia / brote)' }, { name: 'No cuenta con Plan de Continuidad Comercial' }, { name: 'No conozco el término "Plan de continuidad comercial"' }, { name: `No sé si tiene BCP.` }] },
    //     { que: `¿La empresa ha implementado su Plan de Continuidad del Negocio (BCP)?`, type: 'radio', options: [{ name: 'Sí (completamente)' }, { name: 'Sí (en parte)' }, { name: 'No' }], conditional: true },
    //     { que: ` ¿Cuál ha sido el impacto de COVID-19 en el negocio?`, type: 'checkbox', options: [{ title: 'Impacto en la producción y los servicios', innerOptions: ['Incremento', ' Disminución', ' Ningún cambio'] }, { title: 'Impacto en el acceso al mercado', innerOptions: ['Incremento', 'Disminución', 'Ningún cambio'] }, { title: 'Impacto en el flujo de caja y ventas', innerOptions: ['Incremento', 'Disminución', 'Ningún cambio'] }, { title: ' Impacto general en los empleados (productividad, retención)', innerOptions: ['Positivo', 'Negativo', 'Mezclado', 'Ningún cambio'] }] },
    //     { que: '¿Cuánto tiempo cree que le llevará a la empresa recuperarse por completo de la situación actual?', type: 'radio', options: [{ name: 'Ya completamente recuperado' }, { name: 'Menos de 6 meses' }, { name: 'Entre 6 meses y 1 año' }, { name: ' Más de 1 año' }, { name: 'No estoy seguro / No puedo predecir' }] },

    //     { que: '¿Qué tanto le preocupa que sus operaciones empresariales o comerciales resulten afectadas debido al absentismo o a la falta de disponibilidad de los empleados? ', type: 'radio', options: [{ name: 'Sin preocupación, ya que la mayoría de los sistemas están automatizados o los empleados están disponibles.', score: 0 }, { name: 'No me preocupa mucho, ya que mis familiares y amigos pueden o ya están llenando los vacíos por la escasez de empleados', score: 1 }, { name: 'Me preocupa, ya que la empresa depende de los empleados y no cuenta con ningún otro apoyo.', score: 2 }] },
    //     { que: `¿Son los empleados permanentes/regulares o temporales? (Permanente significa que no tienen una fecha fija para dejar de trabajar/tienen acceso a sus pensiones y reúnen los requisitos necesarios para obtener beneficios y prestaciones de la empresa, tales como fondos de pensión, contribuciones del empleador, etc., mientras que temporal significa que se les paga una remuneración diaria o tienen un contrato de corto plazo). `, type: 'radio', options: [{ name: 'Todos los empleados son permanentes o son miembros de la familia', score: 0 }, { name: 'La mayoría de los empleados son permanentes o son miembros de la familia (más del 50%). ', score: 1 }, { name: 'Hay aproximadamente una cantidad igual de empleados permanentes y temporales. ', score: 1 }, { name: 'La mayoría de los empleados son temporales (más del 50%). ', score: 2 }, { name: 'Todos los empleados son temporales.', score: 3 }] },
    //     { que: '¿Cómo describiría a la mayoría de los empleados de la empresa? ', multipleText: true, type: 'checkbox', options: [{ name: 'Familiares' }, { name: `Amigos y vecinos` }, { name: 'Trabajadores migrantes/ estacionales / ocasionales / con un sueldo diario.' }, { name: 'Otros' }] },
    //     { que: '¿Cuáles son las medidas que ha tomado o los esfuerzos que ha realizado la empresa para velar por el bienestar de los empleados?  ', multipleText: true, type: 'checkbox', options: [{ name: 'Los empleados pueden trabajar de forma remota/ espacio de oficina que se ha transformado de forma tal que se minimiza el contacto físico.', score: 1 }, { name: `La gerencia interactúa con regularidad con los empleados y se comunica eficazmente con ellos sobre la posición de la empresa frente al COVID-19 y sus posibles implicaciones.`, score: 1 }, { name: 'Cada cierto tiempo, la gerencia ejecuta programas de apoyo a los empleados para ayudarles con su bienestar físico y mental.', score: 1 }, { name: 'La gerencia anima a los empleados a adquirir nuevas destrezas y conocimiento, a fin de sustituir a otros empleados que no puedan presentarse a trabajar o para desarrollar sus habilidades personales.', score: 1 }, { name: 'La gerencia garantiza los ingresos/los salarios de los empleados, aun si la empresa tiene que cerrar sus puertas temporalmente o reducir sus operaciones o actividades.', score: 1 }, { name: 'Ninguna de las anteriores.', score: 5 }] },
    //     { que: '¿Requiere la empresa que haya una distancia o un contacto físico cercano con las personas? ', type: 'radio', options: [{ name: 'a. Un contacto físico cercano con los clientes y los usuarios (tiendas, restaurantes, etc.) ', score: 1 }, { name: 'b. Una distancia física cercana con otros empleados (unidades de producción o fabricación, talleres, etc.) ', score: 1 }, { name: 'c. Tanto a como b', score: 2 }, { name: 'd. Ninguna de las anteriores.', score: 0 }] },
    //     { que: '¿Qué tipo de problemas de recursos humanos está enfrentando la empresa debido a la pandemia del COVID-19? ', multipleText: true, type: 'checkbox', options: [{ name: 'Absentismo entre los empleados debido a preocupaciones relacionadas con el uso de transporte público, independientemente del cierre general o la cuarentena.' }, { name: 'Emigración, lo que da origen a la falta de jornaleros.' }, { name: 'Absentismo ocasionado por la tensión física o emocional entre los empleados que se presentan a trabajar, lo que ocasiona que se reduzcan las horas de trabajo o la productividad.' }, { name: 'Absentismo entre los empleados debido al cierre general o la cuarentena.' }, { name: 'Absentismo por tener que cuidar a sus niños o familiares.' }, { name: 'Ninguna de las anteriores.' }] },

    //     { que: 'Si esta empresa depende altamente de las tecnologías de información (TI), ¿ha elaborado o analizado estrategias para abordar posibles amenazas a su ciberseguridad?', type: 'radio', options: [{ name: 'Sí.', score: 1 }, { name: 'No.', score: 2 }, { name: 'No se tiene conocimiento sobre estas amenazas', score: 2 }, { name: 'No es pertinente', score: 0 }] },
    //     { que: '¿Está la empresa utilizando tecnología y soluciones innovadoras de tecnologías de información (TI), tales como transacciones digitales, oficinas virtuales, aprendizaje a distancia, visitas/ giras virtuales, telemedicina, seminarios en línea y aplicaciones móviles, para abordar las interrupciones o velar por la continuidad empresarial? ', type: 'radio', options: [{ name: 'Sí, la mayoría de estas.', score: 1 }, { name: 'Algunas de estas.', score: 2 }, { name: 'No, no se ha pensado en esta posibilidad.', score: 3 }, { name: 'No es pertinente para esta empresa.', score: 0 }] },
    //     { que: '¿Ha surgido algún impacto en las operaciones o actividades de la empresa debido a una interrupción en los servicios básicos, tales como electricidad, gas, agua, telecomunicaciones (teléfonos celulares, Internet, líneas telefónicas fijas), servicios bancarios y postales en su área? ', type: 'radio', options: [{ name: 'La empresa ha resultado sumamente afectada.', score: 3 }, { name: 'La empresa ha resultado afectada hasta cierto punto.', score: 2 }, { name: 'La empresa ha experimentado un impacto mínimo.', score: 1 }, { name: 'La empresa no ha experimentado ningún impacto. ', score: 0 }] },
    //     { que: '¿Qué tipo de problemas en la cadena de suministro (movimiento de bienes y servicios, vínculos entre el fabricante, el proveedor/ distribuidor y el cliente) han repercutido en la empresa? ', multipleText: true, type: 'checkbox', options: [{ name: 'Los bienes y servicios están agotados o no están disponibles.', score: 1 }, { name: 'Los distribuidores/ proveedores/materias primas/ productos no han estado disponibles o accesibles.', score: 1 }, { name: 'Hay problemas logísticos/de transporte.', score: 1 }, { name: 'Actualmente, no se experimenta ningún impacto en la cadena de suministro.', score: 0 }] },
    //     { que: '¿Cuáles de estas medidas se están promoviendo para la seguridad en la empresa debido a la pandemia del COVID-19? ', multipleText: true, type: 'checkbox', options: [{ name: 'Hay tareas para desinfectar el lugar de trabajo (por ejemplo, se limpian más las superficies, se instalan unidades de desinfectantes de manos, etc.)', score: 1 }, { name: 'Se promueve una higiene adecuada entre el personal (el uso de máscaras, lavado frecuente de manos, etc.)', score: 1 }, { name: 'Se toma con regularidad la temperatura de los empleados y los clientes.', score: 1 }, { name: 'Se mantiene una distancia física en el lugar de trabajo (por ejemplo, se colocan marcas en el suelo para indicar cuál debe ser la distancia entre los clientes y el personal, se reacondiciona el área de la recepción para aumentar la distancia entre las personas, etc.)', score: 1 }, { name: 'Se pone a disposición servicios de transporte a la oficina para los empleados.', score: 1 }, { name: 'Hay horarios laborales escalonados o se introducen políticas para trabajar a distancia (desde la casa), a fin de minimizar la cantidad de empleados en la empresa/ la oficina.', score: 1 }, { name: 'Ninguna de las anteriores.', score: 5 }] },
    //     { que: '¿De qué forma describe la condición del equipo y la maquinaria que son indispensables para la empresa?', type: 'radio', options: [{ name: 'No hay acceso a la/las oficina(s)/ unidad(es) de producción/ bodega(s) /tienda(s)/otra(s) instalaciones(s)', score: 3 }, { name: 'No hay un contrato de mantenimiento anual (CMA) y gran parte del equipo/ la maquinaria necesita mantenimiento con regularidad.', score: 3 }, { name: 'Hay un contrato de mantenimiento anual (CMA) para la mayor parte del equipo/ la maquinaria.', score: 2 }, { name: 'La empresa no depende actualmente de este tipo de equipo/ maquinaria, que podría quedar inservible debido a la falta de mantenimiento.', score: 1 }, { name: 'La empresa no depende de ningún tipo de este equipo/ maquinaria.', score: 0 }] },
    //     { que: '¿Qué tipo de pasivos u obligaciones financieras tenía la empresa antes de la pandemia del COVID-19? ', multipleText: true, type: 'checkbox', options: [{ name: 'Un alto costo operativo.', score: 1 }, { name: 'Impuestos pendientes, intereses por cambios en las políticas financieras del gobierno (derechos de aduana, impuestos, regulaciones a las importaciones y exportaciones, etc.)', score: 1 }, { name: 'Deudas/préstamos existentes o cualquier otra carga financiera.', score: 1 }, { name: 'Ninguna de las anteriores.', score: 0 }] },
    //     { que: '¿Por cuánto tiempo puede funcionar la empresa con su situación financiera actual (activos, acciones, efectivo, ayuda del gobierno)? ', type: 'radio', options: [{ name: 'Ya no puede continuar.', score: 4 }, { name: 'Puede mantener sus operaciones durante 1-2 meses.', score: 3 }, { name: 'Puede mantener sus operaciones durante 3-6 meses.', score: 2 }, { name: 'Puede mantener sus operaciones durante 6 -12 meses.', score: 1 }] },
    //     { que: '¿Está asegurada la empresa?', type: 'radio', options: [{ name: 'La empresa está asegurada con una cobertura en caso de desastres, la cual incluye pandemias.', score: 0 }, { name: 'La empresa está asegurada con una cobertura en caso de desastres, pero no incluye pandemias.', score: 1 }, { name: 'Solo una parte de la empresa está asegurada en caso de desastres y pandemias. ', score: 2 }, { name: 'Actualmente, la empresa no tiene o nunca ha adquirido un seguro.', score: 3 }, { name: 'La empresa no tiene acceso a ningún seguro.', score: 3 }] },
    //     { que: '¿Qué cubre el seguro de la empresa?', type: 'checkbox', options: [{ name: 'Terremotos.' }, { name: 'Inundaciones.' }, { name: 'Incendios.' }, { name: 'Ciclones/ tifones/ tornados.' }, { name: 'Pandemias/ brotes/ epidemias/ endemias.' }, { name: 'Ataques terroristas' }, { name: 'Actividades volcánicas.' }, { name: 'Sequías.' }, { name: 'Daños a cultivos.' }, { name: 'Otros.' }, { name: 'Ninguna de las anteriores.' }] },
    //     { que: `¿Qué tan eficaz ha sido el paquete de estímulo del gobierno para las empresas debido al COVID-19?`, type: 'radio', options: [{ name: 'Muy eficaz.', score: 0 }, { name: 'Algo eficaz.', score: 1 }, { name: 'No ha sido eficaz.', score: 2 }, { name: 'El gobierno no ha ofrecido este tipo de paquete o todavía no se tiene acceso al mismo.', score: 2 }, { name: 'La empresa no reúne los requisitos necesarios para obtener este/estos paquete(s).', score: 2 }, { name: 'No se tiene conocimiento sobre estos paquetes.', score: 2 }] },
    //     { que: '¿Cuáles son los efectos de un cierre general o cuarentena en la empresa?', type: 'radio', options: [{ name: 'La empresa ha tenido que cerrar totalmente.', score: 3 }, { name: 'La empresa está funcionando a una capacidad mínima después del cierre inicial.', score: 2 }, { name: 'La empresa está funcionando a una capacidad reducida sin ningún cierre.', score: 1 }, { name: 'La empresa está funcionando a capacidad plena después de un cierre inicial.', score: 1 }, { name: 'No se ha experimentado ningún impacto en las actividades u operaciones de la empresa / no hubo ningún cierre.', score: 0 }] },
    //     { que: `¿Cuáles han sido los efectos de las regulaciones del gobierno en la empresa?`, multipleText: true, type: 'checkbox', options: [{ name: 'Dificultades para adquirir materia prima y otros suministros. ', score: 1 }, { name: 'Dificultades para vender productos en el mercado/ tener acceso a clientes.', score: 1 }, { name: 'Retrasos en las aprobaciones y el control de calidad de nuevos productos.', score: 1 }, { name: 'Aumento en el costo del uso de servicios públicos (por ejemplo, electricidad, agua, etc.)', score: 1 }, { name: 'Escasez/ indisponibilidad/ aumento en el costo de los recursos humanos.', score: 1 }, { name: 'Ningún efecto.', score: 0 }] },
    //     { que: 'Bajo el escenario del COVID-19, ¿cuáles de estas condiciones de mercado son pertinentes para la empresa? ', multipleText: true, type: 'checkbox', options: [{ name: 'Se observa una menor demanda de los consumidores.', score: 1 }, { name: 'Se recurre a métodos manuales/tradicionales para llegar a los clientes, en lugar de plataformas digitales/ comercio electrónico.', score: 1 }, { name: 'No hay margen para diversificar productos y servicios, y aprovechar los cambios en la demanda del mercado.', score: 1 }, { name: 'Ahora, el mercado físico se encuentra en una zona de alto riesgo y no es apto. ', score: 1 }, { name: 'El mercado ahora es más competitivo. ', score: 1 }, { name: 'No hay capacidad para comunicarse con los clientes y los proveedores. ', score: 1 }, { name: 'Ninguna de las anteriores.', score: 0 }] },
    //     { que: '¿Cuáles de estas amenazas presentan una alta probabilidad de repercutir en la empresa en el futuro inmediato? ', multipleText: true, type: 'checkbox', options: [{ name: 'Terremotos.', score: 1 }, { name: 'Ciclones/ tifones/ tormentas y daños debido a vientos.', score: 1 }, { name: 'Inundaciones.', score: 1 }, { name: 'Derrumbes.', score: 1 }, { name: 'Incendios industriales/ forestales.', score: 1 }, { name: 'Sequías', score: 1 }, { name: 'Olas de calor/ frío ', score: 1 }, { name: 'Fuga de productos químicos.', score: 1 }, { name: 'Conflictos y disturbios sociales.', score: 1 }, { name: 'Ninguna de las anteriores.', score: 0 }] },
    // ]

    let odiaaa = [
        `número de pregunta 1  ¿Seleccionar tipo de negocio? opción 1 Agribusiness  opción 2  Construcción e Inmobiliaria opción 3 Consultoría  opción 4 Educación  opción 5 Electrónica y Telecomunicación  opción 6 Alimentos y bebidas opción 7  Cuidado de la salud opción 8 Hospitalidad opción 9  Fabricación  opción 10 Medios de comunicación y entretenimiento  opción 11 Instituciones microfinancieras  opción 12 Minorista y mayorista  opción 13  Software / Tecnología de información opción 14 Transporte y cadena de suministro  opción 15  Viaje y Turismo opción 16 ONG / NPO`,
        `número de pregunta 2  ¿Es usted uno de los dueños del negocio? opción1  Sí  opción 2 No`,
        `número de pregunta 3   ¿Alguno de los dueños del negocio es mujer? opción1 Sí  opción 2 No`,
        `número de pregunta 4   ¿Cuál es el número total de oficinas / unidades de fabricación / tiendas / almacenes que tiene la empresa?`,
        `número de pregunta 5  ¿Cuáles son los ingresos anuales de la empresa (en moneda local)?`,
        `número de pregunta 6   ¿Cuál es la cantidad total de personal / empleados / trabajadores que tiene la empresa?`,
        `número de pregunta 7  ¿ Tipo de negocio ? opción1 Cooperativa / Fideicomiso / Sociedad  opción 2 Corporación  opción 3 De responsabilidad limitada opción 4 Empresa aún no registrada opción 5 Alianza empresarial opción 6  Propietario único opcións 7 ONG / NPO `,
        `número de pregunta 8  ¿Seleccionar país ?`,
        `número de pregunta 9  ¿Seleccionar provincia?`,
        `número de pregunta 10  ¿Código postal / postal / PIN?`,
        `número de pregunta 11  ¿Tiene la empresa un Plan de Continuidad Comercial (BCP)? opción1 Sí, tiene plan y toma en cuenta emergencias sanitarias (pandemia / brote)  opción 2 Sí, tiene plan pero no toma en cuenta emergencias de salud (pandemia / brote) opción 3 No cuenta con Plan de Continuidad Comercial" opción 4 No conozco el término "Plan de continuidad comercial" opción 5 No sé si tiene BCP.`,
        `número de pregunta 12 ¿La empresa ha implementado su Plan de Continuidad del Negocio (BCP)? opción1   Sí (completamente) opción 2 Sí (en parte) opción 3 No`,
        `número de pregunta 13  ¿Cuál ha sido el impacto de COVID-19 en el negocio? 1 Impacto en la producción y los servicios opción1 Incremento opción2 Disminución opción3 Ningún cambio  2 Impacto en el acceso al mercado opción1 Incremento opción2 Disminución opción3 Ningún cambio  3 Impacto en el flujo de caja y ventas opción1 Incremento opción2 Disminución opción3 Ningún cambio  4  Impacto general en los empleados (productividad, retención) opción1 Positivo opción2 Negativo opción3 Mezclado opción 4 Ningún cambio`,
        `número de pregunta 14  ¿Cuánto tiempo cree que le llevará a la empresa recuperarse por completo de la situación actual? opción1  Ya completamente recuperado  opción 2  Menos de 6 meses opción 3 Entre 6 meses y 1 año opción 4 Más de 1 año opción 5  No estoy seguro / No puedo predecir`,
        `número de pregunta 15 ¿Qué tanto le preocupa que sus operaciones empresariales o comerciales resulten afectadas debido al absentismo o a la falta de disponibilidad de los empleados? opción1 Sin preocupación, ya que la mayoría de los sistemas están automatizados o los empleados están disponibles.  opción 2 No me preocupa mucho, ya que mis familiares y amigos pueden o ya están llenando los vacíos por la escasez de empleados. opción 3 Me preocupa, ya que la empresa depende de los empleados y no cuenta con ningún otro apoyo. `,
        `número de pregunta 16 ¿Son los empleados permanentes/regulares o temporales? (Permanente significa que no tienen una fecha fija para dejar de trabajar/tienen acceso a sus pensiones y reúnen los requisitos necesarios para obtener beneficios y prestaciones de la empresa, tales como fondos de pensión, contribuciones del empleador, etc., mientras que temporal significa que se les paga una remuneración diaria o tienen un contrato de corto plazo). opción1 Todos los empleados son permanentes o son miembros de la familia opción 2  La mayoría de los empleados son permanentes o son miembros de la familia (más del 50%).  opción 3 Hay aproximadamente una cantidad igual de empleados permanentes y temporales.  opción 4 La mayoría de los empleados son temporales (más del 50%).  opción 5 Todos los empleados son temporales. `,
        `número de pregunta 17 ¿Cómo describiría a la mayoría de los empleados de la empresa? (Se pueden escoger varias respuestas). opción1 Familiares  opción 2 Amigos y vecinos opción 3 Trabajadores migrantes/ estacionales / ocasionales / con un sueldo diario. opción 4 Otros `,
        `número de pregunta 18 ¿Cuáles son las medidas que ha tomado o los esfuerzos que ha realizado la empresa para velar por el bienestar de los empleados? (Se pueden escoger varias respuestas). opción1 Los empleados pueden trabajar de forma remota/ espacio de oficina que se ha transformado de forma tal que se minimiza el contacto físico. opción 2 La gerencia interactúa con regularidad con los empleados y se comunica eficazmente con ellos sobre la posición de la empresa frente al COVID-19 y sus posibles implicaciones. opción 3 Cada cierto tiempo, la gerencia ejecuta programas de apoyo a los empleados para ayudarles con su bienestar físico y mental.  opción 4 La gerencia anima a los empleados a adquirir nuevas destrezas y conocimiento, a fin de sustituir a otros empleados que no puedan presentarse a trabajar o para desarrollar sus habilidades personales.  opción 5 La gerencia garantiza los ingresos/los salarios de los empleados, aun si la empresa tiene que cerrar sus puertas temporalmente o reducir sus operaciones o actividades.  opción 6 Ninguna de las anteriores.`,
        `número de pregunta 19 ¿Requiere la empresa que haya una distancia o un contacto físico cercano con las personas?  opción 1  a. Un contacto físico cercano con los clientes y los usuarios (tiendas, restaurantes, etc.)   opción 2 b. Una distancia física cercana con otros empleados (unidades de producción o fabricación, talleres, etc.)  opción 3 c. Tanto a como b.  opción 4 d. Ninguna de las anteriores.`,
        `número de pregunta 20 ¿Qué tipo de problemas de recursos humanos está enfrentando la empresa debido a la pandemia del COVID-19? (Se pueden escoger varias respuestas).  opción1 Absentismo entre los empleados debido a preocupaciones relacionadas con el uso de transporte público, independientemente del cierre general o la cuarentena  opción 2 Emigración, lo que da origen a la falta de jornaleros.  opción 3 Absentismo ocasionado por la tensión física o emocional entre los empleados que se presentan a trabajar, lo que ocasiona que se reduzcan las horas de trabajo o la productividad.  opción 4 Absentismo entre los empleados debido al cierre general o la cuarentena.  opción 5 Absentismo por tener que cuidar a sus niños o familiares.  opción 6 Ninguna de las anteriores.`,
        `número de pregunta 21 Si esta empresa depende altamente de las tecnologías de información (TI), ¿ha elaborado o analizado estrategias para abordar posibles amenazas a su ciberseguridad?  opción1  Sí  opción 2 No opción 3 No se tiene conocimiento sobre estas amenazas opción 4 No es pertinente.`,
        `número de pregunta 22 ¿Está la empresa utilizando tecnología y soluciones innovadoras de tecnologías de información (TI), tales como transacciones digitales, oficinas virtuales, aprendizaje a distancia, visitas/ giras virtuales, telemedicina, seminarios en línea y aplicaciones móviles, para abordar las interrupciones o velar por la continuidad empresarial?  opción1  Sí, la mayoría de estas.  opción 2 Algunas de estas opción 3 No, no se ha pensado en esta posibilidad.  opción 4 No es pertinente para esta empresa.`,
        `número de pregunta 23 ¿Ha surgido algún impacto en las operaciones o actividades de la empresa debido a una interrupción en los servicios básicos, tales como electricidad, gas, agua, telecomunicaciones (teléfonos celulares, Internet, líneas telefónicas fijas), servicios bancarios y postales en su área?  opción1 La empresa ha resultado sumamente afectada.  opción 2 La empresa ha resultado afectada hasta cierto punto.  opción 3 La empresa ha experimentado un impacto mínimo. opción 4 La empresa no ha experimentado ningún impacto.`,
        `número de pregunta 24 ¿Qué tipo de problemas en la cadena de suministro (movimiento de bienes y servicios, vínculos entre el fabricante, el proveedor/ distribuidor y el cliente) han repercutido en la empresa? (Se pueden escoger varias respuestas). opción 1 Los bienes y servicios están agotados o no están disponibles  opción 2 Los distribuidores/ proveedores/materias primas/ productos no han estado disponibles o accesibles.  opción 3 Hay problemas logísticos/de transporte. opción 4 Actualmente, no se experimenta ningún impacto en la cadena de suministro. `,
        `número de pregunta 25 ¿Cuáles de estas medidas se están promoviendo para la seguridad en la empresa debido a la pandemia del COVID-19? (Se pueden escoger varias respuestas). opción 1 Hay tareas para desinfectar el lugar de trabajo (por ejemplo, se limpian más las superficies, se instalan unidades de desinfectantes de manos, etc.)  opción 2 Se promueve una higiene adecuada entre el personal (el uso de máscaras, lavado frecuente de manos, etc.)  opción 3 Se toma con regularidad la temperatura de los empleados y los clientes. opción 4 Se mantiene una distancia física en el lugar de trabajo (por ejemplo, se colocan marcas en el suelo para indicar cuál debe ser la distancia entre los clientes y el personal, se reacondiciona el área de la recepción para aumentar la distancia entre las personas, etc.)  opción 5 Se pone a disposición servicios de transporte a la oficina para los empleados. opción 6 Hay horarios laborales escalonados o se introducen políticas para trabajar a distancia (desde la casa), a fin de minimizar la cantidad de empleados en la empresa/ la oficina. opción 7 Ninguna de las anteriores.`,
        `número de pregunta 26 ¿De qué forma describe la condición del equipo y la maquinaria que son indispensables para la empresa? opción1 No hay acceso a la/las oficina(s)/ unidad(es) de producción/ bodega(s) /tienda(s)/otra(s) instalaciones(s).   opción 2 No hay un contrato de mantenimiento anual (CMA) y gran parte del equipo/ la maquinaria necesita mantenimiento con regularidad.  opción 3 Hay un contrato de mantenimiento anual (CMA) para la mayor parte del equipo/ la maquinaria.  opción 4 La empresa no depende actualmente de este tipo de equipo/ maquinaria, que podría quedar inservible debido a la falta de mantenimiento.  opción 5 ●	La empresa no depende de ningún tipo de este equipo/ maquinaria.`,
        `número de pregunta 27 ¿Qué tipo de pasivos u obligaciones financieras tenía la empresa antes de la pandemia del COVID-19? (Se pueden escoger varias respuestas). (Se pueden escoger varias respuestas) opción 1 Un alto costo operativo. opción 2 Impuestos pendientes, intereses por cambios en las políticas financieras del gobierno (derechos de aduana, impuestos, regulaciones a las importaciones y exportaciones, etc.) opción 3 Deudas/préstamos existentes o cualquier otra carga financiera.  opción 4 Ninguna de las anteriores.`,
        `número de pregunta 28 ¿Por cuánto tiempo puede funcionar la empresa con su situación financiera actual (activos, acciones, efectivo, ayuda del gobierno)? opción 1 Ya no puede continuar.  opción 2 Puede mantener sus operaciones durante 1-2 meses. opción 3 Puede mantener sus operaciones durante 3-6 meses. opción 4 Puede mantener sus operaciones durante 6 -12 meses.`,
        `número de pregunta 29 ¿Está asegurada la empresa? opción 1 La empresa está asegurada con una cobertura en caso de desastres, la cual incluye pandemias. opción 2 La empresa está asegurada con una cobertura en caso de desastres, pero no incluye pandemias.  opción 3 Solo una parte de la empresa está asegurada en caso de desastres y pandemias.  opción 4 Actualmente, la empresa no tiene o nunca ha adquirido un seguro.  opción 5 La empresa no tiene acceso a ningún seguro. `,
        `número de pregunta 30 ¿Qué cubre el seguro de la empresa? (Se pueden escoger varias respuestas). opción 1 Terremotos.  opción 2 Inundaciones. opción 3 Incendios. opción 4 Ciclones/ tifones/ tornados. opción 5 Pandemias/ brotes/ epidemias/ endemias. opción 6 Ataques terroristas opción 7 Actividades volcánicas. opción 8 Sequías. opción 9 Daños a cultivos. opción 10 Otros. opción 11 Ninguna de las anteriores.`,
        `número de pregunta 31 ¿Qué tan eficaz ha sido el paquete de estímulo del gobierno para las empresas debido al COVID-19?  opción 1 Muy eficaz.  opción 2 Algo eficaz. opción 3 No ha sido eficaz. opción 4 El gobierno no ha ofrecido este tipo de paquete o todavía no se tiene acceso al mismo.  opción 5 La empresa no reúne los requisitos necesarios para obtener este/estos paquete(s).  opción 6 No se tiene conocimiento sobre estos paquetes. `,
        `número de pregunta 32 ¿Cuáles son los efectos de un cierre general o cuarentena en la empresa?  opción 1 La empresa ha tenido que cerrar totalmente.  opción 2 La empresa está funcionando a una capacidad mínima después del cierre inicial.   opción 3  La empresa está funcionando a una capacidad reducida sin ningún cierre opción 4 La empresa está funcionando a capacidad plena después de un cierre inicial.  opción 5 No se ha experimentado ningún impacto en las actividades u operaciones de la empresa / no hubo ningún cierre. `,
        `número de pregunta 33 ¿Cuáles han sido los efectos de las regulaciones del gobierno en la empresa? (Se pueden escoger varias respuestas). opción 1 Dificultades para adquirir materia prima y otros suministros.   opción 2 Dificultades para vender productos en el mercado/ tener acceso a clientes.  opción 3 Retrasos en las aprobaciones y el control de calidad de nuevos productos.  opción 4 Aumento en el costo del uso de servicios públicos (por ejemplo, electricidad, agua, etc.)  opción 5 Escasez/ indisponibilidad/ aumento en el costo de los recursos humanos.  opción 6 Ningún efecto. `,
        `número de pregunta 34 Bajo el escenario del COVID-19, ¿cuáles de estas condiciones de mercado son pertinentes para la empresa? (Se pueden escoger varias respuestas). opción 1 Se observa una menor demanda de los consumidores.   opción 2 Se recurre a métodos manuales/tradicionales para llegar a los clientes, en lugar de plataformas digitales/ comercio electrónico. opción 3 No hay margen para diversificar productos y servicios, y aprovechar los cambios en la demanda del mercado.  opción 4 Ahora, el mercado físico se encuentra en una zona de alto riesgo y no es apto.  opción 5 El mercado ahora es más competitivo.  opción 6 No hay capacidad para comunicarse con los clientes y los proveedores.  opción 7 Ninguna de las anteriores.`,
        `número de pregunta 35 ¿Cuáles de estas amenazas presentan una alta probabilidad de repercutir en la empresa en el futuro inmediato? (Se pueden escoger varias respuestas). opción1 Terremotos.  opción 2 Ciclones/ tifones/ tormentas y daños debido a vientos.  opción 3  Inundaciones. opción 4 Derrumbes.  opción 5 Incendios industriales/ forestales. opción 6 Sequías. opción 7 Olas de calor/ frío  opción 8 Fuga de productos químicos. opción 9 Conflictos y disturbios sociales. opción 10 Ninguna de las anteriores.`,
    ];

    const odiaQuestionArray = [
        { que: 'ବ୍ୟବସାୟ ଟି କେଉଁ ପ୍ରକାର ର ବାଛନ୍ତୁ', type: 'select', options: [{ name: 'ଉତ୍ପାଦନ ଭିତ୍ତିକ' }, { name: 'ପରିବହନ ଓ ଯୋଗାଣ ଶୃଙ୍ଖଳା' }, { name: 'ଅତିଥେୟତା' }, { name: 'ଖାଦ୍ୟ ଓ ପାନୀୟ' }, { name: 'ସଫ୍ଟୱେର  / ସୂଚନା ପ୍ରଯୁକ୍ତି ' }, { name: 'ନିର୍ମାଣ କ୍ଷେତ୍ର' }, { name: 'କୃଷି ବ୍ୟବସାୟ ' }, { name: 'କନ୍ସଲଟାନ୍ସି' }, { name: 'ଶିକ୍ଷା' }, { name: 'ଭ୍ରମଣ ଓ ପର୍ଯ୍ୟଟନ' }, { name: 'ମିଡ଼ିଆ ଓ ମନୋରଞ୍ଜନ ଶିଳ୍ପ' }, { name: 'ଇଲେକ୍ଟ୍ରୋନିକ୍ସ ଓ ଟେଲି ଯୋଗାଯୋଗ' }, { name: 'ସ୍ଵାସ୍ଥ୍ୟସେବା' }, { name: 'ମାଇକ୍ରୋ ଫାଇନାନ୍ସ ସଂସ୍ଥା' }, { name: 'ରିଟେଲ ଓ ପାଇକାରୀ ବ୍ୟବସାୟ' }, { name: 'ଏନଜିଓ / ଏନପିଓ' }] },
        { que: 'ଆପଣ କଣ ଏହି ବ୍ୟବସାୟ ର ଜଣେ ମାଲିକ ଅଟନ୍ତି କି ?', type: 'radio', options: [{ name: 'ହଁ' }, { name: 'ନା' }] },
        { que: 'କୌଣସି ମହିଳା ଏହି ବ୍ୟବସାୟ ର ମାଲିକ ଅଟନ୍ତି କି ?', type: 'radio', options: [{ name: 'ହଁ' }, { name: 'ନା' }] },
        { que: 'ଏହି ବ୍ୟବସାୟ ଟି ମାଲିକାନା ରେ କେତେ ଗୋଟି କାର୍ଯ୍ୟାଳୟ / ଉତ୍ପାଦନ ୟୁନିଟ / ଷ୍ଟୋର / ଗୋଦାମ ଘର ରହିଅଛି ', type: 'textinput' },
        { que: 'ଏହି ବ୍ୟବସାୟ ଟିର ବାର୍ଷିକ ରାଜସ୍ଵ କେତେ ଅଟେ (ସ୍ଥାନୀୟ ମୁଦ୍ରା ହିସାବରେ) ?', type: 'textinput' },
        { que: 'ଏହି ବ୍ୟବସାୟ ଟି ରେ କେତେ ଜଣ କର୍ମଚାରୀ / ଶ୍ରମିକ କାମ କରୁଅଛନ୍ତି ?', type: 'textinput' },
        { que: 'ବ୍ୟବସାୟ ଟି କେଉଁ ପ୍ରକାର ର ?', type: 'select', options: [{ name: 'ବ୍ୟକ୍ତିଗତ ମାଲିକାନା ରେ ଅଛି' }, { name: 'ଯୌଥ ମାଲିକାନା ରେ ଥିବା ବ୍ୟବସାୟ' }, { name: 'ସୀମିତ ଦାୟିତ୍ Company କମ୍ପାନୀ |' }, { name: 'ନିଗମ' }, { name: 'ସମବାୟ / ଟ୍ରଷ୍ଟ / ସୋସାଇଟି' }, { name: 'ଏପର୍ଯ୍ୟନ୍ତ ପଞ୍ଜିକରଣ ହୋଇନାହିଁ' }, { name: 'ଏନଜିଓ / NPO' }] },
        { que: 'ଦେଶ', type: 'select' },
        { que: 'ରାଜ୍ୟ', type: 'select' },
        { que: 'ପୋଷ୍ଟ ଅଫିସ ପିନ କୋଡ଼ (ଇଚ୍ଛାଧୀନ )', type: 'textinput' },
        { que: 'ଏହି ବ୍ୟବସାୟଟି ପାଇଁ କୌଣସି ବ୍ୟବସାୟ ନିରନ୍ତରତା ଯୋଜନା ଅଛି କି ?', type: 'radio', options: [{ name: 'ହଁ , ଏହି ଯୋଜନା ଅଛି ଓ ଏହା ସ୍ଵାସ୍ଥ୍ୟ ଜନିତ ଅପାତକାଳୀନ ସ୍ଥିତି (ମହାମାରୀ ସ୍ଥିତି) କୁ ପରିଚାଳନା କରି ପାରିବ' }, { name: 'ହଁ , ଏହି ଯୋଜନା ଅଛି, କିନ୍ତୁ ଏହା ସ୍ଵାସ୍ଥ୍ୟ ଜନିତ ଅପାତକାଳୀନ ସ୍ଥିତି (ମହାମାରୀ ସ୍ଥିତି) କୁ ପରିଚାଳନା କରି ପାରିବ  ନାହିଁ' }, { name: 'ହଁ , ଏହି ଯୋଜନା ଅଛି, କିନ୍ତୁ ଏହା ସ୍ଵାସ୍ଥ୍ୟ ଜନିତ ଅପାତକାଳୀନ ସ୍ଥିତି (ମହାମାରୀ ସ୍ଥିତି) କୁ ପରିଚାଳନା କରି ପାରିବ  ନାହିଁ' }, { name: 'ମୁଁ ବ୍ୟବସାୟ ନିରନ୍ତରତା ଯୋଜନା ବିଷୟରେ ସଚେତନ ନୁହେଁ' }, { name: `ମୁଁ ବ୍ୟବସାୟ ନିରନ୍ତରତା ଯୋଜନା ବିଷୟରେ ଜାଣି ନାହିଁ` }] },
        { que: `ବ୍ୟବସାୟ ନିରନ୍ତରତା ଯୋଜନାକୁ ସଂସ୍ଥା ତରଫରୁ କାର୍ଯ୍ୟକାରୀ କରାଯାଇଛି କି ?`, type: 'radio', options: [{ name: 'ହଁ (ସମ୍ପୂର୍ଣ ଭାବରେ )' }, { name: 'ହଁ (ଆଂଶିକ ଭାବରେ )' }, { name: 'ନା' }], conditional: true },
        { que: `ବ୍ୟବସାୟ ଟି ଉପରେ କୋଭିଡ ୧୯ ଏ କଣ ପ୍ରଭାବ ପଡ଼ିଅଛି ?`, type: 'checkbox', options: [{ title: 'ଉତ୍ପାଦନ ଓ ସେବା ଯୋଗାଣରେ ପଡିଥିବା ପ୍ରଭାବ', innerOptions: ['ପ୍ରଭାବ ବଢ଼ିଅଛି', 'ପ୍ରଭାବ କମି ଅଛି', 'କିଛି ପ୍ରଭାବ ପଡ଼ିନାହିଁ'] }, { title: 'Impact on market access', innerOptions: ['ପ୍ରଭାବ ବଢ଼ିଅଛି', 'ପ୍ରଭାବ କମି ଅଛି', 'କିଛି ପ୍ରଭାବ ପଡ଼ିନାହିଁ '] }, { title: 'ବଜାର ରେ ପହଞ୍ଚି କିଣା ବିକା କରିବା ଉପରେ ପଡିଥିବା ପ୍ରଭାବ', innerOptions: ['ପ୍ରଭାବ ବଢ଼ିଅଛି', 'ପ୍ରଭାବ କମି ଅଛି', 'କିଛି ପ୍ରଭାବ ପଡ଼ିନାହିଁ'] }, { title: 'କର୍ମଚାରୀ ମାନଙ୍କ ଉପରେ ମୋଟାମୋଟି ଭାବରେ ପଡିଥିବା ପ୍ରଭାବ (ଯେପରି :- କାର୍ଯ୍ୟ ଦକ୍ଷତା , ସ୍ଥାୟୀ ଭାବରେ ରହିବା )', innerOptions: ['ସକାରାତ୍ମକ ପ୍ରଭାବ', 'ନକାରାତ୍ମକ ପ୍ରଭାବ', 'ମିଶ୍ର ପ୍ରଭାବ', 'କିଛି ପ୍ରଭାବ ପଡ଼ିନାହିଁ'] }] },
        { que: 'ଆପଣଙ୍କ ମତରେ ବର୍ତମାନ ସ୍ଥିତିରୁ ବାହାରି ପୂର୍ବ ସ୍ଥିତିକୁ ଆସିବା ପାଇଁ ବ୍ୟବସାୟକୁ ଆଉ କେତେ ସମୟ ଲାଗିବ ?', type: 'radio', options: [{ name: 'ବ୍ୟବସାୟ ସ୍ଥିତି ରେ ସୁଧାର ଆସି ସାରିଛି' }, { name: 'ବ୍ୟବସାୟ ସ୍ଥିତି ସୁଧୁରିବାକୁ ୬ ମାସରୁ କମ ସମୟ ଲାଗିବ' }, { name: '୬ ରୁ ୧ ବର୍ଷ ସମୟ ଲାଗିବ' }, { name: '୧ ବର୍ଷରୁ ଅଧିକ ସମୟ ଲାଗିବ' }, { name: 'ବ୍ୟବସାୟ ସ୍ଥିତିରେ ସୁଧାର ଆସିବାକୁ କେତେ ସମୟ ଲାଗିବ ଜଣା ନାହିଁ / ଅନୁମାନ କରାଯାଇ ପାରିବ ନାହିଁ' }] },

        { que: 'ଆପଣ କେତେ ଚିନ୍ତିତ ଯେ କର୍ମଚାରୀଙ୍କ ଅଭାବ କିମ୍ବା ଅନୁପସ୍ଥିତି ଦ୍ଵାରା ବ୍ୟବସାୟ କାର୍ଯ୍ୟ ପ୍ରଭାବିତ ହେବ?', type: 'radio', options: [{ name: 'ଅଧିକାଂଶ କାର୍ଯ୍ୟ ସ୍ଵୟଂଚାଳିତ କିମ୍ବା କର୍ମଚାରୀ ଉପଲବ୍ଧ ଥିବାରୁ ସେଥିପାଇଁ ଆଦୌ ଚିନ୍ତିତ ନୁହଁନ୍ତି |', score: 0 }, { name: 'ପରିବାର ସଦସ୍ୟ ଏବଂ/କିମ୍ବା ସାଙ୍ଗମାନେ କୌଣସି କର୍ମଚାରୀଙ୍କ ଅଭାବ ପୂରଣ କରୁଅଛନ୍ତି କିମ୍ବା ଅଭାବ ପୁରାଣ କରିପାରିବେ', score: 1 }, { name: 'ବ୍ୟବସାୟ କର୍ମଚାରୀଙ୍କ ଉପରେ ନିର୍ଭର କରୁଥିବାରୁ ଚିନ୍ତିତ ଏବଂ ବ୍ୟବସାୟ ପାଇଁ ଅନ୍ୟ କୌଣସି ସମର୍ଥନ ନାହିଁ |', score: 2 }] },
        {
            que: `କର୍ମଚାରୀ ମାନେ ସ୍ଥାୟୀ/ନିୟମିତ କିମ୍ବା ଅସ୍ଥାୟୀ କିପରି ଭାବରେ କାର୍ଯ୍ୟ କରୁଅଛନ୍ତି?

        (ସ୍ଥାୟୀ ର ଅର୍ଥ ହେଉଛି କର୍ମଚାରୀ କୌଣସି ନିର୍ଦ୍ଧିଷ୍ଟ ସମୟ ପାଇଁ ନିୟୋଜିତ ନୁହନ୍ତି / ଅବସର ବୟସ ପର୍ଯ୍ୟନ୍ତ କାର୍ଯ୍ୟ କରିପାରିବେ ଏବଂ କମ୍ପାନୀ ତରଫରୁ ଅବସର କାଳୀନ ସୁବିଧା ଯେପରି ପେନସନ ସୁବିଧା, ଭବିଷ୍ୟ ନିଧି ପାଣ୍ଠି ସୁବିଧା ଇତ୍ୟାଦି ପାଇଁ ଯୋଗ୍ୟ ଏବଂ ଅସ୍ଥାୟୀ ର ଅର୍ଥ ହେଉଛି କର୍ମଚାରୀ ମାନେ ଦୈନିକ ମଜୁରୀ ପାଇଁ କାମ କରୁଛନ୍ତି କିମ୍ବା ସ୍ଵଳ୍ପ ସମୟ ପାଇଁ ଚୁକ୍ତିଭିତ୍ତିକ କର୍ମଚାରୀ ଅଟନ୍ତି)`, type: 'radio', options: [{ name: 'ସମସ୍ତ କର୍ମଚାରୀ ମାନେ ସ୍ଥାୟୀ ଅଥବା ସେମାନେ ପରିବାର ସଦସ୍ୟ ମାନଙ୍କ ମଧ୍ୟରୁ ଅଛନ୍ତି', score: 0 }, { name: 'କର୍ମଚାରୀମାନଙ୍କ ମଧ୍ୟରୁ ଅଧିକାଂଶ ସ୍ଥାୟୀ ଅଟନ୍ତି ଅଥବା ପରିବାର ସଦସ୍ୟ ମାନଙ୍କ ଭିତରୁ ଅଛନ୍ତି (୫୦ ପ୍ରତିଶତରୁ ଅଧିକ)', score: 1 }, { name: 'ସ୍ଥାୟୀ ଓ ଅସ୍ଥାୟୀ ଭାବରେ କାମ କରୁଥିବା କର୍ମଚାରୀ ପ୍ରାୟତଃ ସମାନ ଅଛନ୍ତି', score: 1 }, { name: 'କାମ କରୁଥିବା ଅଧିକାଂଶ କର୍ମଚାରୀ ଅସ୍ଥାୟୀ ଅଟନ୍ତି (୫୦ ପ୍ରତିଶତରୁ ଅଧିକ)', score: 2 }, { name: 'ସମସ୍ତ କର୍ମଚାରୀ ଅସ୍ଥାୟୀ ଅଟନ୍ତି', score: 3 }]
        },
        { que: 'ଆପଣଙ୍କ ମତରେ ବ୍ୟବସାୟରେ କାର୍ଯ୍ୟ କରୁଥିବା କର୍ମଚାରୀ ମାନଙ୍କ ମଧ୍ୟରୁ ଅଧିକାଂଶ କେଉଁ ପ୍ରକାର ର ଅଟନ୍ତି ? (ଏକରୁ ଅଧିକ ଉତ୍ତର ମଧ୍ୟ ଚୟନ କରିପାରିବେ)', multipleText: true, type: 'checkbox', options: [{ name: 'ପରିବାର ସଦସ୍ୟ' }, { name: `ବନ୍ଧୁ ଅଥବା ପଡୋଶୀ` }, { name: 'ଋତୁକାଳୀନ / ପ୍ରବାସୀ ଶ୍ରମିକ / ଅସ୍ଥାୟୀ କର୍ମଚାରୀ / ଦିନ ମଜୁରିଆ' }, { name: 'ଅନ୍ୟ କିଛି' }] },
        { que: 'କର୍ମଚାରୀମାନଙ୍କ ସୁବିଧା ଓ ଉତ୍ତମ ଜୀବନ କୁ ସୁନିଶ୍ଚିତ କରିବା ପାଇଁ ବ୍ୟବସାୟ / ଉଦ୍ୟୋଗ ତରଫରୁ କଣ ସବୁ ପଦକ୍ଷେପ ନିଅ ଯାଇଅଛି ? (ଏକ ରୁ ଅଧିକ ଉତ୍ତର ଚୟନ କରାଯାଇପାରିବ)', multipleText: true, type: 'checkbox', options: [{ name: 'କର୍ମଚାରୀମାନେ ଘରୁ ରହି କାମ କରିବା ପାଇଁ ବ୍ୟବସ୍ଥା କରାଯାଇଛି', score: 1 }, { name: `ଏହି ଉଦ୍ୟୋଗ ର ପରିଚାଳନା କର୍ତ୍ତୃପକ୍ଷ କୋଭିଡ ୧୯ ର ପ୍ରଭାବ ଓ ଏଥିପାଇଁ ସଂସ୍ଥା ତରଫରୁ ନିଅ ଯାଇଥିବା ପଦକ୍ଷେପ ସମ୍ପର୍କ ରେ ନିୟମିତ ଭାବରେ କର୍ମଚାରୀମାନଙ୍କ ସହିତ ଯୋଗାଯୋଗରେ ରହୁଛନ୍ତି |`, score: 1 }, { name: 'କର୍ମଚାରୀମାନଙ୍କ ମାନସିକ ଓ ଶାରୀରିକ ସୁସ୍ଥତା କୁ ସୁନିଶ୍ଚିତ କରିବା ପାଇଁ ସଂସ୍ଥା ତରଫରୁ ନିୟମିତ ଭାବରେ ସହାୟତା କାର୍ଯ୍ୟକ୍ରମ କରାଯାଉଅଛି |', score: 1 }, { name: 'କାର୍ଯ୍ୟକ୍ଷେତ୍ରକୁ ଆସିପାରୁନଥିବା କର୍ମଚାରୀମାନଙ୍କ କାର୍ଯ୍ୟକୁ ଭରଣା କରିବା ପାଇଁ ତଥା ଅନ୍ୟମାନେ ଯେଉଁମାନେଆଗ୍ରହୀ ଅଛନ୍ତି, ସେମାନଙ୍କର ନୂତନ ଦକ୍ଷତା କୌଶଳ ଆହରଣ କରିବା ନିମନ୍ତେ ଉଦ୍ୟୋଗର ପରିଚାଳନା କର୍ତ୍ତୃପକ୍ଷଙ୍କ ତରଫରୁ ପ୍ରୋତ୍ସାହିତ କରାଯାଉଅଛି |', score: 1 }, { name: 'ଉଦ୍ୟୋଗ / ବ୍ୟବସାୟ ସାମୟିକ ଭାବରେ ବନ୍ଦ ରହିବା କିମ୍ବା ଉତ୍ପାଦନ କରିବା ସ୍ଥିତିରେ ମଧ୍ୟ କର୍ମଚାରୀମାନଙ୍କ ରୋଜଗାର / ବେତନକୁ ସଂସ୍ଥା ତରଫରୁ ସୁନିଶ୍ଚିତ କରାଯାଇଅଛି |', score: 1 }, { name: 'ଏଥି ମଧ୍ୟରୁ କିଛି ବି ନୁହେଁ |', score: 5 }] },
        { que: 'ବ୍ୟବସାୟ ଚଳାଇବା ପାଇଁ ଲୋକମାନଙ୍କ ସହିତ ଘନିଷ୍ଠ ଭାବରେ ସମ୍ପର୍କ କିମ୍ବା ଲୋକଙ୍କ ଠାରୁ ଦୂରତା ରକ୍ଷା କରିବା, କଣ ଆବଶ୍ୟକ ଅଟେ ?', type: 'radio', options: [{ name: 'ଉପଭୋକ୍ତା ଓ ଗ୍ରାହକ ମାନଙ୍କ ଠାରୁ (ଯେପରି ଦୋକାନ, ରେଷ୍ଟୁରାଣ୍ଟ ଇତ୍ୟାଦି) ନିକଟତମ ଦୂରତା ରକ୍ଷା କରିବା ଉଚିତ', score: 1 }, { name: 'ଅନ୍ୟ କର୍ମଚାରୀ ମାନଙ୍କ ଠାରୁ (ଯେପରି ଉତ୍ପାଦନ କେନ୍ଦ୍ର, ଦୋକାନ ଇତ୍ୟାଦି) ନିକଟତମ ଦୂରତା ରକ୍ଷା କରିବା ଉଚିତ', score: 1 }, { name: 'ଉଭୟ ଏ ଏବଂ ବି', score: 2 }, { name: 'ଏଥି ମଧ୍ୟରୁ କିଛି ନୁହେଁ', score: 0 }] },
        { que: 'କୋଭିଡ ୧୯ ମହାମାରୀ କାରଣରୁ ଆପଣଙ୍କ ବ୍ୟବସାୟଟି କେଉଁ ପ୍ରକାର ମାନବ ସମ୍ବଳ ଜନିତ ସମସ୍ୟା ର ସମ୍ମୁଖୀନ ହେଉଛି ? (ଏକ ରୁ ଅଧିକ ଉତ୍ତର ଚୟନ କରି ପାରିବେ)', multipleText: true, type: 'checkbox', options: [{ name: 'ତାଲା ବନ୍ଦ ସମୟରେ ସାଧାରଣ ପରିବହନ ବ୍ୟବସ୍ଥା ବନ୍ଦ ହେବା କାରଣକୁ ନେଇ କର୍ମଚାରୀମାନଙ୍କ ଅନୁପସ୍ଥିତି ବଢୁଛି' }, { name: 'ପ୍ରବାସୀ ଶ୍ରମିକ ଭାବରେ ଲୋକ ମାନେ ଯିବା ହେତୁ ଦିନ ମଜୁରିଆ ଶ୍ରମିକ ପାଇବାରେ ସମସ୍ୟା ଆସୁଛି' }, { name: 'କାମକୁ ଆସୁଥିବା କର୍ମଚାରୀ ମାନଙ୍କ ମଧ୍ୟରେ ମାନସିକ ଚିନ୍ତା ଓ ଅବସାଦ କାରଣରୁ ଦୈନିକ କାର୍ଯ୍ୟ ସମୟ ଅଥବା କର୍ମଚାରୀଙ୍କ କାର୍ଯ୍ୟ ଦକ୍ଷତା ପ୍ରଭାବିତ ହେଉଛି' }, { name: 'ତାଲା ବନ୍ଦ କାରଣରୁ କର୍ମଚାରୀ ମାନକ ମଧ୍ୟରେ ଅନୁପସ୍ଥିତି ବଢୁଛି' }, { name: 'ଘର ର ସଦସ୍ୟ କିମ୍ବା ପିଲା ମାନଙ୍କ ଯତ୍ନ ପାଇଁ କର୍ମଚାରୀ ଅନୁପସ୍ଥିତ ରହୁଛନ୍ତି' }, { name: 'ଏଥି ମଧ୍ୟରୁ କିଛି ନୁହେଁ' }] },

        { que: 'ଯଦି ବ୍ୟବସାୟ ଟି ସୂଚନା ପ୍ରଯୁକ୍ତି ଉପରେ ବହୁଳ ଭାବରେ ନିର୍ଭର କରୁଛି , ତେବେ ସାଇବର ସୁରକ୍ଷା ପ୍ରତି ରହିଥିବା ବିପଦ କୁ ନେଇ ସମୀକ୍ଷା କିମ୍ବା କୌଣସି ପ୍ରାକ ବ୍ୟବସ୍ଥା କରିଛନ୍ତି କି ?', type: 'radio', options: [{ name: 'ହଁ', score: 1 }, { name: 'ନା', score: 2 }, { name: 'ଏଭଳି ବିପଦ ରହିଥିବା ନେଇ କୌଣସି ସଚେତନତା ନାହିଁ', score: 2 }, { name: 'ଏଥିପାଇଁ ପ୍ରଯୁଜ୍ୟ ନୁହେଁ', score: 0 }] },
        { que: 'ବ୍ୟବସାୟ ରେ ଆସୁଥିବା କୌଣସି ବ୍ୟାଘାତ କୁ ପରିଚାଳନା ଏବଂ ବ୍ୟବସାୟର ନିରନ୍ତରତାକୁ ସୁନିଶ୍ଚିତ କରିବା ପାଇଁ କୌଣସି ପ୍ରଯୁକ୍ତି ବିଦ୍ୟା ଏବଂ ଅଭିନବ ସୂଚନା ପ୍ରଯୁକ୍ତି ସମାଧାନ ଯେପରି (ଡିଜିଟାଲ ନେଣଦେଣ , ଭରଚୁଆଲ କାର୍ଯ୍ୟାଳୟ , ରିମୋଟ ଶିକ୍ଷା , ଭରଚୁଆଲ ଭ୍ରମଣ , ଟେଲି ମେଡ଼ିସିନ, ୱେବିନାର , ମୋବାଇଲ ଆପ୍ଲିକେସନ ) ଇତ୍ୟାଦି ବ୍ୟବସ୍ଥା ବ୍ୟବହାର ହେଉଛି କି ?', type: 'radio', options: [{ name: 'ହଁ, ଏଥିରୁ ଅଧିକାଂଶ', score: 1 }, { name: 'ଏଥି ମଧ୍ୟ ରୁ ଅଳ୍ପ କିଛି', score: 2 }, { name: 'ନା, ଏଥି ମଧ୍ୟରୁ କିଛି ବ୍ୟବହାର କରିବା ପାଇଁ ପୂର୍ବରୁ କୌଣସି ଚିନ୍ତା କରାଯାଇ ନାହିଁ', score: 3 }, { name: 'ଏହି ବ୍ୟବସାୟ ପାଇଁ ଏସବୁ ଆବଶ୍ୟକ ନୁହେଁ', score: 0 }] },
        { que: 'ବିଦ୍ୟୁତ୍, ଗ୍ୟାସ୍, ଜଳ, ଟେଲିକମ୍ (ମୋବାଇଲ୍, ଟେଲିଫୋନ୍, ଇଣ୍ଟରନେଟ୍), ବ୍ୟାଙ୍କିଙ୍ଗ୍ ଏବଂ ଡାକ ସେବା ଭଳି ମୌଳିକ ଉପଯୋଗୀ ସେବାରେ ବ୍ୟାଘାତ ହେତୁ ବ୍ୟବସାୟ କାର୍ଯ୍ୟ ଉପରେ କୌଣସି ପ୍ରଭାବ ପଡୁଅଛି କି ?', type: 'radio', options: [{ name: 'ବ୍ୟବସାୟ ଅତ୍ୟଧିକ ପ୍ରଭାବିତ |', score: 3 }, { name: 'ବ୍ୟବସାୟ କିଛି ମାତ୍ରାରେ ପ୍ରଭାବିତ ହୋଇଛି |', score: 2 }, { name: 'ବ୍ୟବସାୟ ଉପରେ ସର୍ବନିମ୍ନ ପ୍ରଭାବ ଥିଲା |', score: 1 }, { name: 'ବ୍ୟବସାୟ ଉପରେ କୌଣସି ପ୍ରଭାବ ପଡିନାହିଁ |', score: 0 }] },
        { que: 'ଯୋଗାଣ ଶୃଙ୍ଖଳା ନେଇ ରହିଥିବା ସମସ୍ୟା ଯେପରି (ଉତ୍ପାଦନକାରୀ, ବିକ୍ରେତା, ଯୋଗାଣକାରୀ , ଏବଂ ଗ୍ରାହକ ମାନଙ୍କ ସହିତ ଯୋଗାଯୋଗ ବିଛିନ୍ନ ହେତୁ ଦ୍ରବ୍ୟ ଓ ସେବା ର ପ୍ରବାହ ରେ ସମସ୍ୟା) ହେତୁ ଆପଣଙ୍କ ବ୍ୟବସାୟ ଉପରେ କୌଣସି ପ୍ରଭାବ ପଡିଅଛି କି?', multipleText: true, type: 'checkbox', options: [{ name: 'ଦ୍ରବ୍ୟ ଏବଂ ସେବା ବିକ୍ରି ହୋଇଯାଇଛି କିମ୍ବା ଉପଲବ୍ଧ ନାହିଁ |', score: 1 }, { name: 'ବିକ୍ରେତା / ଯୋଗାଣକାରୀ / କଞ୍ଚାମାଲ / ଉତ୍ପାଦ ଉପଲବ୍ଧ ନାହିଁ କିମ୍ବା ପାଇବାରେ ସମସ୍ୟା ହେଉଛି', score: 1 }, { name: 'ଲଜିଷ୍ଟିକ୍ସ / ପରିବହନ ସମସ୍ୟା |', score: 1 }, { name: 'ଯୋଗାଣ ଶୃଙ୍ଖଳା ଉପରେ କୌଣସି ସାମ୍ପ୍ରତିକ ପ୍ରଭାବ ନାହିଁ', score: 0 }] },
        { que: 'କୋଭିଡ ୧୯ ମହାମାରୀ ସମୟରେ ସୁରକ୍ଷା କୁ ସୁନିଶ୍ଚିତ କରିବା ପାଇଁ ଏଥି ମଧ୍ୟରୁ କେଉଁଗୁଡିକ ବ୍ୟବସାୟ କ୍ଷେତ୍ରରେ ପ୍ରୋତ୍ସାହିତ ହେଉଛି? (ଏକାଧିକ ଉତ୍ତର ଚୟନ କରାଯାଇପାରିବ)', multipleText: true, type: 'checkbox', options: [{ name: 'କର୍ମକ୍ଷେତ୍ର କୁ ସାନିଟାଈଜ କରିବା (ଯଥା ଚଟାଣ ଓ ଅନ୍ୟସ୍ଥାନ ସଫା କରିବା, ହାତ ସାନିଟାଇଜିଂ ୟୁନିଟ୍ ସ୍ଥାପନ ଇତ୍ୟାଦି)', score: 1 }, { name: 'କର୍ମଚାରୀଙ୍କ ମଧ୍ୟରେ ଉତ୍ତମ ସ୍ଵଛତା କୁ ପ୍ରୋତ୍ସାହିତ କରିବା (ମାସ୍କ ପିନ୍ଧିବା, ହାତ ଧୋଇବା)', score: 1 }, { name: 'କର୍ମଚାରୀ ଏବଂ ଗ୍ରାହକଙ୍କ ନିୟମିତ ତାପମାତ୍ରା ଯାଞ୍ଚ|', score: 1 }, { name: 'କାର୍ଯ୍ୟକ୍ଷେତ୍ରରେ ଶାରୀରିକ ଦୂରତା ବଜାୟ ରଖିବା (ଯଥା ଗ୍ରାହକ ଏବଂ କର୍ମଚାରୀଙ୍କ ମଧ୍ୟରେ ଦୂରତା ସୂଚାଇବା ପାଇଁ ଚଟାଣକୁ ଚିହ୍ନିତ କରିବା, ଲୋକଙ୍କ ମଧ୍ୟରେ ଦୂରତା ରକ୍ଷା କରିବା ପାଇଁ ସମ୍ମୁଖ ଡେସ୍କ ର ରିଟ୍ରୋଫିଟ୍ ଇତ୍ୟାଦି)', score: 1 }, { name: 'କାର୍ଯ୍ୟକ୍ଷେତ୍ରକୁ ଆସିବା ପାଇଁ କର୍ମଚାରୀମାନଙ୍କ ପାଇଁ ପରିବହନ ସୁବିଧା ଯୋଗାଇବା |', score: 1 }, { name: 'ବ୍ୟବସାୟ କ୍ଷେତ୍ର / କାର୍ଯ୍ୟାଳୟରେ କର୍ମଚାରୀଙ୍କ ଘନତାକୁ କମ୍ କରିବା ପାଇଁ କାର୍ଯ୍ୟ ନୀତି ବଦଳାଇବା କିମ୍ବା ଘରୁ ରହି କାର୍ଯ୍ୟ କରିବା ନୀତିକୁ ଆପଣାଇବା |', score: 1 }, { name: 'ଏଗୁଡ଼ିକ ମଧ୍ୟରୁ କୌଣସି ଟି ନୁହେଁ |', score: 5 }] },
        { que: 'ଉଦ୍ୟୋଗ / ବ୍ୟବସାୟ କାର୍ଯ୍ୟ ପାଇଁ ଅପରିହାର୍ଯ୍ୟ ରହିଥିବା ଯନ୍ତ୍ରପାତି / ଉପକରଣର ସ୍ଥିତିକୁ ଆପଣ କିପରି ଭାବରେ ବର୍ଣନା କରିବେ ?', type: 'radio', options: [{ name: 'କାର୍ଯ୍ୟାଳୟ / ଉତ୍ପାଦନ ୟୁନିଟ ଗୁଡିକ / ଗୋଦାମ / ଷ୍ଟୋର / ଅନ୍ୟାନ୍ୟ ପ୍ରତିଷ୍ଠାନ ଗୁଡିକୁ ପହଂଚିବା ସୁବିଧା ନାହିଁ', score: 3 }, { name: 'ଯନ୍ତ୍ରପାତି ଗୁଡିକ ପାଇଁ ବାର୍ଷିକ ରକ୍ଷଣାବେକ୍ଷଣ ଚୁକ୍ତିନାମା (AMC) ନାହିଁ ଏବଂ ଅନେକ ଯନ୍ତ୍ରପାତି / ଉପକରଣ ନିୟମିତ ରକ୍ଷଣାବେକ୍ଷଣ ଆବଶ୍ୟକ କରେ |', score: 3 }, { name: 'ଅଧିକାଂଶ ଯନ୍ତ୍ରପାତି / ଉପକରଣ ପାଇଁ ଏକ ବାର୍ଷିକ ରକ୍ଷଣାବେକ୍ଷଣ ଚୁକ୍ତି ( AMC ) ଅଛି |', score: 2 }, { name: 'ଏହି ଉଦ୍ୟୋଗ / ବ୍ୟବସାୟ ଟି ଏପରି କୌଣସି ଯନ୍ତ୍ରପାତି / ଉପକରଣ ଉପରେ ନିର୍ଭରଶୀଳ ନୁହେଁ ଯାହା ରକ୍ଷଣାବେକ୍ଷଣ ଅଭାବରୁ ବନ୍ଦ ହୋଇପାରେ |', score: 1 }, { name: 'ଏହି ଉଦ୍ୟୋଗ / ବ୍ୟବସାୟଟି କୌଣସି ଯନ୍ତ୍ରପାତି / ଉପକରଣ ଉପରେ ନିର୍ଭରଶୀଳ ନୁହେଁ |', score: 0 }] },
        { que: 'କୋଭିଡ ୧୯ ମହାମାରୀ ପୂର୍ବରୁ ବ୍ୟବସାୟ ଉପରେ କେଉଁ ପ୍ରକାରର ଆର୍ଥିକ ବୋଝ ରହିଥିଲା? (ଏକରୁ ଅଧିକ ଉତ୍ତର ଚୟନ କରାଯାଇପାରିବ)', multipleText: true, type: 'checkbox', options: [{ name: 'ଉଚ୍ଚ ପରିଚାଳନାଗତ ଖର୍ଚ', score: 1 }, { name: 'ସରକାରଙ୍କ ଆର୍ଥିକ ନିୟମାବଳୀରେ ଯେପରି (କଷ୍ଟମ ଡ୍ୟୁଟି, ଟ୍ୟାକ୍ସ, ଆମଦାନୀ / ରପ୍ତାନି ନିୟମାବଳୀ ଇତ୍ୟାଦି) ରେ ପରିବର୍ତ୍ତନ ହେତୁ ଟିକସ, ସୁଧ ଇତ୍ୟାଦି ବକେୟା ରହିଥିଲା |', score: 1 }, { name: 'ପୂର୍ବର କରଜ / ଋଣ / ଅଥବା ଅନ୍ୟ କୌଣସି ଆର୍ଥିକ ବୋଝ', score: 1 }, { name: 'ଏଥି ମଧ୍ୟରୁ କିଛି ବି ନୁହେଁ', score: 0 }] },
        { que: 'ବ୍ୟବସାୟ ର ବର୍ତ୍ତମାନର ଆର୍ଥିକ ସ୍ଥିତି ଯେପରି (ରହିଥିବା ସମ୍ପତ୍ତି, ଅଂଶଧନ, ନଗଦ, ସରକାରୀ ସହାୟତା) ସହିତ କେତେ ଦିନ ପର୍ଯ୍ୟନ୍ତ ଚାଲି ପାରିବାରେ ସକ୍ଷମ ହେବ ?', type: 'radio', options: [{ name: 'ଏହା ଆଉ ଆଗକୁ ଚାଲି ପାରିବ ନାହିଁ', score: 4 }, { name: 'ଏହା ୧ ରୁ ୨ ମାସ ପର୍ଯ୍ୟନ୍ତ ଚାଲିପାରିବ', score: 3 }, { name: 'ଏହା ୩ ରୁ ୬ ମାସ ପର୍ଯ୍ୟନ୍ତ ଚାଲିପାରିବ', score: 2 }, { name: 'ଏହା ୬ ରୁ ୧୨ ମାସ ପର୍ଯ୍ୟନ୍ତ ଚାଲିପାରିବ', score: 1 }] },
        { que: 'ବ୍ୟବସାୟ ଟି ବୀମାଭୁକ୍ତ ହୋଇଛି କି?', type: 'radio', options: [{ name: 'ବ୍ୟବସାୟ ଟି ବିପର୍ଯ୍ୟୟ ବୀମା ସୁରକ୍ଷା ସହିତ ବୀମାଭୁକ୍ତ ହୋଇଛି ଯେଉଁଥିରେ ମହାମାରୀ ଅନ୍ତର୍ଭୁକ୍ତ |', score: 0 }, { name: 'ବ୍ୟବସାୟଟି ବିପର୍ଯ୍ୟୟ ବୀମା ସୁରକ୍ଷା ସହିତ ବୀମାଭୁକ୍ତ ହୋଇଛି କିନ୍ତୁ ଏଥିରେ ମହାମାରୀ ଅନ୍ତର୍ଭୁକ୍ତ ନୁହେଁ', score: 1 }, { name: 'ବ୍ୟବସାୟର କିଛି ଅଂଶ ବିପର୍ଯ୍ୟୟ ଏବଂ ମହାମାରୀ ପାଇଁ ଉଦ୍ଧିଷ୍ଟ ବୀମା ସୁରକ୍ଷା ଅନ୍ତର୍ଭୁକ୍ତ ଅଟେ', score: 2 }, { name: 'ବ୍ୟବସାୟଟି ପାଇଁ ବର୍ତମାନ କିମ୍ବା ପୂର୍ବରୁ ମଧ୍ୟ କୌଣସି ବୀମା ସୁବିଧା କ୍ରୟ କରାଯାଇ ନାହିଁ', score: 3 }, { name: 'ବ୍ୟବସାୟ ଟି ପାଇଁ କୌଣସି ବୀମା ସୁବିଧା ନାହିଁ', score: 3 }] },
        { que: 'ବ୍ୟବସାୟ ବୀମା ସୁରକ୍ଷା ମଧ୍ୟରେ କ’ଣ ସବୁ ଅନ୍ତର୍ଭୁକ୍ତ ?', type: 'checkbox', options: [{ name: 'ଭୂମିକମ୍ପ' }, { name: 'ବନ୍ୟା' }, { name: 'ଅଗ୍ନିକାଣ୍ଡ' }, { name: 'ସାମୁଦ୍ରିକ ଝଡ / ବାତ୍ୟା / ଘୁର୍ଣ୍ଣି ଝଡ ଆଦି' }, { name: 'ସର୍ବତ୍ର ବ୍ୟାପୁଥିବା ମହାମାରୀ / ପ୍ରକୋପ / ମହାମାରୀ / ସ୍ଥାନୀୟ ସଂକ୍ରମଣ' }, { name: 'ଆତଙ୍କବାଦୀ ଆକ୍ରମଣ' }, { name: 'ଆଗ୍ନେୟଗିରି ଉଦ୍ଗିରଣ' }, { name: 'ମରୁଡ଼ି' }, { name: 'ଫସଲ କ୍ଷତି' }, { name: 'ଅନ୍ୟ କିଛି' }, { name: 'ଏଥି ମଧ୍ୟରୁ କିଛି ବି ନୁହେଁ |' }] },
        { que: `ବ୍ୟବସାୟ ପାଇଁ ସରକାରଙ୍କ ତରଫରୁ ଦିଆଯାଇଥିବା କୋଭିଡ ୧୯ ସହାୟତା ପ୍ୟାକେଜ କେତେ ପ୍ରଭାବଶାଳୀ ହୋଇଛି?`, type: 'radio', options: [{ name: 'ବହୁତ ପ୍ରଭାବଶାଳୀ', score: 0 }, { name: 'କିଛି ମାତ୍ରାରେ ପ୍ରଭାବଶାଳୀ', score: 1 }, { name: 'ପ୍ରଭାବଶାଳୀ ନୁହେଁ |', score: 2 }, { name: 'ସରକାର ଏପର୍ଯ୍ୟନ୍ତ କୌଣସି ସହାୟତା ପ୍ୟାକେଜ୍ ପ୍ରଦାନ କରିନାହାଁନ୍ତି କିମ୍ବା ସେ ସୁବିଧା ପାଇ ନାହାନ୍ତି', score: 2 }, { name: 'ଏହିପରି ସହାୟତା ପ୍ୟାକେଜ୍ (ଗୁଡିକ) ପାଇଁ ବ୍ୟବସାୟ ଟି ଯୋଗ୍ୟ ନୁହେଁ', score: 2 }, { name: 'ଏହି ସବୁ ସହାୟତା ପ୍ୟାକେଜଗୁଡ଼ିକ ବିଷୟରେ କୌଣସି ସଚେତନତା କରାଯାଇନାହିଁ', score: 2 }] },
        { que: 'ବ୍ୟବସାୟ ଟି ଉପରେ ତାଲା ବନ୍ଦ ର କୌଣସି ପ୍ରଭାବ ପଡିଅଛି କି ?', type: 'radio', options: [{ name: 'ବ୍ୟବସାୟ ସମ୍ପୂର୍ଣ୍ଣ ବନ୍ଦ ହୋଇଯାଇଛି', score: 3 }, { name: 'ପ୍ରାରମ୍ଭିକ ପର୍ଯ୍ୟାୟ ରେ ବନ୍ଦ ପରେ ବ୍ୟବସାୟ ସର୍ବନିମ୍ନ କ୍ଷମତାରେ କାର୍ଯ୍ୟ କରୁଛି', score: 2 }, { name: 'ବ୍ୟବସାୟଟି ଆଦୌ ବନ୍ଦ ନକରି କମ କ୍ଷମତାରେ କାର୍ଯ୍ୟ କରୁଛି', score: 1 }, { name: 'ପ୍ରାରମ୍ଭିକ ପର୍ଯ୍ୟାୟ ରେ ବନ୍ଦ ପରେ ବ୍ୟବସାୟ ଟି ପୂର୍ଣ୍ଣ କ୍ଷମତା ସହିତ କାର୍ଯ୍ୟ କରୁଛି', score: 1 }, { name: 'ବ୍ୟବସାୟ ଟି ଉପରେ ତାଲା ବନ୍ଦ ର କୌଣସି ପ୍ରଭାବ ପଡି ନାହିଁ / ଅଥବା ସେଠାରେ ତାଲା ବନ୍ଦ ହୋଇ ନଥିଲା', score: 0 }] },
        { que: `ବ୍ୟବସାୟ ଉପରେ ସରକାରୀ ନିୟମାବଳୀର କଣ ସବୁ ପ୍ରଭାବ ପଡି ଅଛି ? ( ଏକରୁ ଅଧିକ ଉତ୍ତର ଚୟନ କରାଯାଇପାରିବ)`, multipleText: true, type: 'checkbox', options: [{ name: 'କଞ୍ଚାମାଲ ଏବଂ ଅନ୍ୟାନ୍ୟ ସାମଗ୍ରୀ କିଣିବା କଷ୍ଟକର ହୋଇଛି', score: 1 }, { name: 'ବଜାରରେ ଉତ୍ପାଦ ସବୁ କୁ ବିକ୍ରୟ କରିବା / ଗ୍ରାହକଙ୍କୁ ଯୋଗାଯୋଗ କରିବା କଷ୍ଟକର ହୋଇଛି', score: 1 }, { name: 'ନୂତନ ଉତ୍ପାଦଗୁଡିକର ଅନୁମୋଦନ ଏବଂ ଗୁଣାତ୍ମକ ମାନ ପାଇଁ ଥିବା ଯାଞ୍ଚ ପ୍ରକ୍ରିୟା ରେ ବିଳମ୍ବ |', score: 1 }, { name: 'ସାଧାରଣ ଉପଯୋଗୀତା (ଯଥା ବିଦ୍ୟୁତ୍, ଜଳ, ଇତ୍ୟାଦି) ବ୍ୟବହାର କରିବା ମୂଲ୍ୟ ରେ ବୃଦ୍ଧି |', score: 1 }, { name: 'ମାନବ ସମ୍ବଳର ଅଭାବ / ଉପଲବ୍ଧତା ଅଥବା ମଜୁରୀ ରେ ବୃଦ୍ଧି', score: 1 }, { name: 'ଏଥି ମଧ୍ୟରୁ କିଛି ବି ନୁହେଁ', score: 0 }] },
        { que: 'କୋଭିଡ ୧୯ ପରିସ୍ଥିତି କୁ ନେଇ ଏହି ବଜାର ଅବସ୍ଥା ମଧ୍ୟରୁ କେଉଁଟି ବ୍ୟବସାୟ ପାଇଁ ସତ୍ୟ ଅଟେ ? (ଏକ ରୁ ଅଧିକ ଉତ୍ତର ଚୟନ କରାଯାଇପାରିବ)', multipleText: true, type: 'checkbox', options: [{ name: 'ଗ୍ରାହକଙ୍କ ମଧ୍ୟରେ ଚାହିଦା ହ୍ରାସ ପାଇଛି', score: 1 }, { name: 'ଡିଜିଟାଲ୍ ପ୍ଲାଟଫର୍ମ / ଇ-ବାଣିଜ୍ୟ ପରିବର୍ତ୍ତେ ଗ୍ରାହକମାନଙ୍କ ପାଖରେ ପହଞ୍ଚିବା ପାଇଁ ପାରମ୍ପରିକ ପଦ୍ଧତି ଉପରେ ନିର୍ଭରଶୀଳ', score: 1 }, { name: 'ବଜାର ଚାହିଦା ପରିବର୍ତ୍ତନର ଲାଭ ଉଠାଇବା ପାଇଁ ଉତ୍ପାଦ ଏବଂ ସେବାଗୁଡିକୁ ବିବିଧ କରିବା ପାଇଁ କୌଣସି ସୁଯୋଗ ନାହିଁ', score: 1 }, { name: 'କ୍ରେତା ବିକ୍ରେତା ଉପସ୍ଥିତ ରହି ଚାଲୁଥିବା ବଜାର ପ୍ରକ୍ରିୟା ବର୍ତମାନ ଏକ ବିପଦପୂର୍ଣ୍ଣ ସ୍ଥିତିରେ ଅଛି ଓ ଏଠାରେ କୌଣସି ସେବା ମିଳୁନାହିଁ', score: 1 }, { name: 'ବଜାର ଅଧିକ ପ୍ରତିଯୋଗିତାମୂଳକ ହୋଇପାରିଛି', score: 1 }, { name: 'ଗ୍ରାହକ ଏବଂ ଯୋଗାଣକାରୀଙ୍କ ସହିତ ଯୋଗାଯୋଗ ସମ୍ଭବ ହୋଇପାରୁ ନାହିଁ', score: 1 }, { name: 'ଏଗୁଡିକ ମଧ୍ୟରୁ କୌଣସି ଟି ବି ନୁହେଁ', score: 0 }] },
        { que: 'ନିମ୍ନରେ ଦିଆଯାଇଥିବା ବିପଦଗୁଡିକ ମଧ୍ୟରୁ କେଉଁଟି ନିକଟ ଭବିଷ୍ୟତରେ ବ୍ୟବସାୟକୁ ପ୍ରଭାବିତ କରିବାର ଅଧିକ ସମ୍ଭାବନା ରହି ଅଛି? (ଏକ ରୁ ଅଧିକ ଉତ୍ତର ଚୟନ କରାଯାଇପାରିବ)', multipleText: true, type: 'checkbox', options: [{ name: 'ଭୂକମ୍ପ', score: 1 }, { name: 'ବାତ୍ୟା / ଟାଇଫୁନ୍ / ସାମୁଦ୍ରିକ ଝଡ ଓ ପବନ ଯୋଗୁ ହେବାକୁ ଥିବା କ୍ଷତି', score: 1 }, { name: 'ବନ୍ୟା', score: 1 }, { name: 'ଭୂସ୍ଫଳନ', score: 1 }, { name: 'ଶିଳ୍ପ କ୍ଷେତ୍ରରେ ଅଗ୍ନିକାଣ୍ଡ / ଜଙ୍ଗଲ ରେ ଅଗ୍ନିକାଣ୍ଡ|', score: 1 }, { name: 'ମରୁଡ଼ି', score: 1 }, { name: 'ଅତ୍ୟଧିକ ଗରମ / ଅତ୍ୟଧିକ ଶୀତ |', score: 1 }, { name: 'ରାସାୟନିକ ନିର୍ଗମନ', score: 1 }, { name: 'ବିବାଦ ଏବଂ ସାମାଜିକ ଅସ୍ଥିରତା |', score: 1 }, { name: 'ଏଥି ମଧ୍ୟରୁ କିଛି ବି ନୁହେଁ', score: 0 }] },
    ];

    const [agreeed, setAgreeed] = useState(false);
    const [show, setShow] = useState(true);
    const [showAnimation, setShowAnimation] = useState(false);
    const [userId, setUserId] = useState('');
    const [position, setPosition] = useState([0, 0]);
    const location = useLocation();
    const [answerArray, SetAnswerArray] = useState(Array());
    const [questionNo, SetQuestionNo] = useState(0);
    const [error, SetError] = useState(false);
    const [showPopover, setShowPopover] = useState(false);
    const [target, setTarget] = useState(null);
    const ref = useRef(null);
    const speechref = useRef(null);
    const [currency, setCurrancy] = useState(["AED", "AFN", "ALL", "AMD", "ANG", "AOA", "ARS", "AUD", "AWG", "AZN", "BAM", "BBD", "BDT", "BGN", "BHD", "BIF", "BMD", "BND", "BOB", "BRL", "BSD", "BTN", "BWP", "BYN", "BZD", "CAD", "CDF", "CHF", "CLP", "CNY", "COP", "CRC", "CUP", "CVE", "CZK", "DJF", "DKK", "DOP", "DZD", "EGP", "ERN", "ETB", "EUR", "FJD", "FKP", "GBP", "GEL", "GGP", "GHS", "GIP", "GMD", "GNF", "GTQ", "GYD", "HKD", "HNL", "HRK", "HTG", "HUF", "IDR", "ILS", "IMP", "INR", "IQD", "IRR", "ISK", "JEP", "JMD", "JOD", "JPY", "KES", "KGS", "KHR", "KMF", "KPW", "KRW", "KWD", "KYD", "KZT", "LAK", "LBP", "LKR", "LRD", "LSL", "LYD", "MAD", "MDL", "MGA", "MKD", "MMK", "MNT", "MOP", "MRU", "MVR", "MWK", "MXN", "MYR", "MZN", "NAD", "NGN", "NIO", "NOK", "NPR", "NZD", "OMR", "PEN", "PGK", "PHP", "PKR", "PLN", "PYG", "QAR", "RON", "RSD", "RUB", "RWF", "SAR", "SBD", "SCR", "SDG", "SEK", "SGD", "SHP", "SLL", "SOS", "SRD", "SSP", "STN", "SYP", "SZL", "THB", "TJS", "TMT", "TND", "TOP", "TRY", "TTD", "TWD", "TZS", "UAH", "UGX", "USD", "UYU", "UZS", "VES", "VND", "VUV", "WST", "XAF", "XCD", "XDR", "XOF", "XPF", "YER", "ZAR", "ZMW"])
    const [selectedCurruncy, setselectedCurruncy] = useState('');
    const [language, setLanguage] = useState('En');

    const topRef = useRef()
    const idleTimer = useRef(null);

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

        let arr = [];
        // debugger;
        // console.log(language);
        // console.log(allQuestionArray[language][questionNo].que);

        for (let index = 0; index < allQuestionArray[language].length; index++) {
            const element = allQuestionArray[language][index];
            if (index == 12) {
                arr.push({
                    questionNo: index + 1, question: element.que, answer: {
                        title1: 'Impact on production and services', ans1: '',
                        title2: 'Impact on market access', ans2: '',
                        title3: 'Impact on cashflow and sales', ans3: '',
                        title4: 'Impact on employees', ans4: ''
                    }
                })
            }
            else {
                if (element.type == 'checkbox') {
                    arr.push({ questionNo: index + 1, question: element.que, answer: [] })
                }
                else if (element.type == 'radio') {
                    arr.push({ questionNo: index + 1, question: element.que, answer: '' })
                }
                else if (element.type == 'select') {
                    arr.push({ questionNo: index + 1, question: element.que, answer: '' })
                }
                else if (element.type == 'textinput') {
                    arr.push({ questionNo: index + 1, question: element.que, answer: '' })
                }
            }

        }
        init();
        SetAnswerArray(arr);

        let lang = localStorage.getItem('language');
        setLanguage(lang);

    }, [])

    const init = () => {
        const speech = new Speech();
        speech
            .init({
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

        // debugger;
        // console.log(allQuestionArray[language][questionNo].que);
        // SetQuestionNo(12);

    }

    const prepareSpeakButton = (speech) => {
        const speakButton = document.getElementById("play");
        const pauseButton = document.getElementById("pause");
        const resumeButton = document.getElementById("resume");
        speakButton.addEventListener("click", () => {
            const lang = language == 'en' ? "en-GB" : "es-ES";
            if (lang) speech.setLanguage(lang);
            speech.speak({
                text: language == 'sp' ? spaa[questionNo] : aa[questionNo],
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

    useEffect(() => {
        init();
    }, [questionNo]);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition((position) => {
            setPosition([position.coords.latitude, position.coords.longitude])
        })
    }, [position]);

    useEffect(() => {
        if (location.state && location.state.userId) {
            setUserId(location.state.userId);
        }
    }, [location]);

    const submitForm = (e) => {
        e.preventDefault()
        let num = questionNo, flag = false;
        if (questionNo == allQuestionArray[language].length - 1) {
            if ((answerArray[num].answer.length > 0) || (answerArray[num].answer != '')) {
                flag = true
            }
        }

        if (((questionNo) == (allQuestionArray[language].length - 1)) && agreeed && flag) {

            let que17 = language == 'sp' ? answerArray[17].answer[0].name == 'Ninguna de las anteriores.' : answerArray[17].answer[0].name == 'None of these' ? 5 : answerArray[17].answer.length == 5 ? 1 : (5 - answerArray[17].answer.length);
            let que24 = language == 'sp' ? answerArray[24].answer[0].name == 'Ninguna de las anteriores.' : answerArray[24].answer[0].name == 'None of these' ? 5 : (5 - answerArray[24].answer.length);

            let HR = answerArray[14].answer.score + answerArray[15].answer.score + que17 + answerArray[18].answer.score
            let OP = answerArray[22].answer.score + answerArray[23].answer.reduce((a, b) => +a + +b.score, 0) + que24 + answerArray[25].answer.score
            let FIN = answerArray[26].answer.reduce((a, b) => +a + +b.score, 0) + answerArray[27].answer.score + answerArray[28].answer.score
            let TI = answerArray[21].answer.score + answerArray[20].answer.score

            let Rint = ((0.25 * OP) + (0.25 * HR) + (0.25 * FIN) + (0.25 * TI)).toFixed(3);

            let MKT = answerArray[33].answer.reduce((a, b) => +a + +b.score, 0),
                GP = answerArray[30].answer.score + answerArray[31].answer.score + answerArray[32].answer.reduce((a, b) => +a + +b.score, 0),
                HE = answerArray[34].answer.length >= 4 ? 4 : answerArray[34].answer.reduce((a, b) => +a + +b.score, 0);

            let Rex = (0.33 * (MKT + GP + HE)).toFixed(3)

            let Ro = ((0.5 * Rex) + (0.5 * Rint)).toFixed(2);

            let resultData = {
                HR, OP, FIN, TI, MKT, GP, HE, Rint, Rex, Ro
            }

            let risk_category = '';

            if (Ro > 6.81) {
                risk_category = 'very high'
            }
            else if ((Ro >= 5.21) && (Ro <= 6.81)) {
                risk_category = 'high'
            }
            else if ((Ro > 3.59) && (Ro < 5.21)) {
                risk_category = 'medium'
            }
            else if ((Ro >= 1.99) && (Ro <= 3.59)) {
                risk_category = 'low'
            }
            else {
                risk_category = 'very low'
            }

            let payload = {
                score: JSON.stringify(resultData),
                risk_category: risk_category,
                latitude: position[0],
                longitude: position[1],
                questions_array: JSON.stringify(answerArray),
                user_id: userId
            }
            saveQuesionsService(payload, (CB) => {
                if (CB.status == 'Success') {
                    if (location.state && location.state.prevData) {
                        props.history.replace({
                            pathname: 'dashboard',
                            state: { resultData, position, pastData: location.state.prevData }
                        })
                    } else if (location.state && location.state.guestUser) {
                        props.history.replace({
                            pathname: 'dashboard',
                            state: { resultData, position, guestUser: true }
                        })
                    } else {
                        props.history.replace({
                            pathname: 'dashboard',
                            state: { resultData, position }
                        })
                    }

                }
            });

        }

    }

    const handleChange = (e, item) => {
        const isChecked = e.target.checked;
        let arr = [...answerArray];

        let temp = _.filter(arr[questionNo].answer, function (o) { return (o.name.includes('None of these') || o.name.includes('Ninguna de las anteriores.') || o.name.includes("None whatsoever") || o.name.includes("Ningún efecto.") || o.name.includes("No current impact on supply chain") || o.name.includes("Actualmente, no se experimenta ningún impacto en la cadena de suministro.")) })
        if (isChecked) {
            if (item.name.includes('None of these') || item.name.includes('Ninguna de las anteriores.') || item.name.includes("None whatsoever") || item.name.includes("Ningún efecto.") || item.name.includes("No current impact on supply chain") || item.name.includes("Actualmente, no se experimenta ningún impacto en la cadena de suministro.")) {
                let temp = []
                temp.push(item)
                arr[questionNo].answer = temp
                SetAnswerArray(arr);
            }
            else if (temp.length) {
                let temp = []
                temp.push(item)
                arr[questionNo].answer = temp
                SetAnswerArray(arr);
            }
            else {
                arr[questionNo].answer.push(item)
                SetAnswerArray(arr);
            }

        } else {
            let filteredArr = _.filter(arr[questionNo].answer, function (o) { return o.name !== item.name });

            arr[questionNo].answer = filteredArr
            SetAnswerArray(arr);
        }

        SetError(false)

    }

    const handleClick = (event) => {
        setShowPopover(!showPopover);
        setTarget(event.target);
    };

    const handleClose = () => setShow(false);

    const handleRadioChange = (e, item) => {
        let arr = [...answerArray];
        arr[questionNo].answer = item;
        SetAnswerArray(arr);
        SetError(false)
    }

    const handleSelectChange = (e, item) => {
        let arr = [...answerArray];
        arr[questionNo].answer = e.target.value;
        SetAnswerArray(arr);
        SetError(false)
    }

    const nextClick = () => {

        let num = questionNo, flag = false;
        if (num == 9) {
            setShowAnimation(true)
        } else if (num == 17) {
            setShowAnimation(true)
        } else if (num == 26) {
            setShowAnimation(true)
        } else if (num == 34) {
            setShowAnimation(true)
        }

        if (num == 4) {
            if (selectedCurruncy == '' || answerArray[questionNo].answer == '') {
                SetError(true)
            }
            else {
                SetQuestionNo(num + 1);
                SetError(false)
            }
        } else if (num == 9) {
            SetQuestionNo(num + 1);
        }
        else if (num == 12) {
            if ((answerArray[questionNo].answer.ans1 == '') || (answerArray[questionNo].answer.ans2 == '') || (answerArray[questionNo].answer.ans3 == '') || (answerArray[questionNo].answer.ans4 == '')) {
                SetError(true)
            }
            else {
                SetQuestionNo(num + 1);
                SetError(false)
            }
        }
        else {
            if ((answerArray[num].answer.length > 0) || (answerArray[num].answer != '')) {
                if (num == 10) {
                    if (answerArray[10].answer.name.includes('Yes') || answerArray[10].answer.name.includes('si')) {
                        SetQuestionNo(num + 1);
                    } else {
                        SetQuestionNo(num + 2);
                    }
                    setShowPopover(false)
                    setTarget(null)
                } else if (num == 28) {
                    if (answerArray[28].answer.name.includes('The business currently does not have or has never purchased any insurance') || answerArray[28].answer.name.includes('The business does not have access to any insurance') || answerArray[28].answer.name.includes('Actualmente, la empresa no tiene o nunca ha adquirido un seguro.') || answerArray[28].answer.name.includes('La empresa no tiene acceso a ningún seguro.')) {
                        SetQuestionNo(num + 2);
                    } else {
                        SetQuestionNo(num + 1);
                    }
                }
                else {
                    SetQuestionNo(num + 1);
                }
                SetError(false)
            } else {
                SetError(true)
            }
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

        <IdleTimer
            ref={idleTimer}
            timeout={1000 * 60 * 15}
            // onActive={handleOnActive}
            onIdle={handleOnIdle}
            // onAction={handleOnAction}
            debounce={250}
        >
            {/* {alert(language)} */}
            <section className="bg-img">
                <Modal
                    size='lg'
                    show={show}
                    onHide={handleClose}
                    backdrop="static"
                    keyboard={false}>
                    <Modal.Header >
                        <Modal.Title style={{ fontFamily: 'Roboto', fontWeight: 'bold' }}>
                            {
                                localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).genaralStatement : ''
                            }
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="row">
                            <span style={{ display: 'flex', padding: '10px' }}>
                                <img
                                    style={{ height: '24px', marginTop: '1vh', marginRight: '10px' }}
                                    alt="research"
                                    src={require('./../assets/img/images/research.png')}
                                    className="img-fluid" />
                                <p style={{ fontFamily: 'Roboto', marginBottom: '0rem' }}>
                                    {
                                        localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).genaralStatement1 : ''
                                    }
                                </p>
                            </span>
                            <span style={{ display: 'flex', paddingLeft: '10px', paddingRight: '10px' }}>
                                <img
                                    style={{ height: '20px', width: '20px', marginTop: '1vh', marginRight: '10px' }}
                                    alt="navigation"
                                    src={require('./../assets/img/images/navigation.png')}
                                    className="img-fluid" />
                                <p style={{ fontFamily: 'Roboto', }}>
                                    {
                                        localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).genaralStatement2 : ''
                                    }
                                </p>
                            </span>
                            <p style={{ fontFamily: 'Roboto', padding: '10px', marginBottom: '-0.5rem' }}>
                                <span style={{ marginRight: '10px' }}>
                                    <img
                                        style={{ height: 18, width: 18 }}
                                        alt="hourglass"
                                        src={require('./../assets/img/images/hourglass.png')}
                                        className="img-fluid" />
                                </span>
                                {
                                    localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).genaralStatement3 : ''
                                }
                            </p>
                            <p style={{ fontFamily: 'Roboto', padding: '10px', marginBottom: '-1rem' }}>
                                <span style={{ marginRight: '10px' }}>
                                    <img
                                        style={{ height: 18, width: 18 }}
                                        alt="study"
                                        src={require('./../assets/img/images/study.png')}
                                        className="img-fluid" />
                                </span>
                                {
                                    localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).genaralStatement4a : ''
                                }
                                <a style={{ color: 'blue' }} href="https://www.undrr.org/terminology" target="_blank">
                                    {
                                        localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).genaralStatement4b : ''
                                    }
                                </a>
                            </p>
                        </div >
                    </Modal.Body>
                    <Modal.Header >
                        <Modal.Title style={{ fontFamily: 'Roboto', fontWeight: 'bold' }}>
                            {
                                localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).disclaimer : ''
                            }
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <span style={{ display: 'flex', }}>
                            <img
                                style={{ height: '20px', width: '20px', marginTop: '1vh', marginRight: '10px' }}
                                alt="gear"
                                src={require('./../assets/img/images/gear.png')}
                                className="img-fluid" />
                            <p style={{ fontFamily: 'Roboto', }}>
                                {
                                    localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).disclaimer1 : ''
                                }
                            </p>
                        </span>
                        <span style={{ display: 'flex', }}>
                            <img
                                style={{ height: '20px', width: '20px', marginTop: '1vh', marginRight: '10px' }}
                                alt="interchange"
                                src={require('./../assets/img/images/interchange.png')}
                                className="img-fluid" />
                            <p style={{ fontFamily: 'Roboto', }}>
                                {
                                    localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).disclaimer2 : ''
                                }
                            </p>
                        </span>
                        <span style={{ display: 'flex', }}>
                            <img
                                style={{ height: '20px', marginTop: '1vh', marginRight: '10px' }}
                                alt="stop"
                                src={require('./../assets/img/images/stop.png')}
                                className="img-fluid" />
                            <p style={{ fontFamily: 'Roboto' }}>
                                {
                                    localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).disclaimer3 : ''
                                }
                            </p>
                        </span>
                        <span style={{ display: 'flex', }}>
                            <img
                                style={{ height: '20px', marginTop: '1vh', marginRight: '10px' }}
                                alt="result"
                                src={require('./../assets/img/images/result.png')}
                                className="img-fluid" />
                            <p style={{ fontFamily: 'Roboto' }}>
                                {
                                    localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).disclaimer4 : ''
                                }
                            </p>
                        </span>
                        <div className="col-md-12">
                            <div style={{ padding: 5, margin: 5, borderRadius: 20, }} >
                                <div className="custom-control custom-checkbox">
                                    <input type="checkbox" aria-label={'I accept terms and conditions'} aria-required="true" checked={agreeed} id={'agreeed'} onChange={(e) => setAgreeed(e.target.checked)} className="custom-control-input" />
                                    <label style={{ color: '#002a4a' }} className="custom-control-label" htmlFor={'agreeed'}>
                                        {
                                            localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).agreeTerm : ''
                                        }
                                    </label>
                                </div>
                            </div>
                            <button style={{ backgroundColor: '#002a4a' }} onClick={() => { setShow(false); setShowAnimation(true); }} disabled={!agreeed} className='btn btn-primary' variant="primary">
                                {
                                    localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).iAgree : ''
                                }
                            </button>
                        </div>
                    </Modal.Body>
                </Modal>
                <div ref={topRef} className="container-fluid">
                    <div className="row head-img">
                        <div className="col-md-12 ">
                            <div className="row tabmargin">
                                <div className="col-md-3 col-3">
                                    <a target="_blank" href='https://www.undrr.org/'>
                                        <img
                                            alt="undrrlogocolor"
                                            style={{ marginTop: '1vh', marginLeft: '2vw', width: '85%' }}
                                            src={require('./../assets/img/images/undrrlogocolor.png')} className="img-fluid" />
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
                </div>
                <div className="row" style={{ backgroundColor: '#dedede', margin: '0px' }}>
                    <div className="col-md-5 col-12 padd-0" style={{ width: '100vw', backgroundColor: '#dedede' }} >
                        <p style={{ color: '#234081', padding: '2vh', margin: 0, marginLeft: '1vw', fontFamily: 'Roboto' }}>
                            {
                                localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).toolName : ''
                            }
                        </p>
                    </div>
                    <div className="col-md-5 col-1 padd-0 AudioControl" style={{ backgroundColor: '#dedede', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }} >
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
                            <img alt="home" style={{ height: 25, width: 25 }} src={require('./../assets/img/home.png')} />
                        </button>
                    </div>
                    <div
                        className="col-md-1"
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
                            {
                                localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).logout : ''
                            }
                        </button>
                    </div>
                </div>
                <div class="container-fluid question-img" style={{ backgroundColor: '#ffffff', height: '100%' }}>
                    <div className="row pbalignment" >
                        <div className="row" style={{ height: '10vh', width: '100%' }}>
                            {
                                questionNo == 0 && showAnimation ?
                                    <React.Fragment>
                                        <span className='yoga1' style={{ fontFamily: 'Roboto', fontSize: 12, marginTop: '4vh' }}>
                                            {
                                                localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).letsStart : ''
                                            }
                                        </span>
                                        <img
                                            src={require('./../assets/img/images/gif/yoga1.gif')}
                                            alt="yoga1"
                                            style={{ height: '10vh' }}
                                            className="img-fluid" />
                                    </React.Fragment>
                                    :
                                    null
                            }
                            {
                                questionNo == 3
                                    ?
                                    <React.Fragment>
                                        <span className='yoga2' style={{ fontFamily: 'Roboto', fontSize: 12, marginTop: '4vh' }}></span>
                                        <img
                                            src={require('./../assets/img/images/gif/gif6.gif')}
                                            alt="gif6"
                                            style={{ height: '10vh' }}
                                            className="img-fluid" />
                                    </React.Fragment>
                                    :
                                    null
                            }
                            {
                                questionNo == 6 ?
                                    <React.Fragment>
                                        <span className='yoga3' style={{ fontFamily: 'Roboto', fontSize: 12, marginTop: '4vh' }}></span>
                                        <img
                                            src={require('./../assets/img/images/gif/yoga2.gif')}
                                            alt="yoga2"
                                            style={{ height: '10vh' }}
                                            className="img-fluid" />
                                    </React.Fragment>
                                    :
                                    null
                            }
                            {
                                questionNo == 9
                                    ?
                                    <React.Fragment>
                                        <span className='yoga4' style={{ fontFamily: 'Roboto', fontSize: 12, marginTop: '4vh' }}></span>
                                        <img
                                            src={require('./../assets/img/images/gif/gif7.gif')}
                                            alt="gif7"
                                            style={{ height: '10vh' }}
                                            className="img-fluid" />
                                    </React.Fragment>
                                    :
                                    null
                            }
                            {
                                questionNo == 13 ?
                                    <React.Fragment>
                                        <span className='yoga5' style={{ fontFamily: 'Roboto', fontSize: 12, marginTop: '4vh' }}></span>
                                        <img
                                            src={require('./../assets/img/images/gif/yoga3.gif')}
                                            alt="yoga3"
                                            style={{ height: '10vh' }}
                                            className="img-fluid" />
                                    </React.Fragment>
                                    :
                                    null
                            }
                            {
                                questionNo == 17 ?
                                    <React.Fragment>
                                        <span className='yoga6' style={{ fontFamily: 'Roboto', fontSize: 12, marginTop: '4vh' }}>
                                            {
                                                localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).halfWay : ''
                                            }
                                        </span>
                                        <img
                                            src={require('./../assets/img/images/gif/gif8.gif')}
                                            alt="gif8"
                                            style={{ height: '10vh' }}
                                            className="img-fluid" />
                                    </React.Fragment>
                                    :
                                    null
                            }
                            {
                                questionNo == 20 ?
                                    <React.Fragment>
                                        <span className='yoga7' style={{ fontFamily: 'Roboto', fontSize: 12, marginTop: '4vh' }}></span>
                                        <img
                                            src={require('./../assets/img/images/gif/yoga4.gif')}
                                            alt="yoga4"
                                            style={{ height: '10vh' }}
                                            className="img-fluid" />
                                    </React.Fragment>
                                    :
                                    null
                            }
                            {
                                questionNo == 23
                                    ?
                                    <React.Fragment>
                                        <span className='yoga8' style={{ fontFamily: 'Roboto', fontSize: 12, marginTop: '4vh' }}></span>
                                        <img
                                            src={require('./../assets/img/images/gif/gif9.gif')}
                                            alt="gif9"
                                            style={{ height: '10vh' }}
                                            className="img-fluid" />
                                    </React.Fragment>
                                    :
                                    null
                            }
                            {
                                questionNo == 27
                                    ?
                                    <React.Fragment>
                                        <span className='yoga9' style={{ fontFamily: 'Roboto', fontSize: 12, marginTop: '4vh' }}></span>
                                        <img
                                            src={require('./../assets/img/images/gif/yoga5.gif')}
                                            alt="yoga5"
                                            style={{ height: '10vh' }}
                                            className="img-fluid" />
                                    </React.Fragment>
                                    :
                                    null
                            }
                            {
                                questionNo == 30
                                    ?
                                    <React.Fragment>
                                        <span className='yoga10' style={{ fontFamily: 'Roboto', fontSize: 12, marginTop: '4vh' }}></span>
                                        <img
                                            src={require('./../assets/img/images/gif/gif10.gif')}
                                            alt="gif10"
                                            style={{ height: '10vh' }}
                                            className="img-fluid" />
                                    </React.Fragment>
                                    :
                                    null
                            }
                            {
                                questionNo == 34 ?
                                    <React.Fragment>
                                        <span className='yoga11' style={{ fontFamily: 'Roboto', fontSize: 12, marginTop: '4vh' }}></span>
                                        <img
                                            src={require('./../assets/img/images/gif/gif11.gif')}
                                            alt="gif11"
                                            style={{ height: '10vh' }}
                                            className="img-fluid" />
                                    </React.Fragment>
                                    :
                                    null
                            }
                        </div>
                        <Progress
                            percent={Math.round((questionNo + 1) / allQuestionArray[language].length * 100)} status="success"
                            theme={
                                {
                                    success: {
                                        symbol: Math.round((questionNo + 1) / allQuestionArray[language].length * 100) + '%',
                                        trailColor: 'lime',
                                        color: 'green'
                                    }
                                }
                            }
                        />
                    </div>
                    <div className="row padd-0" style={{ height: '10vh', alignItems: 'center', justifyContent: 'center', marginTop: '10vh' }}>
                        <p style={{ color: '#1f6191', margin: 0, textAlign: 'center', fontWeight: 'bold', fontSize: '1.5rem', fontFamily: 'Roboto' }}>
                            {
                                questionNo < 9 ?
                                    localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).bprofile : ''
                                    :
                                    (questionNo >= 9) && (questionNo < 14) ?
                                        localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).understandingTheOrg : ''
                                        :
                                        (questionNo >= 14) && (questionNo < 20) ?
                                            localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).HR : ''
                                            :
                                            (questionNo >= 20) && (questionNo < 22) ?
                                                localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).TI : ''
                                                :
                                                (questionNo >= 22) && (questionNo < 26) ?
                                                    localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).OP : ''
                                                    :
                                                    (questionNo >= 26) && (questionNo < 30) ?
                                                        localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).FIN : ''
                                                        :
                                                        (questionNo >= 30) && (questionNo < 33) ?
                                                            localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).GP : ''
                                                            :
                                                            (questionNo >= 33) && (questionNo < 34) ?
                                                                localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).MKT : ''
                                                                :
                                                                (questionNo >= 34) ?
                                                                    localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).EXH : ''
                                                                    :
                                                                    ''
                            }
                        </p>
                    </div>
                    <div class="row ">
                        <div class="col-md-6 col-center top-botm-10">
                            <form action="" onSubmit={submitForm} >
                                <div class="fields-container">
                                    <div style={{ display: 'flex', flexDirection: 'row' }} class="col-md-12 top-20 login-heading">
                                        <Overlay
                                            show={showPopover}
                                            target={target}
                                            placement="top"
                                            container={ref.current}
                                            containerPadding={20}>
                                            <Popover id="popover-contained">
                                                <Popover.Content>
                                                    <p style={{ fontFamily: 'Roboto' }}>
                                                        {/* {i18n[language == 'en' ? 'en' : 'sp'].questionnaire.BCPDetails} */}
                                                        {localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).BCPDetails : ''}
                                                    </p>
                                                </Popover.Content>
                                            </Popover>
                                        </Overlay>
                                        <label style={{ whiteSpace: 'pre-line' }} class="card-title">
                                            {
                                                allQuestionArray[language][questionNo].que
                                            }
                                            <span style={{ color: '#ffffff' }}>
                                                <i>
                                                    {
                                                        allQuestionArray[language][questionNo].multipleText
                                                            ?
                                                            localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).multipleSelect : ''
                                                            :
                                                            null
                                                    }
                                                </i>
                                            </span>
                                        </label>
                                        {
                                            questionNo == 10 ?
                                                <img
                                                    src={require('./../assets/img/images/information.png')}
                                                    alt="information"
                                                    onClick={handleClick}
                                                    style={{ position: 'absolute', right: '5px', bottom: '1px' }}
                                                    className="img-fluid" />
                                                :
                                                null
                                        }

                                    </div>
                                    <div class="col-md-12 login-wht-box">
                                        {
                                            answerArray.length > 0 ?
                                                <div class="row">
                                                    {
                                                        questionNo == 7 ?
                                                            <div className="col-md-12">
                                                                <div style={{ padding: '10px 27px' }}>
                                                                    <CountryDropdown
                                                                        classes='custom-select custom-select-sm'
                                                                        value={answerArray[questionNo].answer}
                                                                        onChange={(val) => {
                                                                            let arr = [...answerArray];
                                                                            arr[questionNo].answer = val;
                                                                            SetAnswerArray(arr);
                                                                            SetError(false)
                                                                        }}
                                                                    />
                                                                </div>
                                                            </div>
                                                            :
                                                            questionNo == 8 ?
                                                                <div className="col-md-12">
                                                                    <div style={{ padding: '10px 27px' }}>
                                                                        <RegionDropdown
                                                                            classes='custom-select custom-select-sm'
                                                                            country={answerArray[questionNo - 1].answer}
                                                                            value={answerArray[questionNo].answer}
                                                                            onChange={(val) => {
                                                                                let arr = [...answerArray];
                                                                                arr[questionNo].answer = val;
                                                                                SetAnswerArray(arr);
                                                                                SetError(false)
                                                                            }}
                                                                        />
                                                                    </div>
                                                                </div>
                                                                :
                                                                questionNo == 12 ?
                                                                    <div className="col-md-12">
                                                                        {
                                                                            // (language == 'sp' ? spQuestionArray[12] : questionArray[12]).options.map((item, index) => {
                                                                            allQuestionArray[language][questionNo].options.map((item, index) => {
                                                                                return (
                                                                                    <div key={index} className="col-md-12">
                                                                                        <p>{item.title}</p>
                                                                                        {
                                                                                            item.innerOptions.map((item1, index1) => {
                                                                                                return (
                                                                                                    <div key={item.title} className="col-md-12">
                                                                                                        <div style={{
                                                                                                            padding: 5, margin: 5, borderRadius: 20, backgroundColor: index == 0 ? (answerArray[questionNo].answer.ans1 == item1) ? '#1f6191' : '#fafafa' :
                                                                                                                index == 1 ? (answerArray[questionNo].answer.ans2 == item1) ? '#1f6191' : '#fafafa' :
                                                                                                                    index == 2 ? (answerArray[questionNo].answer.ans3 == item1) ? '#1f6191' : '#fafafa' :
                                                                                                                        index == 3 ? (answerArray[questionNo].answer.ans4 == item1) ? '#1f6191' : '#fafafa' : '#fafafa', color: index == 0 ? (answerArray[questionNo].answer.ans1 == item1) ? '#ffffff' : '#000000' :
                                                                                                                            index == 1 ? (answerArray[questionNo].answer.ans2 == item1) ? '#ffffff' : '#000000' :
                                                                                                                                index == 2 ? (answerArray[questionNo].answer.ans3 == item1) ? '#ffffff' : '#000000' :
                                                                                                                                    index == 3 ? (answerArray[questionNo].answer.ans4 == item1) ? '#ffffff' : '#000000' : '#000000'
                                                                                                        }}>
                                                                                                            <div key={item.title} className="custom-control custom-radio">
                                                                                                                <input aria-label={item.title + '' + item1} aria-required="true" key={item.title} type="radio" name={item.title + '::' + item1} id={item.title + '::' + item1}
                                                                                                                    checked={index == 0 ? (answerArray[questionNo].answer.ans1 == item1) ? true : false :
                                                                                                                        index == 1 ? (answerArray[questionNo].answer.ans2 == item1) ? true : false :
                                                                                                                            index == 2 ? (answerArray[questionNo].answer.ans3 == item1) ? true : false :
                                                                                                                                index == 3 ? (answerArray[questionNo].answer.ans4 == item1) ? true : false : false}
                                                                                                                    onChange={(e, itm) => {
                                                                                                                        let arr = [...answerArray];
                                                                                                                        if (index == 0) {
                                                                                                                            arr[questionNo].answer.ans1 = item1;
                                                                                                                        }
                                                                                                                        else if (index == 1) {
                                                                                                                            arr[questionNo].answer.ans2 = item1;
                                                                                                                        }
                                                                                                                        if (index == 2) {
                                                                                                                            arr[questionNo].answer.ans3 = item1;
                                                                                                                        }
                                                                                                                        if (index == 3) {
                                                                                                                            arr[questionNo].answer.ans4 = item1;
                                                                                                                        }
                                                                                                                        SetAnswerArray(arr);
                                                                                                                        SetError(false)
                                                                                                                    }} className="custom-control-input" />
                                                                                                                <label className="custom-control-label" htmlFor={item.title + '::' + item1}>{item1}</label>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </div>

                                                                                                )
                                                                                            })
                                                                                        }
                                                                                    </div>

                                                                                )
                                                                            })
                                                                        }
                                                                    </div>
                                                                    :
                                                                    allQuestionArray[language][questionNo].type === 'checkbox' ?
                                                                        allQuestionArray[language][questionNo].options && allQuestionArray[language][questionNo].options.length ?
                                                                            language == 'sp' ? allQuestionArray[language][questionNo].options.map((item, index) => {
                                                                                var b = _.find(answerArray[questionNo].answer, ['name', item.name]);
                                                                                return (
                                                                                    <div key={item.name} className="col-md-12">
                                                                                        <div key={item.name} style={{ padding: 5, margin: 5, borderRadius: 20, backgroundColor: _.isObject(b) ? '#1f6191' : '#fafafa', color: _.isObject(b) ? '#ffffff' : '#000000' }} >

                                                                                            <div className="custom-control custom-checkbox">
                                                                                                <input aria-label={item.name} aria-required="true" type="checkbox" name={item.name} checked={(_.isObject(b)) ? true : false} id={item.name} onChange={(e) => handleChange(e, item)} className="custom-control-input" />
                                                                                                <label className="custom-control-label" htmlFor={item.name}>{item.name}</label>
                                                                                            </div>
                                                                                        </div>

                                                                                    </div>
                                                                                )
                                                                            }) :
                                                                                allQuestionArray[language][questionNo].options.map((item, index) => {
                                                                                    var b = _.find(answerArray[questionNo].answer, ['name', item.name]);
                                                                                    return (
                                                                                        <div key={item.name} className="col-md-12">
                                                                                            <div key={item.name} style={{ padding: 5, margin: 5, borderRadius: 20, backgroundColor: _.isObject(b) ? '#1f6191' : '#fafafa', color: _.isObject(b) ? '#ffffff' : '#000000' }} >
                                                                                                <div className="custom-control custom-checkbox">
                                                                                                    <input aria-label={item.name} aria-required="true" type="checkbox" name={item.name} checked={(_.isObject(b)) ? true : false} id={item.name} onChange={(e) => handleChange(e, item)} className="custom-control-input" />
                                                                                                    <label className="custom-control-label" htmlFor={item.name}>{item.name}</label>
                                                                                                </div>
                                                                                            </div>

                                                                                        </div>
                                                                                    )
                                                                                })
                                                                            : null :
                                                                        allQuestionArray[language][questionNo].type === 'radio' ?
                                                                            allQuestionArray[language][questionNo].options && allQuestionArray[language][questionNo].options.length ?
                                                                                language == 'sp' ? allQuestionArray[language][questionNo].options.map((item, index) => {
                                                                                    return (
                                                                                        <div key={item.name} className="col-md-12">
                                                                                            <div key={item.name} style={{ padding: 5, margin: 5, borderRadius: 20, backgroundColor: (_.includes(answerArray[questionNo].answer, item.name)) ? '#1f6191' : '#fafafa', color: (_.includes(answerArray[questionNo].answer, item.name)) ? '#ffffff' : '#000000' }}>
                                                                                                <div className="custom-control custom-radio">
                                                                                                    <input type="radio" aria-label={item.name} aria-required="true" name={item.name} checked={(_.includes(answerArray[questionNo].answer, item.name)) ? true : false} id={item.name} onChange={(e) => handleRadioChange(e, item)} className="custom-control-input" />
                                                                                                    <label className="custom-control-label" htmlFor={item.name}>{item.name}</label>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    )
                                                                                })
                                                                                    : allQuestionArray[language][questionNo].options.map((item, index) => {
                                                                                        return (
                                                                                            <div key={item.name} className="col-md-12">
                                                                                                <div key={item.name} style={{ padding: 5, margin: 5, borderRadius: 20, backgroundColor: (_.includes(answerArray[questionNo].answer, item.name)) ? '#1f6191' : '#fafafa', color: (_.includes(answerArray[questionNo].answer, item.name)) ? '#ffffff' : '#000000' }}>
                                                                                                    <div className="custom-control custom-radio">
                                                                                                        <input type="radio" aria-label={item.name} aria-required="true" name={item.name} checked={(_.includes(answerArray[questionNo].answer, item.name)) ? true : false} id={item.name} onChange={(e) => handleRadioChange(e, item)} className="custom-control-input" />
                                                                                                        <label className="custom-control-label" htmlFor={item.name}>{item.name}</label>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        )
                                                                                    })
                                                                                : null
                                                                            :
                                                                            allQuestionArray[language][questionNo].type === 'select' ?
                                                                                <div className="col-md-12">
                                                                                    <div style={{ padding: '10px 27px' }}>
                                                                                        <select
                                                                                            style={{ border: '1px solid #b6b6b6' }}
                                                                                            value={answerArray[questionNo].answer}
                                                                                            className='custom-select custom-select-sm'
                                                                                            onChange={handleSelectChange} >
                                                                                            {/* <option value={''}>{'Select'}</option> */}
                                                                                            <option value={''}>
                                                                                                {localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).select : ''}
                                                                                            </option>
                                                                                            {
                                                                                                allQuestionArray[language][questionNo].options && allQuestionArray[language][questionNo].options.length ?
                                                                                                    language == 'sp' ? allQuestionArray[language][questionNo].options.sort(function (a, b) {
                                                                                                        var nameA = a.name.toUpperCase(); // ignore upper and lowercase
                                                                                                        var nameB = b.name.toUpperCase(); // ignore upper and lowercase
                                                                                                        if (nameA < nameB) {
                                                                                                            return -1;
                                                                                                        }
                                                                                                        if (nameA > nameB) {
                                                                                                            return 1;
                                                                                                        }
                                                                                                        return 0;
                                                                                                    }).map((item, index) => {
                                                                                                        return (
                                                                                                            <option value={item.name}>{item.name}</option>
                                                                                                        )
                                                                                                    })
                                                                                                        : allQuestionArray[language][questionNo].options.sort(function (a, b) {
                                                                                                            var nameA = a.name.toUpperCase(); // ignore upper and lowercase
                                                                                                            var nameB = b.name.toUpperCase(); // ignore upper and lowercase
                                                                                                            if (nameA < nameB) {
                                                                                                                return -1;
                                                                                                            }
                                                                                                            if (nameA > nameB) {
                                                                                                                return 1;
                                                                                                            }

                                                                                                            return 0;
                                                                                                        }).map((item, index) => {
                                                                                                            return (
                                                                                                                <option value={item.name}>{item.name}</option>
                                                                                                            )
                                                                                                        })
                                                                                                    :
                                                                                                    null
                                                                                            }
                                                                                        </select>
                                                                                    </div>

                                                                                </div>
                                                                                :
                                                                                <div className="col-md-12">
                                                                                    <div className="row" style={{ padding: '10px' }}>
                                                                                        {
                                                                                            questionNo == 4 ?
                                                                                                <div className="col-md-3 col-4">
                                                                                                    <div style={{ padding: '12px' }}>
                                                                                                        <select
                                                                                                            style={{ border: '1px solid #b6b6b6' }}
                                                                                                            className='custom-select custom-select-sm'
                                                                                                            value={selectedCurruncy} onChange={(e) => {
                                                                                                                setselectedCurruncy(e.target.value);
                                                                                                            }} >
                                                                                                            <option value={''}>
                                                                                                                {/* {i18n[language == 'en' ? 'en' : 'sp'].questionnaire.select} */}
                                                                                                                {localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).select : ''}
                                                                                                            </option>
                                                                                                            {
                                                                                                                currency.sort().map((item, index) => {
                                                                                                                    return (
                                                                                                                        <option value={item}>{item}</option>
                                                                                                                    )
                                                                                                                })
                                                                                                            }
                                                                                                        </select>
                                                                                                    </div>

                                                                                                </div>
                                                                                                :
                                                                                                null
                                                                                        }
                                                                                        <div className={questionNo == 4 ? "col-md-9 col-8" : "col-md-12 col-12"}>
                                                                                            <div style={{ padding: '10px' }} className="input-group mb-3">
                                                                                                {
                                                                                                    questionNo == 4 ?
                                                                                                        <CurrencyFormat thousandSeparator={true}
                                                                                                            maxLength={25}
                                                                                                            onValueChange={(val) => {
                                                                                                                let arr = [...answerArray];
                                                                                                                arr[questionNo].answer = val.value;
                                                                                                                SetAnswerArray(arr);
                                                                                                                SetError(false)
                                                                                                            }}
                                                                                                            className="form-control"
                                                                                                            value={answerArray[questionNo].answer}
                                                                                                        />
                                                                                                        :
                                                                                                        <input aria-label={language == 'sp' ? allQuestionArray[language][questionNo].que : allQuestionArray[language][questionNo].que} aria-required="true" type="text" className="form-control" maxLength={questionNo == 3 ? 4 : questionNo == 5 ? 6 : questionNo == 9 ? 15 : 32} onChange={(e) => {
                                                                                                            let regex = /^[0-9]{0,32}$/;
                                                                                                            let arr = [...answerArray];
                                                                                                            if (regex.test(e.target.value)) {
                                                                                                                arr[questionNo].answer = e.target.value;
                                                                                                                SetError(false)
                                                                                                                SetAnswerArray(arr);
                                                                                                            }
                                                                                                        }}
                                                                                                            value={answerArray[questionNo].answer}
                                                                                                            style={{ height: 40 }} />

                                                                                                }
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                    }
                                                    {
                                                        allQuestionArray[language][questionNo].type == 'textinput' ?
                                                            questionNo == 4 ?
                                                                error && <p style={{ paddingLeft: 20, color: 'red', fontSize: 12, fontFamily: 'Roboto' }}>
                                                                    {localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).currencyErr : ''}
                                                                </p>
                                                                :
                                                                error && <p style={{ paddingLeft: 20, color: 'red', fontSize: 12, fontFamily: 'Roboto' }}>
                                                                    {localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).textInpErr : ''}
                                                                </p>
                                                            :
                                                            error && <p style={{ paddingLeft: 20, color: 'red', fontSize: 12, fontFamily: 'Roboto' }}>
                                                                {localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).selectErr : ''}
                                                            </p>
                                                    }
                                                </div>

                                                :
                                                null
                                        }
                                    </div>
                                    <div style={{ height: '5vh', }}></div>
                                    <div className='bottombutton' >
                                        {
                                            questionNo == (allQuestionArray[language].length - 1) ?
                                                <button className='btn btn-primary' style={{ backgroundColor: '#224483' }} type="submit">
                                                    {localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).submit : ''}
                                                </button>
                                                :
                                                <button className='btn btn-primary' style={{ backgroundColor: '#224483' }} disabled={questionNo == allQuestionArray[language].length - 1} onClick={nextClick} >
                                                    {localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).next : ''}
                                                </button>
                                        }
                                        <button className='btn btn-primary' style={{ backgroundColor: '#224483' }} disabled={questionNo == 0} onClick={() => {
                                            let num = questionNo;
                                            if (num == 12) {
                                                if (answerArray[10].answer.name.includes('Yes') || answerArray[10].answer.name.includes('si')) {
                                                    SetQuestionNo(num - 1);

                                                } else {
                                                    SetQuestionNo(num - 2);

                                                }
                                            } else if (num == 10) {
                                                SetQuestionNo(num - 1);
                                                setShowPopover(false)
                                                setTarget(null)
                                            }
                                            else if (num == 30) {
                                                if (answerArray[28].answer.name.includes('The business currently does not have or has never purchased any insurance') || answerArray[28].answer.name.includes('The business does not have access to any insurance') || answerArray[28].answer.name.includes('Actualmente, la empresa no tiene o nunca ha adquirido un seguro.') || answerArray[28].answer.name.includes('La empresa no tiene acceso a ningún seguro.')) {
                                                    SetQuestionNo(num - 2);
                                                } else {
                                                    SetQuestionNo(num - 1);
                                                }
                                            }
                                            else {
                                                SetQuestionNo(num - 1);
                                            }
                                            SetError(false)
                                        }} >{localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).prev : ''}</button>
                                    </div>
                                    <div className=' mobileButton' >
                                        {
                                            questionNo == (allQuestionArray[language].length - 1) ?
                                                <button className='btn btn-primary' style={{ backgroundColor: '#224483' }} type="submit">
                                                    {localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).submit : ''}
                                                </button>
                                                :
                                                <button className='btn btn-primary' style={{ backgroundColor: '#224483' }} disabled={questionNo == allQuestionArray[language].length - 1} onClick={nextClick} >
                                                    {localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).next : ''}
                                                </button>
                                        }
                                        <button className='btn btn-primary' style={{ backgroundColor: '#224483' }} disabled={questionNo == 0} onClick={() => {
                                            let num = questionNo;
                                            if (num == 12) {
                                                if (answerArray[10].answer.name.includes('Yes') || answerArray[10].answer.name.includes('si')) {
                                                    SetQuestionNo(num - 1);
                                                } else {
                                                    SetQuestionNo(num - 2);
                                                }
                                            }
                                            if (num == 10) {
                                                SetQuestionNo(num - 1);
                                                setShowPopover(false)
                                                setTarget(null)
                                            }
                                            else if (num == 30) {
                                                if (answerArray[28].answer.name.includes('The business currently does not have or has never purchased any insurance') || answerArray[28].answer.name.includes('The business does not have access to any insurance') || answerArray[28].answer.name.includes('Actualmente, la empresa no tiene o nunca ha adquirido un seguro.') || answerArray[28].answer.name.includes('La empresa no tiene acceso a ningún seguro.')) {
                                                    SetQuestionNo(num - 2);
                                                } else {
                                                    SetQuestionNo(num - 1);
                                                }
                                            }
                                            else {
                                                SetQuestionNo(num - 1);
                                            }
                                            SetError(false)
                                        }}>
                                            {localStorage.getItem(`LangDataFor${language}`) ? JSON.parse(localStorage.getItem(`LangDataFor${language}`)).prev : ''}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </IdleTimer>

    );
}

export default geolocated({
    positionOptions: {
        enableHighAccuracy: false,
    },
    userDecisionTimeout: 5000,
})(Questionnaire);
