import { Component, Input, ViewChild, ElementRef, EventEmitter, Output } from '@angular/core';
import { AlgoResponseService } from '../services/algo-response.service';
import {FormBuilder, Validators, FormsModule, ReactiveFormsModule, FormGroup, FormControl} from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import {COMMA, ENTER} from '@angular/cdk/keycodes';

import {LiveAnnouncer} from '@angular/cdk/a11y';
import {ChangeDetectionStrategy,  computed, inject, model, signal} from '@angular/core';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';



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

  // File Upload  __________________________________________________________________________________

 
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


  // behavioral module __________________________________________________________________________________

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  readonly currentFruit = model('');
  readonly fruits = signal(['Leadership']);
  readonly allFruits: string[] = ['Meritocracy', 'Leadership', 'Emotional Intelligence'];
  readonly filteredFruits = computed(() => {
    const currentFruit = this.currentFruit().toLowerCase();
    return currentFruit
      ? this.allFruits.filter(fruit => fruit.toLowerCase().includes(currentFruit))
      : this.allFruits.slice();
  });

  readonly announcer = inject(LiveAnnouncer);

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      this.fruits.update(fruits => [...fruits, value]);
    }

    // Clear the input value
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

  

  
}
