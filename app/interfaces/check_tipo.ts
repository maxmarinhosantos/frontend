// Arquivo: frontend/interfaces/check_tipo.ts
export interface CheckTipo {
    id?: string; // UUID gerado automaticamente, opcional
    user_id: string;
    empresa_id: string;
    filial_id: string;
    nome: string;
  }