import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/users/home/home.component';
import { MaterialModule } from './material/material.module';
import { LoginComponent } from './pages/login/login.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { AuthGuard } from './services/auth.guard';
import { OrderDetailsComponent } from './pages/order-details/order-details.component';
import { ProductOrderComponent } from './pages/product-order/product-order.component';

const usersModule = () => import('./pages/users/user.module').then(x => x.UsersModule);
const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'users', loadChildren: usersModule, canActivate: [AuthGuard]  },
  { path: 'login', component: LoginComponent},
  { path: 'sign-up', component: SignUpComponent },
  { path: 'order-details/:id', component: OrderDetailsComponent, canActivate: [AuthGuard]  },
  { path: 'product-order/:id', component: ProductOrderComponent, canActivate: [AuthGuard]  },
  // { path: '', redirectTo: '/sign-up', pathMatch: 'full' },

  // otherwise redirect to home
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
