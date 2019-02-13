import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MyNavComponent } from './my-nav/my-nav.component';
import { LayoutModule } from '@angular/cdk/layout';
import {
  MatToolbarModule, MatButtonModule, MatSidenavModule, MatIconModule, MatListModule,
  MatCardModule, MatGridListModule, MatFormFieldModule, MatInputModule, MatSelectModule,
  MatDatepickerModule, MatNativeDateModule, MatTableModule, MatTabsModule, MatPaginatorModule, MatProgressSpinnerModule,
  MatSortModule, MatDialogModule
} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegistrationComponent } from './registration/registration.component';
import { AppRoutingModule } from './/app-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HttpClientModule } from '@angular/common/http';
import { MainService } from './services/main.service';
import { TaskAssignmentComponent } from './task-assignment/task-assignment.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { ChartsComponent } from './charts/charts.component';
import { AssignmentTopicComponent } from './assignment-topic/assignment-topic.component';
import { AlertBoxComponent } from './alert-box/alert-box.component';


@NgModule({
  declarations: [
    AppComponent,
    MyNavComponent,
    RegistrationComponent,
    DashboardComponent,
    TaskAssignmentComponent,
    UserProfileComponent,
    AssignmentTopicComponent,
    ChartsComponent,
    AlertBoxComponent,
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatCardModule,
    MatGridListModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTableModule,
    MatTabsModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSortModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule
  ],
  providers: [MainService],
  bootstrap: [AppComponent],
  entryComponents: [AssignmentTopicComponent]
})
export class AppModule { }
