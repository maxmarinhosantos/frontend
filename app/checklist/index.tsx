//frontend/frontend/app/checklist/index.tsx

import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Button, Divider } from '@rneui/themed';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {API_URL} from '../../config';

interface Checklist {
  id: string;
  data: string;
  observacoes: string;
}

export default function Checklists() {
  const [checklists, setChecklists] = useState<Checklist[]>([]);
  const [loading, setLoading] = useState(false);

  const { veiculoId } = useLocalSearchParams(); // Obtém o ID do veículo pela rota
  const router = useRouter();

  useEffect(() => {
    const fetchChecklists = async () => {
      try {
        setLoading(true);
        const token = await AsyncStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        const response = await axios.get(
          `${API_URL}/api/veiculos/${veiculoId}/checklists`,
          { headers }
        );

        setChecklists(response.data);
      } catch (error) {
        console.error('Erro ao buscar checklists:', error);
        Alert.alert(
          'Erro',
          'Não foi possível carregar os checklists deste veículo.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchChecklists();
  }, [veiculoId]);

  const renderItem = ({ item }: { item: Checklist }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{`Data: ${item.data}`}</Text>
      <Text>{`Observações: ${item.observacoes}`}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Checklists do Veículo</Text>
      <Button
        title="Novo Checklist"
        onPress={() =>
          router.push({
            pathname: '/checklist/novo',
            params: { veiculoId },
          })
        }
        buttonStyle={styles.addButton}
      />
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <FlatList
          data={checklists}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <Divider />}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Nenhum checklist encontrado.</Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa', padding: 10 },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#333',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 6,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
  },
  title: { fontWeight: 'bold', fontSize: 16, marginBottom: 5 },
  emptyText: { textAlign: 'center', marginTop: 20, color: '#777' },
  addButton: {
    backgroundColor: '#007bff',
    marginBottom: 15,
  },
});
