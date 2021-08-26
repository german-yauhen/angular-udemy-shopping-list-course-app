import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent {

  @Input()
  allertMessage: string;

  @Output()
  closeAlert: EventEmitter<void> = new EventEmitter<void>();

  onCLoseAlert(): void {
    this.closeAlert.emit();
  }
}
