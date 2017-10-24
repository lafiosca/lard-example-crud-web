import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, XHRBackend, RequestOptions } from '@angular/http';

import { appRouting } from './app.routing';

import {
	AuthHttpService,
	authHttpLoader,
	LardExampleCrudApiService,
	UserPoolService,
} from './services';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';

import { EditorComponent } from './editor/editor.component';
import { EditorService } from './editor/editor.service';
import { NoteListComponent } from './editor/note-list/note-list.component';
import { NoteComponent } from './editor/note/note.component';

@NgModule({
	declarations: [
		AppComponent,
		LoginComponent,
		EditorComponent,
		NoteListComponent,
		NoteComponent,
	],
	imports: [
		BrowserModule,
		FormsModule,
		HttpModule,
		appRouting,
	],
	providers: [
		{
			provide: AuthHttpService,
			useFactory: authHttpLoader,
			deps: [XHRBackend, RequestOptions, UserPoolService],
		},
		UserPoolService,
		LardExampleCrudApiService,
		EditorService,
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
