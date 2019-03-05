import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MainService } from '../services/main.service';

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

  constructor(private route: ActivatedRoute, private repositoryService: MainService) { }

  ngOnInit() {
    this.getUserTaskData();
  }

  getUserTaskData() {
    this.loggedUserName = localStorage.getItem('userName');
    const uid = this.route.snapshot.queryParams.uID;
    const tid = this.route.snapshot.queryParams.tID;
    const tasksData = JSON.parse(localStorage.getItem('usersTasksDetails'));
    const getTask =  tasksData.filter(task => task['t_id'] === tid && task['ref_id'] === uid);
    this.currentTask  = getTask[0];
    this.repositoryService.getTopicInfo(tid).subscribe(response => {
      if (response['status'] === 'OK') {
        const resData = response['data'];
        this.topicName = resData[0].topic_name;
        this.topicDescription = resData[0].topic_description;
      }
    });
  }
}
