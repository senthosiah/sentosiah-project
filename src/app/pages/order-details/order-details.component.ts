import { FirebaseService } from 'src/app/services/firebase.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit {
  orderDetails: any[] = []; // Define a property to hold the order details
  userId: string | null = null;
  userName: string = '';
  orderCount: number = 0;
  id = null;
  displayedColumns: string[] = [
    'id', 
    'productControl', 
    'customizationControl', 
    'customizationUnitControl', 
    'customizationUnitPriceControl', 
    'priceControl',
    'actions'
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth,
    public firebaseService: FirebaseService
  ) { }

  ngOnInit(): void {
    // Retrieve the current user ID from Firebase Auth
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.userId = user.uid;
        this.id = this.route.snapshot.params['id'];
        this.loadUserName();
        this.loadUserOrders();
      } else {
        // Handle case where user is not authenticated
        this.router.navigate(['/login']);
      }
    });

    // Retrieve order details from query parameters
    this.route.queryParams.subscribe(params => {
      if (params['orderDetails']) {
        this.orderDetails = JSON.parse(params['orderDetails']);
      }
    });
  }

  loadUserName(): void {
    if (this.id) {
      this.firestore.collection('users').doc(this.id).get().subscribe(doc => {
        if (doc.exists) {
          const userData = doc.data();
          this.userName = userData ? userData['name'] : '';
        }
      });
    }
  }

  loadUserOrders(): void {
    if (this.id) {
      this.firestore.collection('users').doc(this.id).collection('orders')
        .valueChanges()
        .subscribe((orders: any[]) => {
          this.orderDetails = orders;
          this.orderCount = orders.length;
          console.log('User orders:', this.orderDetails);
        });
    }
  }
  editOrder(orderId: string): void {
    this.router.navigate(['/product-order', this.id, orderId]);
  }
  

  deleteOrder(orderId: string): void {
    // Implement deletion logic here
    console.log('Deleting order with ID:', orderId);
    // Example: Call a service method to delete order
    this.firebaseService.deleteOrder(orderId, this.id).then(() => {
      console.log('Order deleted successfully.'); 
      // Example: Refresh order list after deletion
      this.loadUserOrders();
    })
    .catch(error => {
      console.error('Error deleting order:', error);
      // Handle error
    });
  }
  // deleteOrder(orderId: string): void {
  //   this.firestore.collection('users').doc(this.id).collection('orders').doc(orderId).delete()
  //     .then(() => {
  //       console.log('Order deleted successfully.');
  //       // Optionally, update UI or perform other actions after deletion
  //     })
  //     .catch(error => {
  //       console.error('Error deleting order:', error);
  //       // Handle error
  //     });
  // }
  
}
