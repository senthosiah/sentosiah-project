import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';

@Component({
  selector: 'app-product-order',
  templateUrl: './product-order.component.html',
  styleUrls: ['./product-order.component.scss']
})
export class ProductOrderComponent implements OnInit {
  @ViewChild('auto') auto: MatAutocompleteTrigger | undefined; // Declare auto as ViewChild
  orderForm: FormGroup;
  products: any[] = []; // Replace with your actual product array
  filteredProducts: Observable<any[]>;
  userId: string | null = null;
  id: string | null = null;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth
  ) {
    this.orderForm = new FormGroup({
      entries: new FormArray([]), // FormArray for multiple entries
      totalPrice: new FormControl({ value: 0, disabled: true }) // Total price control
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
    // this.filteredProducts = this.orderForm.controls['productControl'].valueChanges.pipe(
    //   startWith(''),
    //   map(value => this._filterProducts(value))
    // );
  }

  private _filterProducts(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.products.filter(product => product.name.toLowerCase().includes(filterValue));
  }

  displayProduct(product: any): string {
    return product ? product.name : '';
  }

  submitOrder() {
    if (this.userId && this.id) {
      const entriesFormArray = this.orderForm.get('entries') as FormArray;
      const batch = this.firestore.firestore.batch();
  
      entriesFormArray.controls.forEach((entryFormGroup: FormGroup) => {
        // Calculate price based on customization for each entry
        const price = this.calculatePrice(entryFormGroup.value);
        entryFormGroup.patchValue({ priceControl: price });
  
        // Prepare order data for Firestore
        const orderData = {
          ...entryFormGroup.value,
          userId: this.userId,
          orderId: ''
        };
  
        // Create a new document reference with auto-generated ID for each order within a batch
        const orderRef = this.firestore.collection('users').doc(this.id).collection('orders').doc();
        const orderId = orderRef.ref['id']; // Get the auto-generated orderId
        batch.set(orderRef.ref, { ...orderData, orderId }); // Include orderId in the document data
      });
  
      // Commit the batch write
      batch.commit()
        .then(() => {
          console.log('Orders successfully saved');
          this.router.navigate(['/order-details', this.id]);
        })
        .catch(error => {
          console.error('Error saving orders: ', error);
        });
    } else {
      console.error('User ID or document ID not available');
    }
  }
  
  

  calculatePrice(customization) {
    let basePrice = 10;
    const {customizationUnitControl, customizationUnitPriceControl} = customization;
    let customizationPrice = customizationUnitControl * customizationUnitPriceControl;
    return (basePrice + customizationPrice);
  }
  addEntry(): void {
    const entryFormGroup = new FormGroup({
      productControl: new FormControl(),
      customizationControl: new FormControl(),
      customizationUnitControl: new FormControl(),
      customizationUnitPriceControl: new FormControl(),
      priceControl: new FormControl()
    });

    // Push the new entry FormGroup to the FormArray
    (this.orderForm.get('entries') as FormArray).push(entryFormGroup);

    // Update filteredProducts for the new entry
    this.filteredProducts = entryFormGroup.get('productControl').valueChanges.pipe(
      startWith(''),
      map(value => this._filterProducts(value))
    );
  }

  calculateTotalPrice(): void {
    let totalPrice = 0;
    const entriesFormArray = this.orderForm.get('entries') as FormArray;
    entriesFormArray.controls.forEach(entryFormGroup => {
      const price = this.calculatePrice(entryFormGroup.value);
      entryFormGroup.patchValue({ priceControl: price }, { emitEvent: false });
      totalPrice += price;
    });

    this.orderForm.patchValue({ totalPrice });
  }

}
