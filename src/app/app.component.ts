import { ChangeDetectorRef, Component } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'sentosiah-project';
  constructor(public authService: AuthService, private cdr: ChangeDetectorRef) { }
  ngAfterViewInit() {
    this.authService.isLoggedIn().subscribe(() => {
      this.cdr.detectChanges(); // Manually trigger change detection
    });
  }
  logout() {
    this.authService.logout()
  }
}
