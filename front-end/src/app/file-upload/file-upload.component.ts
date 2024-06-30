import { Component } from '@angular/core';
import { AlgoResponseService } from '../services/algo-response.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [NgIf],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.css',
})
export class FileUploadComponent {

  data : any = {'Response' : 0}
  selectedFile: File | null = null;
  enteredText: string = '';


  constructor( private algo_response_service : AlgoResponseService) {}

  ngOnInit() {
    
    this.getAll();
    console.log(this.data)
  }
  getAll(){
    this.algo_response_service.getAll('Response').subscribe({
      next:data=>{
       this.data = data
      }
    })
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  onSubmit(): void {
    if (!this.selectedFile || !this.enteredText) {
      alert('Please select a file and enter text.');
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('text', this.enteredText);

    // this.http.post('http://127.0.0.1:8000/upload', formData).subscribe(
    //   response => {
    //     console.log('Upload successful:', response);
    //   },
    //   error => {
    //     console.error('Upload failed:', error);
    //   }
    // );
  }



}
