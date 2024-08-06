import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { saveAs } from 'file-saver';
import { ExportDialogComponent } from '../export-dialog/export-dialog.component';
import { DatabaseService } from '../services/database.service';
import { AlgoResponseService } from '../services/algo-response.service';
interface Candidate {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  address: string;
  experience: number;
  candidate_id: string;
  resume: string;
  cover_letter: string;
}

@Component({
  selector: 'app-analysis',
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class AnalysisComponent implements OnInit, AfterViewInit {
  secondFormGroup: FormGroup;
  displayedColumns: string[] = ['id', 'name', 'experience', 'profile'];
  dataSource = new MatTableDataSource<Candidate>([]);
  jobs: any = []

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private _formBuilder: FormBuilder, private http: HttpClient, public dialog: MatDialog,
              public dbservice: DatabaseService, public algoservice: AlgoResponseService
  ) {
    this.secondFormGroup = this._formBuilder.group({
      jobDescription: ['', Validators.required],
    });

    this.jobs = this.getAllJobs()
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

  openExportDialog(): void {
    const dialogRef = this.dialog.open(ExportDialogComponent, {
      height: '350px',
      width: '400px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.exportData(result.rows, result.columns);
      }
    });
  }

  exportData(rows: number, columns: string[]): void {
    const csvData: string[] = [];
  
    // Add headers
    csvData.push(columns.join(','));
  
    // Add rows
    this.dataSource.data.slice(0, rows).forEach(candidate => {
      const row: string[] = [];
      columns.forEach(column => {
        // Ensure to properly escape and quote CSV fields
        const field = candidate[column as keyof Candidate] || '';
        row.push(`"${field}"`);
      });
      csvData.push(row.join(','));
    });
  
    // Create CSV content
    const csvContent = csvData.join('\n');
    const encodedUri = encodeURI(csvContent);
    const blob = new Blob([csvContent], { type: 'text/csv' });
  
    // Use file-saver to save the CSV file
    saveAs(blob, `Export_${new Date().toISOString()}.csv`);
  }

  getResumeUrl(candidateId: string): string {
    return `http://127.0.0.1:8000/resume/${candidateId}`;
  }

  getCoverLetterUrl(candidateId: string): string {
    return `http://127.0.0.1:8000/cover_letter/${candidateId}`;
  }
  
  getAllJobs(){
    this.dbservice.getAllJobs().subscribe(
      data =>{
        this.jobs = data
      }
    )
  }

  runJDToResumeMatch(jobId: number): void {
    this.algoservice.runForAllCandidates(jobId).subscribe(response => {
      console.log('Match process started', response);
      this.updateCandidatesWithMatch(response.result)
    }, error => {
      console.error('Error running JD to Resume Match', error);
    });
  }

  updateCandidatesWithMatch(results: any[]): void {
    this.dataSource.data = this.dataSource.data.map(candidate => {
      const match = results.find(r => r.candidate_id === candidate.id);
      return {
        ...candidate,
        match_percentage: match ? match.match_percentage : 0
      };
    });
  }
  
}
