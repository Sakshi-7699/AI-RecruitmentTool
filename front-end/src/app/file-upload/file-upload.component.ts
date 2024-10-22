import { Component, Input, ViewChild, ElementRef, EventEmitter, Output, OnInit } from '@angular/core';
import { AlgoResponseService } from '../services/algo-response.service';
import { FormBuilder, Validators, FormsModule, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { ChangeDetectionStrategy, computed, inject, model, signal } from '@angular/core';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent implements OnInit {

  constructor(private algoservice: AlgoResponseService, private _formBuilder: FormBuilder) {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required],
    });
    this.secondFormGroup = this._formBuilder.group({
      jobDescription: ['', Validators.required],
    });
  }


  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  readonly panelOpenState = signal(false);
  
  @ViewChild('resumeInput', { static: false }) resumeInput!: ElementRef;
  @ViewChild('coverLetterInput', { static: false }) coverLetterInput!: ElementRef;

  resumeFiles: File[] = [];
  coverLetterFiles: File[] = [];

  // Behavioral module
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  readonly currentFruit = model('');
  readonly fruits = signal(['Leadership']);
  readonly allFruits: string[] = ['Meritocracy', 'Leadership', 'Emotional Intelligence'];
  readonly filteredFruits = computed(() => {
    const currentFruit = this.currentFruit().toLowerCase();
    return currentFruit ? this.allFruits.filter(fruit => fruit.toLowerCase().includes(currentFruit)) : this.allFruits.slice();
  });

  readonly announcer = inject(LiveAnnouncer);

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required],
    });
    this.secondFormGroup = this._formBuilder.group({
      jobDescription: ['', Validators.required],
    });
  }

  onFileSelected(event: Event, fileType: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      if (fileType === 'resume') {
        this.resumeFiles = Array.from(input.files);
      } else if (fileType === 'coverLetter') {
        this.coverLetterFiles = Array.from(input.files);
      }
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onDrop(event: DragEvent, fileType: string): void {
    event.preventDefault();
    if (event.dataTransfer && event.dataTransfer.files) {
      if (fileType === 'resume') {
        this.resumeFiles = Array.from(event.dataTransfer.files);
      } else if (fileType === 'coverLetter') {
        this.coverLetterFiles = Array.from(event.dataTransfer.files);
      }
    }
  }

  triggerFileInput(fileType: string): void {
    if (fileType === 'resume') {
      this.resumeInput.nativeElement.click();
    } else if (fileType === 'coverLetter') {
      this.coverLetterInput.nativeElement.click();
    }
  }


  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.fruits.update(fruits => [...fruits, value]);
    }
    this.currentFruit.set('');
  }

  remove(fruit: string): void {
    this.fruits.update(fruits => {
      const index = fruits.indexOf(fruit);
      if (index < 0) {
        return fruits;
      }
      fruits.splice(index, 1);
      this.announcer.announce(`Removed ${fruit}`);
      return [...fruits];
    });
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.fruits.update(fruits => [...fruits, event.option.viewValue]);
    this.currentFruit.set('');
    event.option.deselect();
  }

  private convertToBinary(file: File) {
    const reader = new FileReader()

    reader.readAsArrayBuffer(file);
    return reader
  }

  cover_letter_summary : string = ""
  behavioral_scores : { [key: string]: number; } = {}
  resume_match_score : number = 0
  model_match_score : number = 0

  isResponseReceived : boolean = false
  loading: boolean = false; 
  

  submit(): void {
    this.loading = true;
    const formData = {
      resume: this.convertToBinary(this.resumeFiles[0]),
      cover_letter: this.convertToBinary(this.coverLetterFiles[0]),
      job_description: this.secondFormGroup.value.jobDescription,
      behavioral_values: this.fruits()
    };
    this.algoservice.uploadFiles(this.resumeFiles[0], this.coverLetterFiles[0], 
      this.secondFormGroup.value.jobDescription,
      this.fruits()).subscribe(response => {
      
      this.loading = false;
      console.log('Form submitted successfully', response);
      this.cover_letter_summary = response['cover_letter_summary'];
      this.behavioral_scores = response['behavioral_scores'];
      this.resume_match_score = response['resume_match_score'];
      this.model_match_score = response['model_match_score'];
      this.isResponseReceived = true; 
      
    }, error => {
      this.loading = false;
      console.error('Form submission error', error);
    });
  }

  

  
}
