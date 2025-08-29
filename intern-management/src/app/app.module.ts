import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ChartsModule } from 'ng2-charts';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Components
import { LoginComponentComponent } from './login-component/login-component.component';
import { GestionStagiairesComponent } from './gestion-stagiaires/gestion-stagiaires.component';
import { AddInternComponent } from './add-intern/add-intern.component';
import { ModifyInternComponent } from './modify-intern/modify-intern.component';
import { AttestationFormComponent } from './attestation-form/attestation-form.component';
import { MlSuperviseComponent } from './ml-supervise/ml-supervise.component';
import { PdfPageComponent } from './pdf-page/pdf-page.component';
import { ChatbotComponent } from './chatbot/chatbot.component';
import { SignupComponent } from './signup/signup.component';
import { StatComponent } from './stat/stat.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponentComponent,
    GestionStagiairesComponent,
    AddInternComponent,
    ModifyInternComponent,
    AttestationFormComponent,
    MlSuperviseComponent,
    PdfPageComponent,
    ChatbotComponent,
    SignupComponent,
    StatComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ChartsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
