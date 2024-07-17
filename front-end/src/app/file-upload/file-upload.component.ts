import { Component, Input, ViewChild, ElementRef, EventEmitter, Output } from '@angular/core';
import { AlgoResponseService } from '../services/algo-response.service';
import {FormBuilder, Validators, FormsModule, ReactiveFormsModule, FormGroup, FormControl} from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import {COMMA, ENTER} from '@angular/cdk/keycodes';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent {
  



  
  constructor(private algoservice : AlgoResponseService, private _formBuilder: FormBuilder) {
   

  }

  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });



  ngOnInit() {
    
    
  }

 
  @ViewChild('resumeInput', { static: false }) resumeInput!: ElementRef;
  @ViewChild('coverLetterInput', { static: false }) coverLetterInput!: ElementRef;
  
  resumeFiles: File[] = [];
  coverLetterFiles: File[] = [];

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

  onUpload(): void {
    if (this.resumeFiles.length && this.coverLetterFiles.length) {
      // Implement your upload logic here
      console.log('Uploading resume:', this.resumeFiles);
      console.log('Uploading cover letter:', this.coverLetterFiles);
    } else {
      console.error('Both resume and cover letter must be selected');
    }
  }


  

  
}
