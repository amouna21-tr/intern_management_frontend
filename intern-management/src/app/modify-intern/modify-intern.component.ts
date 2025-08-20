import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-modify-intern',
  templateUrl: './modify-intern.component.html',
  styleUrls: ['./modify-intern.component.css']
})
export class ModifyInternComponent implements OnInit {
  stagiaire: any = {};
  stagiaireId!: number;
  private apiUrl = 'http://localhost:3000/api/stagiaires';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.stagiaireId = +this.route.snapshot.params['id'];
    this.loadStagiaire();
  }

  loadStagiaire() {
    this.http.get(`${this.apiUrl}`).subscribe((res: any) => {
      const found = res.data.find((s: any) => s.id === this.stagiaireId);
      if (found) {
        this.stagiaire = found;
      } else {
        alert('Intern not found.');
        this.router.navigate(['/gestion-stagiaires']);
      }
    }, err => {
      console.error(err);
      alert('Error fetching intern.');
    });
  }

  updateIntern() {
    this.http.put(`${this.apiUrl}/${this.stagiaireId}`, this.stagiaire)
      .subscribe({
        next: () => {
          alert('Intern updated successfully!');
          this.router.navigate(['/gestion-stagiaires']);
        },
        error: (err) => {
          console.error(err);
          alert('Error updating intern.');
        }
      });
  }
}
