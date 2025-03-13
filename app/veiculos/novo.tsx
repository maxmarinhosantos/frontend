// frontend/app/veiculos/novo.tsx - Formulário completo de cadastro de veículos
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Modal,
  FlatList,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../../config';
import { globalStyles } from '../../constants/styles';
import { Filial } from '../interfaces/filial';

interface Option {
  id: string;
  nome: string;
}


export default function NovoVeiculo() {
  const [form, setForm] = useState({
    num_frota: '',
    placa: '',
    categoria_veiculo_id: '',
    tipo_veiculo_id: '',
    marca_veiculo_id: '',
    modelo_veiculo_id: '',
    ano: '',
    filial_id: '',
    empresa_id: '',
  });

  const [categorias, setCategorias] = useState<Option[]>([]);
  const [tipos, setTipos] = useState<Option[]>([]);
  const [marcas, setMarcas] = useState<Option[]>([]);
  const [modelos, setModelos] = useState<Option[]>([]);
  const [filiais, setFiliais] = useState<Filial[]>([]);
  const [empresas, setEmpresas] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState<string | null>(null);

  const fetchToken = async () => await AsyncStorage.getItem('token');

  const fetchData = async (endpoint: string, setState: React.Dispatch<React.SetStateAction<any[]>>) => {
    try {
      setLoading(true);
      const token = await fetchToken();
      if (!token) return Alert.alert('Erro', 'Token não encontrado.');

      const response = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setState(response.data);
    } catch (error) {
      Alert.alert('Erro', `Erro ao carregar ${endpoint}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(`${API_URL}/api/categorias-veiculo`, setCategorias);
    fetchData(`${API_URL}/api/veiculos-tipos`, setTipos);
    fetchData(`${API_URL}/api/veiculos-marcas`, setMarcas);
    fetchData(`${API_URL}/api/filiais`, setFiliais);
    fetchData(`${API_URL}/api/empresas`, setEmpresas);
    fetchData(`${API_URL}/api/veiculos/modelos`, setModelos);
  }, []);





  const handleSelect = (key: string, value: string) => {
    console.log(`Selecionando ${key}:`, value); // Agora "value" é o próprio ID correto
    setForm((prev) => ({ ...prev, [key]: value })); // Armazena o ID no estado corretamente
    setModalVisible(null);
  };



  const renderModal = (data: any[], key: string, formatFn?: (item: any) => string) => (
    <Modal visible={modalVisible === key} animationType="slide" onRequestClose={() => setModalVisible(null)}>
      <View style={globalStyles.modalContainer}>
        <Text style={globalStyles.modalTitle}>Selecione uma opção</Text>
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={globalStyles.modalItem} onPress={() => handleSelect(key, item.id)}>
              <Text style={globalStyles.modalItemText}>{formatFn ? formatFn(item) : item.nome}</Text>
            </TouchableOpacity>
          )}
        />
        <TouchableOpacity style={globalStyles.modalCloseButton} onPress={() => setModalVisible(null)}>
          <Text style={globalStyles.modalCloseButtonText}>Fechar</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );










  const handleSubmit = async () => {
    if (!form.num_frota.trim() || !form.placa.trim() || !form.ano.trim()) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios.');
      return;
    }

    setLoading(true);
    try {
      const token = await fetchToken();
      if (!token) {
        Alert.alert('Erro', 'Token de autenticação não encontrado.');
        return;
      }

      console.log('Enviando os seguintes dados:', form);

      const response = await axios.post(`${API_URL}/api/veiculos/novo`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 201) {
        Alert.alert('Sucesso', 'Veículo cadastrado com sucesso!');
        setForm({
          num_frota: '',
          placa: '',
          categoria_veiculo_id: '',
          tipo_veiculo_id: '',
          marca_veiculo_id: '',
          modelo_veiculo_id: '',
          ano: '',
          filial_id: '',
          empresa_id: '',
        });
      } else {
        throw new Error('Erro ao cadastrar veículo.');
      }
    } catch (error: any) {
      console.error('Erro ao cadastrar veículo:', error.response?.data || error);
      Alert.alert('Erro', error.response?.data?.message || 'Erro desconhecido ao cadastrar o veículo.');
    } finally {
      setLoading(false);
    }
  };








  const filialSelecionada = filiais.find((filial) => filial.id === form.filial_id);

  return (
    <ScrollView style={globalStyles.container}>
      <Text style={globalStyles.title}>Cadastro de Veículo</Text>

      <TouchableOpacity style={globalStyles.selectButton} onPress={() => setModalVisible('filial_id')}>
        <Text style={globalStyles.selectButtonText}>
          {filialSelecionada ? filialSelecionada.nome : 'Selecione a Filial'}
        </Text>
      </TouchableOpacity>


      <TextInput style={globalStyles.input} placeholder="Número da Frota" value={form.num_frota} onChangeText={(text) => setForm((prev) => ({ ...prev, num_frota: text }))} />
      <TextInput style={globalStyles.input} placeholder="Placa" value={form.placa} onChangeText={(text) => setForm((prev) => ({ ...prev, placa: text }))} />
      <TextInput style={globalStyles.input} placeholder="Ano de Fabricação" keyboardType="numeric" value={form.ano} onChangeText={(text) => setForm((prev) => ({ ...prev, ano: text }))} />


      <TouchableOpacity style={globalStyles.selectButton} onPress={() => setModalVisible('tipo_veiculo_id')}>
        <Text style={globalStyles.selectButtonText}>
          {form.tipo_veiculo_id
            ? tipos.find((tipo) => tipo.id === form.tipo_veiculo_id)?.nome
            : 'Tipo de Veículo'}
        </Text>
      </TouchableOpacity>


      <TouchableOpacity style={globalStyles.selectButton} onPress={() => setModalVisible('categoria_veiculo_id')}>
        <Text style={globalStyles.selectButtonText}>
          {form.categoria_veiculo_id
            ? categorias.find((categoria) => categoria.id === form.categoria_veiculo_id)?.nome
            : 'Categoria do Veículo'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={globalStyles.selectButton} onPress={() => setModalVisible('marca_veiculo_id')}>
        <Text style={globalStyles.selectButtonText}>
          {form.marca_veiculo_id
            ? marcas.find((marca) => marca.id === form.marca_veiculo_id)?.nome
            : 'Marca do Veículo'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={globalStyles.selectButton} onPress={() => setModalVisible('modelo_veiculo_id')}>
        <Text style={globalStyles.selectButtonText}>
          {form.modelo_veiculo_id
            ? modelos.find((modelo) => modelo.id === form.modelo_veiculo_id)?.nome
            : 'Selecione o Modelo do Veículo'}
        </Text>
      </TouchableOpacity>

      {renderModal(filiais, 'filial_id', (filial) => filial.nome)}

      {renderModal(categorias, 'categoria_veiculo_id')}
      {renderModal(tipos, 'tipo_veiculo_id')}
      {renderModal(marcas, 'marca_veiculo_id')}
      {renderModal(modelos, 'modelo_veiculo_id')}
      {renderModal(empresas, 'empresa_id')}

      <TouchableOpacity style={globalStyles.button} onPress={handleSubmit}>
        <Text style={globalStyles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
