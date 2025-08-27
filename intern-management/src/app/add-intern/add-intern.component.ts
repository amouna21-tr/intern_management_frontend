import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-add-intern',
  templateUrl: './add-intern.component.html',
  styleUrls: ['./add-intern.component.css']
})
export class AddInternComponent {
  cin = '';
  nom = '';
  prenom = '';
  email = '';
  telephone = '';
  institut = '';
  specialite = '';
  dateDebut = '';
  dateFin = '';
  objetStage = '';
  cv='';
  message = '';
  

  constructor(private http: HttpClient) {}

  ajouterStagiaire() {
    if (!this.cin || !this.nom || !this.prenom || !this.email) {
      this.message = '❌ Veuillez remplir les champs obligatoires';
      return;
    }

    const stagiaire = {
      cin: this.cin,
      nom: this.nom,
      prenom: this.prenom,
      email: this.email,
      telephone: this.telephone,
      institut: this.institut,
      specialite: this.specialite,
      dateDebut: this.dateDebut,
      dateFin: this.dateFin,
      objetStage: this.objetStage,
      cv: this.cv
        };

    this.http.post<any>('http://localhost:3000/api/ajouter-stagiaire', stagiaire)
  .subscribe({
    next: (res) => {
      if (res.success) {
        // Show success message first
        this.message = '✅ Stagiaire ajouté avec succès !';

        // Clear the form after showing the message
        this.resetForm();
      } else {
        // Show error message if backend failed
        this.message = '❌ ' + res.message;
      }
    },
    error: (err) => {
      console.error(err);
      this.message = '⚠️ Erreur de connexion au serveur.';
    }
  });

  }

  resetForm() {
    this.cin = this.nom = this.prenom = this.email = '';
    this.telephone = this.institut = this.specialite = '';
    this.dateDebut = this.dateFin = this.objetStage = '';
    this.cv='';
  }
}
