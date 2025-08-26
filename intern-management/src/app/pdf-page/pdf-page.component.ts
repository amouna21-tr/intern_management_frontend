import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as html2pdf from 'html2pdf.js';

interface Stagiaire {
  nom: string;
  prenom: string;
  cin: string;
  email: string;
  telephone: string;
  institut: string;
  specialite: string;
  date_debut: string;
  date_fin: string;
  objet_stage: string;
  created_at: string;
}

@Component({
  selector: 'app-pdf-page',
  templateUrl: './pdf-page.component.html',
  styleUrls: ['./pdf-page.component.css']
})
export class PdfPageComponent implements OnInit {

  stagiaire: Stagiaire = {
    nom: '',
    prenom: '',
    cin: '',
    email: '',
    telephone: '',
    institut: '',
    specialite: '',
    date_debut: '',
    date_fin: '',
    objet_stage: '',
    created_at: ''
  };

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.stagiaire.nom = params['nom'] || '';
      this.stagiaire.prenom = params['prenom'] || '';
      this.stagiaire.cin = params['cin'] || '';
      this.stagiaire.institut = params['institut'] || '';
      this.stagiaire.specialite = params['specialite'] || '';
      this.stagiaire.date_debut = params['dateDebut'] || '';
      this.stagiaire.date_fin = params['dateFin'] || '';
      this.stagiaire.objet_stage = params['objetStage'] || '';
    });
  }

  formatDate(dateStr: string): string {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleDateString('fr-FR');
  }

  get today(): string {
    return this.formatDate(new Date().toISOString().split('T')[0]);
  }

  downloadPDF() {
    const element = document.getElementById('pdf-content');
    
    if (element) {
      // Temporarily adjust container styling for PDF generation
      const container = document.querySelector('div[style*="210mm"]') as HTMLElement;
      const originalStyle = container?.style.cssText;
      
      if (container) {
        container.style.width = '800px';
        container.style.height= '1000px';
        
        container.style.padding = '30px';
        container.style.margin = '0 auto';
        container.style.boxShadow = 'none';
      }
      
      const options = {
        margin: [10, 10, 10, 10], // top, left, bottom, right in mm
        filename: `${this.stagiaire.nom}_${this.stagiaire.prenom}_attestation.pdf`,
        image: { 
          type: 'jpeg', 
          quality: 0.98 
        },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          letterRendering: true,
          scrollX: 0,
          scrollY: 0
        },
        jsPDF: { 
          unit: 'mm', 
          format: 'a4', 
          orientation: 'portrait' 
        }
      };

      html2pdf().from(element).set(options).save().then(() => {
        // Restore original styling after PDF generation
        if (container && originalStyle) {
          container.style.cssText = originalStyle;
        }
      }).catch((error: any) => {
        console.error('Error generating PDF:', error);
        // Restore styling even if PDF generation fails
        if (container && originalStyle) {
          container.style.cssText = originalStyle;
        }
      });
    }
  }
}