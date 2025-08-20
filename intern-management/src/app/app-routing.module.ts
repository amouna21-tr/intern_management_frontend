import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {GestionStagiairesComponent } from  './gestion-stagiaires/gestion-stagiaires.component';
import {LoginComponentComponent} from './login-component/login-component.component'; 
import { AddInternComponent } from './add-intern/add-intern.component';
import { ModifyInternComponent } from './modify-intern/modify-intern.component'; 
import { AttestationFormComponent } from './attestation-form/attestation-form.component';


const routes: Routes = [
   {path: '', component: LoginComponentComponent }, 
  {path: 'login', component: LoginComponentComponent },
   {path: 'gestion-stagiaires', component: GestionStagiairesComponent }, 
  { path:'ajouter-stagiaire',  component:AddInternComponent},
  { path: 'modify-intern/:id', component:ModifyInternComponent } ,
 { path: 'attestation-form', component: AttestationFormComponent },


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
