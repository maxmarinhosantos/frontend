// Arquivo: frontend/interfaces/checklist_detalhes.ts
export interface ChecklistDetalhes {
    id?: string; // UUID gerado automaticamente, opcional
    checklist_id: string;
    item: string;
    valor: string;
  }