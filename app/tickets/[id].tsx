//frontend/app/ticket/[id].tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Button } from 'react-native-elements';
import { API_URL } from 'config';
import { fetchToken } from '../../utils/auth';
import { globalStyles } from '../../constants/styles';


interface Ticket {
  id: string;
  title: string;
  description?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export default function TicketDetail() {
  const router = useRouter();
  // useLocalSearchParams() retorna qualquer parâmetro definido em [id].tsx
  const { id } = useLocalSearchParams(); 

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchTicket = async (ticketId: string) => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Erro', 'Token não encontrado.');
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get(`${API_URL}/api/tickets/${ticketId}`, {
        headers,
      });

      if (response.data && response.data.data) {
        setTicket(response.data.data);
      } else {
        throw new Error('Retorno inesperado da API.');
      }
    } catch (error) {
      console.error('Erro ao buscar ticket:', error);
      Alert.alert('Erro', 'Não foi possível carregar os detalhes do ticket.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Garante que 'id' é uma string antes de chamar fetchTicket
    if (typeof id === 'string') {
      fetchTicket(id);
    } else {
      setLoading(false);
      Alert.alert('Erro', 'ID do ticket inválido ou não encontrado.');
    }
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  if (!ticket) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Ticket não encontrado ou erro ao carregar.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Detalhes do Ticket</Text>

      <View style={styles.card}>
        <Text style={styles.label}>ID do Ticket:</Text>
        <Text style={styles.value}>{ticket.id}</Text>

        <Text style={styles.label}>Título:</Text>
        <Text style={styles.value}>{ticket.title}</Text>

        <Text style={styles.label}>Status:</Text>
        <Text style={styles.value}>{ticket.status || 'N/A'}</Text>

        <Text style={styles.label}>Descrição:</Text>
        <Text style={styles.value}>
          {ticket.description || 'Nenhuma descrição fornecida.'}
        </Text>

        {ticket.created_at && (
          <>
            <Text style={styles.label}>Criado em:</Text>
            <Text style={styles.value}>
              {new Date(ticket.created_at).toLocaleString()}
            </Text>
          </>
        )}
        {ticket.updated_at && (
          <>
            <Text style={styles.label}>Última atualização:</Text>
            <Text style={styles.value}>
              {new Date(ticket.updated_at).toLocaleString()}
            </Text>
          </>
        )}
      </View>

      <Button
        title="Voltar"
        buttonStyle={[styles.button, { backgroundColor: '#6c757d' }]}
        onPress={() => router.back()}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: '#f8f9fa', 
    padding: 16,
  },
  loadingContainer: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 6,
    padding: 15,
    marginBottom: 10,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#003366',
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {
    fontWeight: 'bold',
    marginTop: 10,
    color: '#333',
  },
  value: {
    color: '#555',
    marginBottom: 5,
  },
  button: {
    marginTop: 10,
    backgroundColor: '#007bff',
    borderRadius: 6,
  },
});
