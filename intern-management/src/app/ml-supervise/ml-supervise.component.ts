import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

// Graphs
import { Label } from 'ng2-charts';
import { ChartOptions, ChartDataSets } from 'chart.js';

interface Stagiaire {
  id?: number;
  cin: string;
  nom: string;
  prenom: string;
  email?: string;
  telephone?: string;
  institut?: string;
  specialite?: string;
  date_debut?: string;
  date_fin?: string;
  objet_stage?: string;
}

// For stats
type Row = Stagiaire;

@Component({
  selector: 'app-ml-supervise',
  templateUrl: './ml-supervise.component.html',
  styleUrls: ['./ml-supervise.component.css']
})
export class MlSuperviseComponent {
  
  metrics: any = {};       
  atypiques: any[] = [];   
  results: any[] = [];    
  dbLoading = false;
  dbError = '';
  kpi = { total: 0, actifs: 0, avg: 0, median: 0, topInstitut: '-' };

  // Graphes
  barLabels: Label[] = [];           // instituts
  barData: ChartDataSets[] = [{ data: [], label: 'Par institut' }];
  pieSpecLabels: Label[] = [];       // spécialités
  pieSpecData: number[] = [];
  chartOpts: ChartOptions = { 
    responsive: true, 
    maintainAspectRatio: false, 
    legend: { position: 'bottom' as any } 
  };

  constructor(private http: HttpClient) {}

  // ================== STATS DB ==================
  loadDbStats() {
    this.dbLoading = true; 
    this.dbError = '';
    this.http.get<any>(`${environment.apiUrl}/api/stagiaires`).subscribe({
      next: (res) => {
        const rows: Row[] = res?.data ?? res ?? [];
        this.computeStats(rows);
      },
      error: () => this.dbError = 'Erreur chargement stagiaires',
      complete: () => this.dbLoading = false
    });
  }

  private computeStats(rows: Row[]) {
    // Durées
    const durations = rows.map(r => this.daysBetween(r.date_debut, r.date_fin)).filter(d => d > 0);
    const mean = durations.length ? (durations.reduce((a,b)=>a+b,0) / durations.length) : 0;
    const sorted = durations.slice().sort((a,b)=>a-b);
    const median = sorted.length
      ? (sorted[Math.floor((sorted.length-1)/2)] + sorted[Math.ceil((sorted.length-1)/2)]) / 2
      : 0;

    // Actifs aujourd’hui
    const actifs = rows.filter(r => this.isActiveToday(r)).length;

    // Top institut
    const instCount = new Map<string, number>();
    rows.forEach(r => {
      const k = r.institut || 'Inconnu';
      instCount.set(k, (instCount.get(k) || 0) + 1);
    });
    const topInst = [...instCount.entries()].sort((a,b)=>b[1]-a[1])[0]?.[0] || '-';

    this.kpi = { total: rows.length, actifs, avg: Math.round(mean), median: Math.round(median), topInstitut: topInst };

    // Graphes : Top 5 instituts
    const top5Inst = [...instCount.entries()].sort((a,b)=>b[1]-a[1]).slice(0,5);
    this.barLabels = top5Inst.map(x=>x[0]);
    this.barData = [{ data: top5Inst.map(x=>x[1]), label: 'Par institut' }];

    // Graphes : Top 5 spécialités
    const specCount = new Map<string, number>();
    rows.forEach(r => {
      const k = r.specialite || 'Inconnue';
      specCount.set(k, (specCount.get(k) || 0) + 1);
    });
    const top5Spec = [...specCount.entries()].sort((a,b)=>b[1]-a[1]).slice(0,5);
    this.pieSpecLabels = top5Spec.map(x=>x[0]);
    this.pieSpecData   = top5Spec.map(x=>x[1]);

    // Atypiques (z-score sur durée)
    if (durations.length >= 5) {
      const mu = mean;
      const sigma = Math.sqrt(durations.reduce((s,d)=>s+(d-mu)*(d-mu),0)/(durations.length));
      const withDur = rows.map(r => ({ r, d: this.daysBetween(r.date_debut, r.date_fin) })).filter(x=>x.d>0);
      const scored = withDur.map(x => ({ ...x, z: sigma>0 ? (x.d - mu)/sigma : 0 }));
      this['atypiques'] = scored
        .filter(x => Math.abs(x.z) >= 2)
        .sort((a,b)=>Math.abs(b.z)-Math.abs(a.z))
        .slice(0,10)
        .map(x => ({
          nom: x.r.nom, prenom: x.r.prenom, institut: x.r.institut, specialite: x.r.specialite,
          duree: x.d, z: Math.round(x.z*100)/100
        }));
    } else {
      this['atypiques'] = [];
    }
  }

  // ---------- UTIL ----------
  private daysBetween(a?: string, b?: string) {
    if (!a || !b) return 0;
    const da = new Date(a), db = new Date(b);
    return Math.max(0, Math.round((+db - +da) / 86400000));
  }

  private nowIso() { return new Date(); }
  private isActiveToday(r: Row) {
    const today = this.nowIso();
    const d1 = r.date_debut ? new Date(r.date_debut) : null;
    const d2 = r.date_fin   ? new Date(r.date_fin)   : null;
    return (!!d1 && !!d2 && d1 <= today && today <= d2);
  }
}
