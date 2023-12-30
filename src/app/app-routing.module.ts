import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/users/home/home.component';
import { MaterialModule } from './material/material.module';

const usersModule = () => import('./pages/users/user.module').then(x => x.UsersModule);
const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'users', loadChildren: usersModule },

  // otherwise redirect to home
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
