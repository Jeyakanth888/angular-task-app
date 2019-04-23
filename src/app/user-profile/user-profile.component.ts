import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MainService } from '../services/main.service';
import { ViewUser } from '../models/view-user';
import { Response } from '../apiresponse';
import { Observable } from 'rxjs';
class ImageSnippet {
  pending = false;
  status = 'init';
  constructor(public src: string, public file: File) { }
}

export interface PeriodicElement {
  taskname: String;
  assigneddate: Date;
  taskdate: Date;
  submitteddate: Date;
  u_id: String;
  t_id: String;
}

const ELEMENT_DATA: PeriodicElement[] = [];

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  private userId: string;
  userRole: string;
  response: Response[];
  userData: ViewUser[];
  selectedFile: ImageSnippet;
  showloader: Boolean = false;
  userProfileImage: String = 'assets/images/Manager-512.png';
  totalCount: any;
  pendingCount: Number;
  completedCount: any;
  rejectedCount: Number;
  holdCount: Number;
  taskPercentage: Number;
  submittedTaskAvailable: Boolean = false;
  displayedColumns: string[] = ['taskname', 'assigneddate', 'taskdate', 'submitteddate', 'view'];
  dataSource: any[];
  allUsersTasks: any[];
  allTaskTopics: any[];

  constructor(private route: ActivatedRoute, private repositoryService: MainService) { }

  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('id');
    this.userRole = localStorage.getItem('userRole');
    this.allUsersTasks = JSON.parse(localStorage.getItem('usersTasksDetails'));
    this.loadUserData();
    this.findTaskCounts();
    this.getAllTaskTopics();
    this.getUserSubmittedTasks();

  }

  loadUserData(): void {
    this.repositoryService.getUserDetails(this.userId).subscribe(respData => {
      if (respData['status'] === 'OK') {
        this.response = respData;
        this.userData = this.response['data'][0];
        const getImagePath = this.userData['profileimage'];
        if (getImagePath !== '') {
          const path: String = getImagePath.replace(/\\/g, '/').replace('src/', '');
          this.userProfileImage = path;
        }
      } else {

      }
    });
  }

  importUserPhoto(imageInput: any): void {
    if (imageInput.files.length === 0) {
      console.log('No file selected!');
      return;
    }
    const file: File = imageInput.files[0];
    this.showloader = true;
    this.repositoryService.uploadPhoto(file, this.userId).subscribe(
      (res) => {
        this.showloader = false;
        const imagePath = res['data'][0].destination + '/' + res['data'][0].filename;
        const path: String = imagePath.replace('./src/', '');
        this.userProfileImage = path;
      },
      (err) => {
        this.uploadOnError();
      });
  }

  private uploadOnError() {
    this.showloader = false;
    this.userProfileImage = 'assets/images/Manager-512.png';
  }

  findTaskCounts() {
    const allUserTasks = JSON.parse(localStorage.getItem('usersTasksDetails'));
    const getTasks = allUserTasks.filter(usersTask => usersTask['ref_id'] === this.userId);
    this.totalCount = getTasks.length;
    this.pendingCount = getTasks.filter(task => task['approved_status'] === 0).length;
    this.completedCount = getTasks.filter(task => task['approved_status'] === 1).length;
    this.rejectedCount = getTasks.filter(task => task['approved_status'] === 2).length;
    this.holdCount = getTasks.filter(task => task['approved_status'] === 3).length;
    this.taskPercentage = this.completedCount / this.totalCount * 100;
  }

  getUserSubmittedTasks() {
    this.repositoryService.getUserSubmittedTaskDetails(this.userId).subscribe(respData => {
      if (respData['status'] === 'OK') {
        this.submittedTaskAvailable = true;
        const taskDocDatas = respData['data'];
        const dataArr = [];
  
        taskDocDatas.map((data) => {
          const taskId = data.t_id;
        
          const dataObj: Object = {
            't_id': taskId, 'u_id': this.userId,
            'taskname': this.findTaskName(taskId), 'taskdate': this.findUserTaskDates(taskId, 'taskdate'),
            'assigneddate': this.findUserTaskDates(taskId, 'created'), 'submitteddate': data.created_at
          };
          dataArr.push(dataObj);
        });
        this.dataSource = dataArr;
      }
    });
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

  findTaskName(tId) {
    const filterData = this.allTaskTopics.filter(task => task['_id'] === tId);
    return filterData[0].topic_name;
  }

  findUserTaskDates(tId, dateType) {
    const filterData = this.allUsersTasks.filter(userTask => userTask['t_id'] === tId && userTask['ref_id'] === this.userId);
    if (dateType === 'created') {
      return filterData[0].created_at;
    } else {
      return filterData[0].task_date;
    }
  }

}
