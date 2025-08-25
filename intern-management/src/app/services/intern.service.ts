import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class InternService {
  private apiUrl = 'http://localhost:3000/api/stagiaires'; // Node.js backend URL for stagiaires

  constructor(private http: HttpClient) {}


addIntern(intern: any): Observable<any> {
  


  return this.http.post<any>('http://localhost:3000/api/ajouter-stagiaire', intern);
}


  // Method to get the list of interns
  getInterns(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Method to get a specific intern by ID
  getInternById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Method to update an intern's information
  updateIntern(id: number, intern: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, intern);
  }

  // Method to delete an intern
  deleteIntern(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
