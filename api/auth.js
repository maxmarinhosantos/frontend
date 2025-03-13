// frontend/api/auth.js
// Centralizar as chamadas HTTP para a API de autenticação.
// Função Principal: Enviar requisições para o backend (POST /auth/register, POST /auth/login, etc.).
// Usa axios para fazer chamadas à API.

// frontend/api/auth.js
import axios from './axios';

// 🔹 Função de Registro de Usuário (sem role_id)
export const register = async (email, password, nome, cidade, uf, telefone) => {
  try {
    const response = await axios.post('/auth/register', {
      email,
      password,
      nome,
      cidade,
      uf,
      phone,
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Erro ao registrar usuário');
  }
};
