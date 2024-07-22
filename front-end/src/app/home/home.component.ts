// home.component.ts
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  features = [
    {
      icon: 'how_to_reg',
      title: 'Candidate to Job Matching',
      description: 'Our AI matches candidates to job descriptions with high accuracy.'
    },
    {
      icon: 'psychology',
      title: 'Behavioral Analysis',
      description: 'Analyze candidate behaviors to find the best fit for your company.'
    },
    {
      icon: 'people_alt',
      title: 'Match Multiple Candidates',
      description: 'Match multiple candidates against a single job description efficiently.'
    }
  ];

  steps = [
    {
      icon: 'account_circle',
      description: 'Register an account and fill out your profile.'
    },
    {
      icon: 'cloud_upload',
      description: 'Upload job descriptions and candidate resumes.'
    },
    {
      icon: 'search',
      description: 'Use AI to match candidates to job descriptions.'
    },
    {
      icon: 'thumb_up',
      description: 'Review and hire the best candidates.'
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }
}
