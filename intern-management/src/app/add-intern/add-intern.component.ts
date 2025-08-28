import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import emailjs from 'emailjs-com';

interface Stagiaire {
  cin: string;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  institut?: string;
  specialite?: string;
  dateDebut?: string;
  dateFin?: string;
  objetStage?: string;
  cv?: string;
}

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
  cv = '';
  message = '';

  private readonly EMAILJS_SERVICE_ID = 'service_qi2b3r9';
  private readonly EMAILJS_TEMPLATE_ID = 'template_8lm7wtf';
  private readonly EMAILJS_PUBLIC_KEY = 'PvNx-6TZv4qQ_YGje';
  private readonly ADMIN_EMAIL: string | null = null; // optional

  constructor(private http: HttpClient, private router: Router) {}

  ajouterStagiaire() {
    if (!this.cin || !this.nom || !this.prenom || !this.email) {
      this.message = '❌ Veuillez remplir les champs obligatoires';
      return;
    }

    if (!/\S+@\S+\.\S+/.test(this.email)) {
      this.message = '❌ Email invalide';
      return;
    }

    const stagiaire: Stagiaire = {
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
          if (res?.success) {
            this.message = '✅ Stagiaire ajouté avec succès !';
            this.envoyerEmail(stagiaire);
            if (this.ADMIN_EMAIL) this.envoyerEmailAdmin(stagiaire);
            this.resetForm();

            // delay navigation so user sees the success message
            setTimeout(() => this.router.navigate(['/gestion-stagiaires']), 1500);
          } else {
            this.message = '❌ ' + (res?.message || 'Erreur serveur.');
          }
        },
        error: () => this.message = '⚠️ Erreur de connexion au serveur.'
      });
  }

  resetForm() {
    this.cin = this.nom = this.prenom = this.email = '';
    this.telephone = this.institut = this.specialite = '';
    this.dateDebut = this.dateFin = this.objetStage = '';
    this.cv = '';
  }

  private envoyerEmail(st: Stagiaire) {
    emailjs.send(
      this.EMAILJS_SERVICE_ID,
      this.EMAILJS_TEMPLATE_ID,
      {
        to_email: st.email,
        nom: st.nom,
        prenom: st.prenom,
        cin: st.cin,
        institut: st.institut,
        specialite: st.specialite,
        date_debut: st.dateDebut,
        date_fin: st.dateFin,
        objet_stage: st.objetStage
      },
      this.EMAILJS_PUBLIC_KEY
    ).then(() => console.log('Email stagiaire envoyé'))
     .catch((e) => console.warn('Erreur envoi email', e));
  }

  private envoyerEmailAdmin(st: Stagiaire) {
    if (!this.ADMIN_EMAIL) return;
    emailjs.send(
      this.EMAILJS_SERVICE_ID,
      this.EMAILJS_TEMPLATE_ID,
      {
        to_email: this.ADMIN_EMAIL,
        nom: st.nom,
        prenom: st.prenom,
        cin: st.cin,
        institut: st.institut,
        specialite: st.specialite,
        date_debut: st.dateDebut,
        date_fin: st.dateFin,
        objet_stage: st.objetStage
      },
      this.EMAILJS_PUBLIC_KEY
    ).then(() => console.log('Email admin envoyé'))
     .catch((e) => console.warn('Erreur envoi email admin', e));
  }
}
