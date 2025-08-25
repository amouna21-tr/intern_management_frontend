import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InternService } from '../services/intern.service';


@Component({
  selector: 'app-modify-intern',
  templateUrl: './modify-intern.component.html',
  styleUrls: ['./modify-intern.component.css']
})
export class ModifyInternComponent implements OnInit {
  stagiaire: any = {};
  stagiaireId!: number;


  constructor(
    private route: ActivatedRoute,
     private internService: InternService, 
    public router: Router
  ) {}

  ngOnInit(): void {
    this.stagiaireId = +this.route.snapshot.params['id'];
    this.loadStagiaire();
  }

    loadStagiaire() {
    this.internService.getInternById(this.stagiaireId).subscribe({
      next: (data) => {
        this.stagiaire = data; // Fill the form with fetched data
      },
      error: (err) => {
        console.error(err);
        alert('Intern not found.'); // Show alert if ID is invalid
        this.router.navigate(['/gestion-stagiaires']); // Redirect back to list
      }
    });
  }
  updateIntern() {
    this.internService.updateIntern(this.stagiaireId, this.stagiaire).subscribe({
      next: () => {
        alert('Intern updated successfully!'); // Notify user
        this.router.navigate(['/gestion-stagiaires']); // Redirect to list page
      },
      error: (err) => {
        console.error(err);
        alert('Error updating intern.'); // Show error if update fails
      }
  });
  }
}
