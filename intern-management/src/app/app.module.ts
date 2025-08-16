import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponentComponent } from './login-component/login-component.component';
import { GestionStagiairesComponent } from './gestion-stagiaires/gestion-stagiaires.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponentComponent,
    GestionStagiairesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
     FormsModule 
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { } 
