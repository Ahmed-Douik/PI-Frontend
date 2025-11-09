import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {InfoComponent} from "./info/info.component";
import {SubscriptionComponent} from "./subscription/subscription.component";
import {TasksComponent} from "./tasks/tasks.component";

const routes: Routes = [
  {path:'info', component: InfoComponent},
  {path:'sub',component:SubscriptionComponent},
  {path:'tasks', component: TasksComponent},
  {path:'',redirectTo:'info',pathMatch:'full'},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfilRoutingModule { }
