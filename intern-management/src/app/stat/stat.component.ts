import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { MlService } from '../services/ml.services';
import { environment } from '../../environments/environment';

// Graphs (optionnel si tu utilises ng2-charts/Chart.js)
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

// Pour les stats DB on réutilise Stagiaire
type Row = Stagiaire;

@Component({
  selector: 'app-stat',
  templateUrl: './stat.component.html',
  styleUrls: ['./stat.component.css']
})
export class StatComponent {
  // ===== Entraînement & prédiction en masse =====
  file?: File;
  training = false;
  predicting = false;
  metrics: any = null;
  errorMsg = '';
  results: any[] = [];
  threshold = 0.6;

  // ===== Prédiction d’un seul stagiaire =====
  one: Partial<Stagiaire> = { institut: '', specialite: '' };
  oneThreshold = 0.6;
  oneLoading = false;
  oneError = '';
  oneResult: { proba: number; good: boolean } | null = null;

  // ====== STATS (liées à la DB /api/stagiaires) ======
  dbLoading = false; dbError = '';
  kpi = { total: 0, actifs: 0, avg: 0, median: 0, topInstitut: '-' };

  // Graphes (optionnels)
  barLabels: Label[] = [];           // instituts
  barData: ChartDataSets[] = [{ data: [], label: 'Par institut' }];
  pieSpecLabels: Label[] = [];       // spécialités
  pieSpecData: number[] = [];
  chartOpts: ChartOptions = { responsive: true, maintainAspectRatio: false, legend: { position: 'bottom' as any } };

  constructor(private ml: MlService, private http: HttpClient) {}

  // ---------- Entraîner ----------
  onFileChange(ev: any) {
    this.file = ev?.target?.files?.[0];
  }

  train() {
    if (!this.file) return;
    this.metrics = null;
    this.errorMsg = '';
    this.training = true;

    this.ml.train(this.file)
      .pipe(finalize(() => (this.training = false)))
      .subscribe({
        next: (r: any) => {
          if (!r?.ok) { this.errorMsg = r?.message || 'Erreur entraînement'; return; }
          this.metrics = r.metrics || {};
        },
        error: (e) => { this.errorMsg = e?.error?.message || e?.error?.error || 'Erreur entraînement'; }
      });
  }

  // ---------- Prédire (liste actuelle) ----------
  predictOnCurrentStagiaires() {
    this.errorMsg = '';
    this.results = [];
    this.predicting = true;

    this.http.get<any>(`${environment.apiUrl}/api/stagiaires`)
      .subscribe({
        next: (res) => {
          const rows: Stagiaire[] = res?.data ?? res ?? [];
          const items = rows.map(s => ({
            cin: s.cin,
            nom: s.nom,
            prenom: s.prenom,
            institut: s.institut ?? '',
            specialite: s.specialite ?? '',
            // duree_stage_jours: this.daysBetween(s.date_debut, s.date_fin),
          }));

          this.ml.predict(items, this.threshold)
            .pipe(finalize(() => (this.predicting = false)))
            .subscribe({
              next: (r: any) => { this.results = r?.results || []; },
              error: (e) => { this.errorMsg = e?.error?.error || e?.error?.message || 'Erreur prédiction'; }
            });
        },
        error: () => { this.errorMsg = 'Échec chargement stagiaires'; this.predicting = false; }
      });
  }

  // ---------- Prédire (un seul) ----------
  predictOne() {
    this.oneError = '';
    this.oneResult = null;
    this.oneLoading = true;

    const item = {
      cin: this.one.cin || undefined,
      nom: this.one.nom || undefined,
      prenom: this.one.prenom || undefined,
      institut: this.one.institut || '',
      specialite: this.one.specialite || ''
    };

    this.ml.predict([item], this.oneThreshold)
      .pipe(finalize(() => (this.oneLoading = false)))
      .subscribe({
        next: (r: any) => {
          const x = r?.results?.[0];
          if (!x) { this.oneError = 'Aucun résultat'; return; }
          const proba = typeof x.prob_bon === 'number' ? x.prob_bon : (x.proba ?? 0);
          const good  = typeof x.good === 'boolean' ? x.good : (x.classe === 'Bon');
          this.oneResult = { proba, good };
        },
        error: (e) => { this.oneError = e?.error?.error || e?.error?.message || 'Erreur prédiction'; }
      });
  }

  // ---------- Export CSV (résultats de masse) ----------
  exportCsv() {
    if (!this.results.length) return;
    const cols = Object.keys(this.results[0]);
    const csv = [
      cols.join(','),
      ...this.results.map(r => cols.map(c => JSON.stringify(r[c] ?? '')).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'predictions.csv';
    a.click();
    URL.revokeObjectURL(a.href);
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

  // ================== STATS DB ==================
  loadDbStats() {
    this.dbLoading = true; this.dbError = '';
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
      // garder les plus “éloignés”
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
}