import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { HomeComponent } from './home/home.component';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { AnalysisComponent } from './analysis/analysis.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [

{ 
    path: 'candidate-compatibility-check', 
    component: FileUploadComponent ,
    canActivate: [AuthGuard] 
},
{ 
    path: 'analysis', 
    component: AnalysisComponent ,
    canActivate: [AuthGuard] 
},
{ 
    path: '', 
    component: HomeComponent 
},
{ 
    path: 'user-login', 
    component: LoginComponent 
},
{ 
    path: '**', 
    component: PagenotfoundComponent 
},



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
