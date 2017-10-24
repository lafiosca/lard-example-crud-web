import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserPoolService } from '../services';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
})
export class LoginComponent {
	constructor(private userPoolService: UserPoolService, private router: Router) {}

	login(username, password) {
		console.log('Log into Cognito User Pool');
		this.userPoolService.login(username, password)
			.subscribe({
				next: (session) => {
					console.log(`Logged in: ${JSON.stringify(session)}`);
					this.router.navigate(['/']);
				},
				error: (error) => {
					alert('Login failed');
					console.error(error);
				},
			});
	}
}

