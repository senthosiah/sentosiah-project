import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-product-order',
  templateUrl: './product-order.component.html',
  styleUrls: ['./product-order.component.scss']
})
export class ProductOrderComponent implements OnInit {
  orderForm: FormGroup;
  products: any[] = []; // Replace with your actual product array
  filteredProducts: Observable<any[]>;
  userId: string | null = null;
  id = null;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth
  ) {
    this.orderForm = new FormGroup({
      productControl: new FormControl(),
      customizationControl: new FormControl(),
      customizationUnitControl: new FormControl(),
      customizationUnitPriceControl: new FormControl(),
      priceControl: new FormControl()
    });
  }

  ngOnInit(): void {
    // Get the logged-in user's ID
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.userId = user.uid;
        this.id = this.route.snapshot.params['id'];
        console.log('route', this.route)
        this.route.queryParams.subscribe(params => {
          console.log('params', params)
        });
      } else {
        // Redirect to login if not authenticated
        this.router.navigate(['/login']);
      }
    });

    // Initialize filteredProducts with products array
    this.filteredProducts = this.orderForm.controls['productControl'].valueChanges.pipe(
      startWith(''),
      map(value => this._filterProducts(value))
    );
  }

  private _filterProducts(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.products.filter(product => product.name.toLowerCase().includes(filterValue));
  }

  displayProduct(product: any): string {
    return product ? product.name : '';
  }

  submitOrder() {
    if (this.userId) {
    // Calculate price based on customization
    const price = this.calculatePrice(this.orderForm.value);
    this.orderForm.patchValue({ priceControl: price });
    
      const orderData = this.orderForm.value;
      orderData.userId = this.userId; // Add user ID to the order data

   
      // Save the order to Firestore under the user document
      this.firestore.collection('users').doc(this.id).collection('orders').add(orderData)
        .then(() => {
          console.log('Order successfully saved');
          this.router.navigate(['/order-details', this.id]);
        })
        .catch(error => {
          console.error('Error saving order: ', error);
        });
    } else {
      // Handle case where user ID is not available
      console.error('User ID not available');
    }
  }

  calculatePrice(customization) {
    let basePrice = 10;
    const {customizationUnitControl, customizationUnitPriceControl} = customization;
    let customizationPrice = customizationUnitControl * customizationUnitPriceControl;
    return (basePrice + customizationPrice);
  }
}
