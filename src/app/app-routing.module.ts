import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrowseTaskComponent } from './pages/browse-task/browse-task.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./pages/pages.module').then((m) => m.PagesModule),
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./auth/auth.module').then((m) => m.AuthModule),
  },
  
  {path:'browse-tasks', component:BrowseTaskComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
