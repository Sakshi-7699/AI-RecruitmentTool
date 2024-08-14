import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FileUploadComponent } from './file-upload.component';
import { AlgoResponseService } from '../services/algo-response.service';
import { FormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { of } from 'rxjs';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('FileUploadComponent', () => {
  let component: FileUploadComponent;
  let fixture: ComponentFixture<FileUploadComponent>;
  let mockAlgoResponseService: jasmine.SpyObj<AlgoResponseService>;

  beforeEach(async () => {
    mockAlgoResponseService = jasmine.createSpyObj('AlgoResponseService', ['uploadFiles']);

    await TestBed.configureTestingModule({
      declarations: [FileUploadComponent],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        MatChipsModule,
        MatAutocompleteModule,
        HttpClientTestingModule,
      ],
      providers: [
        FormBuilder,
        { provide: AlgoResponseService, useValue: mockAlgoResponseService },
        LiveAnnouncer,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FileUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form groups on ngOnInit', () => {
    component.ngOnInit();
    expect(component.firstFormGroup).toBeDefined();
    expect(component.secondFormGroup).toBeDefined();
  });

  it('should update resumeFiles when a file is selected', () => {
    const mockFile = new File(['resume'], 'resume.pdf', { type: 'application/pdf' });
    const event = { target: { files: [mockFile] } } as unknown as Event;

    component.onFileSelected(event, 'resume');

    expect(component.resumeFiles.length).toBe(1);
    expect(component.resumeFiles[0]).toBe(mockFile);
  });

  it('should update coverLetterFiles when a file is selected', () => {
    const mockFile = new File(['coverLetter'], 'coverLetter.pdf', { type: 'application/pdf' });
    const event = { target: { files: [mockFile] } } as unknown as Event;

    component.onFileSelected(event, 'coverLetter');

    expect(component.coverLetterFiles.length).toBe(1);
    expect(component.coverLetterFiles[0]).toBe(mockFile);
  });

  it('should add a fruit to the list', () => {
    const event = { value: 'Teamwork' } as MatChipInputEvent;
    component.add(event);

    expect(component.fruits().length).toBe(2);
    expect(component.fruits()).toContain('Teamwork');
  });

  it('should remove a fruit from the list', () => {
    component.remove('Leadership');

    expect(component.fruits().length).toBe(0);
    expect(component.fruits()).not.toContain('Leadership');
  });

  it('should submit form and handle response', () => {
    const mockFile = new File(['resume'], 'resume.pdf', { type: 'application/pdf' });
    component.resumeFiles = [mockFile];
    component.coverLetterFiles = [mockFile];
    component.secondFormGroup.patchValue({ jobDescription: 'Mock Job Description' });
    component.fruits.set(['Leadership', 'Teamwork']);

    const mockResponse = {
      cover_letter_summary: 'Summary of cover letter',
      behavioral_scores: { Leadership: 5, Teamwork: 4 },
      resume_match_score: 90,
      model_match_score: 85,
    };

    mockAlgoResponseService.uploadFiles.and.returnValue(of(mockResponse));

    component.submit();

    expect(component.loading).toBe(false);
    expect(component.cover_letter_summary).toBe('Summary of cover letter');
    expect(component.behavioral_scores).toEqual({ Leadership: 5, Teamwork: 4 });
    expect(component.resume_match_score).toBe(90);
    expect(component.model_match_score).toBe(85);
    expect(component.isResponseReceived).toBe(true);
  });

  it('should trigger file input click event for resume', () => {
    spyOn(component.resumeInput.nativeElement, 'click');
    component.triggerFileInput('resume');
    expect(component.resumeInput.nativeElement.click).toHaveBeenCalled();
  });

  it('should trigger file input click event for cover letter', () => {
    spyOn(component.coverLetterInput.nativeElement, 'click');
    component.triggerFileInput('coverLetter');
    expect(component.coverLetterInput.nativeElement.click).toHaveBeenCalled();
  });

  it('should announce a fruit removal', () => {
    spyOn(component.announcer, 'announce');
    component.remove('Leadership');
    expect(component.announcer.announce).toHaveBeenCalledWith('Removed Leadership');
  });
});
