// Arquivo: frontend/interfaces/veiculo_categoria.ts
export interface VeiculoCategoria {
    id?: string; // UUID gerado automaticamente, opcional
    nome?: string;
    created_at?: string; // ISO String
    user_id?: string | null; // UUID ou null
    empresa_id?: string;
  }