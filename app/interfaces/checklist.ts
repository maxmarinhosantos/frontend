// Arquivo: frontend/interfaces/checklist.ts
export interface Checklist {
    id?: string; // UUID gerado automaticamente, opcional
    empresa_id?: string | null; // UUID ou null
    check_tipo_id: string; // Obrigatório
    status?: 'pendente' | 'em_progresso' | 'concluido'; // Enum com valores válidos
    created_at?: string; // ISO String
    completed_at?: string | null; // ISO String ou null
    user_id?: string | null; // UUID ou null
    filial_id?: string | null; // UUID ou null
    descricao?: string | null; // Texto opcional
  }
  