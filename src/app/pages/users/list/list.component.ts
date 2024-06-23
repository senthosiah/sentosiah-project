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
  filtered_items: any[] = [];
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
  searchByNameOrLocation() {
    let value = this.searchValue.toLowerCase();
  
    // Search by name
    this.firebaseService.searchUsersByName(value)
      .subscribe(nameResult => {
        // Search by location
        this.firebaseService.searchUsersByLocation(value)
          .subscribe(locationResult => {
            // Combine results
            this.filtered_items = [...nameResult, ...locationResult];
            this.items = this.combineLists(this.filtered_items);
          });
      });
  }
  

  combineLists(filteredList) {
    return filteredList.filter((item, index, self) =>
      index === self.findIndex((t) => (
        t.payload.doc.id === item.payload.doc.id
      ))
    );
  }
  
  // rangeChange(event){
  //   this.firebaseService.searchUsersByAge(event.value)
  //   .subscribe(result =>{
  //     this.age_filtered_items = result;
  //     this.items = this.combineLists(result, this.name_filtered_items);
  //   })
  // }


  viewOrderDetails(client: any) {
    // Navigate to order details component and pass order details
    this.router.navigate(['/order-details', client.payload.doc.id], {
      queryParams: {
        orderDetails: JSON.stringify(client.orderDetails) // Assuming orderDetails is structured appropriately
      }
    });
  }

}