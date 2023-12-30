import { Component} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import {AddDialogComponent} from '../../../dialogs/add/add.component';
import {EditDialogComponent} from '../../../dialogs/edit/edit.component'
import { FirebaseService } from 'src/app/services/firebase.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent {
   ageValue: number = 0;
  searchValue: string = "";
  items: Array<any>;
  age_filtered_items: Array<any>;
  name_filtered_items: Array<any>;

  constructor(
    public firebaseService: FirebaseService,
    public dialogService: MatDialog,
    private router: Router
  ) { }

  ngOnInit() {
    this.getData();
  }

  getData(){
    this.firebaseService.getUsers()
    .subscribe(result => {
      this.items = result;
      this.age_filtered_items = result;
      this.name_filtered_items = result;
    })
  }
  createNewUser() {
    const dialogRef = this.dialogService.open(AddDialogComponent, {
      data: {issue: {} }
    });
  }
  editUser(item){
    const dialogRef = this.dialogService.open(EditDialogComponent, {
      data: {recId: item.payload.doc.id}
    });
  }
  deleteUser(item) {
    this.firebaseService.deleteUser(item.payload.doc.id)
    .then(
      res => {
        // this.router.navigate(['/home']);
      },
      err => {
        console.log(err);
      }
    )
  }
  capitalizeFirstLetter(value){
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  searchByName(){
    let value = this.searchValue.toLowerCase();
    this.firebaseService.searchUsers(value)
    .subscribe(result => {
      this.name_filtered_items = result;
      this.items = this.combineLists(result, this.age_filtered_items);
    })
  }

  rangeChange(event){
    this.firebaseService.searchUsersByAge(event.value)
    .subscribe(result =>{
      this.age_filtered_items = result;
      this.items = this.combineLists(result, this.name_filtered_items);
    })
  }

  combineLists(a, b){
    let result = [];

    a.filter(x => {
      return b.filter(x2 =>{
        if(x2.payload.doc.id == x.payload.doc.id){
          result.push(x2);
        }
      });
    });
    return result;
  }

}