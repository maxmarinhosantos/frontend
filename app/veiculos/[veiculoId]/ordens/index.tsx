// frontend/app/veiculos/[veiculoId]/ordens/index.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  FlatList,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { Button, Icon } from '@rneui/themed';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { API_URL } from '../../../../config'; // Importa a URL dinâmica

interface OrdemServico {
  id: string;
  descricao: string;
  status: string;
  prioridade: string;
  local_servico: string;
  created_at: string;
  inicio_servico?: string | null;
  encerramento_servico?: string | null;
}

export default function OrdensDeServico() {
  const router = useRouter();
  const { veiculoId } = useLocalSearchParams();
  const [ordens, setOrdens] = useState<OrdemServico[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrdens = async () => {
      try {
        setLoading(true);
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          throw new Error('Token não encontrado. Faça login novamente.');
        }

        const headers = { Authorization: `Bearer ${token}` };
        const response = await axios.get(
          `${API_URL}/api/veiculos/${veiculoId}/ordens`,
          { headers }
        );

        if (response.data?.data) {
          setOrdens(response.data.data);
        } else {
          console.warn('Nenhum dado encontrado na resposta da API:', response.data);
          setOrdens([]);
        }
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          console.error('Erro de API:', err.response || err.message);
          Alert.alert(
            'Erro',
            err.response?.data?.message || 'Não foi possível carregar as ordens de serviço.'
          );
        } else if (err instanceof Error) {
          console.error('Erro:', err.message);
          Alert.alert('Erro', err.message || 'Erro desconhecido.');
        } else {
          console.error('Erro desconhecido:', err);
          Alert.alert('Erro', 'Um erro inesperado ocorreu.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrdens();
  }, [veiculoId]);

  const renderItem = ({ item }: { item: OrdemServico }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        router.push({
          pathname: '/veiculos/[veiculoId]/ordens/[id]',
          params: { veiculoId: String(veiculoId), id: item.id },
        })
      }
    >
      <View style={styles.cardContent}>
        <Icon name="assignment" type="material" color="#007bff" containerStyle={styles.icon} />
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{item.descricao || 'Sem descrição'}</Text>
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Status:</Text>
            <Text style={styles.value}>{item.status}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Prioridade:</Text>
            <Text style={styles.value}>{item.prioridade || 'Não definida'}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Local Serviço:</Text>
            <Text style={styles.value}>{item.local_servico || 'Interno'}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Criado em:</Text>
            <Text style={styles.value}>
              {new Date(item.created_at).toLocaleDateString('pt-BR')}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Ordens de Serviço</Text>
      <Button
        title="Nova Ordem de Serviço"
        icon={{ name: 'add-circle-outline', type: 'material', size: 20, color: 'white' }}
        buttonStyle={styles.addButton}
        onPress={() =>
          router.push({
            pathname: '/veiculos/[veiculoId]/ordens/novo',
            params: { veiculoId: String(veiculoId) },
          })
        }
      />
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#007bff" />
        </View>
      ) : ordens.length > 0 ? (
        <FlatList
          data={ordens}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      ) : (
        <View style={styles.centered}>
          <Icon name="info" type="material" color="#777" size={50} />
          <Text style={styles.emptyText}>Nenhuma ordem de serviço encontrada.</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f8f9fa' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, color: '#333' },
  addButton: { backgroundColor: '#007bff', marginBottom: 20 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 6,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
  },
  cardContent: { flexDirection: 'row', alignItems: 'center' },
  icon: { marginRight: 10 },
  title: { fontWeight: 'bold', fontSize: 16, color: '#37474f' },
  infoContainer: { flexDirection: 'row', marginTop: 5 },
  label: { fontWeight: 'bold', fontSize: 14, color: '#37474f' },
  value: { fontSize: 14, color: '#555', marginLeft: 5 },
  emptyText: { fontSize: 16, color: '#777', textAlign: 'center', marginTop: 10 },
});
