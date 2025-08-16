import { Component, OnInit } from "@angular/core";
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-login-component',
  templateUrl: './login-component.component.html',
  styleUrls: ['./login-component.component.css']
})
export class LoginComponentComponent implements OnInit {

email: string = ''; 
  password: string = ''; 

  constructor(private router: Router) { } 

  ngOnInit(): void { } 
  
  onClickSignIn() {
  
    console.log('Email:', this.email, 'Password:', this.password);
  }
  seConnecter() { 
    if (this.email && this.password) { 
      this.router.navigate(['/gestion-stagiaires']); 
    } else {
      alert('Veuillez entrer vos identifiants'); 
    }
  }

  
}
