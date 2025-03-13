// frontend/app/modelos/index.tsx - Lista de Modelos com Botão para Inserção
import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import { Text, Card, Button } from '@rneui/themed';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { API_URL } from 'config';
import { fetchToken } from '../../utils/auth';
import { VeiculoModelo } from '../interfaces/veiculo_modelo';
import { globalStyles } from '../../constants/styles';

interface ItemSerie {
  id: string;
  item: string;
}

interface Grupo {
  id: string;
  grupo: string;
  itens: ItemSerie[];
}

type Modelo = VeiculoModelo & { grupos: Grupo[] };

export default function Modelos() {
  const [modelos, setModelos] = useState<Modelo[]>([]);
  const [filteredModelos, setFilteredModelos] = useState<Modelo[]>([]);
  const [search, setSearch] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [novoModelo, setNovoModelo] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchModelos = async () => {
      try {
        const token = await fetchToken();
        console.log("📢 Token obtido no index.tsx:", token); // 🔥 Adicionando log
        if (!token) {
          Alert.alert('Erro', 'Token de autenticação não encontrado.');
          return;
        }

        const headers = { Authorization: `Bearer ${token}` };
        const response = await axios.get(`${API_URL}/api/veiculos/modelos`, { headers });

        if (!Array.isArray(response.data)) {
          console.error('Erro: Resposta inesperada da API:', response.data);
          Alert.alert('Erro', 'Formato de resposta inesperado da API.');
          return;
        }

        const modelosAgrupados = response.data.map((modelo: any) => ({
          id: modelo.id,
          nome: modelo.nome,
          created_at: modelo.created_at,
          empresa_id: modelo.empresa_id,
          filial_id: modelo.filial_id,
          user_id: modelo.user_id,
          grupos: modelo.grupos?.map((grupo: any) => ({
            id: grupo.id,
            grupo: grupo.grupo,
            itens: grupo.itens?.map((item: any) => ({
              id: item.id,
              item: item.item,
            })) || [],
          })) || [],
        }));

        setModelos(modelosAgrupados);
        setFilteredModelos(modelosAgrupados);
      } catch (error) {
        console.error('Erro ao buscar modelos:', error);
        Alert.alert('Erro', 'Não foi possível carregar os modelos.');
      }
    };

    fetchModelos();
  }, []);

  const handleSearch = (text: string) => {
    setSearch(text);
    setFilteredModelos(
      text.trim()
        ? modelos.filter((modelo) =>
          modelo.nome?.toLowerCase().includes(text.toLowerCase())
        )
        : modelos
    );
  };

  const abrirModalNovoModelo = () => {
    setNovoModelo('');
    setModalVisible(true);
  };

  const salvarNovoModelo = async () => {
    if (!novoModelo.trim()) {
      Alert.alert('Erro', 'O nome do modelo é obrigatório.');
      return;
    }

    try {
      const token = await fetchToken();
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.post(
        `${API_URL}/api/veiculos-modelos`,
        { nome: novoModelo },
        { headers }
      );

      const novoModeloData: Modelo = {
        id: response.data.id,
        nome: response.data.nome,
        grupos: [],
      };

      setModelos((prev) => [...prev, novoModeloData]);
      setFilteredModelos((prev) => [...prev, novoModeloData]);
      setModalVisible(false);
      Alert.alert('Sucesso', 'Modelo criado com sucesso!');
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível criar o modelo.');
    }
  };

  const handleNavigateToAssociarGrupo = (modeloId: string, modeloNome?: string) => {
    router.push({
      pathname: '/modelos/associar-grupo',
      params: { modeloId, modeloNome },
    });
  };

  const renderItem = ({ item }: { item: Modelo }) => (
    <Card containerStyle={globalStyles.card}>
      <View style={globalStyles.cardHeader}>
        <Text style={globalStyles.cardTitle}>{item.nome}</Text>
        <Button
          title="Associar Grupo"
          onPress={() => handleNavigateToAssociarGrupo(item.id, item.nome)}
          buttonStyle={globalStyles.associarButton}
        />
      </View>
      <View style={globalStyles.gruposContainer}>
        {item.grupos.map((grupo) => (
          <View key={grupo.id} style={globalStyles.grupoCard}>
            <Text style={globalStyles.groupTitle}>{grupo.grupo}</Text>
            {grupo.itens.length > 0 ? (
              grupo.itens.map((itemSerie) => (
                <Text key={itemSerie.id} style={globalStyles.itemText}>
                  • {itemSerie.item}
                </Text>
              ))
            ) : (
              <Text style={globalStyles.emptyText}>Sem itens neste grupo.</Text>
            )}
          </View>
        ))}
      </View>
    </Card>
  );

  return (
    <View style={globalStyles.container}>
      <View style={globalStyles.header}>


        <TextInput
          style={[globalStyles.input]}
          placeholder="Filtrar por nome do modelo"
          value={search}
          onChangeText={handleSearch}
        />



        <TouchableOpacity style={globalStyles.addModeloButton} onPress={abrirModalNovoModelo}>
          <Text style={globalStyles.addModeloButtonText}>+ Modelo</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={filteredModelos}
        keyExtractor={(item) => item.id} // ✅ Sem necessidade de fallback agora!
        renderItem={renderItem}
        contentContainerStyle={globalStyles.listContainer}
      />
    </View>
  );
}
