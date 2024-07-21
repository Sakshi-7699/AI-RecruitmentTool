import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  

  onLogin(): void {
    if (this.loginForm.valid) {
      this.authService.login();


      const credentials = this.loginForm.value;
      const username = credentials.username;
      const pwd = credentials.password;
      this.http.post('http://localhost:8000/auth/login', username,pwd).subscribe(
        (response: any) => {
          localStorage.setItem('token', response.token);
          this.router.navigate(['/']);
        },
        error => {
          console.error('Login failed', error);
        }
      );
    }
  }
}
