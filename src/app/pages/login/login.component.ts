import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email: string;
  password: string;
  errorMessage: string = '';
  returnUrl: string = '';
  constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute) {
    // Get returnUrl from query parameters
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '';
   }

  onLogin() {
    this.authService.login(this.email, this.password)
      .then((result) => {
        console.log('Logged in successfully:', result);
        this.router.navigateByUrl(this.returnUrl); // Redirect to returnUrl after successful login
      })
      .catch((error) => {
        console.error('Error logging in:', error);
        this.errorMessage = error.message;
      });
  }
}
