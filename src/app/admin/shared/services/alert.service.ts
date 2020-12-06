import {Injectable} from '@angular/core';
import {WarningTypes} from '../component/alert/alert.component';
import {Subject} from 'rxjs';

export interface Alert {
  type: WarningTypes;
  text: string;
}

@Injectable()
export class AlertService {
  alerts$ = new Subject<Alert>();

  success(text: string) {
    this.alerts$.next({ type: WarningTypes.Success, text });
  }

  warning(text: string) {
    this.alerts$.next({ type: WarningTypes.Warning, text });
  }

  danger(text: string) {
    this.alerts$.next({ type: WarningTypes.Danger, text });
  }
}
