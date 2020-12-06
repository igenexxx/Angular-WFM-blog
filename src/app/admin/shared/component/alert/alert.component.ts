import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {AlertService} from '../../services/alert.service';
import {Subscription} from 'rxjs';

export enum WarningTypes {
  Success = 'success',
  Warning = 'warning',
  Danger = 'danger'
}

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit, OnDestroy {

  @Input() delay = 5000;
  warningTypes = WarningTypes;
  text: string;
  type: WarningTypes = WarningTypes.Success;
  subscription = new Subscription();

  constructor(private alertService: AlertService) { }

  ngOnInit() {
    this.subscription.add(
      this.alertService.alerts$.subscribe(alert => {
        this.type = alert.type;
        this.text = alert.text;

        const timeout = setTimeout(() => {
          clearTimeout(timeout);
          this.text = '';
        }, this.delay);
    })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
