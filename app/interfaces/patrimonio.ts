// Arquivo: frontend/interfaces/patrimonio.ts
export default interface Patrimonio {
    id?: string;
    descricao: string ;
    patrimonio_categoria_id: string;
    numero: bigint;
    empresa_id: string;
    filial_id: string;
    imagem_id: string;
    status: string;
  }