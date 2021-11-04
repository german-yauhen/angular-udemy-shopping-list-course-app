import { Component, ComponentFactory, ComponentFactoryResolver, ComponentRef, OnDestroy, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { Observable, Subscription } from "rxjs";
import { AuthResponse, AuthService } from "./auth.service";
import { AlertComponent } from "../shared/alert/alert.component";
import { PlaceholderDirective } from "../shared/placeholder/placeholder.directive";
import { Store } from "@ngrx/store";
import * as fromApp from "../store/app.reducer";
import * as AuthActions from "../auth/store/auth.actions";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent implements OnDestroy {
  isLoginMode: boolean = true;
  isLoading: boolean = false;
  error: string = null;

  @ViewChild(PlaceholderDirective)
  alertHost: PlaceholderDirective;

  private closeSubscription: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
    private componentFactoryResolver: ComponentFactoryResolver,
    private store: Store<fromApp.AppState>) {}

  ngOnDestroy() {
    if (this.closeSubscription) {
      this.closeSubscription.unsubscribe();
    }
  }

  onSwitchMode(): void {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm): void {
    if (form.invalid) return;

    const email: string = form.value.email;
    const password: string = form.value.password;

    this.isLoading = true;

    const authObs: Observable<AuthResponse> = this.isLoginMode
      ? this.authService.login(email, password)
      : this.authService.signUp(email, password);
    // let authObs: Observable<AuthResponse>;
    // if (this.isLoginMode) {
    //   this.store.dispatch(new AuthActions.LoginStart({ email: email, password: password }))
    // } else {
    //   authObs = this.authService.signUp(email, password);
    // }

    authObs.subscribe(
      authResponse => {
        console.log(authResponse);
        this.error = null;
        this.isLoading = false;
        this.router.navigate(['/recipes']);
      },
      errorMessage => {
        console.log(errorMessage);
        this.error = errorMessage;
        this.showErrorAlert(errorMessage);
        this.isLoading = false;
      }
    );

    form.reset();
  }

  onHandleError(): void {
    this.error = null;
  }

  private showErrorAlert(errorMessage: string): void {
    const alertComponentFactory: ComponentFactory<AlertComponent> =
      this.componentFactoryResolver.resolveComponentFactory(AlertComponent);

    const hostViewContainerRef = this.alertHost.viewContainerRef;
    hostViewContainerRef.clear();

    const componentRef: ComponentRef<AlertComponent> = hostViewContainerRef.createComponent(alertComponentFactory);
    componentRef.instance.allertMessage = errorMessage;
    this.closeSubscription = componentRef.instance.closeAlert.subscribe(() => {
      this.closeSubscription.unsubscribe();
      hostViewContainerRef.clear();
    });
  }

}
