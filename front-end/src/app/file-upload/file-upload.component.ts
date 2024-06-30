import { Component } from '@angular/core';
import { AlgoResponseService } from '../services/algo-response.service';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.css'
})
export class FileUploadComponent {

  data : any = {'Response' : 0}

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



}
