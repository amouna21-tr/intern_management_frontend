import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponentComponent } from './login-component/login-component.component';
import { GestionStagiairesComponent } from './gestion-stagiaires/gestion-stagiaires.component';
import { AddInternComponent } from './add-intern/add-intern.component';
import { ModifyInternComponent } from './modify-intern/modify-intern.component';
import { AttestationFormComponent } from './attestation-form/attestation-form.component';
import { PdfPageComponent } from './pdf-page/pdf-page.component';
import { ChatbotComponent } from './chatbot/chatbot.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponentComponent,
    GestionStagiairesComponent,
    AddInternComponent,
  
    ModifyInternComponent,
  
    AttestationFormComponent,
  
    PdfPageComponent,
  
    ChatbotComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
     FormsModule,
     HttpClientModule 
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { } 
