import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromApp from "./auth/store/auth.reducer";
import * as AuthActions from "./auth/store/auth.actions";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  appTitle = 'Eugene Shopping List Course App';

  constructor(private appStore: Store<fromApp.AuthState>) {}

  ngOnInit() {
    this.appStore.dispatch(new AuthActions.AutoLogin());
  }
}
