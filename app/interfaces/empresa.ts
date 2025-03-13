// Arquivo: frontend/interfaces/empresa.ts
export interface Empresa {
    id: string; // UUID gerado automaticamente, opcional
    razao: string;
    fantasia: string;
    cidade: string;
    uf: string;
    cnpj: string;
    email_admin: string;
    plano_assinatura: string;
    ativo: boolean;
    criado_em: string;   
  }