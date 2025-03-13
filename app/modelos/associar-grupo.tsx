// frontend/app/modelos/associar-grupo.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Alert } from 'react-native';
import { Button, CheckBox } from '@rneui/themed';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { API_URL } from 'config';
import { fetchToken } from "../../utils/auth";


interface Grupo {
  id: string;
  grupo: string;
}

export default function AssociarGrupo() {
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [selectedGrupos, setSelectedGrupos] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const { modeloId, modeloNome } = useLocalSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (!modeloId || typeof modeloId !== 'string') {
      Alert.alert('Erro', 'ID do modelo inválido.');
      router.push('/modelos'); // Redireciona para a tela de modelos
      return;
    }

    const fetchGrupos = async () => {
      setLoading(true);
      try {
        const token = await AsyncStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        // Busca todos os grupos do banco
        const response = await axios.get(
          `${API_URL}/api/veiculos-modelos/grupos-itens-serie`,
          { headers }
        );

        setGrupos(response.data);
      } catch (error) {
        console.error('Erro ao buscar grupos:', error);
        Alert.alert(
          'Erro',
          'Não foi possível carregar os grupos. Por favor, tente novamente.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchGrupos();
  }, [modeloId]);

  const handleSelectGrupo = (grupoId: string) => {
    setSelectedGrupos((prev) =>
      prev.includes(grupoId)
        ? prev.filter((id) => id !== grupoId)
        : [...prev, grupoId]
    );
  };

  const handleSave = async () => {
    if (selectedGrupos.length === 0) {
      Alert.alert('Atenção', 'Selecione pelo menos um grupo para associar.');
      return;
    }

    setLoading(true);

    try {
      const token = await AsyncStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      await axios.post(
        `${API_URL}/api/veiculos-modelos/${modeloId}/associar-grupos`,
        { grupoIds: selectedGrupos },
        { headers }
      );

      Alert.alert('Sucesso', 'Grupos associados com sucesso!');
      router.push('/modelos');
    } catch (error) {
      console.error('Erro ao associar grupos:', error);
      Alert.alert(
        'Erro',
        'Não foi possível associar os grupos. Por favor, tente novamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Associar Grupos ao Modelo</Text>
      <Text style={styles.subtitle}>
        {modeloNome || 'Nome do modelo não encontrado'}
      </Text>

      <FlatList
        data={grupos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CheckBox
            title={item.grupo}
            checked={selectedGrupos.includes(item.id)}
            onPress={() => handleSelectGrupo(item.id)}
            containerStyle={styles.checkbox}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            Nenhum grupo disponível para associação.
          </Text>
        }
        contentContainerStyle={styles.listContainer}
      />

      <Button
        title={loading ? 'Salvando...' : 'Salvar Associações'}
        onPress={handleSave}
        disabled={loading}
        buttonStyle={styles.saveButton}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f8f9fa' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 10 },
  subtitle: { fontSize: 16, color: '#555', marginBottom: 20 },
  listContainer: { paddingBottom: 20 },
  checkbox: { backgroundColor: '#fff', borderRadius: 8, marginBottom: 10 },
  emptyText: { textAlign: 'center', fontSize: 16, color: '#777', marginTop: 20 },
  saveButton: { backgroundColor: '#007bff', marginTop: 20, padding: 10 },
});
