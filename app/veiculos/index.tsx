//frontend/app/veiculos/index.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Alert,
  FlatList,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { Text, Icon, Button, Divider } from 'react-native-elements';
import { Badge } from 'react-native-paper'; // ✅ Importando o Badge
import { useRouter } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../../config';
import { globalStyles } from '../../constants/styles';

interface Veiculo {
  id: string;
  num_frota: string;
  placa: string;
  tipo_nome: string;
  modelo_nome: string;
  ano: string;
}

interface OrdemServico {
  id: string;
  veiculo_id: string;
  status: string;
}


export default function Veiculos() {
  const router = useRouter();
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [filteredVeiculos, setFilteredVeiculos] = useState<Veiculo[]>([]);
  const [osPendentes, setOsPendentes] = useState<Record<string, number>>({});
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  // 🔹 Buscar lista de veículos
  const fetchVeiculos = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Erro', 'Token não encontrado.');
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get(`${API_URL}/api/veiculos`, { headers });

      if (response.data && Array.isArray(response.data.data)) {
        setVeiculos(response.data.data);
        setFilteredVeiculos(response.data.data);
      } else {
        throw new Error('Dados inesperados da API.');
      }
    } catch (error) {
      console.error('Erro ao buscar veículos:', error);
      Alert.alert('Erro', 'Não foi possível carregar os veículos.');
    } finally {
      setLoading(false);
    }
  };




  // 🔹 Buscar O.S. pendentes (status = 'aberta')
  const fetchOsPendentes = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) return;

      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get(`${API_URL}/api/ordens/abertas`, { headers });

      console.log('📌 Resposta da API O.S.:', response.data.data); // ✅ Verificar resposta

      if (response.data && Array.isArray(response.data.data)) {
        const osPorVeiculo = response.data.data.reduce((acc: Record<string, number>, os: OrdemServico) => {
          if (!os.veiculo_id) {
            console.warn('⚠️ O.S. sem veiculo_id detectada:', os);
            return acc;
          }
          acc[os.veiculo_id] = (acc[os.veiculo_id] || 0) + 1;
          return acc;
        }, {});

        console.log('📌 O.S. pendentes por veículo:', osPorVeiculo); // ✅ Verificar estrutura antes de atualizar estado
        setOsPendentes(osPorVeiculo);
      }
    } catch (error) {
      console.error('❌ Erro ao buscar O.S. pendentes:', error);
    }
  };








  // 🔹 Executar busca inicial e configurar atualização periódica
  useEffect(() => {
    fetchVeiculos();
    fetchOsPendentes();

    // Atualiza as O.S. pendentes a cada 60 segundos
    const interval = setInterval(fetchOsPendentes, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (text: string) => {
    setSearch(text);
    const filtered = veiculos.filter(
      (veiculo) =>
        veiculo.num_frota.toLowerCase().includes(text.toLowerCase()) ||
        veiculo.placa.toLowerCase().includes(text.toLowerCase()) ||
        veiculo.tipo_nome.toLowerCase().includes(text.toLowerCase()) ||
        veiculo.modelo_nome.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredVeiculos(filtered);
  };

  const renderItem = ({ item }: { item: Veiculo }) => {
    const osCount = osPendentes[item.id] || 0; // Número de O.S. abertas
    console.log(`📌 O.S. pendentes para veículo ${item.num_frota} (${item.placa}):`, osCount); // ✅ Debug








    return (
      <View style={globalStyles.card}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Icon name="directions-car" type="material" color="#007bff" containerStyle={{ marginRight: 10 }} />
          <View style={{ flex: 1 }}>
            <Text style={globalStyles.title}>{`Frota: ${item.num_frota}`} - {item.placa}</Text>
            <Text>{item.tipo_nome || 'Não informado'} - {`Modelo: ${item.modelo_nome || 'Não informado'}`} - {`Ano: ${item.ano}`}</Text>
          </View>
        </View>
        <View style={globalStyles.buttonContainer}>
          <Button
            title="Criar Checklist"
            icon={{ name: 'add-circle-outline', type: 'material', size: 20, color: 'white' }}
            onPress={() => router.push(`/checklist/novo?veiculoId=${item.id}`)}
            buttonStyle={globalStyles.createButton}
          />
          <Button
            title="Checklists"
            icon={{ name: 'fact-check', type: 'material', size: 20, color: 'white' }}
            onPress={() => router.push(`/veiculos/${item.id}/checklists`)}
            buttonStyle={globalStyles.viewChecklistButton}
          />
          <TouchableOpacity
            style={globalStyles.osButtonContainer}
            onPress={() => router.push(`/veiculos/${item.id}/ordens`)}
          >
            <Button
              title="O.S."
              icon={{ name: 'assignment', type: 'material', size: 20, color: 'white' }}
              buttonStyle={globalStyles.osButton}
            />
            {osCount > 0 && (
              <Badge style={globalStyles.badge} size={18}>{osCount}</Badge>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  };





  return (
    <View style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
      <View style={globalStyles.searchContainer}>
        <TextInput
          placeholder="Buscar por Frota, Placa, Tipo ou Modelo"
          onChangeText={handleSearch}
          value={search}
          style={globalStyles.searchInput}
        />
        <Button
          title="+ Novo Veículo"
          onPress={() => router.push('/veiculos/novo')}
          buttonStyle={globalStyles.addButton}
        />
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <FlatList
          data={filteredVeiculos}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <Divider />}
          ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20 }}>Nenhum veículo encontrado.</Text>}
        />
      )}
    </View>
  );
}
