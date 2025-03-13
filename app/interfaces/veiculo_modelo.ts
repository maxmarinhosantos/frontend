//frontend/interfaces/veiculo_modelo.ts
export interface VeiculoModelo {
    id: string; // UUID gerado automaticamente
    nome?: string;
    created_at?: string; // ISO String
    user_id?: string | null; // UUID ou null
    empresa_id?: string;
    filial_id?: string;
  }