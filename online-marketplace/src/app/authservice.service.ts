import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthserviceService {
  private tokenKey = 'authToken';

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getUserId(): number | null {
    const token = this.getToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.userId;
      } catch (error) {
        console.error('Invalid token format');
        return null;
      }
    }
    return null;
  }
  getUserRole(): string | null {
    const token = this.getToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.role || null;
      } catch (error) {
        console.error('Invalid token format');
        return null;
      }
    }
    return null;
  }

  isSeller(): boolean {
    return this.getUserRole() === 'seller';
  }



  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }
}
