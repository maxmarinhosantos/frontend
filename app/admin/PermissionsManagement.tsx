// frontend/app/admin/PermissionsManagement.tsx
import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    Alert,
    ActivityIndicator,
    TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import RoleItem from './components/RoleItem';
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
    const [filterText, setFilterText] = useState('');

    const fetchRoles = async () => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await axios.get(`${API_URL}/api/admin/permissions/roles`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setRoles(response.data);
            setFilteredRoles(response.data); // Aplica os dados na lista filtrada inicialmente
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
            console.error('Erro ao adicionar permissão:', error);
            Alert.alert('Erro', 'Não foi possível adicionar a permissão.');
        }
    };

    const handleCopyPermissions = async (fromRoleId: string, toRoleId: string) => {
        try {
            const fromRole = roles.find((role) => role.role_id === fromRoleId);
            if (!fromRole) return;

            const token = await AsyncStorage.getItem('token');
            for (const permission of fromRole.permissions) {
                await axios.post(
                    `${API_URL}/api/admin/permissions/roles/${toRoleId}/permissions`,
                    { permissionId: permission.id },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            }

            Alert.alert('Sucesso', 'Permissões copiadas.');
            fetchRoles();
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível copiar as permissões.');
            console.error('Erro ao copiar permissões:', error);
        }
    };

    const handleFilter = (text: string) => {
        setFilterText(text);
        const filtered = roles.filter((role) =>
            role.role_name.toLowerCase().includes(text.toLowerCase())
        );
        setFilteredRoles(filtered);
    };

    useEffect(() => {
        fetchRoles();
    }, []);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#6200EE" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Gerenciamento de Permissões</Text>
            <TextInput
                style={styles.filterInput}
                placeholder="Filtrar papéis..."
                value={filterText}
                onChangeText={handleFilter}
            />
            <FlatList
                data={filteredRoles}
                keyExtractor={(item) => item.role_id}
                renderItem={({ item }) => (
                    <RoleItem
                        role={item}
                        onAddPermission={(roleId) => {
                            setSelectedRoleId(roleId);
                            setModalVisible(true);
                        }}
                        onCopyPermissions={(fromRoleId) =>
                            handleCopyPermissions(fromRoleId, item.role_id)
                        }
                        onRemovePermission={fetchRoles}
                    />
                )}
            />
            <AddPermissionModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onAdd={handleAddPermission}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    filterInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        marginBottom: 20,
    },
});
