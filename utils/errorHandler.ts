// frontend/utils/errorHandler.ts - Função utilitária para tratamento de erros
/**
 * Função centralizada para tratamento de erros nas chamadas de API.
 * 
 * Funcionalidade:
 * - Trata erros HTTP provenientes do backend.
 * - Garante que mensagens específicas sejam exibidas ao usuário.
 * - Suporta conexões com problemas ou erros inesperados.
 */

import { Alert } from 'react-native';
import axios, { AxiosError } from 'axios';

/**
 * Interface para tipar a resposta do backend.
 * Esperamos um objeto com uma propriedade 'message' (string).
 */
interface ErrorResponse {
  message?: string; // Mensagem de erro opcional
  errors?: Record<string, string>; // Mensagens detalhadas (opcional)
}

/**
 * Tratamento centralizado de erros em chamadas de API.
 * 
 * @param {unknown} error - Objeto de erro capturado na requisição.
 * @param {string} defaultMessage - Mensagem padrão caso o erro não tenha detalhes.
 * @returns {string} - Mensagem detalhada do erro.
 */
export const handleApiError = (
  error: unknown,
  defaultMessage = 'Ocorreu um erro inesperado. Tente novamente mais tarde.'
): string => {
  console.error('Erro detectado:', error); // Log para depuração

  // Verifica se o erro foi gerado pelo Axios
  if (axios.isAxiosError(error)) {
    // Tipagem explícita para o formato esperado na resposta
    const axiosError = error as AxiosError<ErrorResponse>;

    // 1. Erro com resposta do backend (status HTTP 400, 403, etc.)
    if (axiosError.response) {
      const status = axiosError.response.status; // Código HTTP
      const serverMessage = axiosError.response.data?.message || defaultMessage; // Mensagem recebida

      // Logs para depuração
      console.log('URL:', axiosError.config?.url);
      console.log('Status Code:', status);
      console.log('Resposta do Servidor:', axiosError.response.data);

      // Tratamento com base no código de status HTTP
      switch (status) {
        case 400: // Credenciais inválidas ou requisição malformada
          Alert.alert('Erro', serverMessage || 'Credenciais inválidas.');
          return serverMessage;

        case 403: // Conta não ativada ou acesso negado
          Alert.alert('Erro', 'Conta não ativada. Verifique seu e-mail!');
          return 'Conta não ativada.';

        case 404: // Recurso não encontrado
          Alert.alert('Erro', 'Recurso não encontrado.');
          return 'Recurso não encontrado.';

        case 500: // Erro interno no servidor
          Alert.alert('Erro', 'Erro interno no servidor. Tente novamente mais tarde.');
          return 'Erro interno no servidor.';

        default: // Outros códigos HTTP não tratados
          Alert.alert('Erro', serverMessage);
          return serverMessage;
      }
    }

    // 2. Erro de conexão (sem resposta do servidor)
    if (axiosError.request) {
      console.error('Erro de conexão:', axiosError.request); // Log para depuração
      Alert.alert('Erro', 'Sem resposta do servidor. Verifique sua conexão.');
      return 'Sem resposta do servidor.';
    }

    // 3. Outros erros do Axios
    console.error('Erro desconhecido no Axios:', axiosError.message);
    Alert.alert('Erro', axiosError.message || defaultMessage);
    return axiosError.message || defaultMessage;
  }

  // 4. Erro genérico não identificado
  console.error('Erro desconhecido:', error); // Log para depuração
  Alert.alert('Erro', defaultMessage); // Alerta com mensagem padrão
  return defaultMessage;
};
