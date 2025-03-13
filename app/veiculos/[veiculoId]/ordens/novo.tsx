// frontend/app/veiculos/[veiculoId]/ordens/novo.tsx
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { Button } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import axios from 'axios';
import { API_URL } from '../../../../config';

export default function NovaOrdem() {
    const [descricao, setDescricao] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { veiculoId } = useLocalSearchParams();

    const handleSave = async () => {
        if (!descricao.trim()) {
            Alert.alert('Erro', 'A descrição não pode estar vazia.');
            return;
        }

        try {
            setLoading(true);
            const token = await AsyncStorage.getItem('token');
            if (!token) throw new Error('Token não encontrado.');

            const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

            await axios.post(
                `${API_URL}/api/veiculos/${veiculoId}/ordens`,
                { descricao },
                { headers }
            );

            Alert.alert('Sucesso', 'Ordem de serviço criada com sucesso.');

            // ✅ Corrigindo a navegação para evitar o erro TS2820
            router.push({
                pathname: '/veiculos/[veiculoId]/ordens',
                params: { veiculoId: String(veiculoId) },
            });

        } catch (error) {
            console.error('Erro ao criar ordem de serviço:', error);
            Alert.alert('Erro', 'Não foi possível criar a ordem de serviço.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#007bff" />
                <Text>Salvando...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Nova Ordem de Serviço</Text>
            <TextInput
                style={styles.textInput}
                placeholder="Descrição da ordem de serviço"
                value={descricao}
                onChangeText={setDescricao}
            />
            <Button title="Salvar" buttonStyle={styles.saveButton} onPress={handleSave} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: '#f8f9fa' },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, color: '#333' },
    textInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 6,
        marginBottom: 16,
        backgroundColor: '#ffffff',
    },
    saveButton: { backgroundColor: '#007bff' },
});
