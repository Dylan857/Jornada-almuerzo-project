import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

@Injectable({ providedIn: 'root' })
export class AiService {
  private api = `${environment.apiUrl}/ai`;

  constructor(private http: HttpClient) {}

  query(question: string) {
    return this.http.post<{ success: boolean; data: string }>(
      `${this.api}/query`,
      { question }
    );
  }

  getSuggestedQuestions(): string[] {
    return [
      '¿Qué ingredientes van a faltar pronto?',
      '¿Cuál es la receta más pedida?',
      '¿Cuántos platos se han completado hoy?',
      '¿Qué ingredientes tienen stock crítico?',
      '¿Cuántas compras se han hecho en la plaza?',
    ];
  }
}