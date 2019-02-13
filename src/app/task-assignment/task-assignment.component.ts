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
    this.repositoryService.getUsers().subscribe(respData => {
      const usersData = respData['data'];
      const userArr = [];
      usersData.map((userInfo) => {
        const userObj: Object = {
          '_id': userInfo._id, 'name': userInfo.firstname + ' ' + userInfo.lastname
        };
        userArr.push(userObj);
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
    console.log(ele);
    const selectedTopicIndex = ele.value;
    if (selectedTopicIndex !== '') {
      const tObj = this.topics[selectedTopicIndex];
      this.selectedTopicDescription = tObj.topicdescription;
    } else {
      this.selectedTopicDescription = '';
    }
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
    };


    this.repositoryService.submitTaskAssignment(taskAssignmentInfo)
      .subscribe(data => {
        if (data['status'] === 'OK') {
          this.apiResponseStatus['message'] = data['message'];
          this.apiResponseStatus['status'] = 'SUCCESS';
          this.showAlertBox = true;

        } else {
          this.apiResponseStatus['message'] = data['message'];
          this.apiResponseStatus['status'] = 'ERROR';
          this.showAlertBox = true;
        }
        setTimeout(function () {
          this.showAlertBox = false;
        }, 2000);
      });

  }

}
