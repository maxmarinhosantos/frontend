// frontend/app/login.tsx - Tela de Login aprimorada
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';
import { API_URL } from '../config';
import { colors, globalStyles } from '../constants/styles';
import { fetchToken } from '../utils/auth'; // 🔹 Importando a função de gerenciamento do token
import AsyncStorage from '@react-native-async-storage/async-storage'; // 🔹 Import corrigido

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 🔹 Verifica se já há um token salvo e redireciona para o dashboard
  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await fetchToken();
        if (token) {
          router.replace('/dashboard');
        }
      } catch (error) {
        console.error('Erro ao recuperar token:', error);
      }
    };
    checkToken();
  }, []);

  // 🔹 Função de login
  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMessage('Preencha todos os campos');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao fazer login.');
      }

      if (!data.token) {
        throw new Error('Token não recebido.');
      }

      await AsyncStorage.setItem('token', data.token); // 🔹 Salva o token corretamente
      router.replace('/dashboard');
    } catch (error: any) {
      setErrorMessage(error.message || 'Erro inesperado. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          {/* Logo */}
          <View style={styles.logoContainer}>
            <Image
              source={require('../assets/images/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.title}>Login</Text>

          {/* Mensagem de erro */}
          {errorMessage && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          )}

          {/* Formulário de login */}
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            placeholder="Senha"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
          />

          {/* Botão principal de login */}
          <TouchableOpacity
            style={[styles.button, loading && styles.disabledButton]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.buttonText}>Entrar</Text>
            )}
          </TouchableOpacity>

          {/* Link para recuperação de senha */}
          <TouchableOpacity onPress={() => router.push('/forgot-password')}>
            <Text style={styles.link}>Esqueci a Senha</Text>
          </TouchableOpacity>

          {/* Botão secundário para registro */}
          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={() => router.push('/register')}
          >
            <Text style={[styles.buttonText, styles.secondaryButtonText]}>Registrar-se</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// 🔹 Estilos
const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 40,
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 200,
    height: 100,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: colors.dark,
  },
  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.grayLight,
    borderRadius: 8,
    padding: 15,
    marginBottom: 12,
    fontSize: 16,
    color: colors.dark,
    width: '100%',
  },
  button: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
    marginVertical: 10,
  },
  disabledButton: {
    backgroundColor: colors.gray,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  secondaryButtonText: {
    color: colors.primary,
  },
  link: {
    color: colors.primary,
    marginTop: 10,
    textAlign: 'center',
    fontSize: 14,
  },
  errorContainer: {
    marginBottom: 12,
    padding: 10,
    backgroundColor: 'rgba(231, 76, 60, 0.1)',
    borderRadius: 8,
  },
  errorText: {
    color: colors.danger,
    fontSize: 14,
    textAlign: 'center',
  },
});
