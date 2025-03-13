//frontend/app/ticket/index.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  FlatList,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { Text, Icon, Button, Divider } from 'react-native-elements';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { API_URL } from 'config';
import { fetchToken } from '../../utils/auth';
import { globalStyles } from '../../constants/styles';


interface Ticket {
  id: string;
  title: string;
  description?: string;
  status?: string;
}

export default function Tickets() {
  const router = useRouter();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Erro', 'Token não encontrado.');
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };
      // Ajuste a URL conforme seu backend
      const response = await axios.get(`${API_URL}/api/tickets`, {
        headers,
      });

      if (response.data && Array.isArray(response.data.data)) {
        setTickets(response.data.data);
        setFilteredTickets(response.data.data);
      } else {
        throw new Error('Dados inesperados da API.');
      }
    } catch (error) {
      console.error('Erro ao buscar tickets:', error);
      Alert.alert('Erro', 'Não foi possível carregar os tickets.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleSearch = (text: string) => {
    setSearch(text);
    const filtered = tickets.filter((ticket) => {
      const titleMatch = ticket.title
        .toLowerCase()
        .includes(text.toLowerCase());
      const statusMatch = ticket.status
        ?.toLowerCase()
        .includes(text.toLowerCase());
      const descMatch = ticket.description
        ?.toLowerCase()
        .includes(text.toLowerCase());
      return titleMatch || statusMatch || descMatch;
    });
    setFilteredTickets(filtered);
  };

  const renderItem = ({ item }: { item: Ticket }) => (
    <View style={styles.card}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Icon
          name="ticket"
          type="font-awesome"
          color="#007bff"
          containerStyle={{ marginRight: 10 }}
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{`Título: ${item.title}`}</Text>
          <Text>{`Status: ${item.status || 'N/A'}`}</Text>
          {item.description && (
            <Text>{`Descrição: ${item.description}`}</Text>
          )}
        </View>
      </View>
      {/* Botão para ver detalhes */}
      <Button
        title="Ver Detalhes"
        onPress={() => router.push(`/tickets/${item.id}`)}
        buttonStyle={styles.detailsButton}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Buscar tickets por título, status, descrição..."
          onChangeText={handleSearch}
          value={search}
          style={styles.searchInput}
        />
        <Button
          title="+ Novo Ticket"
          onPress={() => router.push('/tickets/novo')}
          buttonStyle={styles.addButton}
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <FlatList
          data={filteredTickets}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <Divider />}
          ListEmptyComponent={
            <Text style={{ textAlign: 'center', marginTop: 20 }}>
              Nenhum ticket encontrado.
            </Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#ffffff',
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#f1f3f5',
    borderRadius: 6,
    padding: 8,
    borderWidth: 1,
    borderColor: '#ced4da',
    marginRight: 10,
    fontSize: 12,
  },
  addButton: {
    backgroundColor: '#28a745',
    paddingHorizontal: 15,
    borderRadius: 6,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 6,
    padding: 15,
    marginHorizontal: 10,
    marginBottom: 10,
    elevation: 3,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#333',
  },
  detailsButton: {
    backgroundColor: '#007bff',
    marginTop: 10,
  },
});
