import { Component, OnInit } from '@angular/core';
import { MainService } from '../services/main.service';
import { User } from '../models/user';
import { ViewUser } from '../models/view-user';
import { Response } from '../apiresponse';
export interface PeriodicElement {
  name: string;
  mobile: number;
  email: string;
  role: string;
  dob: Date;
  _id: string;
}

const ELEMENT_DATA: PeriodicElement[] = [];
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  displayedColumns: string[] = ['name', 'mobile', 'email', 'dob', 'role', 'view', 'delete'];
  dataSource = ELEMENT_DATA;
  users: ViewUser[];
  response: Response[];
  
  constructor(private repositoryService: MainService) { }
 
  ngOnInit() {
    this.loadTableData();
  }

  loadTableData() {
    this.repositoryService.getUsers().subscribe(respData => {
      this.users = respData['data'];
      const userArr = [];
      this.users.map((userInfo) => {
        const userObj: Object = {
          '_id': userInfo._id, 'name': userInfo.firstname + ' ' + userInfo.lastname,
          'mobile': userInfo.mobilenumber, 'email': userInfo.email, 'dob': userInfo.dob, 'role': userInfo.userRole
        };
        userArr.push(userObj);
      });
      this.dataSource = userArr;
    });
  }
  onRowClicked(row) {
    console.log('Row clicked: ', row);
  }


}
