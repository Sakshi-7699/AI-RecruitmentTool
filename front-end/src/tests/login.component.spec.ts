import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { of, throwError } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let httpMock: HttpTestingController;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockAuthService = jasmine.createSpyObj('AuthService', ['login']);

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule
      ],
      providers: [
        FormBuilder,
        { provide: Router, useValue: mockRouter },
        { provide: AuthService, useValue: mockAuthService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form group on creation', () => {
    expect(component.loginForm).toBeDefined();
    expect(component.loginForm.controls['username']).toBeDefined();
    expect(component.loginForm.controls['password']).toBeDefined();
  });

  it('should login successfully and redirect', () => {
    const mockToken = 'mock-token';
    const mockResponse = { token: mockToken };
    const credentials = { username: 'testuser', password: 'testpass' };

    component.loginForm.setValue(credentials);

    spyOn(localStorage, 'setItem');

    httpMock.expectOne('http://localhost:8000/auth/login').flush(mockResponse);

    component.onLogin();

    expect(localStorage.setItem).toHaveBeenCalledWith('token', mockToken);
    expect(mockAuthService.login).toHaveBeenCalledWith(mockToken);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should handle login error', () => {
    const credentials = { username: 'testuser', password: 'testpass' };

    component.loginForm.setValue(credentials);

    httpMock.expectOne('http://localhost:8000/auth/login').flush('Login failed', { status: 401, statusText: 'Unauthorized' });

    spyOn(console, 'error');

    component.onLogin();

    expect(console.error).toHaveBeenCalledWith('Login failed', jasmine.any(Object));
  });

  it('should not call onLogin if form is invalid', () => {
    spyOn(component, 'onLogin').and.callThrough();

    component.loginForm.setValue({ username: '', password: '' });

    component.onLogin();

    expect(component.onLogin).not.toHaveBeenCalled();
  });
});
