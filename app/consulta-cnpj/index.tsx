//frontend/app/consulta-cnpj/index.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  RefreshControl,
  FlatList,
  Text
} from 'react-native';
import { Icon, Button, Divider } from 'react-native-elements';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../../config';
import { globalStyles } from '../../constants/styles';
import { useRouter } from 'expo-router';
import { format } from 'date-fns';

interface CNPJConsulta {
  id: number;
  cnpj: string;
  razao_social?: string;
  nome_fantasia?: string;
  situacao?: string;
  inscricao_estadual?: string;
  data_consulta: string;
  sucesso: boolean;
}

interface FilaStatus {
  tamanho: number;
  processando: boolean;
  proximos: {
    cnpj: string;
    tentativas: number;
    ultima_consulta?: string;
  }[];
}

const formatarCNPJ = (cnpj: string) => {
  // Remove caracteres não numéricos
  const apenasNumeros = cnpj.replace(/[^\d]/g, '');
  
  // Aplica a máscara XX.XXX.XXX/XXXX-XX
  if (apenasNumeros.length === 14) {
    return apenasNumeros.replace(
      /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
      '$1.$2.$3/$4-$5'
    );
  }
  
  // Se não tiver 14 dígitos, retorna o número original
  return apenasNumeros;
};

export default function ConsultaCNPJ() {
  const router = useRouter();
  const [cnpj, setCNPJ] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [consultas, setConsultas] = useState<CNPJConsulta[]>([]);
  const [filaStatus, setFilaStatus] = useState<FilaStatus | null>(null);
  
  // Carregar consultas e status da fila ao iniciar
  useEffect(() => {
    carregarConsultas();
    carregarStatusFila();
    
    // Atualiza o status da fila a cada 10 segundos
    const interval = setInterval(() => {
      carregarStatusFila();
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Carregar resultados das consultas anteriores
  const carregarConsultas = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      
      if (!token) {
        Alert.alert('Erro', 'Você precisa estar logado para acessar esta página.');
        router.push('/login');
        return;
      }
      
      const response = await axios.get(`${API_URL}/api/cnpj/consultas`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setConsultas(response.data.data);
      }
    } catch (error) {
      console.error('Erro ao carregar consultas:', error);
      Alert.alert('Erro', 'Não foi possível carregar as consultas anteriores.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  // Carregar status da fila de consulta
  const carregarStatusFila = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      
      if (!token) return;
      
      const response = await axios.get(`${API_URL}/api/cnpj/fila/status`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setFilaStatus(response.data.data);
      }
    } catch (error) {
      console.error('Erro ao carregar status da fila:', error);
    }
  };
  
  // Adicionar CNPJ à fila de consulta
  const adicionarCNPJNaFila = async () => {
    try {
      if (!cnpj || cnpj.replace(/[^\d]/g, '').length !== 14) {
        Alert.alert('Erro', 'CNPJ inválido. Informe um CNPJ com 14 dígitos.');
        return;
      }
      
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      
      if (!token) {
        Alert.alert('Erro', 'Você precisa estar logado para realizar consultas.');
        router.push('/login');
        return;
      }
      
      const response = await axios.post(
        `${API_URL}/api/cnpj/consulta`,
        { cnpj: cnpj.replace(/[^\d]/g, '') },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        Alert.alert('Sucesso', 'CNPJ adicionado à fila de consulta com sucesso!');
        setCNPJ('');
        carregarStatusFila();
      } else {
        Alert.alert('Erro', response.data.message || 'Erro ao adicionar CNPJ à fila.');
      }
    } catch (error) {
      console.error('Erro ao adicionar CNPJ na fila:', error);
      Alert.alert('Erro', 'Não foi possível adicionar o CNPJ à fila de consulta.');
    } finally {
      setLoading(false);
    }
  };
  
  // Atualizar dados
  const onRefresh = () => {
    setRefreshing(true);
    Promise.all([carregarConsultas(), carregarStatusFila()]).finally(() => {
      setRefreshing(false);
    });
  };
  
  // Formatar a data para exibição
  const formatarData = (dataString: string) => {
    try {
      const data = new Date(dataString);
      return format(data, 'dd/MM/yyyy HH:mm:ss');
    } catch (error) {
      return dataString;
    }
  };
  
  // Renderiza um item da lista de consultas
  const renderConsulta = ({ item }: { item: CNPJConsulta }) => (
    <View style={styles.consultaCard}>
      <View style={styles.consultaHeader}>
        <Text style={styles.cnpjText}>{formatarCNPJ(item.cnpj)}</Text>
        <View style={[
          styles.statusBadge,
          { backgroundColor: item.sucesso ? '#27ae60' : '#e74c3c' }
        ]}>
          <Text style={styles.statusText}>{item.sucesso ? 'Sucesso' : 'Falha'}</Text>
        </View>
      </View>
      
      <Divider style={{ marginVertical: 8 }} />
      
      {item.razao_social && (
        <Text style={styles.infoText}>
          <Text style={styles.infoLabel}>Razão Social: </Text>
          {item.razao_social}
        </Text>
      )}
      
      {item.nome_fantasia && (
        <Text style={styles.infoText}>
          <Text style={styles.infoLabel}>Nome Fantasia: </Text>
          {item.nome_fantasia}
        </Text>
      )}
      
      {item.inscricao_estadual && (
        <Text style={styles.infoText}>
          <Text style={styles.infoLabel}>Inscrição Estadual: </Text>
          {item.inscricao_estadual}
        </Text>
      )}
      
      {item.situacao && (
        <Text style={styles.infoText}>
          <Text style={styles.infoLabel}>Situação: </Text>
          {item.situacao}
        </Text>
      )}
      
      <Text style={styles.dataText}>
        Consultado em: {formatarData(item.data_consulta)}
      </Text>
    </View>
  );
  
  return (
    <View style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Consulta de CNPJ</Text>
      </View>
      
      {/* Formulário de consulta */}
      <View style={styles.formContainer}>
        <Text style={styles.formLabel}>Digite o CNPJ para consultar:</Text>
        <TextInput
          style={styles.input}
          placeholder="XX.XXX.XXX/XXXX-XX"
          value={cnpj}
          onChangeText={(texto) => setCNPJ(texto)}
          keyboardType="numeric"
        />
        <Button
          title="Adicionar CNPJ à Fila"
          icon={{ name: 'search', type: 'material', color: 'white', size: 20 }}
          buttonStyle={styles.buttonConsulta}
          onPress={adicionarCNPJNaFila}
          loading={loading}
          disabled={loading}
        />
      </View>
      
      {/* Status da fila */}
      {filaStatus && (
        <View style={styles.filaStatusContainer}>
          <Text style={styles.filaTitle}>Status da Fila</Text>
          <Text style={styles.filaInfo}>
            Na fila: {filaStatus.tamanho} CNPJ(s)
          </Text>
          <Text style={styles.filaInfo}>
            Processando: {filaStatus.processando ? 'Sim' : 'Não'}
          </Text>
          
          {filaStatus.proximos && filaStatus.proximos.length > 0 && (
            <>
              <Text style={styles.filaSubtitle}>Próximos na fila:</Text>
              {filaStatus.proximos.map((item, index) => (
                <View key={index} style={styles.filaItem}>
                  <Text>{formatarCNPJ(item.cnpj)} (Tentativas: {item.tentativas})</Text>
                </View>
              ))}
            </>
          )}
        </View>
      )}
      
      {/* Lista de consultas */}
      <View style={styles.listContainer}>
        <Text style={styles.listTitle}>Consultas Recentes</Text>
        {loading && !refreshing ? (
          <ActivityIndicator size="large" color="#007bff" style={{ marginTop: 20 }} />
        ) : (
          <FlatList
            data={consultas}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderConsulta}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ListEmptyComponent={
              <Text style={styles.emptyText}>Nenhuma consulta realizada.</Text>
            }
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#ffffff',
    padding: 15,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e4e8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  formContainer: {
    backgroundColor: '#ffffff',
    padding: 15,
    margin: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 10,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
    marginBottom: 15,
  },
  buttonConsulta: {
    backgroundColor: '#007bff',
    borderRadius: 6,
    paddingVertical: 12,
  },
  filaStatusContainer: {
    backgroundColor: '#ffffff',
    padding: 15,
    margin: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  filaTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  filaInfo: {
    fontSize: 16,
    marginBottom: 5,
    color: '#555',
  },
  filaSubtitle: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 10,
    marginBottom: 5,
    color: '#555',
  },
  filaItem: {
    backgroundColor: '#f1f3f5',
    padding: 10,
    borderRadius: 6,
    marginBottom: 5,
  },
  listContainer: {
    flex: 1,
    padding: 10,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    paddingLeft: 5,
  },
  consultaCard: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  consultaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cnpjText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  infoText: {
    fontSize: 14,
    marginBottom: 5,
    color: '#555',
  },
  infoLabel: {
    fontWeight: 'bold',
    color: '#333',
  },
  dataText: {
    fontSize: 12,
    color: '#888',
    marginTop: 8,
    textAlign: 'right',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
    marginTop: 30,
  },
});