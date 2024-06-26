import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import * as moment from 'moment';

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
  editingOrder: any = null;

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
        this.route.queryParams.subscribe(params => {
          if (params['order']) {
            this.editingOrder = JSON.parse(params['order']);
            this.populateForm(this.editingOrder);
          }
        });
      } else {
        // Redirect to login if not authenticated
        this.router.navigate(['/login']);
      }
    });
  }

  private _filterProducts(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.products.filter(product => product.name.toLowerCase().includes(filterValue));
  }

  displayProduct(product: any): string {
    return product ? product.name : '';
  }

  populateForm(order: any): void {
    if (order) {
      const entries = this.orderForm.get('entries') as FormArray;
      entries.clear(); // Clear existing entries if any
  
      // Create a FormGroup for the order entry and push it to the FormArray
      const entryFormGroup = new FormGroup({
        productControl: new FormControl(order.productControl),
        customizationControl: new FormControl(order.customizationControl),
        customizationUnitControl: new FormControl(order.customizationUnitControl),
        customizationUnitPriceControl: new FormControl(order.customizationUnitPriceControl),
        priceControl: new FormControl(order.priceControl),
        orderDate: new FormControl(moment(order.orderDate, 'DD-MM-YYYY').toDate()) // Parse and set the order date
      });
  
      entries.push(entryFormGroup);
      this.orderForm.patchValue({ totalPrice: order.totalPrice });
    } else {
      console.error('Invalid order data:', order);
    }
  }
  
  submitOrder() {
    if (this.userId && this.id) {
      const entriesFormArray = this.orderForm.get('entries') as FormArray;
      const batch = this.firestore.firestore.batch();
  
      entriesFormArray.controls.forEach((entryFormGroup: FormGroup) => {
        // Calculate price based on customization for each entry
        const price = this.calculatePrice(entryFormGroup.value);
        entryFormGroup.patchValue({ priceControl: price });
        const totalPrice = this.calculateTotalPrice(entryFormGroup.value);
        entryFormGroup.patchValue({ totalPrice: totalPrice });
        const orderDate = moment(entryFormGroup.value.orderDate).format('DD-MM-YYYY');
        // Prepare order data for Firestore
        const orderData = {
          ...entryFormGroup.value,
          orderDate,
          userId: this.userId,
          orderId: ''
        };
  
        if (this.editingOrder) {
          // Update existing order
          const orderRef = this.firestore.collection('users').doc(this.id).collection('orders').doc(this.editingOrder.orderId);
          const orderId = orderRef.ref.id;
          batch.update(orderRef.ref, { ...orderData, orderId });
        } else {
          // Create a new document reference with auto-generated ID for each order within a batch
          const orderRef = this.firestore.collection('users').doc(this.id).collection('orders').doc();
          const orderId = orderRef.ref.id;
          batch.set(orderRef.ref, { ...orderData, orderId }); // Include orderId in the document data
        }
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

  calculatePrice(customization: any): number {
    const basePrice = 10;
    const { customizationUnitControl, customizationUnitPriceControl } = customization;
    const customizationPrice = customizationUnitControl * customizationUnitPriceControl;
    return basePrice + customizationPrice;
  }

  addEntry(): void {
    const today = new Date();
    const entryFormGroup = new FormGroup({
      productControl: new FormControl(),
      customizationControl: new FormControl(),
      customizationUnitControl: new FormControl(),
      customizationUnitPriceControl: new FormControl(),
      priceControl: new FormControl(),
      orderDate: new FormControl(today) // Add the orderDate control with today's date
    });

    // Push the new entry FormGroup to the FormArray
    (this.orderForm.get('entries') as FormArray).push(entryFormGroup);

    // Update filteredProducts for the new entry
    this.filteredProducts = entryFormGroup.get('productControl').valueChanges.pipe(
      startWith(''),
      map(value => this._filterProducts(value))
    );
  }

  calculateTotalPrice(customization: any): number {
    let totalPrice = 0;
    const entriesFormArray = this.orderForm.get('entries') as FormArray;
    entriesFormArray.controls.forEach(entryFormGroup => {
      const price = this.calculatePrice(entryFormGroup.value);
      entryFormGroup.patchValue({ priceControl: price }, { emitEvent: false });
      totalPrice += price;
    });

    this.orderForm.patchValue({ totalPrice });
    return totalPrice;
  }
}
