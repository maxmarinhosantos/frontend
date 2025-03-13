// Arquivo: frontend/interfaces/veiculo_marca.ts
export interface VeiculoMarca {
    id?: string; // UUID gerado automaticamente, opcional
    nome: string;
    created_at: string; // ISO String
    user_id: string; 
    empresa_id: string;
    filial_id: string;
  }