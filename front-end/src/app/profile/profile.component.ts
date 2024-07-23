import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      role: ['', Validators.required],
      company: ['', Validators.required]
    });

    this.loadUserData();
  }

  loadUserData() {
    const userData = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '123-456-7890',
      role: 'Developer',
      company: 'Tech Corp'
    };

    this.profileForm.setValue(userData);
  }

  onSubmit() {
    if (this.profileForm.valid) {
      console.log(this.profileForm.value);
      // Save the updated user data, for example, send it to the server
    }
  }
}
