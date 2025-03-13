// frontend/app/activate/[param].tsx
import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import { API_URL } from 'config';
import { fetchToken } from '../../utils/auth';
import { globalStyles } from '../../constants/styles';


export default function ActivateHandler() {
  const { param } = useLocalSearchParams<{ param: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const activateAccount = async () => {
      if (!param) {
        setMessage('Token inválido.');
        setSuccess(false);
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${API_URL}/api/auth/activate/${param}`);
        setMessage(response.data.message || 'Conta ativada com sucesso!');
        setSuccess(true);
      } catch (error: any) {
        setMessage(error.response?.data?.message || 'Erro ao ativar a conta.');
        setSuccess(false);
      } finally {
        setLoading(false);
      }
    };
    activateAccount();
  }, [param]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.message, success ? styles.success : styles.error]}>{message}</Text>
      {success ? (
        <Button
          title="Ir para Login"
          onPress={() => router.replace(`/login?message=${encodeURIComponent('Conta ativada com sucesso!')}`)}
        />
      ) : (
        <Button title="Tentar Novamente" onPress={() => router.replace('/register')} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  message: { fontSize: 18, marginBottom: 20, textAlign: 'center' },
  success: { color: 'green' },
  error: { color: 'red' },
});
