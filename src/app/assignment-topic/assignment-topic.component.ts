import { Component, OnInit, ElementRef, ViewChild, EventEmitter, Output } from '@angular/core';
import { FormControl, Validators, FormGroup, NgForm } from '@angular/forms';
import { Topic } from '../models/topic';
import { MainService } from '../services/main.service';
import { MatDialog, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-assignment-topic',
  templateUrl: './assignment-topic.component.html',
  styleUrls: ['./assignment-topic.component.css']
})
export class AssignmentTopicComponent implements OnInit {
  public topicForm: FormGroup;
  apiResponseStatus: Object = { message: '', status: '' };
  showAlertBox: Boolean = false;
  newTopicInfo: Object;
  @Output() newTopicAdded = new EventEmitter();
  @ViewChild('alertMessageBox') alertBox: ElementRef;

  constructor(private repositoryService: MainService, private addTopicDialogRef: MatDialogRef<AssignmentTopicComponent>) { }

  public ngOnInit(): void {
    this.topicForm = new FormGroup({
      topicName: new FormControl('', [Validators.required, Validators.maxLength(25)]),
      topicDescription: new FormControl('', [Validators.required, Validators.minLength(100)])
    });
  }


  public submitnewTopicForm = (addTopicFormValue) => {
    if (this.topicForm.valid) {
      this.topicFormDataSubmit(addTopicFormValue);
    }
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.topicForm.controls[controlName].hasError(errorName);
  }

  private topicFormDataSubmit = (topicFormValues) => {
    const curDate: Date = new Date();
    curDate.toISOString().substring(0, 10);
    const newTopicInfo: Topic = {
      topic_name: topicFormValues.topicName,
      topic_description: topicFormValues.topicDescription,
      created_at: curDate
    };

    this.repositoryService.submitNewTopic(newTopicInfo)
      .subscribe(data => {
        if (data['status'] === 'OK') {
          this.apiResponseStatus['message'] = data['message'];
          this.apiResponseStatus['status'] = 'SUCCESS';
          this.showAlertBox = true;
          const addedData = data['data'];
          const newTopicObj: Object = {
            '_id': addedData._id, 'topicname': addedData.topic_name,
            'topicdescription': addedData.topic_description
          };
          this.newTopicInfo = newTopicObj;
          this.newTopicAdded.emit(this.newTopicInfo);
        } else {
          this.apiResponseStatus['message'] = data['message'];
          this.apiResponseStatus['status'] = 'ERROR';
          this.showAlertBox = true;
        }
        setTimeout(() => {
          this.showAlertBox = false;
          this.addTopicDialogRef.close();
        }, 2000);
      });
  }
}
