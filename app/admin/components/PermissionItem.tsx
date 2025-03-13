// frontend/app/admin/components/PermissionItem.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { Permission } from '../PermissionsManagement';

interface PermissionItemProps {
    permission: Permission;
    onRemove: () => void;
    style?: ViewStyle; // Adicionado suporte para estilos personalizados
}

const PermissionItem: React.FC<PermissionItemProps> = ({ permission, onRemove, style }) => {
    return (
        <View style={[styles.container, style]}>
            <Text style={styles.text}>{`${permission.resource} - ${permission.action}`}</Text>
            <TouchableOpacity onPress={onRemove} style={styles.removeButton}>
                <Text style={styles.removeButtonText}>Remover</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 6,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
        marginVertical: 2,
    },
    text: {
        fontSize: 12,
        color: '#333',
    },
    removeButton: {
        backgroundColor: '#FF4D4D',
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 3,
    },
    removeButtonText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
});

export default PermissionItem;
