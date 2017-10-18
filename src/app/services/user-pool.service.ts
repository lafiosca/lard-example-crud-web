import { Injectable } from '@angular/core';

import {
	AuthenticationDetails,
	CognitoIdentityCredentials,
	CognitoUser,
	CognitoUserAttribute,
	CognitoUserPool,
	CognitoUserSession,
} from 'amazon-cognito-identity-js';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/bindNodeCallback';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';

import { Config } from '../../config/config';

@Injectable()
export class UserPoolService {
	private userPool: CognitoUserPool;
	private user: CognitoUser;
	private session: CognitoUserSession;

	constructor() {
		this.userPool = new CognitoUserPool({
			UserPoolId: Config.cognito.userPoolId,
			ClientId: Config.cognito.appClientId,
		});
	}

	login(username, password) {
		this.user = null;
		this.session = null;

		let user = new CognitoUser({
			Username: username,
			Pool: this.userPool,
		});

		let authDetails = new AuthenticationDetails({
			Username: username,
			Password: password,
		});

		return Observable.create(observer => {
			user.authenticateUser(authDetails, {
				onSuccess: session => {
					this.user = user;
					this.session = session;
					observer.next(session);
					observer.complete();
				},
				onFailure: error => {
					console.error('Failed to authenticate to cognito user pool:', error);
					observer.error(error);
				},
			});
		});
	}

	logout() {
		if (this.user) {
			this.user.globalSignOut({
				onSuccess: msg => {
					console.log('Global sign out complete:', msg);
				},
				onFailure: error => {
					console.error('Global sign out failed:', error);
				},
			});
		}
		this.user = null;
		this.session = null;
	}

	isLoggedIn() {
		return this.user && this.session;
	}

	isSessionValid() {
		return this.session && this.session.isValid();
	}

	private refreshSession() {
		return Observable.bindNodeCallback(this.user.refreshSession.bind(this.user))(this.session.getRefreshToken())
			.map(session => {
				this.session = session;
				return session;
			});
	}

	getSession() {
		if (!this.user || !this.session) {
			return Observable.throw('Not logged in');
		}
		if (this.isSessionValid()) {
			return Observable.of(this.session);
		}
		return this.refreshSession();
	}

	getIdToken() {
		return this.getSession()
			.map(session => session.getIdToken().getJwtToken());
	}
}
