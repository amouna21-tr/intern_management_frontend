import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';


@Component({
  selector: 'app-attestation-form',
  templateUrl: './attestation-form.component.html',
  styleUrls: ['./attestation-form.component.css']
})
export class AttestationFormComponent {
  cin: string = '';
  nom: string = '';
  prenom: string = '';
  institut: string = '';
  specialite: string = '';
  dateDebut: string = '';
  dateFin: string = '';
  objetStage: string = '';
  attestationRetiree: string = '';

   constructor(
    private route: ActivatedRoute ,
    private router: Router

   ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.cin = params['cin'] || '';
      this.nom = params['nom'] || '';
      this.prenom = params['prenom'] || '';
      this.institut = params['institut'] || '';
      this.specialite = params['specialite'] || '';
      this.dateDebut = params['dateDebut'] || '';
      this.dateFin = params['dateFin'] || '';
      this.objetStage = params['objetStage'] || '';
    });
  }
  

  afficherPDF() {
  this.router.navigate(['/pdf-page'], {
    queryParams: {
      cin: this.cin,
      nom: this.nom,
      prenom: this.prenom,
      institut: this.institut,
      specialite: this.specialite,
      dateDebut: this.dateDebut,
      dateFin: this.dateFin,
      objetStage: this.objetStage,
      attestationRetiree: this.attestationRetiree
    }
  });
}}
