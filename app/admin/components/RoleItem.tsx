//frontend/app/admin/components/RoleItem.tsx
import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Role } from '../PermissionsManagement'; // 🔹 Removida a importação de 'Permission'
import PermissionItem from './PermissionItem';

interface RoleItemProps {
    role: Role;
    onAddPermission: (roleId: string) => void;
    onCopyPermissions: (fromRoleId: string) => void;
    onRemovePermission: (roleId: string, permissionId: string) => void;
}

export default function RoleItem({
    role,
    onAddPermission,
    onCopyPermissions,
    onRemovePermission,
}: RoleItemProps) {
    return (
        <View style={styles.roleItem}>
            <Text style={styles.roleName}>{role.role_name}</Text>
            <FlatList
                data={role.permissions}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <PermissionItem
                        permission={item}
                        onRemove={() => onRemovePermission(role.role_id, item.id)}
                    />
                )}
            />
            <View style={styles.actionsContainer}>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => onAddPermission(role.role_id)}
                >
                    <Text style={styles.buttonText}>Adicionar Permissão</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.copyButton}
                    onPress={() => onCopyPermissions(role.role_id)}
                >
                    <Text style={styles.buttonText}>Copiar Permissões</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    roleItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderColor: '#ccc',
        marginBottom: 10,
    },
    roleName: {
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 10,
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    addButton: {
        backgroundColor: 'green',
        padding: 8,
        borderRadius: 5,
        alignItems: 'center',
    },
    copyButton: {
        backgroundColor: 'blue',
        padding: 8,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});
