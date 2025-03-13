// frontend/app/forgot-password.tsx - Tela de Esqueci a Senha aprimorada
import React, { useState } from 'react';
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
import axios from 'axios';
import { handleApiError } from '../utils/errorHandler';
import { API_URL } from '../config';
import { colors, globalStyles } from '../constants/styles';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const handleForgotPassword = async () => {
    if (!email) {
      setIsError(true);
      setMessage('Informe seu e-mail!');
      return;
    }

    try {
      setLoading(true);
      setIsError(false);
      setMessage('');

      // Envio de solicitação para o backend
      const response = await axios.post(`${API_URL}/api/auth/forgot-password`, { email });

      // Sucesso
      setMessage(response.data.message || 'Verifique seu e-mail para continuar.');

      // 🔹 Aguarda 2 segundos e redireciona para a tela de verificação de código
      setTimeout(() => {
        router.push({
          pathname: '/verify-code',
          params: { email }
        });
      }, 2000);

    } catch (error) {
      setIsError(true);
      const errorMessage = handleApiError(error, 'Erro ao enviar recuperação de senha.');
      setMessage(errorMessage);
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

          <Text style={styles.title}>Recuperar Senha</Text>

          {/* Mensagem informativa ou erro */}
          {message ? (
            <View style={[
              styles.messageContainer,
              isError ? styles.errorContainer : styles.successContainer
            ]}>
              <Text style={[
                styles.messageText,
                isError ? styles.errorText : styles.successText
              ]}>
                {message}
              </Text>
            </View>
          ) : null}

          <Text style={styles.instructions}>
            Digite seu email para receber instruções de recuperação de senha
          </Text>

          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />

          <TouchableOpacity
            style={[styles.button, loading && styles.disabledButton]}
            onPress={handleForgotPassword}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Enviar</Text>
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

// Estilos
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
  instructions: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    color: colors.grayDark,
  },
  messageContainer: {
    marginBottom: 15,
    padding: 12,
    borderRadius: 8,
  },
  errorContainer: {
    backgroundColor: 'rgba(231, 76, 60, 0.1)',
  },
  successContainer: {
    backgroundColor: 'rgba(39, 174, 96, 0.1)',
  },
  messageText: {
    fontSize: 14,
    textAlign: 'center',
  },
  errorText: {
    color: colors.danger,
  },
  successText: {
    color: colors.success,
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
