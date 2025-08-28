import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Components
import { LoginComponentComponent } from './login-component/login-component.component';
import { SignupComponent } from './signup/signup.component';
import { GestionStagiairesComponent } from './gestion-stagiaires/gestion-stagiaires.component';
import { AddInternComponent } from './add-intern/add-intern.component';
import { ModifyInternComponent } from './modify-intern/modify-intern.component';
import { AttestationFormComponent } from './attestation-form/attestation-form.component';
import { PdfPageComponent } from './pdf-page/pdf-page.component';
import { MlSuperviseComponent } from './ml-supervise/ml-supervise.component';

const routes: Routes = [
  { path: '', component: LoginComponentComponent },
  { path: 'login', component: LoginComponentComponent },
  { path: 'signup', component: SignupComponent },            // Signup route
  { path: 'gestion-stagiaires', component: GestionStagiairesComponent },
  { path: 'ajouter-stagiaire', component: AddInternComponent },
  { path: 'modify-intern/:id', component: ModifyInternComponent },
  { path: 'attestation-form', component: AttestationFormComponent },
  { path: 'pdf-page', component: PdfPageComponent },
  { path: 'ml-supervise', component: MlSuperviseComponent }  // ML supervision route
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
