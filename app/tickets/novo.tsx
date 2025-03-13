// frontend/app/tickets/novo.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Modal,
  FlatList,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from 'config';
import { fetchToken } from '../../utils/auth';
import { globalStyles } from '../../constants/styles';


interface Option {
  id: string;
  nome: string;  // Caso seu backend retorne 'nome' ou 'title' ou 'description' etc.
}

export default function NovoTicket() {
  // Estado para o formulário de Ticket
  const [form, setForm] = useState({
    title: '',
    description: '',
    status: 'aberto',  // você pode iniciar com 'aberto' ou deixar vazio
    filial_id: '',
  });

  // Exemplo de listas que serão carregadas da API para dropdown
  const [filiais, setFiliais] = useState<Option[]>([]);
  // Se precisar listar status de forma dinâmica, crie um state para isso
  // const [statusList, setStatusList] = useState<Option[]>([]);

  const [loading, setLoading] = useState(false);

  // Controla qual modal está visível (por ID da propriedade)
  // Por exemplo, se for 'filial_id', vai abrir o modal das filiais
  const [modalVisible, setModalVisible] = useState<string | null>(null);

  // ----------------------------------------------------------------
  // 1. Função para buscar o token do AsyncStorage
  // ----------------------------------------------------------------
  const fetchToken = async () => {
    try {
      return await AsyncStorage.getItem('token');
    } catch (error) {
      console.error('Erro ao obter token do AsyncStorage:', error);
      return null;
    }
  };

  // ----------------------------------------------------------------
  // 2. Função genérica para buscar dados de um endpoint
  // ----------------------------------------------------------------
  const fetchData = async (
    endpoint: string,
    setState: React.Dispatch<React.SetStateAction<Option[]>>
  ) => {
    try {
      setLoading(true);
      const token = await fetchToken();
      if (!token) {
        Alert.alert('Erro', 'Token de autenticação não encontrado.');
        return;
      }

      const response = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Supondo que sua API retorne algo como { data: [ ... ] }:
      // Ajuste conforme a estrutura de resposta.
      setState(response.data.data || response.data);
    } catch (error) {
      Alert.alert('Erro', `Erro ao carregar dados de ${endpoint}`);
      console.error(`Erro ao carregar ${endpoint}:`, error);
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------------------------------------
  // 3. useEffect para carregar listas (filiais, status, etc.)
  // ----------------------------------------------------------------
  useEffect(() => {
    // Exemplo: Carregar filiais
    fetchData(`${API_URL}/api/filiais`, setFiliais);

    // Se você tiver outro endpoint para status, prioridade etc.:
    // fetchData('http://localhost:3000/api/tickets/status', setStatusList);
  }, []);

  // ----------------------------------------------------------------
  // 4. Ao selecionar um valor de Modal
  // ----------------------------------------------------------------
  const handleSelect = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setModalVisible(null); // Fecha o modal após seleção
  };

  // ----------------------------------------------------------------
  // 5. Renderização do modal (reutilizável)
  // ----------------------------------------------------------------
  const renderModal = (data: Option[], key: string) => (
    <Modal
      visible={modalVisible === key}
      animationType="slide"
      transparent={false}
      onRequestClose={() => setModalVisible(null)}
    >
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>Selecione uma opção</Text>
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.modalItem}
              onPress={() => handleSelect(key, item.id)}
            >
              <Text style={styles.modalItemText}>{item.nome}</Text>
            </TouchableOpacity>
          )}
        />
        <TouchableOpacity
          style={styles.modalCloseButton}
          onPress={() => setModalVisible(null)}
        >
          <Text style={styles.modalCloseButtonText}>Fechar</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );

  // ----------------------------------------------------------------
  // 6. Envio do formulário (criação de Ticket)
  // ----------------------------------------------------------------
  const handleSubmit = async () => {
    // Validações mínimas de campos obrigatórios
    if (!form.title) {
      Alert.alert('Erro', 'Preencha o título do ticket.');
      return;
    }

    setLoading(true);
    try {
      const token = await fetchToken();
      if (!token) {
        Alert.alert('Erro', 'Token de autenticação não encontrado.');
        return;
      }

      // Envie para o endpoint de criação de tickets
      const response = await axios.post(
        `${API_URL}/api/tickets/novo`,
        form,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 201) {
        Alert.alert('Sucesso', 'Ticket cadastrado com sucesso!');
        // Limpa o formulário
        setForm({
          title: '',
          description: '',
          status: 'aberto',
          filial_id: '',
        });
      } else {
        throw new Error('Erro ao cadastrar ticket.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro desconhecido ao cadastrar o ticket.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------------------------------------
  // Render do componente
  // ----------------------------------------------------------------
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Novo Ticket de Atendimento</Text>

      <TextInput
        style={styles.input}
        placeholder="Título do Ticket"
        value={form.title}
        onChangeText={(text) => setForm((prev) => ({ ...prev, title: text }))}
      />

      <TextInput
        style={[styles.input, { height: 80 }]}
        placeholder="Descrição (opcional)"
        value={form.description}
        onChangeText={(text) => setForm((prev) => ({ ...prev, description: text }))}
        multiline
      />

      {/* Exemplo: Botão para selecionar filial (caso necessário) */}
      <TouchableOpacity
        style={styles.selectButton}
        onPress={() => setModalVisible('filial_id')}
      >
        <Text style={styles.selectButtonText}>
          {form.filial_id
            ? filiais.find((f) => f.id === form.filial_id)?.nome
            : 'Selecionar Filial (opcional)'}
        </Text>
      </TouchableOpacity>
      {renderModal(filiais, 'filial_id')}

      {/* Exemplo: caso você queira exibir o status em modal:
      <TouchableOpacity
        style={styles.selectButton}
        onPress={() => setModalVisible('status')}
      >
        <Text style={styles.selectButtonText}>
          {form.status || 'Status do Ticket'}
        </Text>
      </TouchableOpacity>
      {renderModal(statusList, 'status')}
      */}

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

// ----------------------------------------------------------------
// Estilos (mesmo padrão do formulário de veículo)
// ----------------------------------------------------------------
const styles = StyleSheet.create({
  container: { padding: 16, flex: 1, backgroundColor: '#f8f9fa' },
  title: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 10,
    color: '#003366',
  },
  input: {
    backgroundColor: '#f1f3f5',
    padding: 8,
    marginBottom: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ced4da',
    fontSize: 12,
  },
  selectButton: {
    backgroundColor: '#f1f3f5',
    padding: 10,
    marginBottom: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ced4da',
  },
  selectButtonText: {
    fontSize: 12,
    color: '#495057',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 12,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 10,
  },
  modalItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  modalItemText: {
    fontSize: 14,
    color: '#333',
  },
  modalCloseButton: {
    marginTop: 20,
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  modalCloseButtonText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 14,
  },
});
