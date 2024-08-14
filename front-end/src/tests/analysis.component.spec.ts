import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AnalysisComponent } from './analysis.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { saveAs } from 'file-saver';
import { ExportDialogComponent } from '../export-dialog/export-dialog.component';
import { DatabaseService } from '../services/database.service';
import { AlgoResponseService } from '../services/algo-response.service';
import { ChangeDetectorRef } from '@angular/core';

describe('AnalysisComponent', () => {
  let component: AnalysisComponent;
  let fixture: ComponentFixture<AnalysisComponent>;
  let httpMock: HttpTestingController;
  let mockDbService: jasmine.SpyObj<DatabaseService>;
  let mockAlgoResponseService: jasmine.SpyObj<AlgoResponseService>;
  let mockDialog: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    mockDbService = jasmine.createSpyObj('DatabaseService', ['getAllJobs']);
    mockAlgoResponseService = jasmine.createSpyObj('AlgoResponseService', ['runForAllCandidates']);
    mockDialog = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      declarations: [AnalysisComponent],
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule,
        MatTableModule,
        MatSortModule,
        MatPaginatorModule,
        MatDialogModule
      ],
      providers: [
        FormBuilder,
        { provide: DatabaseService, useValue: mockDbService },
        { provide: AlgoResponseService, useValue: mockAlgoResponseService },
        { provide: MatDialog, useValue: mockDialog },
        ChangeDetectorRef
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalysisComponent);
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
    expect(component.secondFormGroup).toBeDefined();
  });

  it('should apply filter to dataSource', () => {
    component.dataSource.data = [
      { id: 1, name: 'John Doe', email: 'john@example.com', phone_number: '1234567890', address: '123 Street', experience: 5, candidate_id: '1', resume: '', cover_letter: '' }
    ];
    
    component.applyFilter({ target: { value: 'John' } } as Event);

    expect(component.dataSource.filter).toBe('john');
    expect(component.dataSource.paginator.firstPage).toHaveBeenCalled();
  });

  it('should open export dialog and handle export', () => {
    const mockDialogRef = { afterClosed: () => of({ rows: 1, columns: ['name'] }) } as any;
    mockDialog.open.and.returnValue(mockDialogRef);

    spyOn(component, 'exportData');

    component.openExportDialog();

    expect(mockDialog.open).toHaveBeenCalledWith(ExportDialogComponent, {
      height: '350px',
      width: '400px'
    });
    expect(component.exportData).toHaveBeenCalledWith(1, ['name']);
  });

  it('should export data to CSV', () => {
    spyOn(saveAs);

    component.dataSource.data = [
      { id: 1, name: 'John Doe', email: 'john@example.com', phone_number: '1234567890', address: '123 Street', experience: 5, candidate_id: '1', resume: '', cover_letter: '' }
    ];

    component.exportData(1, ['id', 'name']);

    const csvContent = 'id,name\n"1","John Doe"\n';
    const blob = new Blob([csvContent], { type: 'text/csv' });

    expect(saveAs).toHaveBeenCalledWith(blob, jasmine.any(String));
  });

  it('should fetch and display candidates on init', () => {
    const mockCandidates = [
      { id: 1, name: 'John Doe', email: 'john@example.com', phone_number: '1234567890', address: '123 Street', experience: 5, candidate_id: '1', resume: 'encoded', cover_letter: 'encoded' }
    ];

    component.getCandidates();

    const req = httpMock.expectOne('http://localhost:8000/candidates/');
    expect(req.request.method).toBe('GET');
    req.flush(mockCandidates);

    expect(component.dataSource.data.length).toBe(1);
  });

  it('should call runJDToResumeMatch and update dataSource', () => {
    const mockResponse = {
      result: [
        { id: 1, name: 'John Doe', email: 'john@example.com', phone_number: '1234567890', address: '123 Street', experience: 5, candidate_id: '1', resume: 'encoded', cover_letter: 'encoded' }
      ]
    };

    mockAlgoResponseService.runForAllCandidates.and.returnValue(of(mockResponse));

    component.runJDToResumeMatch(1);

    expect(mockAlgoResponseService.runForAllCandidates).toHaveBeenCalledWith(1);
    expect(component.dataSource.data.length).toBe(1);
    expect(component.showScore).toBe(true);
    expect(component.isShow).toBe(true);
  });

  it('should call getAllJobs and set jobs', () => {
    const mockJobs = [{ id: 1, title: 'Job Title' }];

    mockDbService.getAllJobs.and.returnValue(of(mockJobs));

    component.getAllJobs();

    expect(mockDbService.getAllJobs).toHaveBeenCalled();
    expect(component.jobs).toEqual(mockJobs);
  });

  it('should return correct resume URL', () => {
    const url = component.getResumeUrl('1');
    expect(url).toBe('http://127.0.0.1:8000/resume/1');
  });

  it('should return correct cover letter URL', () => {
    const url = component.getCoverLetterUrl('1');
    expect(url).toBe('http://127.0.0.1:8000/cover_letter/1');
  });
});
