import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

interface Candidate {
  name: string;
  resume: string;
  cover_letter: string;
}

@Component({
  selector: 'app-analysis',
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.css']
})
export class AnalysisComponent implements OnInit {
  secondFormGroup: FormGroup;
  displayedColumns: string[] = ['name', 'resume', 'cover_letter'];
  dataSource = new MatTableDataSource<Candidate>([]);

  @ViewChild(MatSort) sort!: MatSort;

  constructor(private _formBuilder: FormBuilder, private http: HttpClient) {
    this.secondFormGroup = this._formBuilder.group({
      jobDescription: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.getCandidates();
    this.dataSource.sort = this.sort;
  }

  getCandidates(): void {
    this.http.get<Candidate[]>('http://localhost:8000/candidates/')
      .subscribe(data => {
        this.dataSource.data = data.map(candidate => ({
          ...candidate,
          resume: `data:application/pdf;base64,${candidate.resume}`,
          cover_letter: `data:application/pdf;base64,${candidate.cover_letter}`
        }));
      });
  }

  applyFilter(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.dataSource.filter = input.value.trim().toLowerCase();
  }

  onSubmit(): void {
    // Handle form submission logic here
  }
}
