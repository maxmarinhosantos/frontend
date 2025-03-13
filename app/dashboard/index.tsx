// frontend/app/dashboard/index.tsx - Painel Inicial padrão para usuários aguardando aprovação
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { API_URL } from '../../config';
import { fetchToken } from '../../utils/auth';
import { colors, globalStyles, typography, shadows } from '../../constants/styles';

interface User {
  id: string;
  email: string;
  role_id: string;
  nome: string;
}

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await fetchToken();
        if (!token) {
          console.warn('🔴 Token não encontrado, redirecionando para login...');
          router.replace('/login');
          return;
        }

        const response = await axios.get(`${API_URL}/api/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(response.data);
      } catch (error: any) {
        console.error('Erro ao carregar dashboard:', error);
        setErrorMessage(error.response?.data?.message || 'Erro ao carregar dados.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (errorMessage) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{errorMessage}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => router.replace('/login')}>
          <Text style={styles.buttonText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Erro ao carregar usuário.</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => router.replace('/login')}>
          <Text style={styles.buttonText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <Image
          source={require('../../assets/images/logo.png')}
          style={styles.logo}
        />
        <Text style={styles.welcomeText}>Bem-vindo(a), {user.nome}!</Text>
      </View>

      {/* Opções de Navegação */}
      <View style={styles.menuContainer}>
        <TouchableOpacity style={styles.card} onPress={() => router.push('/atendimento')}>
          <Ionicons name="chatbubbles-outline" size={32} color={colors.primary} />
          <Text style={styles.cardText}>Atendimento</Text>
        </TouchableOpacity>

        {user.role_id === 'fa39ca5f-295f-4166-a791-57190727ef99' && (
          <>
            <TouchableOpacity style={styles.card} onPress={() => router.push('/operacoes')}>
              <Ionicons name="briefcase-outline" size={32} color={colors.success} />
              <Text style={styles.cardText}>Operações</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.card} onPress={() => router.push('/admin/permissions')}>
              <Ionicons name="key-outline" size={32} color={colors.danger} />
              <Text style={styles.cardText}>Permissões</Text>
            </TouchableOpacity>


            <TouchableOpacity style={styles.card} onPress={() => router.push('/consulta-cnpj')}>
              <Ionicons name="key-outline" size={32} color={colors.danger} />
              <Text style={styles.cardText}>Contabilidade</Text>
            </TouchableOpacity>





          </>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  header: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 10,
    resizeMode: 'contain',
  },
  welcomeText: {
    ...typography.title,
    color: colors.dark,
    textAlign: 'center',
  },
  menuContainer: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    height: 140,
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    ...shadows.medium,
  },
  cardText: {
    ...typography.body,
    color: colors.text.primary,
    marginTop: 10,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 14,
    color: colors.danger,
    textAlign: 'center',
    marginBottom: 10,
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 6,
  },
  buttonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '500',
  },
});

export default Dashboard;
