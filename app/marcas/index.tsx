// frontend/app/marcas/index.tsx - Lista de Marcas
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Alert, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-elements';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { API_URL } from 'config';
import { fetchToken } from "../../utils/auth";


interface Marca {
  id: string;
  nome: string;
}

export default function Marcas() {
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const router = useRouter(); // Controle de navegação

  useEffect(() => {
    const fetchMarcas = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          Alert.alert('Erro', 'Token não encontrado.');
          return;
        }

        const headers = { Authorization: `Bearer ${token}` };
        const response = await axios.get(`${API_URL}/api/veiculos-marcas`, { headers });

        if (response.data && Array.isArray(response.data)) {
          setMarcas(response.data);
        } else {
          throw new Error('Dados inesperados da API.');
        }
      } catch (error) {
        console.error('Erro ao buscar marcas:', error);
        Alert.alert('Erro', 'Não foi possível carregar as marcas.');
      }
    };

    fetchMarcas();
  }, []);

  const renderItem = ({ item }: { item: Marca }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.nome}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Lista de Marcas</Text>

      {/* Botão para Inserir Nova Marca */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push('/marcas/novo')} // Navega para a tela de inserção
      >
        <Text style={styles.addButtonText}>+ Nova Marca</Text>
      </TouchableOpacity>

      {/* Lista de Marcas */}
      <FlatList
        data={marcas}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  listContainer: {
    paddingBottom: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 6,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 16,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
