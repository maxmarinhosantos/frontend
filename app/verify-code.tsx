// frontend/app/verify-code.tsx - Tela de Verificação de Código
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import { handleApiError } from '../utils/errorHandler';
import { API_URL } from '../config';
import { colors, globalStyles } from '../constants/styles';

export default function VerifyCodeScreen() {
  const router = useRouter();
  const { email } = useLocalSearchParams(); // Obtém o e-mail passado na navegação
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(''); // 🔹 Estado para exibir o erro na tela

  useEffect(() => {
    console.log("🔍 E-mail recebido na URL:", email);
    if (!email) {
      setErrorMessage("E-mail não encontrado. Retorne e tente novamente.");
    }
  }, [email]);

  const handleVerifyCode = async () => {
    if (!email || !code) {
      setErrorMessage('Preencha todos os campos.');
      return;
    }

    try {
      setLoading(true);
      setErrorMessage('');

      console.log(`🔹 Enviando código para verificação: ${API_URL}/api/auth/verify-code`);

      const response = await axios.post(`${API_URL}/api/auth/verify-code`, {
        email,
        code,
      });

      console.log("✅ Resposta do backend:", response.data);

      // Redireciona para redefinição de senha com o código
      router.push({
        pathname: '/reset-password/[token]',
        params: { token: code },
      });

    } catch (error) {
      console.error("❌ Erro ao verificar código:", error);

      // 🔹 Captura a mensagem real do erro vinda do backend
      const errorMessage = handleApiError(error, 'Código inválido ou expirado.');
      setErrorMessage(errorMessage); // Exibe o erro na tela
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
          <Text style={styles.title}>Verificar Código</Text>

          <Text style={styles.instructions}>
            Digite o código enviado para o seu e-mail ({email}).
          </Text>

          {/* 🔹 Exibição de erro diretamente na tela */}
          {errorMessage ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          ) : null}

          <TextInput
            placeholder="Código de Verificação"
            value={code}
            onChangeText={setCode}
            keyboardType="numeric"
            maxLength={6}
            style={styles.input}
          />

          <TouchableOpacity
            style={[styles.button, loading && styles.disabledButton]}
            onPress={handleVerifyCode}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Verificar Código</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkContainer}
            onPress={() => router.push('/forgot-password')}
          >
            <Text style={styles.link}>Voltar</Text>
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
  errorContainer: {
    backgroundColor: 'rgba(231, 76, 60, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  errorText: {
    color: colors.danger,
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
    textAlign: 'center',
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
