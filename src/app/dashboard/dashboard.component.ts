import { Component, OnInit } from '@angular/core';
import { MainService } from '../services/main.service';
import { User } from '../models/user';
import { ViewUser } from '../models/view-user';
import { Response } from '../apiresponse';
import { Router } from '@angular/router';
export interface PeriodicAdminElement {
  name: string;
  mobile: number;
  email: string;
  role: string;
  dob: Date;
  _id: string;
}

export interface PeriodicUserElement {
  topic_name: string;
  created_at: Date;
  target_at: Date;
  completed_at: Date;
  task_status: string;
  t_id: string;
  ref_id: string;
  _id: string;
}

const ELEMENT_ADMIN_DATA: PeriodicAdminElement[] = [];
const ELEMENT_USER_DATA: PeriodicUserElement[] = [];

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  displayedAdminColumns: string[] = ['name', 'mobile', 'email', 'dob', 'role', 'total tasks', 'completed tasks', 'pending tasks', 'view', 'delete'];
  displayedUserColumns: string[] = ['topicname', 'createdat', 'targetat', 'completedat', 'taskstatus', 'view'];
  dataSource: any[];
  users: ViewUser[] = [];
  response: Response[];
  allTasks: any[] = [];
  loggedUserRole: String;
  pendingTasks: any[] = [];
  completedTasks: any[] = [];
  rejectedTasks: any[] = [];
  allTaskTopics: any[];

  constructor(private repositoryService: MainService, private router: Router) { }

  ngOnInit() {
    const getLoggedInUserRole = localStorage.getItem('userRole');
    const getLoggedInUserId = localStorage.getItem('userLoggedIn');
    this.loggedUserRole = getLoggedInUserRole;
    if (getLoggedInUserRole === 'admin') {
      this.loadAllUsersTasks();
      this.loadAllUsers(getLoggedInUserId);
      this.dataSource = ELEMENT_ADMIN_DATA;
    } else {
      this.getAllTaskTopics();
      this.loadUserAllTasks(getLoggedInUserId);
      this.dataSource = ELEMENT_USER_DATA;
    }
  }

  getAllTaskTopics() {
    this.repositoryService.getTopics().subscribe(respData => {
      const datas = respData['data'];
      const respStatus = respData['status'];
      if (respStatus === 'OK') {
        this.allTaskTopics = datas;
      }
    });
  }

  loadAllUsers(getLoggedInUserId) {
    this.repositoryService.getUsers().subscribe(respData => {
      this.users = respData['data'];
      const userArr = [];
      this.users.map((userInfo) => {
        const getRespUserId = userInfo._id;
        const userObj: Object = {
          '_id': getRespUserId, 'name': userInfo.firstname + ' ' + userInfo.lastname,
          'mobile': userInfo.mobilenumber, 'email': userInfo.email, 'dob': userInfo.dob, 'role': userInfo.userRole,
          'taskDetails': this.getUserTaskDetails(getRespUserId)
        };
        if (getLoggedInUserId !== 'NULL' && getLoggedInUserId !== getRespUserId) {
          userArr.push(userObj);
        }
      });
      this.dataSource = userArr;
    });
  }

  loadAllUsersTasks() {
    this.repositoryService.getAllUsersTasks().subscribe(response => {
      if (response['status'] === 'OK') {
        this.allTasks = response['data'];
        localStorage.setItem('usersTasksDetails', JSON.stringify(this.allTasks));
        this.setSplitTasks();
      }
    });
  }

  getUserTaskDetails(userID) {
    const getTasks = this.allTasks.filter(usersTask => usersTask['ref_id'] === userID);
    const pendingCount = getTasks.filter(task => task['completed_status'] === 0).length;
    const completedCount = getTasks.filter(task => task['completed_status'] === 1).length;
    const tasksCountDetails: Object = { 'totalCount': getTasks.length, 'pendingCount': pendingCount, 'completedCount': completedCount };
    return tasksCountDetails ;
  }

  findTopicName(id) {
    const topicData = this.allTaskTopics.filter(topic => topic['_id'] === id);
    return topicData[0].topic_name;
  }

  loadUserAllTasks(getLoggedInUserId) {
    this.repositoryService.getUserAllTasks(getLoggedInUserId).subscribe(response => {
      if (response['status'] === 'OK') {
        this.allTasks = response['data'];
        const taskArr = [];
        this.allTasks.map((taskInfo) => {
          const topic_name = this.findTopicName(taskInfo.t_id);
          const taskObj: Object = {
            '_id': taskInfo._id, 'topic_name': topic_name, 'created_at': taskInfo.created_at,
            'target_at': taskInfo.task_date, 'completed_at': taskInfo.completed_at, 'task_status': taskInfo.completed_status,
            't_id': taskInfo.t_id, 'ref_id': taskInfo.ref_id
          }
          taskArr.push(taskObj);
        });
        this.dataSource = taskArr;
        this.setSplitTasks();
      }
    });
  }

  setSplitTasks() {
    // 0 : pending, 1: completed, 2: rejected, 3:hold
    this.pendingTasks = this.allTasks.filter(task => task['completed_status'] === 0);
    this.completedTasks = this.allTasks.filter(task => task['completed_status'] === 1);
    this.rejectedTasks = this.allTasks.filter(task => task['completed_status'] === 2);
  }

  viewMyTask(taskId) {
    const userLoggedInId = localStorage.getItem('userLoggedIn');
    this.router.navigate(['viewtask'],{queryParams :{'uID':userLoggedInId, 'tID':taskId}});
  }
  onRowClicked(row) {
    console.log('Row clicked: ', row);
  }


}
