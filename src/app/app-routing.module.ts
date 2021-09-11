import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  { path: '', redirectTo: '/recipes', pathMatch: 'full' }

  // Below doesn't work!!!
  // ,
  // { path: 'not-found', component: NotFoundComponent, data: {errorMessage: '404: The requested page is not found!'} },
  // { path: '**', redirectTo: '/not-found' }
]

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {

}
