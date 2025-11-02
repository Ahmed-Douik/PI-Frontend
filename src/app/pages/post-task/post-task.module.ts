import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PostTaskRoutingModule } from './post-task-routing.module';
import { Step1BasicsComponent } from './step1-basics/step1-basics.component';
import { Step2RateComponent } from './step2-rate/step2-rate.component';
import { Step3LocationComponent } from './step3-location/step3-location.component';


@NgModule({
  declarations: [
    Step1BasicsComponent,
    Step2RateComponent,
    Step3LocationComponent
  ],
  imports: [
    CommonModule,
    PostTaskRoutingModule,
    FormsModule
  ]
})
export class PostTaskModule { }
