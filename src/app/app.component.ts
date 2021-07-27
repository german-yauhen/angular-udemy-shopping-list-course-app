import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  appTitle = 'Eugene Shopping List Course App';

  loadedFeature: string;

  onNavigate(feature: string): void {
    this.loadedFeature = feature;
  }
}
