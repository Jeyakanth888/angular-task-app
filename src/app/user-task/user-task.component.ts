import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MainService } from '../services/main.service';
import { FormControl, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-user-task',
  templateUrl: './user-task.component.html',
  styleUrls: ['./user-task.component.css']
})
export class UserTaskComponent implements OnInit {

  currentTask: any[];
  topicName: String;
  topicDescription: String;
  loggedUserName: String;
  taskFile: String;
  isEmptyFile: Boolean = false;
  userId: String;
  taskId: String;
  apiResponseStatus: Object = { message: '', status: '' };
  showAlertBox: Boolean = false;
  constructor(private route: ActivatedRoute, private repositoryService: MainService) { }

  ngOnInit() {
    this.getUserTaskData();
  }

  getUserTaskData() {
    this.loggedUserName = localStorage.getItem('userName');
    this.userId = this.route.snapshot.queryParams.uID;
    this.taskId = this.route.snapshot.queryParams.tID;
    const tasksData = JSON.parse(localStorage.getItem('usersTasksDetails'));
    const getTask = tasksData.filter(task => task['t_id'] === this.taskId && task['ref_id'] === this.userId);
    this.currentTask = getTask[0];
    this.repositoryService.getTopicInfo(this.taskId).subscribe(response => {
      if (response['status'] === 'OK') {
        const resData = response['data'];
        this.topicName = resData[0].topic_name;
        this.topicDescription = resData[0].topic_description;
      }
    });
  }

  submitTaskCompletion(fileInput: any) {
    if (fileInput.files.length === 0) {
      console.log('No file selected!');
      return;
    }
    const file: File = fileInput.files[0];
    let statusType ;
    let resMessage ;
    this.repositoryService.uploadTaskFile(file, this.userId, this.taskId).subscribe(
      (res) => {
        if (res['status'] === 'OK') {
          statusType = 'SUCCESS';
        } else {
          statusType = 'ERROR';
        }
        resMessage = res['message'];
      },
      (err) => {
        statusType = 'ERROR';
        resMessage = 'Server Issue try again later';
      });
      this.showAlertBoxMessage(resMessage,statusType);
  }

  showAlertBoxMessage(msg, alertStatus) {
    this.apiResponseStatus['message'] = msg;
    this.apiResponseStatus['status'] = alertStatus;
    this.showAlertBox = true;
    setTimeout(function () {
      this.showAlertBox = false;
    }, 3000);
  }
}
