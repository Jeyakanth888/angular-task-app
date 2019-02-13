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
@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  private userId: string;
  response: Response[];
  userData: ViewUser[];
  selectedFile: ImageSnippet;
  showloader: Boolean = false;
  userProfileImage: String = 'assets/images/Manager-512.png';

  constructor(private route: ActivatedRoute, private repositoryService: MainService) { }

  ngOnInit() {
    this.loadUserData();
  }
  loadUserData(): void {
    this.userId = this.route.snapshot.paramMap.get('id');
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

}
