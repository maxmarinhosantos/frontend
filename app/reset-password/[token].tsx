// frontend/app/reset-password/[token].tsx - Tela de redefinição de senha aprimorada
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import { handleApiError } from '../../utils/errorHandler';
import { API_URL } from '../../config';
import { colors, globalStyles } from '../../constants/styles';

export default function ResetPasswordScreen() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { token } = useLocalSearchParams(); // 🔹 Pegando o token da URL

  useEffect(() => {
    console.log("🔍 Código recebido na URL:", token);
    if (!token) {
      setError('Código inválido ou expirado.');
    }
  }, [token]);







  const handleResetPassword = async () => {
    setError('');
    setMessage('');

    if (!token) {
      setError('Código inválido ou expirado.');
      return;
    }

    if (!password || !confirmPassword) {
      setError('Preencha todos os campos!');
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem!');
      return;
    }

    if (password.length < 8) {
      setError('A senha deve ter pelo menos 8 caracteres.');
      return;
    }

    try {
      setLoading(true);

      console.log(`🔹 Enviando requisição para: ${API_URL}/api/auth/reset-password/${token}`);

      // 🔹 Aqui corrigimos a URL para incluir o token corretamente
      const response = await axios.post(
        `${API_URL}/api/auth/reset-password/${token}`, // ✅ Agora o token vai na URL
        { password } // ✅ Apenas a senha vai no corpo
      );

      console.log("✅ Resposta do backend:", response.data);

      setMessage(response.data.message || 'Senha redefinida com sucesso.');

      setTimeout(() => {
        router.replace('/login');
      }, 3000);
    } catch (error) {
      console.error("❌ Erro ao redefinir senha:", error);
      setError(handleApiError(error, 'Erro ao redefinir senha.'));
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
          <View style={styles.logoContainer}>
            <Image
              source={require('../../assets/images/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.title}>Redefinir Senha</Text>

          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {message ? (
            <View style={styles.successContainer}>
              <Text style={styles.successText}>{message}</Text>
            </View>
          ) : null}

          <TextInput
            placeholder="Nova Senha"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
          />

          <TextInput
            placeholder="Confirmar Nova Senha"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            style={styles.input}
          />

          <TouchableOpacity
            style={[styles.button, loading && styles.disabledButton]}
            onPress={handleResetPassword}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.buttonText}>Redefinir Senha</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkContainer}
            onPress={() => router.push('/login')}
          >
            <Text style={styles.link}>Voltar para o Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

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
  errorContainer: {
    marginBottom: 15,
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(231, 76, 60, 0.1)',
  },
  errorText: {
    color: colors.danger,
    fontSize: 14,
    textAlign: 'center',
  },
  successContainer: {
    marginBottom: 15,
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(39, 174, 96, 0.1)',
  },
  successText: {
    color: colors.success,
    fontSize: 14,
    textAlign: 'center',
  },
  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.grayLight,
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    color: colors.dark,
  },
  button: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
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
  linkContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  link: {
    color: colors.primary,
    fontSize: 14,
  },
});
