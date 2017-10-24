import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { EditorComponent } from './editor/editor.component';

const APP_ROUTES: Routes = [
	{ path: '', component: EditorComponent },
	{ path: 'login', component: LoginComponent },
];

export const appRouting = RouterModule.forRoot(APP_ROUTES);
