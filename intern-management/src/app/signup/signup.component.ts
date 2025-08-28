import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  nom = '';
  prenom = '';
  email = '';
  password = '';
  confirmPassword = '';
  message = '';

  loading = false;

  constructor(private router: Router) {}

  register() {
    if (this.loading) return;

    // 🔹 Vérif champs obligatoires
    if (!this.nom || !this.prenom || !this.email || !this.password) {
      this.message = '❌ Merci de remplir tous les champs obligatoires.';
      return;
    }

    // 🔹 Vérif confirmation mot de passe
    if (this.password !== this.confirmPassword) {
      this.message = '❌ Les mots de passe ne correspondent pas.';
      return;
    }

    this.loading = true;
    try {
      // Charger les utilisateurs déjà créés dans le navigateur
      const raw = localStorage.getItem('users');
      const users: Array<any> = raw ? JSON.parse(raw) : [];

      // Vérifier si email déjà utilisé
      const exists = users.some(u => String(u.email).toLowerCase() === this.email.toLowerCase());
      if (exists) {
        this.loading = false;
        this.message = '⚠️ Email déjà utilisé (local)';
        return;
      }

      // Créer le nouvel utilisateur
      const newUser = {
        nom: this.nom,
        prenom: this.prenom,
        email: this.email,
        password: this.password,   // ⚠️ plain text (ok pour projet étudiant)
        createdAt: new Date().toISOString()
      };

      // Sauvegarder dans localStorage
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));

      // Optionnel : garder un profil courant
      localStorage.setItem('profile', JSON.stringify({
        nom: this.nom, prenom: this.prenom, email: this.email
      }));

      // ✅ Succès
      this.message = '✅ Compte créé (local).';
      this.showToast('Bienvenue ' + this.prenom + ' 👋');

      // Redirection (à adapter si tu veux aller vers login au lieu de gestion-stagiaires)
      this.router.navigate(['/login']);
    } catch (e) {
      console.error('local signup error:', e);
      this.message = '⚠️ Erreur locale.';
    } finally {
      this.loading = false;
    }
  }

  private showToast(text: string) {
    const el = document.createElement('div');
    el.textContent = text;
    el.style.cssText = `
      position: fixed; right: 16px; top: 16px; z-index: 10000;
      background: #16a34a; color: #fff; padding: 10px 14px;
      border-radius: 8px; box-shadow: 0 8px 24px rgba(0,0,0,.15);
      font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial;
    `;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2000);
  }
}
