// frontend/app/admin/permissions.tsx
import React, { useEffect, useState, useCallback } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    Alert,
    ActivityIndicator,
    TextInput,
    ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import AddPermissionModal from './components/AddPermissionModal';
import { API_URL } from 'config';
import { fetchToken } from '../../utils/auth';
import { globalStyles } from '../../constants/styles';


export interface Permission {
    id: string;
    resource: string;
    action: string;
}

export interface Role {
    role_id: string;
    role_name: string;
    permissions: Permission[];
}

export default function PermissionsManagement() {
    const [roles, setRoles] = useState<Role[]>([]);
    const [filteredRoles, setFilteredRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
    const [roleFilter, setRoleFilter] = useState('');
    const [resourceFilter, setResourceFilter] = useState('');
    const [actionFilter, setActionFilter] = useState('');

    const fetchRoles = async () => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await axios.get(`${API_URL}/api/admin/permissions/roles`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setRoles(response.data);
            setFilteredRoles(response.data);
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível carregar os papéis e permissões.');
            console.error('Erro ao buscar papéis:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddPermission = async (permissionId: string) => {
        if (!selectedRoleId) {
            Alert.alert('Erro', 'Nenhum papel selecionado.');
            return;
        }

        try {
            const token = await AsyncStorage.getItem('token');
            await axios.post(
                `${API_URL}/api/admin/permissions/roles/${selectedRoleId}/permissions`,
                { permissionId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            Alert.alert('Sucesso', 'Permissão adicionada.');
            setModalVisible(false);
            fetchRoles();
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível adicionar a permissão.');
            console.error('Erro ao adicionar permissão:', error);
        }
    };

    const handleRemovePermission = async (roleId: string, permissionId: string) => {
        Alert.alert('Remover Permissão', 'Tem certeza que deseja remover esta permissão?', [
            { text: 'Cancelar', style: 'cancel' },
            {
                text: 'Remover',
                style: 'destructive',
                onPress: async () => {
                    try {
                        const token = await AsyncStorage.getItem('token');
                        await axios.delete(
                            `${API_URL}/api/admin/permissions/roles/${roleId}/permissions/${permissionId}`,
                            { headers: { Authorization: `Bearer ${token}` } }
                        );
                        Alert.alert('Sucesso', 'Permissão removida.');
                        fetchRoles();
                    } catch (error) {
                        Alert.alert('Erro', 'Não foi possível remover a permissão.');
                        console.error('Erro ao remover permissão:', error);
                    }
                },
            },
        ]);
    };

    // 🔹 Encapsulando `handleFilterRoles` para evitar re-renderizações desnecessárias
    const handleFilterRoles = useCallback(() => {
        const filtered = roles.filter((role) => {
            const roleMatches = role.role_name?.toLowerCase().includes(roleFilter.toLowerCase());
            const permissionsFiltered = role.permissions.filter((perm) => {
                const resourceMatches = perm.resource?.toLowerCase().includes(resourceFilter.toLowerCase());
                const actionMatches = perm.action?.toLowerCase().includes(actionFilter.toLowerCase());
                return resourceMatches && actionMatches;
            });
            return roleMatches && permissionsFiltered.length > 0;
        });

        setFilteredRoles(
            filtered.map((role) => ({
                ...role,
                permissions: role.permissions.filter((perm) => {
                    const resourceMatches = perm.resource?.toLowerCase().includes(resourceFilter.toLowerCase());
                    const actionMatches = perm.action?.toLowerCase().includes(actionFilter.toLowerCase());
                    return resourceMatches && actionMatches;
                }),
            }))
        );
    }, [roles, roleFilter, resourceFilter, actionFilter]); // ✅ Agora tem todas as dependências necessárias

    useEffect(() => {
        fetchRoles();
    }, []);

    useEffect(() => {
        handleFilterRoles();
    }, [handleFilterRoles]); // ✅ Agora o ESLint não vai mais reclamar

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#6200EE" />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <TextInput
                style={styles.filterInput}
                placeholder="Filtrar por papel..."
                value={roleFilter}
                onChangeText={setRoleFilter}
            />
            <TextInput
                style={styles.filterInput}
                placeholder="Filtrar por recurso..."
                value={resourceFilter}
                onChangeText={setResourceFilter}
            />
            <TextInput
                style={styles.filterInput}
                placeholder="Filtrar por ação..."
                value={actionFilter}
                onChangeText={setActionFilter}
            />
            <FlatList
                data={filteredRoles}
                keyExtractor={(item) => item.role_id}
                renderItem={({ item }) => (
                    <View style={styles.roleCard}>
                        <Text style={styles.roleTitle}>{item.role_name}</Text>
                    </View>
                )}
            />
            <AddPermissionModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onAdd={handleAddPermission}
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f7f9fc' },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    filterInput: {
        backgroundColor: '#e1e5ea',
        borderRadius: 8,
        margin: 8,
        padding: 8,
        fontSize: 12,
    },
    roleCard: {
        margin: 10,
        padding: 10,
        borderRadius: 8,
        backgroundColor: '#fff',
        elevation: 2,
    },
    roleTitle: { fontSize: 16, fontWeight: 'bold', color: '#003366' },
});
