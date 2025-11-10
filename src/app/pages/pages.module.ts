import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';


import { PagesRoutingModule } from './pages-routing.module';
import { HomeComponent } from './home/home.component';
import { BrowseTaskComponent } from './browse-task/browse-task.component';


@NgModule({
  declarations: [
    HomeComponent,
    BrowseTaskComponent,

  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    HttpClientModule,
    FormsModule
  ]
})
export class PagesModule { }
