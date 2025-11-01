import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {Step1BasicsComponent} from "./step1-basics/step1-basics.component";
import {Step2RateComponent} from "./step2-rate/step2-rate.component";
import {Step3LocationComponent} from "./step3-location/step3-location.component";

const routes: Routes = [
  { path: 'step1', component: Step1BasicsComponent },
  { path: 'step2', component: Step2RateComponent },
  { path: 'step3', component: Step3LocationComponent },
  { path: '', redirectTo: 'step1', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PostTaskRoutingModule { }
