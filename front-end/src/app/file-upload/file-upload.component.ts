import { Component } from '@angular/core';
import { AlgoResponseService } from '../services/algo-response.service';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.css'
})
export class FileUploadComponent {
  data : any = {'Response' : 0}
  summary : any = ''
  submitted = false;

  
  constructor( private algo_response_service : AlgoResponseService) {}

  ngOnInit() {
    
    
  }

  getSummary(){
    this.algo_response_service.getSummary().subscribe({
      next:data=>{
       this.summary = data
      }
    })
  
  }
  getAll(){
    this.algo_response_service.getAll('Response').subscribe({
      next:data=>{
       this.data = data
      }
    })
  }


}
