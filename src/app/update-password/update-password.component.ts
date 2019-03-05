import { Component, OnInit } from '@angular/core';
import { LoginService } from '../services/login.service';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { validateEmailMobileInput } from '../common/commonjs';
import { PasswordUpdate } from '../models/passwordUpdate';

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.css']
})
export class UpdatePasswordComponent implements OnInit {
  public passwordChangeForm: FormGroup;
  notvalidMobile: Boolean = false;
  notValidEmail: Boolean = false;
  newPassword: String;
  confirmPassword: String;
  isPasswordMatch: Boolean = false;
  showAlertBox: Boolean = false;
  apiResponseStatus: Object = { message: '', status: '' };

  constructor(public router: Router, private loginService: LoginService) { }

  ngOnInit() {
    this.passwordChangeForm = new FormGroup({
      email_mobile: new FormControl('', [Validators.required, Validators.email]),
      new_password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirm_password: new FormControl('', [Validators.required])
    });
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.passwordChangeForm.controls[controlName].hasError(errorName);
  }

  public submitPasswordChangeForm = (formValues) => {
    if (this.passwordChangeForm.valid && !this.notvalidMobile && !this.notValidEmail && !this.isPasswordMatch) {
      this.executePasswordChange(formValues);
    }
  }

  private executePasswordChange(formValues): void {
    const passwordInfo: PasswordUpdate = {
      mobile_email: formValues.email_mobile,
      new_password: formValues.new_password,
    };

    this.loginService.updateNewPassword(passwordInfo)
      .subscribe(response => {
        const respStatus = response['status'];
        const respMsg = response['message'];
        this.apiResponseStatus['message'] = respMsg;
        if (respStatus === 'OK') {
          this.apiResponseStatus['status'] = 'SUCCESS';
          this.showAlertBox = true;
          const pRouter = this.router;
          setTimeout(() => {
            this.showAlertBox = false;
            pRouter.navigate(['login']);
          }, 3000);
        } else {
          this.apiResponseStatus['status'] = 'ERROR';
          this.showAlertBox = true;
        }
      });
  }

  passwordMatch() {
    if (this.newPassword === this.confirmPassword) {
      this.isPasswordMatch = false;
    } else {
      this.isPasswordMatch = true;
    }
  }

  storeNewPassword(event) {
    this.newPassword = event.target.value;
    if (this.newPassword !== '' && this.confirmPassword !== '') {
      this.passwordMatch();
    } else {
      this.isPasswordMatch = false;
    }
  }

  storeConfirmPassword(event) {
    this.confirmPassword = event.target.value;
    if (this.confirmPassword !== '' && this.newPassword !== '') {
      this.passwordMatch();
    }
  }

  onKeyupInput(event) {
    const userInput = event.target.value;
    if (userInput !== '') {
      const getValidation = validateEmailMobileInput(userInput);
      switch (getValidation) {
        case 'validEmail': {
          this.notValidEmail = false;
          this.passwordChangeForm.controls['email_mobile'].setErrors(null);
          break;
        }
        case 'validMobile': {
          this.notvalidMobile = false;
          this.passwordChangeForm.controls['email_mobile'].setErrors(null);
          break;
        }
        case 'notValidEmail': {
          this.passwordChangeForm.controls['email_mobile'].setErrors({ 'incorrect': true });
          this.notValidEmail = true;
          break;
        }
        case 'notValidMobile': {
          this.notvalidMobile = true;
          this.passwordChangeForm.controls['email_mobile'].setErrors({ 'incorrect': true });
          break;
        }
      }
    } else {
      this.notValidEmail = false;
      this.notvalidMobile = false;
    }
  }
}
