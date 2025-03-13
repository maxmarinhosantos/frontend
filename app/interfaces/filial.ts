// Arquivo: frontend/interfaces/filial.ts
export interface Filial {
    id?: string; // UUID gerado automaticamente, opcional
    cidade?: string;
    created_at?: string; // ISO String
    updated_at?: string; // ISO z.string().cuid()
    user_id?: string | null; // UUID ou null
    uf?: string | null;
    nome?: string | null;
    estoque_atual?: number;
    cnpj?: string;
    empresa_id?: string;
  }