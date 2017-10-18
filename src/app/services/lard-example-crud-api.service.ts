import { Injectable } from '@angular/core';

import { AuthHttpService } from './auth-http.service';
import { Config } from '../../config/config';
import { DefaultApi } from './lard-example-crud-api-sdk/api/DefaultApi';

@Injectable()
export class LardExampleCrudApiService {
	constructor(private authHttp: AuthHttpService) { }

	private getClient() {
		return new DefaultApi(this.authHttp, Config.api.basePath);
	}

	getNotes() {
		return this.getClient()
			.getNotes()
			.map(response => response.data);
	}

	getNote(noteId) {
		return this.getClient()
			.getNote(noteId)
			.map(response => response.data);
	}

	createNote(note) {
		const body = { data: note };
		return this.getClient()
			.createNote(note)
			.map(response => response.data);
	}

	updateNote(note) {
		const body = { data: note };
		return this.getClient()
			.updateNote(note.id, body)
			.map(response => response.data);
	}

	deleteNote(noteId) {
		return this.getClient()
			.deleteNote(noteId)
			.map(response => response.data);
	}
}
