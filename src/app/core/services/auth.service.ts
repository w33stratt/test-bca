import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private token: string | null = null;
    private baseUrl = '/APITestCoding/v1';

    constructor(private http: HttpClient) { }

    login(userid: string, password: string) {
        return this.http.post(`${this.baseUrl}/Login`, { userid, password }).pipe(
            tap((res: any) => {
                this.token = res.token;
                localStorage.setItem('token', res.token);
            })
        );
    }

    getToken(): string | null {
        if (!this.token) {
            this.token = localStorage.getItem('token');
        }
        return this.token;
    }
}