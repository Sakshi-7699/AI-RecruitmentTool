import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-candidate-profile',
  templateUrl: './candidate-profile.component.html',
  styleUrls: ['./candidate-profile.component.css']
})
export class CandidateProfileComponent implements OnInit {
  candidateId!: string;
  candidate: any;
  show : boolean = false;

  constructor(private route: ActivatedRoute, private http: HttpClient) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.candidateId = params.get('id')!;
      this.getCandidateDetails();
    });
  }

  getCandidateDetails(): void {
    this.http.get<any>(`http://localhost:8000/candidate-profile/${this.candidateId}`)
      .subscribe(data => {
        this.candidate = data[0];
      });
  }

  showResume():void{
    this.show = !this.show;
  }
}
