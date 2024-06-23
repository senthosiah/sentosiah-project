import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent {
  email: string;
  password: string;
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  onSignUp() {
    this.authService.signUp(this.email, this.password)
      .then((result) => {
        console.log('Signed up successfully:', result);
        this.router.navigate(['/login']);
      })
      .catch((error) => {
        console.error('Error signing up:', error);
        this.errorMessage = error.message; 
      });
  }
}
