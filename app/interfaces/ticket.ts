// Arquivo: backend/interfaces/ticket.ts
export interface Ticket {
    id?: string; 
    user_id?: string; 
    title: string;
    description: string;
    status: string;
    created_at?: string;  
  }
  