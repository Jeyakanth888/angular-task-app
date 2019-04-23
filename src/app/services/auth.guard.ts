import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const isUserLogged = localStorage.getItem('isUserLoggedIn');
    const loggedUser = localStorage.getItem('userLoggedIn');
    if (isUserLogged === 'true' && loggedUser !== 'NULL') {
      return true;
    } else {
      this.router.navigate(['login']);   // not logged in so redirect to login page
      return false;
    }

  }
}
