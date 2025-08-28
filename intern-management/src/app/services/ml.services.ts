import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";

const API_BASE = (environment as any).mlApiUrl || environment.apiUrl; // si tu as mlApiUrl (Python 8000), il sera pris
const API = `${API_BASE}/api/ml`;

@Injectable({ providedIn: "root" })
export class MlService {
  constructor(private http: HttpClient) {}

  // Entraînement: multipart/form-data (champ "file")
  train(file: File) {
    const fd = new FormData();
    fd.append("file", file);
    return this.http.post<{ ok?: boolean; metrics?: any; message?: string }>(
      `${API}/train`,
      fd
    );
  }

  // Prédiction en masse: { items: [...], threshold }
  predict(items: any[], threshold: number) {
    return this.http.post<{ ok?: boolean; results: any[] }>(
      `${API}/predict`,
      { items, threshold }
    );
  }

  // (optionnel) prédire un seul item
  predictOne(item: any, threshold: number) {
    return this.http.post<{ ok?: boolean; results: any[] }>(
      `${API}/predict`,
      { items: [item], threshold }
    );
  }
}
