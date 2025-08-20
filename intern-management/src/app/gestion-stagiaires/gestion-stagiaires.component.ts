import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-gestion-stagiaires',
  templateUrl: './gestion-stagiaires.component.html',
  styleUrls: ['./gestion-stagiaires.component.css']
})
export class GestionStagiairesComponent implements OnInit {

  recherche: string = '';
  stagiaires: any[] = [];
  loading: boolean = false;
  error: string = '';

  private apiUrl = 'http://localhost:3000/api'; // backend base URL

  newStagiaire = {
    cin: '',
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    institut: '',
    specialite: ''
  };

  editingIndex: number | null = null;

  constructor(private router: Router, private http: HttpClient) { }

  ngOnInit(): void {
    // Charger tous les stagiaires au démarrage
    this.chargerTousLesStagiaires();
  }

  // 📌 Charger tous les stagiaires depuis le backend
  chargerTousLesStagiaires(): void {
    this.loading = true;
    this.error = '';

    this.http.get<any>(`${this.apiUrl}/stagiaires`).subscribe({
      next: (response) => {
        if (response.success) {
          this.stagiaires = response.data;
        } else {
          this.error = response.message || 'Erreur lors du chargement';
          this.stagiaires = [];
        }
        this.loading = false;
      },
      error: () => {
        this.error = 'Erreur de connexion au serveur';
        this.stagiaires = [];
        this.loading = false;
      }
    });
  }

  // 📌 Recherche avec le backend
  rechercher(): void {
    if (!this.recherche || this.recherche.trim() === '') {
      this.chargerTousLesStagiaires(); // si vide => tout afficher
      return;
    }

    this.loading = true;
    this.error = '';

    this.http.get<any>(`${this.apiUrl}/stagiaires`, {
      params: { search: this.recherche.trim() }
    }).subscribe({
      next: (response) => {
        if (response.success) {
          this.stagiaires = response.data;
          if (response.data.length === 0) {
            this.error = `Aucun stagiaire trouvé pour "${this.recherche}"`;
          }
        } else {
          this.error = response.message || 'Erreur lors de la recherche';
          this.stagiaires = [];
        }
        this.loading = false;
      },
      error: () => {
        this.error = 'Erreur de connexion au serveur';
        this.stagiaires = [];
        this.loading = false;
      }
    });
  }

  // 📌 Effacer la recherche et recharger
  effacerRecherche(): void {
    this.recherche = '';
    this.chargerTousLesStagiaires();
  }

  ajouterStagiaire() {
    this.router.navigate(['/ajouter-stagiaire']);
  }

  listeAttestations() {
    alert('Liste des Attestations Retirées clicked');
  }

  ajouterOuModifierStagiaire() {
    if (this.newStagiaire.cin && this.newStagiaire.nom) {
      if (this.editingIndex !== null) {
        this.stagiaires[this.editingIndex] = { ...this.newStagiaire };
        this.editingIndex = null;
      } else {
        this.stagiaires.push({ ...this.newStagiaire });
      }
      this.newStagiaire = { cin: '', nom: '', prenom: '', email: '', telephone: '', institut: '', specialite: '' };
    }
  }

  modifierStagiaire(index: number) {
    this.newStagiaire = { ...this.stagiaires[index] };
    this.editingIndex = index;
  }

  supprimerStagiaire(index: number) {
    this.stagiaires.splice(index, 1);
  }
}
