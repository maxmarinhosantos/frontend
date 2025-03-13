//frontend/app/modelos/[modeloId]/itens-serie.tsx
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { Text, Button, Input } from '@rneui/themed';
import DropDownPicker from 'react-native-dropdown-picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams } from 'expo-router';
import { API_URL } from 'config';
import { fetchToken } from "../../../utils/auth";


interface ItemSerie {
  id?: string;
  grupo: string;
  item: string;
}

interface GrupoItemSerie {
  label: string; // Nome do grupo exibido no dropdown
  value: string; // ID do grupo enviado ao backend
}

interface Grupo {
  label: string;
  value: string;
}

export default function ItensSerie() {
  const [itensSerie, setItensSerie] = useState<ItemSerie[]>([]);
  const [gruposDisponiveis, setGruposDisponiveis] = useState<GrupoItemSerie[]>([]);
  const [grupoSelecionado, setGrupoSelecionado] = useState<string | null>(null);
  const [novoItem, setNovoItem] = useState('');

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const { modeloId } = useLocalSearchParams();

  useEffect(() => {
    const fetchDadosIniciais = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) throw new Error('Token não encontrado.');

        const headers = { Authorization: `Bearer ${token}` };

        const responseItens = await axios.get(`${API_URL}/api/veiculos-modelos/${modeloId}`, { headers });
        setItensSerie(responseItens.data.itens || []);

        const responseGrupos = await axios.get(`${API_URL}/api/veiculos-modelos/grupos`, { headers });
        setGruposDisponiveis(responseGrupos.data.map((grupo: Grupo) => ({ label: grupo.label, value: grupo.value })));
      } catch (error) {
        console.error('Erro ao buscar dados iniciais:', error);
        Alert.alert('Erro', 'Não foi possível carregar os dados.');
      }
    };

    fetchDadosIniciais();
  }, [modeloId]);

  const handleAddItem = async () => {
    try {
      if (!grupoSelecionado || !novoItem.trim()) {
        Alert.alert('Erro', 'Os campos Grupo e Item são obrigatórios.');
        return;
      }

      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('Token não encontrado.');

      const headers = { Authorization: `Bearer ${token}` };
      await axios.post(`${API_URL}/api/veiculos-modelos/${modeloId}/itens-serie`, { grupoId: grupoSelecionado, item: novoItem }, { headers });

      setItensSerie((prev) => [...prev, { grupo: gruposDisponiveis.find((g) => g.value === grupoSelecionado)?.label || '', item: novoItem }]);
      setGrupoSelecionado(null);
      setNovoItem('');
    } catch (error) {
      console.error('Erro ao adicionar item:', error);
      Alert.alert('Erro', 'Não foi possível adicionar o item.');
    }
  };

  return (
    <View style={styles.container}>
      <Text h4 style={styles.title}>Gerenciar Itens</Text>
      <FlatList
        data={itensSerie}
        keyExtractor={(item) => `${item.grupo}-${item.item}`}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text style={styles.itemTitle}>{item.item}</Text>
            <Text style={styles.itemSubtitle}>{item.grupo}</Text>
          </View>
        )}
      />
      <DropDownPicker
        open={dropdownOpen}
        value={grupoSelecionado}
        items={gruposDisponiveis}
        setOpen={setDropdownOpen}
        setValue={setGrupoSelecionado}
        placeholder="Selecione um Grupo"
        containerStyle={styles.dropdownContainer}
        style={styles.dropdown}
      />
      <Input
        placeholder="Novo Item"
        value={novoItem}
        onChangeText={setNovoItem}
        containerStyle={styles.inputContainer}
      />
      <Button title="Adicionar Item" onPress={handleAddItem} buttonStyle={styles.addButton} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  listItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  itemSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  dropdownContainer: {
    marginBottom: 20,
  },
  dropdown: {
    backgroundColor: '#fff',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ced4da',
  },
  inputContainer: {
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: '#007bff',
    borderRadius: 6,
    paddingVertical: 10,
    alignItems: 'center',
  },
});

