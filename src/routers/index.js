import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Dashboard from './Dashboard';
import Questionnaire from './Questionnaire';
import ResultDashboard from './ResultDashboard';
import Login from './Login';
import Registration from './Registration';
import ForgotPassword from './ForgotPassword';
import ChangePassword from './ChangePassword';
import NotFound from './NotFound';
import AboutTool from './AboutTool';
import ProtectedRoute from "../components/ProtectedRoutes";

export default () => (
	<BrowserRouter basename='/'>
		<Switch>
			<Route exact path='/' component={Dashboard} />
			<ProtectedRoute exact path='/questionnaire' component={Questionnaire} />
			<Route exact path='/login' component={Login} />
			<Route exact path='/registration' component={Registration} />
			<Route exact path='/forgot' component={ForgotPassword} />
			<ProtectedRoute path='/dashboard' component={ResultDashboard} />
			<Route path='/changepassword' component={ChangePassword} />
			<Route path='/aboutTool' component={AboutTool} />
			<Route component={NotFound} />
		</Switch>
	</BrowserRouter>
);