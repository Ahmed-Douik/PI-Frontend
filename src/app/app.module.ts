import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { FormsModule } from '@angular/forms'; 
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {CoreModule} from "./core/core.module";
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { UsersManagementComponent } from './admin/users-management/users-management.component';
import { TasksManagementComponent } from './admin/tasks-management/tasks-management.component';
import { ConflictsManagementComponent } from './admin/conflicts-management/conflicts-management.component';
import { SubscriptionsManagementComponent } from './admin/subscriptions-management/subscriptions-management.component';
import { AdminNavbarComponent } from './admin/admin-navbar/admin-navbar.component';
import { AdminLayoutComponent } from './admin/admin-layout/admin-layout.component';
import { StatisticsComponent } from './admin/statistics/statistics.component';

@NgModule({
  declarations: [
    AppComponent,
    AdminDashboardComponent,
    UsersManagementComponent,
    TasksManagementComponent,
    ConflictsManagementComponent,
    SubscriptionsManagementComponent,
    AdminNavbarComponent,
    AdminLayoutComponent,
    StatisticsComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
         HttpClientModule, 
        CoreModule,
        FormsModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
