import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MyNavComponent } from './my-nav/my-nav.component';
import { LayoutModule } from '@angular/cdk/layout';
import {
  MatToolbarModule, MatButtonModule, MatSidenavModule, MatIconModule, MatListModule,
  MatCardModule, MatGridListModule, MatFormFieldModule, MatInputModule, MatSelectModule,
  MatDatepickerModule, MatNativeDateModule, MatTableModule, MatTabsModule, MatPaginatorModule,
  MatProgressSpinnerModule, MatSortModule, MatDialogModule, MatMenuModule
} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  SocialLoginModule, AuthServiceConfig, GoogleLoginProvider, FacebookLoginProvider
} from 'angular-6-social-login';
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
import { LoginComponent } from './login/login.component';
import { UpdatePasswordComponent } from './update-password/update-password.component';
import { AuthGuard } from './services/auth.guard';
import { LoginService } from './services/login.service';
import { UserTaskComponent } from './user-task/user-task.component';
import { ViewUserTaskComponent } from './view-user-task/view-user-task.component';


// Configs
export function getAuthServiceConfigs() {
  const config = new AuthServiceConfig(
    [
      {
        id: FacebookLoginProvider.PROVIDER_ID,
        provider: new FacebookLoginProvider('267944493630743')
      },
      {
        id: GoogleLoginProvider.PROVIDER_ID,
        provider: new GoogleLoginProvider('679229929445-o4a1nfjehi6ita0s4c0dcrbudvocve7u.apps.googleusercontent.com')
      }
    ]);
  return config;
}

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
    LoginComponent,
    UpdatePasswordComponent,
    UserTaskComponent,
    ViewUserTaskComponent,
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    LayoutModule,
    SocialLoginModule,
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
    MatMenuModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule
  ],
  providers: [MainService, AuthGuard, LoginService,
    {
      provide: AuthServiceConfig,
      useFactory: getAuthServiceConfigs
    }],
  bootstrap: [AppComponent],
  entryComponents: [AssignmentTopicComponent]
})
export class AppModule { }
