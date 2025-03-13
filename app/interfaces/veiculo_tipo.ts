// Arquivo: frontend/interfaces/veiculo_tipo.ts
export interface VeiculoTipo {
    id?: string; // UUID gerado automaticamente, opcional
    nome?: string;
    created_at?: string; // ISO String
    user_id?: string | null; // UUID ou null
    empresa_id?: string;
  }