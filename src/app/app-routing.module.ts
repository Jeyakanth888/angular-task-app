import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TaskAssignmentComponent } from './task-assignment/task-assignment.component';
import { RegistrationComponent } from './registration/registration.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { LoginComponent } from './login/login.component';
import { UpdatePasswordComponent } from './update-password/update-password.component';
import { UserTaskComponent } from './user-task/user-task.component';
import { AuthGuard } from './services/auth.guard';

const appRoutes: Routes = [
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'registration', component: RegistrationComponent, canActivate: [AuthGuard] },
  { path: 'assigntask', component: TaskAssignmentComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'viewprofile/:id', component: UserProfileComponent, canActivate: [AuthGuard] },
  { path: 'updatepassword', component: UpdatePasswordComponent },
  { path: '', component: LoginComponent},
  { path: 'viewtask', component: UserTaskComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(appRoutes)
  ],
  exports: [RouterModule],
  declarations: []
})
export class AppRoutingModule { }
