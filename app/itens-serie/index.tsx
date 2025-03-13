// frontend/app/itens-serie/index.tsx - Lista os itens de série cadastrados
import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Text, Card, Icon, Button } from '@rneui/themed';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchToken } from "../../utils/auth";
import { CheckTipo } from '../interfaces/check_tipo';
import { API_URL } from 'config';



interface ItemSerie {
  id: string;
  item: string;
}

export default function ListaItensSerie() {
  const [itens, setItens] = useState<ItemSerie[]>([]);
  const [filteredItens, setFilteredItens] = useState<ItemSerie[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchItensSerie = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };
        const response = await axios.get(`${API_URL}/api/itens-serie`, { headers });
        setItens(response.data);
        setFilteredItens(response.data);
      } catch (error) {
        console.error('Erro ao buscar itens de série:', error);
        Alert.alert('Erro', 'Não foi possível carregar os itens de série.');
      }
    };

    fetchItensSerie();
  }, []);

  const handleSearch = (text: string) => {
    setSearch(text);
    setFilteredItens(
      text.trim()
        ? itens.filter((item) =>
          item.item.toLowerCase().includes(text.toLowerCase())
        )
        : itens
    );
  };

  const renderItem = ({ item }: { item: ItemSerie }) => (
    <Card containerStyle={styles.card}>
      <View style={styles.cardHeader}>
        <Icon name="tag" type="font-awesome" size={20} color="#007bff" />
        <Text style={styles.cardTitle}>{item.item}</Text>
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TextInput
          style={styles.input}
          placeholder="Filtrar itens de série"
          value={search}
          onChangeText={handleSearch}
        />
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>+ Ítem</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredItens}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: '#f8f9fa' },
  header: { flexDirection: 'row', marginBottom: 10 },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ced4da',
    padding: 10,
    fontSize: 14,
  },
  addButton: { backgroundColor: '#28a745', borderRadius: 6, padding: 10, marginLeft: 10 },
  addButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  listContainer: { paddingBottom: 10 },
  card: { marginBottom: 15, borderRadius: 10, padding: 10 },
  cardHeader: { flexDirection: 'row', alignItems: 'center' },
  cardTitle: { fontSize: 18, fontWeight: 'bold', marginLeft: 10 },
});
