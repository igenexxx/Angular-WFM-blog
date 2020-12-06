import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {User} from '../../shared/interfaces';
import {AuthService} from '../shared/services/auth.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {finalize, tap} from 'rxjs/operators';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit, OnDestroy {
  form: FormGroup;
  isSubmitted = false;
  subscriptions = new Subscription();
  errorMessage: string;

  constructor(
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.subscriptions.add(
      this.route.queryParams.subscribe((params: Params) => {
        console.log(params);
        if (params.loginFailed) {
          this.errorMessage = 'Пожалуйста, авторизируйтесь!';
        } else if (params.authFailed) {
          this.errorMessage = 'Сессия истекла. Введите данные заново';
        }
      })
    );

    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)])
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  submit() {
    if (!this.form.value) {
      return;
    }

    const user: User = {
      email: this.form.value.email,
      password: this.form.value.password,
    };

    this.auth.login(user).pipe(
      tap(() => this.isSubmitted = true),
      finalize(() => this.isSubmitted = false)
    ).subscribe(() => {
      this.form.reset();
      this.router.navigate(['/admin', 'dashboard']);
    });
  }
}
