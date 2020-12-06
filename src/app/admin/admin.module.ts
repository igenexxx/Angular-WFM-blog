import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import { LoginPageComponent } from './login-page/login-page.component';
import {AdminLayoutComponent} from './shared/components/admin-layout/admin-layout.component';
import { DashboardPageComponent } from './dashboard-page/dashboard-page.component';
import { CreatePageComponent } from './create-page/create-page.component';
import { EditPageComponent } from './edit-page/edit-page.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AuthService} from './shared/services/auth.service';
import {SharedModule} from '../shared/shared.module';
import {AuthGuard} from './shared/services/auth.guard';
import {SearchPipe} from './shared/search.pipe';
import { AlertComponent } from './shared/component/alert/alert.component';
import {AlertService} from './shared/services/alert.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        component: AdminLayoutComponent,
        children: [
          { path: '', redirectTo: '/admin/login', pathMatch: 'full' },
          {
            path: 'login',
            component: LoginPageComponent
          },
          {
            path: 'dashboard',
            canActivate: [AuthGuard],
            component: DashboardPageComponent
          },
          {
            path: 'create',
            canActivate: [AuthGuard],
            component: CreatePageComponent
          },
          {
            path: 'post/:id/edit',
            canActivate: [AuthGuard],
            component: EditPageComponent
          },
        ]
      }
    ]),
  ],
  exports: [
    RouterModule
  ],
  declarations: [
    AdminLayoutComponent,
    LoginPageComponent,
    DashboardPageComponent,
    CreatePageComponent,
    EditPageComponent,
    SearchPipe,
    AlertComponent,
  ],
  providers: [AuthGuard, AlertService],
})
export class AdminModule {

}
