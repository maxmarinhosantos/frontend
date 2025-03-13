//frontend/app/veiculos/[veiculoId]/checklists.tsx
//Busca os checklists do veículo na API GET /api/veiculos/{veiculoId}/checklists.
// Exibe um ActivityIndicator enquanto carrega.
// Se houver checklists, mostra uma lista (FlatList):
// Clicando em um item, navega para os detalhes do checklist (/checklist/{id}).
// Se não houver checklists, exibe a mensagem "Nenhum checklist encontrado.".

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Icon } from 'react-native-elements';
import { API_URL } from '../../../config';

interface Checklist {
    id: string;
    descricao: string;
    status: string;
    created_at: string;
}

export default function Checklists() {
    const [loading, setLoading] = useState(true);
    const [checklists, setChecklists] = useState<Checklist[]>([]);
    const router = useRouter();
    const { veiculoId } = useLocalSearchParams();

    useEffect(() => {
        const fetchChecklists = async () => {
            try {
                setLoading(true);
                const token = await AsyncStorage.getItem('token');
                if (!token) throw new Error('Token não encontrado.');

                const headers = { Authorization: `Bearer ${token}` };

                const response = await axios.get(`${API_URL}/api/veiculos/${veiculoId}/checklists`, { headers });
                setChecklists(response.data.data);
            } catch (error) {
                console.error('Erro ao carregar checklists:', error);
                Alert.alert('Erro', 'Não foi possível carregar os checklists.');
            } finally {
                setLoading(false);
            }
        };

        fetchChecklists();
    }, [veiculoId]);

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#007bff" />
                <Text>Carregando checklists...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Checklists do Veículo</Text>

            {checklists.length === 0 ? (
                <Text style={styles.emptyText}>Nenhum checklist encontrado.</Text>
            ) : (
                <FlatList
                    data={checklists}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.checklistItem}
                            onPress={() =>
                                router.push({
                                    pathname: "/checklist/[id]",
                                    params: { id: item.id },
                                })
                            }
                        >
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Icon name="check-circle" type="material" color="#007bff" containerStyle={{ marginRight: 10 }} />
                                <View>
                                    <Text style={styles.checklistText}>{item.descricao || 'Checklist sem descrição'}</Text>
                                    <Text style={styles.statusText}>{item.status}</Text>
                                    <Text style={styles.dateText}>Criado em: {new Date(item.created_at).toLocaleDateString()}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: '#f8f9fa' },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, color: '#333' },
    emptyText: { fontSize: 16, fontStyle: 'italic', textAlign: 'center', marginTop: 20, color: '#666' },
    checklistItem: {
        padding: 15,
        backgroundColor: '#fff',
        borderRadius: 6,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    checklistText: { fontSize: 16, fontWeight: 'bold', color: '#37474f' },
    statusText: { fontSize: 14, color: '#007bff', marginTop: 4 },
    dateText: { fontSize: 12, color: '#777', marginTop: 2 },
});
