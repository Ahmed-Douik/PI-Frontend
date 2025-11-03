import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 


import { PagesRoutingModule } from './pages-routing.module';
import { HomeComponent } from './home/home.component';
import { BrowseTaskComponent } from './browse-task/browse-task.component';


@NgModule({
  declarations: [
    HomeComponent,
    BrowseTaskComponent
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    FormsModule
  ]
})
export class PagesModule { }
