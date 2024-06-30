import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { NavbarComponent } from './navbar/navbar.component';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { AppComponent } from './app.component';



export const routes: Routes = [

    { 
        path: 'file-upload', 
        component: FileUploadComponent 
    },

];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppModule { }
