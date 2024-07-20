import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { HomeComponent } from './home/home.component';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { AnalysisComponent } from './analysis/analysis.component';

export const routes: Routes = [

{ 
    path: 'candidate-compatibility-check', 
    component: FileUploadComponent 
},
{ 
    path: 'analysis', 
    component: AnalysisComponent 
},
{ 
    path: '', 
    component: HomeComponent 
},
{ path: '**', component: PagenotfoundComponent },



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
