// frontend/app/modelos/novo.tsx - Formulário de Cadastro de Modelos
import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from 'config';
import { fetchToken } from "../../utils/auth";


export default function NovoModelo() {
    const [nome, setNome] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!nome.trim()) {
            Alert.alert('Erro', 'O nome do modelo é obrigatório.');
            return;
        }

        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                Alert.alert('Erro', 'Token de autenticação não encontrado.');
                return;
            }

            const response = await axios.post(
                `${API_URL}/api/veiculos-modelos`,
                { nome },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.status === 201) {
                Alert.alert('Sucesso', 'Modelo criado com sucesso!');
                setNome('');
            } else {
                throw new Error('Erro ao criar o modelo.');
            }
        } catch (error) {
            console.error('Erro ao criar modelo:', error);
            Alert.alert('Erro', 'Não foi possível criar o modelo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Novo Modelo</Text>
            <TextInput
                style={styles.input}
                placeholder="Nome do Modelo"
                value={nome}
                onChangeText={setNome}
            />
            <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
                {loading ? (
                    <ActivityIndicator color="#FFF" />
                ) : (
                    <Text style={styles.buttonText}>Cadastrar</Text>
                )}
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: '#f8f9fa' },
    title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
    input: { backgroundColor: '#f1f3f5', padding: 12, marginBottom: 16, borderRadius: 6, fontSize: 16 },
    button: { backgroundColor: '#007bff', padding: 12, borderRadius: 6, alignItems: 'center' },
    buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
