import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    // Check authentication status
    this.authService.isLoggedIn().subscribe(user => {
      if (user) {
        this.router.navigate(['']); // Redirect to clients if authenticated
      }
    });
  }
}
