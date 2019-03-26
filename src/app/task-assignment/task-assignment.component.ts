import { Component, OnInit } from '@angular/core';
import { MainService } from '../services/main.service';
import { MatDialog, MatDialogRef } from '@angular/material';
import { AssignmentTopicComponent } from '../assignment-topic/assignment-topic.component';
import { FormControl, Validators, FormGroup, NgForm } from '@angular/forms';
import { AssignTask } from '../models/assignTask';

@Component({
  selector: 'app-task-assignment',
  templateUrl: './task-assignment.component.html',
  styleUrls: ['./task-assignment.component.css']
})
export class TaskAssignmentComponent implements OnInit {
  public taskForm: FormGroup;
  apiResponseStatus: Object = { message: '', status: '' };
  showAlertBox: Boolean = false;
  users: any[];
  topics: any[];
  selectedTopicDescription: String = '';
  addTopicDialogRef: MatDialogRef<AssignmentTopicComponent>;
  minDate = new Date();
  dateFilter = (date: Date) => date.getMonth() - 1 && date.getDate() - 1;
  selectedUser: string;
  selectedTopic: any;
  disableSubmitTask: Boolean = false;

  constructor(private repositoryService: MainService, private addTopicDialog: MatDialog) { }

  ngOnInit() {
    this.taskForm = new FormGroup({
      assignUser: new FormControl('', [Validators.required]),
      assignTopic: new FormControl('', [Validators.required]),
      assignDate: new FormControl('', [Validators.required])
    });
  }

  ngAfterViewInit() {
    this.getAllUsers();
    this.getAllTopics();
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.taskForm.controls[controlName].hasError(errorName);
  }

  getAllUsers() {
    const getLoggedInUserId = localStorage.getItem('userLoggedIn');
    this.repositoryService.getUsers().subscribe(respData => {
      const usersData = respData['data'];
      const userArr = [];
      usersData.map((userInfo) => {
        const getRespUserId = userInfo._id;
        const userObj: Object = {
          '_id': userInfo._id, 'name': userInfo.firstname + ' ' + userInfo.lastname
        };
        if (getLoggedInUserId !== 'NULL' && getLoggedInUserId !== getRespUserId) {
          userArr.push(userObj);
        }
      });
      this.users = userArr;
    });
  }

  getAllTopics() {
    this.repositoryService.getTopics().subscribe(respData => {
      const datas = respData['data'];
      const dataArr = [];
      datas.map((data) => {
        const tObj: Object = {
          '_id': data._id, 'topicname': data.topic_name, 'topicdescription': data.topic_description
        };
        dataArr.push(tObj);
      });
      this.topics = dataArr;
    });
  }

  openAddTopicDialog() {
    this.addTopicDialogRef = this.addTopicDialog.open(AssignmentTopicComponent, {
      hasBackdrop: false
    });
    this.addTopicDialogRef.componentInstance.newTopicAdded.subscribe((getNewTopicInfo) => {
      this.topics.push(getNewTopicInfo);
    });
  }

  onSelectTopic(ele) {
    const selectedTopicIndex = ele.value;
    if (selectedTopicIndex !== '') {
      this.checkExistTasktoUser();
      const tObj = this.topics[selectedTopicIndex];
      this.selectedTopicDescription = tObj.topicdescription;
    } else {
      this.selectedTopicDescription = '';
    }
  }

  onSelectUser(ele) {
    const selectedUserIndex = ele.value;
    if (selectedUserIndex !== '') {
      this.checkExistTasktoUser();
    }
  }

  checkExistTasktoUser() {
    this.showAlertBox = false;
    if (this.selectedUser !== '' && this.selectedTopic !== '') {
      this.disableSubmitTask = false;
      if (this.findTaskExist(this.selectedUser, this.selectedTopic)) {
        this.disableSubmitTask = true;
        const errorMsg = 'This topic has been already assigned to this user';
        this.showAlertBoxMessage(errorMsg, 'ERROR');
      }
    }
  }

  findTaskExist(userId, taskIndex) {
    let flag = false;
    const taskId = this.topics[taskIndex]._id;
    const allUserTasks = JSON.parse(localStorage.getItem('usersTasksDetails'));
    const getTasks = allUserTasks.filter(usersTask => usersTask['ref_id'] === userId);
    const findTask = getTasks.filter(tasks => tasks['t_id'] === taskId);
    if (findTask.length !== 0) {
      flag = true;
    }
    return flag;
  }

  public submitTaskForm = (taskFormValues) => {
    if (this.taskForm.valid) {
      this.submitTaskFormDatas(taskFormValues);
    }
  }

  private submitTaskFormDatas = (taskFormValues) => {
    const curDate: Date = new Date();
    curDate.toISOString().substring(0, 10);
    const taskAssignment_id = this.topics[taskFormValues.assignTopic]._id;
    const taskAssignmentInfo: AssignTask = {
      ref_id: taskFormValues.assignUser,
      t_id: taskAssignment_id,
      task_date: taskFormValues.assignDate,
      created_at: curDate,
      completed_status: 0,
      completed_at: curDate,
      approved_status: 0,
      approved_rejected_at: curDate
    };

    this.repositoryService.submitTaskAssignment(taskAssignmentInfo)
      .subscribe(data => {
        let statusType;
        if (data['status'] === 'OK') {
          statusType = 'SUCCESS';
        } else {
          statusType = 'ERROR';
        }
        this.showAlertBoxMessage(data['message'], statusType);
      });
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
