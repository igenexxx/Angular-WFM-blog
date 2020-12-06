import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {FbAuthResponse, User} from '../../../shared/interfaces';
import {Observable, Subject, throwError} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {catchError, tap} from 'rxjs/operators';

const ErrorMap = new Map([
  ['INVALID_EMAIL', 'Неверный email'],
  ['INVALID_PASSWORD', 'Неверный пароль'],
  ['EMAIL_NOT_FOUND', 'Email не найден'],
]);

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  error$ = new Subject<string>();
  errorObservable$ = this.error$.asObservable();

  constructor(private http: HttpClient) {}

  private setToken(response: FbAuthResponse | null) {
    if (response) {
      const expDate = this.getExpiresDateInMs(response.expiresIn);
      localStorage.setItem('fb-token', response.idToken);
      localStorage.setItem('fb-token-exp', expDate.toString());
    } else {
      localStorage.clear();
    }
  }

  private getExpiresDateInMs(expiresData: string): Date {
    return new Date(new Date().getTime() + parseInt(expiresData, 10) * 1000);
  }

  private handleError(error: HttpErrorResponse) {
    console.log('ERROR', error);
    const { message } = error.error.error;
    this.error$.next(ErrorMap.get(message));
    return throwError(error);
  }

  get token(): string {
    const expDate = new Date(localStorage.getItem('fb-token-exp'));
    if (new Date() > expDate) {
      this.logout();
      return null;
    }
    return localStorage.getItem('fb-token');
  }

  login(user: User): Observable<any> {
    const userWithToken = { ...user, returnSecureToken: true };
    return this.http
      .post<FbAuthResponse>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.apiKey}`,
        userWithToken
      )
      .pipe(
        tap(this.setToken.bind(this)),
        catchError(this.handleError.bind(this))
      );
  }

  logout() {
    this.setToken(null);
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }
}
