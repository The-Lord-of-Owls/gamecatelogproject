import { Component } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { Form, FormControl, FormsModule, NgForm, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs'
import { BackendService } from '../services/backend.service';
import { Observable, merge } from 'rxjs';

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

  userEmail = new FormControl('', [Validators.required, Validators.email]);
  userPassword = new FormControl('', Validators.required);

  newName = new FormControl('', Validators.required);
  newEmail = new FormControl('', [Validators.required, Validators.email]);
  newPassword = new FormControl('', Validators.required);
  newPasswordConfirm = new FormControl('', Validators.required);

  userEmailError = '';
  userPasswordError = '';

  newNameError = '';
  newEmailError = '';
  newPasswordError = '';
  newPasswordConfirmError = '';

  constructor(private loginService: BackendService) {
    merge(this.userEmail.statusChanges, this.userEmail.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessage(this.userEmail, this.userEmailError));

    merge(this.userPassword.statusChanges, this.userPassword.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessage(this.userPassword, this.userPasswordError));

    merge(this.newName.statusChanges, this.newName.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessage(this.newName, this.newNameError));

    merge(this.newEmail.statusChanges, this.newEmail.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessage(this.newEmail, this.newEmailError));

    merge(this.newPassword.statusChanges, this.newPassword.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessage(this.newPassword, this.newPasswordError));

    merge(this.newPasswordConfirm.statusChanges, this.newPasswordConfirm.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessage(this.newPasswordConfirm, this.newPasswordConfirmError));
  }

  updateErrorMessage(inputField: FormControl, errorMessage: string) {
    if (inputField.hasError('required')) {
      errorMessage = 'You must enter a value';
    } else if (inputField.hasError('email')) {
      errorMessage = 'Not a valid email';
    } else {
      errorMessage = '';
    }
  }

  onSubmit(form: NgForm, loggingIn: boolean) {
    const isRegistration: Boolean = (form.value.name !== undefined) || false

    if (isRegistration) {
      this.loginService.register(form.value).subscribe((res: Observable<any>) => {
        console.log(res)
      })
    } else {
      this.loginService.login(form.value).subscribe((res: Observable<any>) => {
        console.log(res)
      })
    }
  }
}
