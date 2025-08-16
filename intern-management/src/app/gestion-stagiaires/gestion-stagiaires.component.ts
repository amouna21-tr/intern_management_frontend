import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-gestion-stagiaires',
  templateUrl: './gestion-stagiaires.component.html',
  styleUrls: ['./gestion-stagiaires.component.css']
})
export class GestionStagiairesComponent implements OnInit {

  recherche: string = '';
  stagiaires: any[] = [];

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

  constructor() { }

  ngOnInit(): void { }

  ajouterStagiaire() {
    this.ajouterOuModifierStagiaire();
  }

  listeAttestations() {
    alert('Liste des Attestations Retirees clicked');
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

  rechercher() {
    
  }

  get stagiairesFiltres() {
    if (!this.recherche) return this.stagiaires;
    return this.stagiaires.filter(s =>
      Object.values(s).some(val =>
       String(val).toLowerCase().includes(this.recherche.toLowerCase())
      )
    );
  }
}
