import { Injectable } from '@angular/core';
import {
	Http,
	Request,
	RequestMethod,
	RequestOptions,
	RequestOptionsArgs,
	Response,
	XHRBackend,
} from '@angular/http';

import { AwsSigner } from 'aws-sign-web';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/mergeMap';

import { Config } from '../../config/config';
import { UserPoolService } from './user-pool.service';

@Injectable()
export class AuthHttpService extends Http {
	constructor(backend: XHRBackend, defaultOptions: RequestOptions, private userPoolService: UserPoolService) {
		super(backend, defaultOptions);
	}

	request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
		if (typeof url !== 'string') {
			throw new Error('Unhandled request style');
		}

		return this.userPoolService.getIdToken()
			.mergeMap(idToken => {
				options.headers.set('Authorization', idToken);
				return super.request(url, options);
			});
	}
}

export function authHttpLoader(backend: XHRBackend, defaultOptions: RequestOptions, userPoolService: UserPoolService) {
	return new AuthHttpService(backend, defaultOptions, userPoolService);
}
