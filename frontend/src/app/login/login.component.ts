import { Component } from '@angular/core';
import { Form, FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs'
import { BackendService } from '../services/backend.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatTabsModule,
    MatButtonModule,
    FormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  constructor(private loginService: BackendService) {}

  onSubmit(form: NgForm, loggingIn: boolean) {
	const isRegistration: Boolean = ( form.value.name !== undefined ) || false

	if ( isRegistration ) {
		this.loginService.register( form.value ).subscribe( ( res: Observable<any> ) => {
			console.log( res )
		} )
	} else {
		this.loginService.login( form.value ).subscribe( ( res: Observable<any> ) => {
			console.log( res )
		} )
	}
  }
}
