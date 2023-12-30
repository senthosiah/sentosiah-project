import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {Component, Inject} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditDialogComponent {

  exampleForm: FormGroup;
  item: any;

  validation_messages = {
   'name': [
     { type: 'required', message: 'Name is required.' }
   ],
   'surname': [
     { type: 'required', message: 'Surname is required.' }
   ],
   'age': [
     { type: 'required', message: 'Age is required.' },
   ]
 };
data;
  constructor(
    public firebaseService: FirebaseService,
    private fb: FormBuilder,
    private router: Router,
    private dialogRef: MatDialogRef<EditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.data = data;

   }

  ngOnInit() {
    this.exampleForm = this.fb.group({
      name:  new FormControl(),
      surname:  new FormControl(),
      age:  new FormControl()
    });
    this.firebaseService.getUser(this.data.recId)
    .subscribe(
      data => {
        this.item = data;
            this.item.id = this.data.recId
            this.createForm();
      }
    );
  }

  createForm() {
    this.exampleForm = this.fb.group({
      name: [this.item.name, Validators.required],
      surname: [this.item.surname, Validators.required],
      age: [this.item.age, Validators.required]
    });
  }


  onSubmit(value){
    value.age = Number(value.age);
    this.firebaseService.updateUser(this.item.id, value)
    .then(
      res => {
        this.dialogRef.close()
      }
    )
  }

  delete(){
    this.firebaseService.deleteUser(this.item.id)
    .then(
      res => {
        // this.router.navigate(['/home']);
        this.dialogRef.close()
      },
      err => {
        console.log(err);
      }
    )
  }

  cancel(){
    // this.router.navigate(['/home']);
    this.dialogRef.close()
  }

}
