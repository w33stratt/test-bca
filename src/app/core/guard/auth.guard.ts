import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(private authService: AuthService, private router: Router) { }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {
        const token = this.authService.getToken();

        if (token) {
            // Jika ada token, lanjutkan ke route yang diminta
            return true;
        } else {
            // Jika tidak ada token, redirect ke halaman login
            this.router.navigate(['/login']);
            return false;
        }
    }
}
