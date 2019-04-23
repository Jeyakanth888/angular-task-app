import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  AuthService, FacebookLoginProvider, GoogleLoginProvider
} from 'angular-6-social-login';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Login } from '../models/login';
import { LoginService } from '../services/login.service';
import { validateEmailMobileInput } from '../common/commonjs';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup;
  notvalidMobile: Boolean = false;
  notValidEmail: Boolean = false;
  showAlertBox: Boolean = false;
  apiResponseStatus: Object = { message: '', status: '' };
  userRoles: Object = { 1: 'admin', 2: 'subadmin', 3: 'user' };
  FB: any;
  constructor(private router: Router, private socialAuthService: AuthService, private loginService: LoginService) {

  }

  ngOnInit() {
    localStorage.setItem('isUserLoggedIn', 'false');
    localStorage.setItem('userLoggedIn', 'NULL');
    this.loginForm = new FormGroup({
      user_email_mobile: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.loginForm.controls[controlName].hasError(errorName);
  }

  public socialSignIn(socialPlatform: string) {
    let socialPlatformProvider;
    if (socialPlatform === 'facebook') {
      socialPlatformProvider = FacebookLoginProvider.PROVIDER_ID;
    } else if (socialPlatform === 'google') {
      socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
    }
    this.socialAuthService.signIn(socialPlatformProvider).then(
      (userData) => {
        console.log(socialPlatform + ' sign in data : ', userData);
        const getUserEmail: Object = { email: userData.email };
        this.userSocialLogin(getUserEmail);
      }
    );
  }

  userSocialLogin(emailId) {
    this.loginService.submitUserSocialLogin(emailId)
      .subscribe(response => {
        const respStatus = response['status'];
        const respMsg = response['message'];
        if (respStatus === 'OK') {
          this.apiResponseStatus['message'] = respMsg;
          this.apiResponseStatus['status'] = 'SUCCESS';
          this.showAlertRoute(true, 1500);
          const resData = response['data'][0];
          const loggedUserId = resData._id;
          const loggedUserRole = this.userRoles[resData.userRole];
          const loggedUserName = resData.firstname + ' ' + resData.lastname;
          this.setLocalStorageData(loggedUserId, loggedUserRole, loggedUserName);
        } else {
          this.apiResponseStatus['message'] = respMsg;
          this.apiResponseStatus['status'] = 'ERROR';
          this.showAlertRoute(false, 3000);
        }
      });
  }

  showAlertRoute(route, duration) {
    this.showAlertBox = true;
    setTimeout(() => {
      this.showAlertBox = false;
      if (route) {
        this.router.navigate(['dashboard']);
      }
    }, duration);
  }

  public submitLoginForm = (loginFormValue) => {
    if (this.loginForm.valid && !this.notvalidMobile && !this.notValidEmail) {
      this.executeUserLogin(loginFormValue);
    }
  }

  private executeUserLogin = (loginFormValues) => {
    const curDate: Date = new Date();
    curDate.toISOString().substring(0, 10);

    const loginInfo: Login = {
      mobile_email: loginFormValues.user_email_mobile,
      password: loginFormValues.password,
      last_login: curDate,
    };

    this.loginService.submitLogin(loginInfo)
      .subscribe(response => {
        console.log(response);
        const respStatus = response['status'];
        const respMsg = response['message'];
        let setDuration = 3000;
        this.apiResponseStatus['message'] = respMsg;
        if (respStatus === 'OK' && respMsg === 'MATCHED') {
          this.apiResponseStatus['status'] = 'SUCCESS';
          setDuration = 1500;
          const resData = response['data'][0];
          const loggedUserId = resData._id;
          const loggedUserRole = this.userRoles[resData.userRole];
          const loggedUserName = resData.firstname + ' ' + resData.lastname;
          this.setLocalStorageData(loggedUserId, loggedUserRole, loggedUserName);
        } else if (respStatus === 'ERR' && respMsg === 'NOTMATCHED') {
          this.apiResponseStatus['status'] = 'ERROR';
        } else if (respStatus === 'ERR' && respMsg === 'PWDEMPTY') {
          this.apiResponseStatus['status'] = 'ERROR';
        } else if (respStatus === 'ERR' && respMsg === 'NOTAVAIL') {
          this.apiResponseStatus['status'] = 'ERROR';
        }
        this.showAlertRoute(true, setDuration);
      });
  }

  setLocalStorageData(userId, userRole, userName) {
    localStorage.setItem('isUserLoggedIn', 'true');
    localStorage.setItem('userLoggedIn', userId);
    localStorage.setItem('userRole', userRole);
    localStorage.setItem('userName', userName);
  }
  onKeyupUser(event) {
    const userInput = event.target.value;
    if (userInput !== '') {
      const getValidation = validateEmailMobileInput(userInput);
      switch (getValidation) {
        case 'validEmail': {
          this.notValidEmail = false;
          this.loginForm.controls['user_email_mobile'].setErrors(null);
          break;
        }
        case 'validMobile': {
          this.notvalidMobile = false;
          this.loginForm.controls['user_email_mobile'].setErrors(null);
          break;
        }
        case 'notValidEmail': {
          this.loginForm.controls['user_email_mobile'].setErrors({ 'incorrect': true });
          this.notValidEmail = true;
          break;
        }
        case 'notValidMobile': {
          this.notvalidMobile = true;
          this.loginForm.controls['user_email_mobile'].setErrors({ 'incorrect': true });
          break;
        }
      }
    } else {
      this.notValidEmail = false;
      this.notvalidMobile = false;
    }
  }
}
