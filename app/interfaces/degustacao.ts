export interface Degustacao {
  id: string; // UUID gerado automaticamente
  created_at?: string | null; // Timestamp - opcional, padrão null
  updated_at?: string | null; // Timestamp - opcional, padrão null
  empresa_id?: string | null; // UUID - opcional, padrão null
  filial_id?: string | null; // UUID - opcional, padrão null
  user_id?: string | null; // UUID - opcional, padrão null
  data_prevista?: string | null; // Date (AAAA-MM-DD) - opcional
  data_realizacao?: string | null; // Date (AAAA-MM-DD) - opcional
  extra_id?: string | null; // Código externo - opcional
  cnpj?: string | null; // CNPJ - opcional
  nome?: string | null; // Nome - opcional
  endereco?: string | null; // Endereço - opcional
  numero?: string | null; // Número do endereço - opcional
  cidade?: string | null; // Cidade - opcional
  bairro?: string | null; // Bairro - opcional
  cep?: string | null; // CEP - opcional
  uf?: string | null; // Estado (UF) - opcional
  phone?: string | null; // Telefone - opcional
  email?: string | null; // Email - opcional
  etapa?: string | null; // Etapa atual - padrão 'Analizando'
  num: bigint; //Número da deguatação(sequencial)
}
