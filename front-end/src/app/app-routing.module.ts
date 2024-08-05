import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { HomeComponent } from './home/home.component';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { AnalysisComponent } from './analysis/analysis.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth.guard';
import { ProfileComponent } from './profile/profile.component';
import { CandidateProfileComponent } from './candidate-profile/candidate-profile.component';

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
    path: 'profile', 
    component: ProfileComponent ,
    canActivate: [AuthGuard]
},
{ 
    path: 'user-login', 
    component: LoginComponent 
},
{ 
    path: 'candidate-profile/:id', 
    component: CandidateProfileComponent 
},
{ 
    path: '', 
    component: HomeComponent 
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
