import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [

{ 
    path: 'file-upload', 
    component: FileUploadComponent 
},
{ 
    path: '', 
    component: HomeComponent 
},



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
