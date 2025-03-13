//frontend/app/admin/components/AddPermissionModal.tsx
// frontend/app/admin/components/AddPermissionModal.tsx
import React, { useEffect, useState } from 'react';
import { Modal, View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from 'config';
import { fetchToken } from '../../../utils/auth';
import { globalStyles } from '../../../constants/styles';


interface Permission {
    id: string;
    resource: string;
    action: string;
}

interface AddPermissionModalProps {
    visible: boolean;
    onClose: () => void;
    onAdd: (permissionId: string) => void;
}

export default function AddPermissionModal({ visible, onClose, onAdd }: AddPermissionModalProps) {
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchPermissions = async () => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await axios.get(`${API_URL}/api/admin/permissions`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setPermissions(response.data);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (visible) {
            fetchPermissions();
        }
    }, [visible]);

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Selecione uma Permissão</Text>
                    {loading ? (
                        <ActivityIndicator size="large" color="#6200EE" />
                    ) : (
                        <FlatList
                            data={permissions}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.permissionItem}
                                    onPress={() => {
                                        onAdd(item.id);
                                        onClose();
                                    }}
                                >
                                    <Text>{`${item.resource} - ${item.action}`}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    )}
                    <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                        <Text style={styles.cancelButtonText}>Cancelar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 8,
        width: '80%',
        maxHeight: '80%',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    permissionItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderColor: '#ccc',
    },
    cancelButton: {
        backgroundColor: '#ccc',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        alignItems: 'center',
    },
    cancelButtonText: {
        color: '#333',
        fontSize: 14,
        fontWeight: 'bold',
    },
});
