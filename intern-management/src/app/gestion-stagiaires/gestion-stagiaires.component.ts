import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
// 📦 Add XLSX + PDF imports
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
// ✅ QR generator
import * as QRCode from 'qrcode';

@Component({
  selector: 'app-gestion-stagiaires',
  templateUrl: './gestion-stagiaires.component.html',
  styleUrls: ['./gestion-stagiaires.component.css']
})
export class GestionStagiairesComponent implements OnInit {

  // 🔧 expose Math for template
  Math = Math;

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

  // ✅ QR cache: CIN -> dataURL
  qrMap = new Map<string, string>();
  qrPreview: string | null = null;

  // === Toast
  toast: string = '';

  // ===== FILTERS & SORT =====
  filterInstitut: string = '';
  filterSpecialite: string = '';
  sortField: string = '';
  sortDir: 'asc' | 'desc' = 'asc';

  // ===== PAGINATION =====
  page = 1;
  pageSize = 3;
  pageSizeOptions = [3, 5, 8, 10, 20];

  private readonly UI_KEY = 'gs-ui-state-v1';

  constructor(private router: Router, private http: HttpClient) { }

  ngOnInit(): void {
    this.restoreUIState();
    this.chargerTousLesStagiaires();

    // ⌨️ Keyboard shortcut for search
    window.addEventListener('keydown', e => {
      if (e.key === '/') {
        e.preventDefault();
        (document.getElementById('searchBox') as HTMLInputElement)?.focus();
      }
    });
  }

  // ===== DATA =====
  chargerTousLesStagiaires(): void {
    this.loading = true;
    this.error = '';
    this.http.get<any>(`${this.apiUrl}/stagiaires`).subscribe({
      next: res => {
        if (res.success) {
          this.stagiaires = res.data;
          this.page = this.page || 1;
          this.generateQRCodes(this.stagiaires);
        } else {
          this.error = res.message || 'Erreur lors du chargement';
          this.stagiaires = [];
          this.qrMap.clear();
        }
        this.loading = false;
      },
      error: () => {
        this.error = 'Erreur de connexion au serveur';
        this.stagiaires = [];
        this.qrMap.clear();
        this.loading = false;
      }
    });
  }

  rechercher(): void {
    if (!this.recherche.trim()) {
      this.chargerTousLesStagiaires();
      this.saveUIState();
      return;
    }
    this.loading = true;
    this.error = '';
    this.http.get<any>(`${this.apiUrl}/stagiaires`, { params: { search: this.recherche.trim() } }).subscribe({
      next: res => {
        if (res.success) {
          this.stagiaires = res.data;
          this.page = 1;
          if (!res.data.length) this.error = `Aucun stagiaire trouvé pour "${this.recherche}"`;
          this.generateQRCodes(this.stagiaires);
        } else {
          this.error = res.message || 'Erreur lors de la recherche';
          this.stagiaires = [];
          this.qrMap.clear();
        }
        this.loading = false;
        this.saveUIState();
      },
      error: () => {
        this.error = 'Erreur de connexion au serveur';
        this.stagiaires = [];
        this.qrMap.clear();
        this.loading = false;
      }
    });
  }

  effacerRecherche(): void {
    this.recherche = '';
    this.page = 1;
    this.chargerTousLesStagiaires();
    this.saveUIState();
  }

  ajouterStagiaire() { this.router.navigate(['/ajouter-stagiaire']); }
  listeAttestations() { alert('Liste des Attestations Retirées clicked'); }

  ajouterOuModifierStagiaire() {
    if (!this.newStagiaire.cin || !this.newStagiaire.nom) return;
    if (this.editingIndex !== null) {
      this.stagiaires[this.editingIndex] = { ...this.newStagiaire };
      this.editingIndex = null;
    } else {
      this.stagiaires.push({ ...this.newStagiaire });
    }
    this.generateQRCodes(this.stagiaires);
    this.newStagiaire = { cin: '', nom: '', prenom: '', email: '', telephone: '', institut: '', specialite: '' };
    this.page = 1;
    this.saveUIState();
  }

  modifierStagiaire(index: number) { this.newStagiaire = { ...this.stagiaires[index] }; this.editingIndex = index; }
  supprimerStagiaire(index: number) {
    const removed = this.stagiaires.splice(index, 1)[0];
    if (removed?.cin) this.qrMap.delete(String(removed.cin));
    if ((this.page - 1) * this.pageSize >= this.filteredStagiaires.length && this.page > 1) this.page--;
    this.saveUIState();
  }

  // ===== FILTERS & SORT =====
  get uniqueInstituts() { return [...new Set(this.stagiaires.map(s => s?.institut).filter(Boolean))]; }
  get uniqueSpecialites() { return [...new Set(this.stagiaires.map(s => s?.specialite).filter(Boolean))]; }

  get filteredStagiaires() {
    const filtered = this.stagiaires.filter(s =>
      (!this.filterInstitut || s.institut === this.filterInstitut) &&
      (!this.filterSpecialite || s.specialite === this.filterSpecialite)
    );
    if (!this.sortField) return filtered;
    const dir = this.sortDir === 'asc' ? 1 : -1;
    return [...filtered].sort((a, b) => {
      const va = (a?.[this.sortField] ?? '').toString().toLowerCase();
      const vb = (b?.[this.sortField] ?? '').toString().toLowerCase();
      const na = Number(va), nb = Number(vb);
      if (!isNaN(na) && !isNaN(nb)) return (na - nb) * dir;
      return va < vb ? -dir : va > vb ? dir : 0;
    });
  }

  clearFilters() { this.filterInstitut = ''; this.filterSpecialite = ''; this.page = 1; this.saveUIState(); }
  sortBy(field: string) {
    this.sortField === field
      ? this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc'
      : (this.sortField = field, this.sortDir = 'asc');
    this.page = 1;
    this.saveUIState();
  }

  // ===== PAGINATION =====
  get totalPages(): number { return Math.max(1, Math.ceil(this.filteredStagiaires.length / this.pageSize)); }
  get pagedStagiaires() { const start = (this.page - 1) * this.pageSize; return this.filteredStagiaires.slice(start, start + this.pageSize); }
  setPage(p: number) { if (p < 1 || p > this.totalPages) return; this.page = p; this.saveUIState(); }
  nextPage() { this.setPage(this.page + 1); }
  prevPage() { this.setPage(this.page - 1); }
  onPageSizeChange() { this.page = 1; this.saveUIState(); }
  onFilterChange() { this.page = 1; this.saveUIState(); }

  // ===== EXPORT =====
  exportCSV() {
    const rows = [['CIN','Nom','Prénom','Email','Téléphone','Institut','Spécialité'], ...this.filteredStagiaires.map(s => [s.cin, s.nom, s.prenom, s.email, s.telephone, s.institut, s.specialite])];
    const blob = new Blob([rows.map(r => r.map(v => `"${v ?? ''}"`).join(',')).join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = 'stagiaires.csv'; link.click(); window.URL.revokeObjectURL(url);
  }

  exportExcel() { const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.filteredStagiaires); const wb: XLSX.WorkBook = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, ws, 'Stagiaires'); XLSX.writeFile(wb, 'stagiaires.xlsx'); }
  exportPDF() { const doc = new jsPDF(); autoTable(doc, { head: [['CIN','Nom','Prénom','Email','Téléphone','Institut','Spécialité']], body: this.filteredStagiaires.map(s => [s.cin,s.nom,s.prenom,s.email,s.telephone,s.institut,s.specialite]) }); doc.save('stagiaires.pdf'); }

  // ===== QR helpers =====
  private generateQRCodes(list: any[]) {
    this.qrMap.clear();
    (list||[]).forEach(s => {
      if (s?.cin)
        QRCode.toDataURL(String(s.cin), { width: 72, errorCorrectionLevel: 'M' as any })
          .then(url => this.qrMap.set(String(s.cin), url))
          .catch(()=>{});
    });
  }
  openQR(src: string) { this.qrPreview = src; }
  closeQR() { this.qrPreview = null; }

  // ===== COPY + TOAST =====
  copy(text: string) {
    if (!text) return;
    navigator.clipboard.writeText(String(text))
      .then(()=>this.showToast('Copié ✔'))
      .catch(()=>this.showToast('Impossible de copier'));
  }
  private showToast(msg: string) { this.toast = msg; setTimeout(()=>this.toast='',1200); }

  // ===== PRINT =====
  printPage() { window.print(); }

  // ===== LocalStorage =====
  private saveUIState() {
    const state = {
      recherche:this.recherche,
      page:this.page,
      pageSize:this.pageSize,
      filterInstitut:this.filterInstitut,
      filterSpecialite:this.filterSpecialite,
      sortField:this.sortField,
      sortDir:this.sortDir
    };
    try{localStorage.setItem(this.UI_KEY,JSON.stringify(state));}catch{}
  }
  private restoreUIState() {
    try{
      const raw = localStorage.getItem(this.UI_KEY);
      if(!raw) return;
      const s = JSON.parse(raw);
      if(typeof s.recherche==='string') this.recherche=s.recherche;
      if(typeof s.page==='number') this.page=s.page;
      if(typeof s.pageSize==='number') this.pageSize=s.pageSize;
      if(typeof s.filterInstitut==='string') this.filterInstitut=s.filterInstitut;
      if(typeof s.filterSpecialite==='string') this.filterSpecialite=s.filterSpecialite;
      if(typeof s.sortField==='string') this.sortField=s.sortField;
      if(s.sortDir==='asc'||s.sortDir==='desc') this.sortDir=s.sortDir;
    }catch{}
  }
}
