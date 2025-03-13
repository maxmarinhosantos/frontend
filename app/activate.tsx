// frontend/app/activate.tsx - Tela de Ativação de Conta
import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Alert
} from 'react-native';
import axios from 'axios';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { API_URL } from '../config';

export default function ActivateAccount() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const [email, setEmail] = useState<string>(typeof params.email === 'string' ? params.email : '');
    const [activationCode, setActivationCode] = useState('');
    const [loading, setLoading] = useState(false);

    const handleActivate = async () => {
        if (!email || !activationCode) {
            Alert.alert('Erro', 'Preencha todos os campos.');
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(`${API_URL}/api/auth/activate`, {
                email,
                activationCode
            });

            Alert.alert('Sucesso', response.data.message);
            router.replace('/login');
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                Alert.alert('Erro', error.response?.data?.message || 'Erro ao ativar conta.');
            } else if (error instanceof Error) {
                Alert.alert('Erro', error.message);
            } else {
                Alert.alert('Erro', 'Erro desconhecido ao ativar conta.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Ativar Conta</Text>

            <TextInput
                placeholder="Email"
                value={String(email) || ''} // 🔹 Garante que é uma string válida
                onChangeText={setEmail}
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
            />

            <TextInput
                placeholder="Código de Ativação"
                value={activationCode}
                onChangeText={setActivationCode}
                style={styles.input}
                autoCapitalize="none"
            />

            <TouchableOpacity style={[styles.button, loading && styles.disabledButton]} onPress={handleActivate} disabled={loading}>
                {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Ativar Conta</Text>}
            </TouchableOpacity>
        </View>
    );
}

// Estilos da tela
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
        backgroundColor: '#f7f9fc',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    input: {
        width: '100%',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 15,
        marginBottom: 12,
        fontSize: 16,
    },
    button: {
        backgroundColor: '#007bff',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        width: '100%',
        marginVertical: 10,
    },
    disabledButton: {
        backgroundColor: '#ccc',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
