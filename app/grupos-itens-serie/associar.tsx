//frontend/app/grupos-itens-serie/associar.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { Text, Button, CheckBox } from '@rneui/themed';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from "../../config";
import { fetchToken } from "../../utils/auth";

interface Grupo {
  id: string;
  grupo: string;
}

interface ItemSerie {
  id: string;
  item: string;
}

export default function AssociarItensGrupos() {
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [itens, setItens] = useState<ItemSerie[]>([]);
  const [selectedGrupo, setSelectedGrupo] = useState<string | null>(null);
  const [selectedItens, setSelectedItens] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        // Carregar grupos
        const gruposResponse = await axios.get(`${API_URL}/api/grupos-itens-serie`, {
          headers,
        });
        setGrupos(gruposResponse.data);

        // Carregar itens
        const itensResponse = await axios.get(`${API_URL}/api/itens-serie`, { headers });
        setItens(itensResponse.data);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        Alert.alert('Erro', 'Não foi possível carregar os dados.');
      }
    };

    fetchData();
  }, []);

  const toggleItemSelecionado = (itemId: string) => {
    setSelectedItens((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    );
  };

  const handleAssociar = async () => {
    if (!selectedGrupo) {
      Alert.alert('Erro', 'Selecione um grupo para associar os itens.');
      return;
    }

    if (selectedItens.length === 0) {
      Alert.alert('Erro', 'Selecione ao menos um item para associar.');
      return;
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      await axios.post(
        `${API_URL}/api/grupos-itens-serie/associar`,
        {
          grupoId: selectedGrupo,
          itemIds: selectedItens,
        },
        { headers }
      );

      Alert.alert('Sucesso', 'Itens associados ao grupo com sucesso!');
      setSelectedItens([]);
      setSelectedGrupo(null);
    } catch (error) {
      console.error('Erro ao associar itens ao grupo:', error);
      Alert.alert('Erro', 'Não foi possível associar os itens ao grupo.');
    } finally {
      setLoading(false);
    }
  };

  const filteredItens = search.trim()
    ? itens.filter((item) => item.item.toLowerCase().includes(search.toLowerCase()))
    : itens;

  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Associar Itens a Grupos</Text>
      </View>

      {/* Filtro e Botão de Associar */}
      <View style={styles.filterContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Filtrar itens"
          value={search}
          onChangeText={setSearch}
        />
        <Button
          title={loading ? <ActivityIndicator color="#FFF" /> : 'Associar'}
          buttonStyle={styles.associarButton}
          onPress={handleAssociar}
          disabled={loading}
        />
      </View>

      <ScrollView style={styles.content}>
        {/* Seleção de Grupos */}
        <Text style={styles.label}>Selecione um Grupo:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.groupList}>
          {grupos.map((grupo) => (
            <TouchableOpacity
              key={grupo.id}
              style={[
                styles.groupButton,
                selectedGrupo === grupo.id ? styles.groupButtonSelected : null,
              ]}
              onPress={() => setSelectedGrupo(grupo.id)}
            >
              <Text style={styles.groupButtonText}>{grupo.grupo}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Lista de Itens */}
        <Text style={styles.label}>Selecione os Itens:</Text>
        {filteredItens.map((item) => (
          <CheckBox
            key={item.id}
            title={item.item}
            checked={selectedItens.includes(item.id)}
            onPress={() => toggleItemSelecionado(item.id)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000000',
    padding: 16,
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#FFF', marginLeft: 16 },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ced4da',
    padding: 10,
    fontSize: 14,
    marginRight: 10,
  },
  associarButton: { backgroundColor: '#28a745', borderRadius: 6, paddingVertical: 10 },
  content: { padding: 16 },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 10 },
  groupList: { flexDirection: 'row', marginBottom: 20 },
  groupButton: {
    backgroundColor: '#000000',
    padding: 12,
    borderRadius: 8,
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#32a202',
  },
  groupButtonSelected: { backgroundColor: '#', borderColor: '#28a745' },
  groupButtonText: { fontSize: 12, fontWeight: 'bold', color: '#FFF' },
});
