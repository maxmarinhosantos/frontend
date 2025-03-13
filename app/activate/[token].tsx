// frontend/app/activate/[token].tsx
import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Button } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import { API_URL } from '../../config';

const ActivateAccount = () => {
    const router = useRouter();
    const { token } = useLocalSearchParams(); // Captura o token da URL
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!token) {
            setError('Token inválido.');
            setLoading(false);
            return;
        }

        const activateAccount = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/auth/activate/${token}`);
                setMessage(response.data.message);
            } catch (err: any) {
                setError(err.response?.data?.message || 'Erro ao ativar conta.');
            } finally {
                setLoading(false);
            }
        };

        activateAccount();
    }, [token]);

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#6200EE" />
            ) : error ? (
                <Text style={styles.errorText}>{error}</Text>
            ) : (
                <>
                    <Text style={styles.successText}>{message}</Text>
                    <Button title="Fazer Login" onPress={() => router.replace('/login')} />
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff',
    },
    successText: {
        fontSize: 16,
        color: 'green',
        textAlign: 'center',
        marginBottom: 20,
    },
    errorText: {
        fontSize: 16,
        color: 'red',
        textAlign: 'center',
        marginBottom: 20,
    },
});

export default ActivateAccount;
