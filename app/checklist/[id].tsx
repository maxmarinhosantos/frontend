//frontend/app/checklist/[id].tsx - Página de detalhes para exibir detalhes do checklist.

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button, Icon } from '@rneui/themed';
import { API_URL } from 'config';

interface ChecklistDetail {
  id: string;
  valor: string;
  item: string; // Alterado de item_nome para item
  descricao_problema?: string | null;
}

interface ChecklistData {
  id: string;
  descricao: string;
  status: string;
  created_at: string;
  updated_at: string;
  completed_at?: string | null;
  usuario_nome: string;
  veiculo_placa: string;
  veiculo_numero: string;
  detalhes: ChecklistDetail[];
}

export default function ChecklistDetails() {
  const [loading, setLoading] = useState(true);
  const [checklist, setChecklist] = useState<ChecklistData | null>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [newDescricao, setNewDescricao] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const router = useRouter();
  const { id } = useLocalSearchParams();

  useEffect(() => {
    const fetchChecklistDetails = async () => {
      try {
        setLoading(true);
        const token = await AsyncStorage.getItem('token');
        if (!token) throw new Error('Token não encontrado.');

        const headers = { Authorization: `Bearer ${token}` };

        const response = await axios.get(`${API_URL}/api/checklist/${id}`, { headers });
        console.log('Detalhes do checklist:', response.data.data.detalhes);
        setChecklist(response.data.data);
        setNewDescricao(response.data.data.descricao);
        setNewStatus(response.data.data.status);
      } catch (error) {
        console.error('Erro ao carregar checklist:', error);
        Alert.alert('Erro', 'Não foi possível carregar os detalhes do checklist.');
      } finally {
        setLoading(false);
      }
    };

    fetchChecklistDetails();
  }, [id]);

  const handleDelete = async () => {
    Alert.alert(
      'Confirmação',
      'Deseja realmente excluir este checklist?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('token');
              if (!token) throw new Error('Token não encontrado.');

              const headers = { Authorization: `Bearer ${token}` };

              await axios.delete(`${API_URL}/api/checklist/${id}`, { headers });

              Alert.alert('Sucesso', 'Checklist excluído com sucesso.');
              router.push('/veiculos');
            } catch (error) {
              console.error('Erro ao excluir checklist:', error);
              Alert.alert('Erro', 'Falha ao excluir o checklist.');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleEdit = async () => {
    if (!['pendente', 'concluido'].includes(newStatus.toLowerCase())) {
      Alert.alert('Erro', 'Status inválido. Use "pendente" ou "concluído".');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('Token não encontrado.');

      const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

      await axios.put(
        `${API_URL}/api/checklist/${id}`,
        {
          descricao: newDescricao,
          status: newStatus,
        },
        { headers }
      );

      Alert.alert('Sucesso', 'Checklist atualizado com sucesso.');
      setEditModalVisible(false);
      setChecklist({ ...checklist!, descricao: newDescricao, status: newStatus });
    } catch (error) {
      console.error('Erro ao editar checklist:', error);
      Alert.alert('Erro', 'Falha ao atualizar o checklist.');
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text>Carregando checklist...</Text>
      </View>
    );
  }

  if (!checklist) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Checklist não encontrado.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.actionContainer}>
        <Button title="Editar" onPress={() => setEditModalVisible(true)} buttonStyle={styles.editButton} />
        <Button title="Excluir" onPress={handleDelete} buttonStyle={styles.deleteButton} />
      </View>

      <Text style={styles.title}>Detalhes do Checklist</Text>

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          <Icon name="car" type="font-awesome" size={16} /> Frota: {checklist.veiculo_numero} - {checklist.veiculo_placa}
        </Text>

        <Text style={styles.infoText}>
          <Icon name="calendar" type="font-awesome" size={16} /> Criado: {new Date(checklist.created_at).toLocaleString('pt-BR')} - {checklist.usuario_nome}
        </Text>

        <Text style={styles.infoText}>
          <Icon name="calendar" type="font-awesome" size={16} /> Atualizado: {new Date(checklist.updated_at).toLocaleString('pt-BR')} - {checklist.usuario_nome}
        </Text>



        <Text style={styles.infoText}>
          <Icon name="info-circle" type="font-awesome" size={16} /> Status: <Text style={styles.statusText}>{checklist.status}</Text>
        </Text>
        {checklist.descricao && (
          <Text style={styles.infoText}>
            <Icon name="file-text" type="font-awesome" size={16} /> Descrição: {checklist.descricao}
          </Text>
        )}
      </View>

      <Text style={styles.subTitle}>Itens Checados</Text>

      <FlatList
        data={checklist.detalhes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={item.valor === 'problema' ? styles.problemContainer : styles.okContainer}>
            <Text style={styles.itemTitle}>
              <Icon
                name={item.valor === 'problema' ? 'exclamation-circle' : 'check-circle'}
                type="font-awesome"
                size={16}
                color={item.valor === 'problema' ? '#e74c3c' : '#2ecc71'}
              />{' '}
              {item.item || 'Item não especificado'}      </Text>

            {item.descricao_problema && (
              <Text style={styles.problemText}>
                <Icon name="warning" type="material" size={14} color="#e74c3c" /> Problema: {item.descricao_problema}
              </Text>
            )}
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>Nenhum item checado.</Text>}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Editar Checklist</Text>

          <TextInput
            style={styles.input}
            value={newDescricao}
            onChangeText={setNewDescricao}
            placeholder="Descrição"
          />

          <TextInput
            style={styles.input}
            value={newStatus}
            onChangeText={setNewStatus}
            placeholder="Status (pendente ou concluído)"
          />

          <View style={styles.modalButtons}>
            <Button
              title="Cancelar"
              onPress={() => setEditModalVisible(false)}
              buttonStyle={styles.cancelButton}
            />
            <Button
              title="Salvar"
              onPress={handleEdit}
              buttonStyle={styles.saveButton}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f9fa'
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
    textAlign: 'center'
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    fontWeight: 'bold'
  },
  infoContainer: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 6,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ccc'
  },
  infoText: {
    fontSize: 16,
    marginBottom: 6,
    color: '#37474f'
  },
  statusText: {
    fontWeight: 'bold',
    color: '#007bff'
  },
  subTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#37474f'
  },
  problemContainer: {
    backgroundColor: '#fdecea',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#f5c6cb',
  },
  okContainer: {
    backgroundColor: '#eafaf1',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#d4edda',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#37474f',
    marginBottom: 4
  },
  problemText: {
    fontSize: 14,
    color: '#721c24',
    marginTop: 4
  },
  emptyText: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
    marginTop: 20
  },
  editButton: {
    backgroundColor: '#f39c12'
  },
  deleteButton: {
    backgroundColor: '#e74c3c'
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 15
  },
  cancelButton: {
    backgroundColor: '#95a5a6',
    marginRight: 10
  },
  saveButton: {
    backgroundColor: '#2ecc71',
    marginLeft: 10
  }
});
