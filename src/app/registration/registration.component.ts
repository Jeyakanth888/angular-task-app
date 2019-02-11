import { Component, OnInit, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { NgForm } from '@angular/forms';
import { Location } from '@angular/common';
import { User } from '../models/user';
import { MainService } from '../services/main.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  public registerForm: FormGroup;
  allStates = [];
  allStateCities: any[];
  selectedStateCities = [];
  startDate = new Date(1990, 0, 1);
  successMsg: String = '';
  errorMsg: String = '';
  showAlertBox: Boolean = false;
  userRoles = { 1: 'Admin', 2: 'Sub Admin', 3: 'User' };

  @ViewChild('alertMessageBox') alertBox: ElementRef;
  @ViewChild('registrationForm') myRegisterForm: NgForm;

  constructor(private location: Location, private repositoryService: MainService) { }

  public hasError = (controlName: string, errorName: string) => {
    return this.registerForm.controls[controlName].hasError(errorName);
  }

  public ngOnInit(): void {
    this.loadStatesData();

    this.registerForm = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.email]),
        firstName: new FormControl('', [Validators.required, Validators.maxLength(15)]),
        lastName: new FormControl('', [Validators.required, Validators.maxLength(15)]),
        mobileNumber: new FormControl('', [Validators.required]),
        gender: new FormControl('', [Validators.required]),
        dob: new FormControl('', [Validators.required]),
        state: new FormControl('', [Validators.required]),
        city: new FormControl('', [Validators.required]),
        maritalStatus: new FormControl('', [Validators.required]),
        address: new FormControl('', [Validators.required]),
        userRole: new FormControl('', [Validators.required])
      });
  }

  loadStatesData(): void {
    this.repositoryService.getStates().subscribe(data => {
      this.allStateCities = data;
      this.loadState();
    });
  }

  loadState(): void {
    const allStatesCities = this.allStateCities;
    const statesArr = [];
    allStatesCities.map(state => {
      const splitState = Object.keys(state).toString();
      statesArr.push(splitState);
    });
    this.allStates = statesArr;
  }
  onSelectionCity(stateEle): void {
    const stateIndex = stateEle.value;
    if (stateIndex !== '') {
      const stateObj = this.allStateCities[stateIndex];
      const selectedState = Object.keys(stateObj).toString();
      const stateCities = stateObj[selectedState];
      this.selectedStateCities = stateCities;
    } else {
      this.selectedStateCities = [];
    }
  }


  public submitRegisterForm = (regFormValue) => {
    if (this.registerForm.valid) {
      this.executeOwnerCreation(regFormValue);
    }
  }

  private executeOwnerCreation = (regFormValue) => {
    const state = this.allStateCities[regFormValue.state];
    const selectedState = Object.keys(state).toString();

    const curDate: Date = new Date();
    curDate.toISOString().substring(0, 10);

    const userInfo: User = {
      firstname: regFormValue.firstName,
      lastname: regFormValue.lastName,
      mobilenumber: regFormValue.mobileNumber,
      email: regFormValue.email,
      dob: regFormValue.dob,
      gender: regFormValue.gender,
      address: {
        state: selectedState,
        city: regFormValue.city,
        street: regFormValue.address
      },
      userRole: regFormValue.userRole,
      userLog: 0,
      userActive: true,
      password: 'NULL',
      last_login: '1970-01-01 00:00:00',
      created_at: curDate,
      maritalstatus: regFormValue.maritalStatus
    };

    this.repositoryService.submitRegister(userInfo)
      .subscribe(data => {
        if (data['status'] === 'OK') {
          this.successMsg = data['message'];
          this.showAlertBox = true;
        } else {
          this.errorMsg = data['message'];
          this.showAlertBox = true;
        }
        setTimeout(function () {
          this.showAlertBox = false;
          this.myRegisterForm.reset();
        }, 2000);
      });
  }
}
