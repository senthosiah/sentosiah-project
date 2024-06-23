import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddDialogComponent implements OnInit {
  exampleForm: FormGroup;

  validation_messages = {
    'name': [
      { type: 'required', message: 'Name is required.' }
    ],
    'surname': [
      { type: 'required', message: 'Surname is required.' }
    ],
    'location': [
      { type: 'required', message: 'Location is required.' },
    ]
  };

  constructor(
    private fb: FormBuilder,
    private router: Router,
    public firebaseService: FirebaseService
  ) { }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.exampleForm = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      location: ['', Validators.required]
    });
  }

  resetFields() {
    this.exampleForm.reset({
      name: '',
      surname: '',
      location: ''
    });
  }

  onSubmit() {
    if (this.exampleForm.valid) {
      this.firebaseService.createUser(this.exampleForm.value)
        .then(() => {
          console.log('User added successfully.');
          this.resetFields();
          // Optionally navigate to another page after successful submission
          // this.router.navigate(['/home']);
        })
        .catch(error => {
          console.error('Error adding user:', error);
          // Handle error here, e.g., display a message to the user
        });
    } else {
      console.error('Form is invalid.');
      // Optionally display validation errors to the user
    }
  }
}
