import { Component, ComponentFactory, ComponentFactoryResolver, ComponentRef, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Subscription } from "rxjs";
import { AlertComponent } from "../shared/alert/alert.component";
import { PlaceholderDirective } from "../shared/placeholder/placeholder.directive";
import { Store } from "@ngrx/store";
import * as fromApp from "../store/app.reducer";
import * as AuthActions from "../auth/store/auth.actions";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent implements OnInit, OnDestroy {
  isLoginMode: boolean = true;
  isLoading: boolean = false;
  error: string = null;

  @ViewChild(PlaceholderDirective)
  alertHost: PlaceholderDirective;

  private closeSubscription: Subscription;
  private authSubscription: Subscription;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private appStore: Store<fromApp.AppState>
  ) { }

  ngOnInit() {
    this.authSubscription = this.appStore.select('auth').subscribe(authState => {
      this.isLoading = authState.loading;
      this.error = authState.authErrorMsg;
      if (this.error) {
        this.showErrorAlert(this.error);
      }
    });
  }

  ngOnDestroy() {
    if (this.closeSubscription) {
      this.closeSubscription.unsubscribe();
    }
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
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

    if (this.isLoginMode) {
      this.appStore.dispatch(new AuthActions.LoginStart({ email: email, password: password }))
    } else {
      this.appStore.dispatch(new AuthActions.SignUpStart({ email: email, password: password }));
    }

    form.reset();
  }

  onHandleError(): void {
    this.appStore.dispatch(new AuthActions.ClearError());
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
