// admin-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { UsersManagementComponent } from './users-management/users-management.component';
import { TasksManagementComponent } from './tasks-management/tasks-management.component';
import { ConflictsManagementComponent } from './conflicts-management/conflicts-management.component';
import { SubscriptionsManagementComponent } from './subscriptions-management/subscriptions-management.component';

const routes: Routes = [
  {
    path: 'admin-dashboard',
    component: AdminDashboardComponent
  },
  {
    path: 'users-management',
    component: UsersManagementComponent
  },
  {
    path: 'tasks-management',
    component: TasksManagementComponent
  },
  {
    path: 'conflicts-management',
    component: ConflictsManagementComponent
  },
  {
    path: 'subscriptions-management',
    component: SubscriptionsManagementComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }