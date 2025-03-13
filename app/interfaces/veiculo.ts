// Arquivo: frontend/app/interfaces/veiculo.ts
/**
 * Interface para representar os dados de um veículo, incluindo associações populadas.
 */
export interface Veiculo {
  id?: string; // UUID gerado automaticamente pelo backend, opcional ao criar
  num_frota: string; // Número de frota do veículo - Obrigatório
  placa: string; // Placa do veículo - Obrigatório
  categoria_veiculo_id: string; // ID da categoria do veículo (UUID) - Obrigatório
  filial_id: string; // ID da filial alocada ao veículo (UUID) - Obrigatório
  ano: string; // Ano de fabricação do veículo, em formato de string - Obrigatório
  tipo_veiculo_id?: string; // ID do tipo de veículo (UUID) - Opcional
  marca_veiculo_id?: string; // ID da marca do veículo (UUID) - Opcional
  modelo_veiculo_id?: string; // ID do modelo do veículo (UUID) - Opcional
  empresa_id?: string; // ID da empresa associada ao veículo (UUID) - Opcional
  user_id?: string; // ID do usuário responsável pelo cadastro do veículo (UUID) - Opcional
  created_at?: string; // Data de criação do registro em formato ISO - Opcional

  // Associações populadas
  categoria?: { id: string; nome: string }; // Categoria do veículo, se populada pelo backend
  tipo?: { id: string; nome: string }; // Tipo do veículo, se populado pelo backend
  marca?: { id: string; nome: string }; // Marca do veículo, se populada pelo backend
  modelo?: { id: string; nome: string }; // Modelo do veículo, se populado pelo backend
  filial?: { id: string; nome: string }; // Filial associada, se populada pelo backend
}
