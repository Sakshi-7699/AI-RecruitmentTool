import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { animate, state, style, transition, trigger } from '@angular/animations';


interface Candidate {
  name: string;
  resume: string;
  cover_letter: string;
}

@Component({
  selector: 'app-analysis',
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.css'],
  
})
export class AnalysisComponent implements OnInit, AfterViewInit {
  secondFormGroup: FormGroup;
  displayedColumns: string[] = ['name', 'resume', 'cover_letter'];
  dataSource = new MatTableDataSource<Candidate>([]);

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private _formBuilder: FormBuilder, private http: HttpClient) {
    this.secondFormGroup = this._formBuilder.group({
      jobDescription: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.getCandidates();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
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
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  submit(): void {
    // Handle form submission logic here
  }

}
