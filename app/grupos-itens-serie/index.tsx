// frontend/app/grupo-itens-serie/index.tsx - Lista os grupo de itens de série cadastrados
import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { Text, Card, Icon, Button } from '@rneui/themed';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { API_URL } from "../../config";
import { fetchToken } from "../../utils/auth";


interface GrupoItemSerie {
  id: string;
  grupo: string;
  itens: { id: string; item: string }[]; // Adicionado para itens dentro do grupo
}

export default function ListaGruposItensSerie() {
  const [grupos, setGrupos] = useState<GrupoItemSerie[]>([]);
  const [filteredGrupos, setFilteredGrupos] = useState<GrupoItemSerie[]>([]);
  const [search, setSearch] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchGruposItensSerie = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        // Faz o GET para obter grupos com itens associados
        const response = await axios.get(
          `${API_URL}/api/grupos-itens-serie`,
          { headers }
        );

        // Atualiza os estados com os dados recebidos
        setGrupos(response.data);
        setFilteredGrupos(response.data);
      } catch (error) {
        console.error('Erro ao buscar grupos de itens de série:', error);
        Alert.alert(
          'Erro',
          'Não foi possível carregar os grupos de itens de série.'
        );
      }
    };

    fetchGruposItensSerie();
  }, []);

  const handleSearch = (text: string) => {
    setSearch(text);
    setFilteredGrupos(
      text.trim()
        ? grupos.filter((grupo) =>
            grupo.grupo.toLowerCase().includes(text.toLowerCase())
          )
        : grupos
    );
  };

  const handleNavigateToAssociar = (grupoId: string, grupoNome: string) => {
    router.push({
      pathname: '/grupos-itens-serie/associar',
      params: { grupoId, grupoNome },
    });
  };

  const renderItem = ({ item }: { item: GrupoItemSerie }) => (
    <Card containerStyle={styles.card}>
      <View style={styles.cardHeader}>
        <Icon name="layers" type="material-community" size={20} color="#007bff" />
        <Text style={styles.cardTitle}>{item.grupo}</Text>
      </View>

      {/* Lista os itens do grupo */}
      <ScrollView style={styles.itensList}>
        {item.itens && item.itens.length > 0 ? (
          item.itens.map((it) => (
            <View key={it.id} style={styles.itemContainer}>
              <Icon name="circle" type="font-awesome" size={10} color="#007bff" />
              <Text style={styles.itemText}>{it.item}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>Sem itens neste grupo.</Text>
        )}
      </ScrollView>

      <Button
        title="Associar Itens"
        onPress={() => handleNavigateToAssociar(item.id, item.grupo)}
        buttonStyle={styles.associarButton}
      />
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TextInput
          style={styles.input}
          placeholder="Filtrar grupos de itens de série"
          value={search}
          onChangeText={handleSearch}
        />
        <TouchableOpacity
          style={styles.addButton}
          onPress={() =>
            Alert.alert('Adicionar Novo Grupo', 'Funcionalidade ainda não implementada.')
          }
        >
          <Text style={styles.addButtonText}>+ Grupo</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredGrupos}
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
  associarButton: { backgroundColor: '#007bff', marginTop: 10 },
  itensList: { marginTop: 10, maxHeight: 100 },
  itemContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 4 },
  itemText: { marginLeft: 10, fontSize: 14, color: '#333' },
  emptyText: { fontSize: 14, color: '#6c757d', fontStyle: 'italic' },
});
