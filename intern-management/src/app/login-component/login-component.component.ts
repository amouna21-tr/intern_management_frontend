import { Component, OnInit } from "@angular/core";
import { Router } from '@angular/router'; 
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login-component',
  templateUrl: './login-component.component.html',
  styleUrls: ['./login-component.component.css']
})
export class LoginComponentComponent implements OnInit {

  email: string = ''; 
  password: string = ''; 
  message: string = '';

  // ➕ “I am not a robot” checkbox flag
  notRobot: boolean = false;

  constructor(private router: Router, private authService: AuthService) { } 

  ngOnInit(): void { } 

  seConnecter() { 
    // ➕ Block login if checkbox isn’t ticked
    if (!this.notRobot) {
      alert('Veuillez confirmer que vous n’êtes pas un robot.');
      return;
    }

    if (this.email && this.password) { 
      console.log('➡️ Sending login request:', this.email, this.password);

      this.authService.login(this.email, this.password).subscribe(
        (response) => {
          console.log('⬅️ Backend response:', response); 

          if (response.success) {
            this.message = "✅ Connexion réussie !";
            this.router.navigate(['/gestion-stagiaires']);
          } else {
            this.message = "❌ " + response.message;
          }
        },
        (error) => {
          console.error('⚠️ Connection error:', error); 
          this.message = "⚠️ Erreur de connexion au serveur.";
        }
      );
    } else {
      alert('Veuillez entrer vos identifiants'); 
    }
  }

}
