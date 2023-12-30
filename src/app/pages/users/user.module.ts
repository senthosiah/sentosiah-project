import { MaterialModule } from './../../material/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LayoutComponent } from './layout.component';
import { UsersRoutingModule } from './user-routing.module';
import { ListComponent } from './list/list.component';
import { FormsModule } from '@angular/forms';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        MaterialModule,
        UsersRoutingModule,
    ],
    declarations: [
        LayoutComponent,
        ListComponent,
    ]
})
export class UsersModule { }