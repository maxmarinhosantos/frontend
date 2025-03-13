// frontend/app/marcas/novo.tsx - Formulário de cadastro de marcas
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from 'config';
import { fetchToken } from "../../utils/auth";

export default function NovaMarca() {
  const [nome, setNome] = useState(''); // Nome da marca
  const [loading, setLoading] = useState(false);

  const fetchToken = async () => {
    try {
      return await AsyncStorage.getItem('token');
    } catch (error) {
      console.error('Erro ao obter token do AsyncStorage:', error);
      return null;
    }
  };

  const handleSubmit = async () => {
    if (!nome.trim()) {
      Alert.alert('Erro', 'O nome da marca é obrigatório.');
      return;
    }

    setLoading(true);
    try {
      const token = await fetchToken();
      if (!token) {
        Alert.alert('Erro', 'Token de autenticação não encontrado.');
        return;
      }

      const response = await axios.post(
        `${API_URL}/api/veiculos-marcas/novo`,
        { nome },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 201) {
        Alert.alert('Sucesso', 'Marca cadastrada com sucesso!');
        setNome(''); // Limpa o campo após o cadastro
      } else {
        throw new Error('Erro ao cadastrar a marca.');
      }
    } catch (error) {
      console.error('Erro ao cadastrar marca:', error);
      Alert.alert('Erro', 'Não foi possível cadastrar a marca.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Cadastro de Marca</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome da Marca"
        value={nome}
        onChangeText={(text) => setNome(text)}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.buttonText}>Cadastrar</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    backgroundColor: '#f1f3f5',
    padding: 12,
    marginBottom: 16,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ced4da',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
