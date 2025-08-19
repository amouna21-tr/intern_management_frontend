import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {GestionStagiairesComponent } from  './gestion-stagiaires/gestion-stagiaires.component';
import {LoginComponentComponent} from './login-component/login-component.component'; 
import { AddInternComponent } from './add-intern/add-intern.component';


const routes: Routes = [
   {path: '', component: LoginComponentComponent }, 
  {path: 'login', component: LoginComponentComponent },
   {path: 'gestion-stagiaires', component: GestionStagiairesComponent }, 
  { path:'ajouter-stagiaire',  component:AddInternComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
