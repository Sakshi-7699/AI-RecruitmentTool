import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  showTabs = false;
  username = "";

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.authService.isLoggedIn.subscribe(isLoggedIn => {
      this.showTabs = isLoggedIn;
      this.username = localStorage.getItem('token') || "";
    });
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/user-login']);
  }

  theme = 'light-theme';
  toggleTheme(isDarkTheme: boolean) {
    const theme = isDarkTheme ? 'dark-theme' : 'light-theme';
    this.setTheme(theme);
  }

  setTheme(theme: string) {
    document.body.classList.remove('dark-theme', 'light-theme');
    document.body.classList.add(theme);
    localStorage.setItem('theme', theme);
  }
}
