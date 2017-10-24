import { Component, DoCheck } from '@angular/core';
import { Router } from '@angular/router';

import { UserPoolService } from '../services';
import { EditorService } from './editor.service';

@Component({
	selector: 'app-editor',
	templateUrl: './editor.component.html',
})
export class EditorComponent implements DoCheck {

	constructor(private userPoolService:UserPoolService, private router:Router, private editorService:EditorService) { }

	ngOnInit() {
		if (!this.userPoolService.isLoggedIn()) {
			console.log('Not logged in, redirecting to login page');
			this.router.navigate(['/login']);
		} else {
			this.editorService.refreshNotes(null);
		}
	}

	ngDoCheck() {
		if (!this.userPoolService.isLoggedIn()) {
			console.log('Not logged in, redirecting to login page');
			this.router.navigate(['/login']);
		}
	}
}
