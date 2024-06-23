import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component'; 
import { CdkModule } from './cdk/cdk.module';
import { MaterialModule } from './material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './pages/users/home/home.component';
import { UsersRoutingModule } from './pages/users/user-routing.module';
import { EditDialogComponent } from './dialogs/edit/edit.component';
import { AddDialogComponent } from './dialogs/add/add.component';
import { HttpClientModule } from '@angular/common/http';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { environment } from 'src/environments/environment';
import { LoginComponent } from './pages/login/login.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { OrderDetailsComponent } from './pages/order-details/order-details.component';
import { ProductOrderComponent } from './pages/product-order/product-order.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AddDialogComponent,
    EditDialogComponent,
    LoginComponent,
    SignUpComponent,
    OrderDetailsComponent,
    ProductOrderComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule, 
    ReactiveFormsModule,
    UsersRoutingModule,
    MaterialModule, 
    CdkModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(){
    console.log('Firebase Config:', environment.firebase);

  }
 }
