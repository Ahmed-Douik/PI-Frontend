import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfilRoutingModule } from './profil-routing.module';
import { InfoComponent } from './info/info.component';
import { TasksComponent } from './tasks/tasks.component';
import { SubscriptionComponent } from './subscription/subscription.component';


@NgModule({
  declarations: [
    InfoComponent,
    TasksComponent,
    SubscriptionComponent
  ],
  imports: [
    CommonModule,
    ProfilRoutingModule,
    FormsModule
  ]
})
export class ProfilModule { }
