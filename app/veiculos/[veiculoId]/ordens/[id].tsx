// frontend/app/veiculos/[veiculoId]/ordens/[id].tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, Alert } from 'react-native';
import { Button } from 'react-native-elements';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { API_URL } from '../../../../config';

interface ChecklistItem {
  descricao: string;
  checklist_status: string;
}

interface OrdemServico {
  id: string;
  numero: number;
  placa: string;
  num_frota: string;
  tipo: string;
  local_servico: string;
  prioridade: string;
  status: string;
  created_at: string;
  checklist: ChecklistItem[];
}

export default function OrdemServicoDetalhes() {
  const { id } = useLocalSearchParams();
  const [ordem, setOrdem] = useState<OrdemServico | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchOrdem = async () => {
      try {
        setLoading(true);
        const token = await AsyncStorage.getItem('token');
        if (!token) throw new Error('Token não encontrado.');

        const headers = { Authorization: `Bearer ${token}` };
        const response = await axios.get(`${API_URL}/api/ordens/${id}/detalhes`, { headers });
        setOrdem(response.data.data);
      } catch (error) {
        console.error('Erro ao carregar ordem de serviço:', error);
        Alert.alert('Erro', 'Não foi possível carregar os detalhes da ordem de serviço.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrdem();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text>Carregando...</Text>
      </View>
    );
  }

  if (!ordem) {
    return (
      <View style={styles.centered}>
        <Text>Ordem de serviço não encontrada.</Text>
        <Button title="Voltar" onPress={() => router.back()} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Detalhes da Ordem de Serviço</Text>
      <Text>{`Número: ${ordem.numero}`}</Text>
      <Text>{`Placa: ${ordem.placa}`}</Text>
      <Text>{`Frota: ${ordem.num_frota}`}</Text>
      <Text>{`Tipo: ${ordem.tipo}`}</Text>
      <Text>{`Local de Serviço: ${ordem.local_servico}`}</Text>
      <Text>{`Prioridade: ${ordem.prioridade}`}</Text>
      <Text>{`Status: ${ordem.status}`}</Text>
      <Text>{`Criado em: ${new Date(ordem.created_at).toLocaleDateString('pt-BR')}`}</Text>

      <Text style={styles.sectionTitle}>Itens do Checklist:</Text>
      <FlatList
        data={ordem.checklist}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.checklistItem}>
            <Text>{item.descricao}</Text>
            <Text>{`Status: ${item.checklist_status}`}</Text>
          </View>
        )}
        ListEmptyComponent={<Text>Nenhum item no checklist.</Text>}
      />
      <Button title="Voltar" onPress={() => router.back()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f8f9fa' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 20 },
  checklistItem: { marginVertical: 8, padding: 10, backgroundColor: '#fff', borderRadius: 5 },
});
