import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { Router, RoutesRecognized } from '@angular/router';

@Component({
  selector: 'my-nav',
  templateUrl: './my-nav.component.html',
  styleUrls: ['./my-nav.component.css']
})

export class MyNavComponent {
  isHandset: Observable<BreakpointState> = this.breakpointObserver.observe(Breakpoints.Handset);
  isUserLoggedIn: Boolean;
  userRole: String;
  loggedUserName: String;
  constructor(private breakpointObserver: BreakpointObserver, private router: Router) {
  }

  ngOnInit() {
    this.userRole = localStorage.getItem('userRole');
    this.router.events.subscribe((event: any) => {
      if (event instanceof RoutesRecognized) {
        const getURL = event.url;
        if ((getURL === '/login' || getURL === '/') && (localStorage.getItem('isUserLoggedIn') === 'false')) {
          this.isUserLoggedIn = false;
        } else {
          this.isUserLoggedIn = true;
          this.loggedUserName = localStorage.getItem('userName');
        }
      }
    });
  }

  logout() {
    localStorage.setItem('isUserLoggedIn', 'false');
    this.isUserLoggedIn = false;
    this.router.navigate(['login']);
  }
}
