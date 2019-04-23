import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { MainService } from '../services/main.service';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-view-user-task',
  templateUrl: './view-user-task.component.html',
  styleUrls: ['./view-user-task.component.css']
})


export class ViewUserTaskComponent implements OnInit {
  loggedInUserRole: String;
  viewingUserId: String;
  viewingUserTaskId: String;
  apiResponseStatus: Object = { message: '', status: '' };
  showAlertBox: Boolean = false;
  currentDocumentDetails:  {'approved_status': 0};
  @ViewChild('btnsRow') btnsRow: ElementRef;
  constructor(private repositoryService: MainService, private _location: Location, private route: ActivatedRoute) { }

  ngOnInit() {
    this.loggedInUserRole  = localStorage.getItem('userRole');
    this.viewingUserId = this.route.snapshot.url[1].path;
    this.viewingUserTaskId = this.route.snapshot.url[2].path;
    this.loadUserTaskDoc();
  }

  loadUserTaskDoc() {
    this.repositoryService.getUserTaskDocuments(this.viewingUserId, this.viewingUserTaskId).subscribe(resp => {
      if (resp['status'] === 'OK') {
       this.currentDocumentDetails = resp['data'][0];

      }
    });
  }

  updateUserTaskAction(status) {
    const sendData: Object = { 'tId': this.viewingUserTaskId, 'uId': this.viewingUserId, 'status': status === 'approve' ? 1 : 2 };
    this.repositoryService.updateTaskAction(sendData).subscribe((resp) => {
      let statusType;
      if (resp['status'] === 'OK') {
        statusType = status === 'approve' ? 'SUCCESS' : 'ERROR';
        this.btnsRow.nativeElement.classList.add('disabled-btns');

      } else {
        statusType = 'ERROR';
      }
      this.showAlertBoxMessage(resp['message'], statusType);
    }, (err) => {
      const statusType = 'ERROR';
      const msg = 'Some Error occurred try later!..';
      this.showAlertBoxMessage(msg, statusType);
    });
  }

  showAlertBoxMessage(msg, alertStatus) {
    this.apiResponseStatus['message'] = msg;
    this.apiResponseStatus['status'] = alertStatus;
    this.showAlertBox = true;
    setTimeout(() => {
      this.showAlertBox = false;
    }, 3000);
  }

  backPreviousPage() {
    this._location.back();
  }

  resetActionBtns() {
    this.btnsRow.nativeElement.classList.remove('disabled-btns');
  }
}
