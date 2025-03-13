// frontend/app/_layout.tsx - Layout principal do app com logs de debug
import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, ActivityIndicator, TouchableOpacity, Text } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { PaperProvider, MD3LightTheme as DefaultTheme } from 'react-native-paper';
import jwt_decode from 'jwt-decode';
import getAppVersion from '../utils/getAppVersion';
import { fetchToken, removeToken } from '../utils/auth';
import { API_URL } from '../config';

interface DecodedToken {
    id: string;
    role: string;
    email: string;
    name?: string;
    exp: number;
}

const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: '#6200EE',
        accent: '#03DAC5',
    },
};

export default function Layout() {
    return (
        <PaperProvider theme={theme}>
            <AuthHandler />
        </PaperProvider>
    );
}

function AuthHandler() {
    const router = useRouter();
    const [isReady, setIsReady] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    // 🔍 Teste explícito da API no mobile
    useEffect(() => {
        const checkAPI = async () => {
            console.log('🔍 Verificando conexão com API no mobile...');
            console.log('📡 API_URL:', API_URL);
            try {
                const response = await fetch(`${API_URL}/health`);
                const data = await response.json();
                console.log('✅ API responde corretamente:', data);
            } catch (error) {
                console.error('❌ Erro ao conectar na API:', error);
            }
        };
        checkAPI();
    }, []);

    const validateToken = async (token: string): Promise<boolean> => {
        try {
            const decoded = jwt_decode<DecodedToken>(token);
            const currentTime = Math.floor(Date.now() / 1000);
            return decoded.exp >= currentTime;
        } catch (error) {
            console.error('❌ Erro ao decodificar token:', error);
            return false;
        }
    };

    const checkAuth = useCallback(async () => {
        try {
            console.log('🔑 Buscando token...');
            const token = await fetchToken();
            if (!token) throw new Error('Token não encontrado.');
            console.log('✅ Token encontrado:', token);

            const isValid = await validateToken(token);
            console.log(isValid ? '✅ Token válido' : '❌ Token inválido');
            setIsAuthenticated(isValid);
        } catch (error) {
            console.error('❌ Erro ao verificar autenticação:', error);
            setIsAuthenticated(false);
        }
    }, []);

    useEffect(() => {
        const initialize = async () => {
            console.log('🔄 Inicializando autenticação...');
            await checkAuth();
            setIsReady(true);
        };
        initialize();
    }, [checkAuth]);

    useEffect(() => {
        if (!isReady || isAuthenticated === null) return;
        console.log(isAuthenticated ? '✅ Usuário autenticado, indo para Dashboard' : '🔒 Usuário não autenticado, indo para Login');
        router.replace(isAuthenticated ? '/dashboard' : '/login');
    }, [isReady, isAuthenticated, router]);

    if (!isReady) {
        return <LoadingScreen />;
    }

    return <MainLayout />;
}

function MainLayout() {
    const router = useRouter();
    const [userName, setUserName] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserName = async () => {
            try {
                console.log('👤 Buscando nome do usuário...');
                const token = await fetchToken();
                if (token) {
                    const decoded = jwt_decode<DecodedToken>(token);
                    setUserName(decoded.name || 'Usuário');
                    console.log('✅ Usuário identificado:', decoded.name || 'Usuário');
                }
            } catch (error) {
                console.error('❌ Erro ao recuperar nome do usuário:', error);
            }
        };
        fetchUserName();
    }, []);

    const handleLogout = async () => {
        console.log('🚪 Logout realizado. Removendo token...');
        await removeToken();
        router.replace('/login');
    };

    return (
        <View style={styles.container}>
            <Stack
                screenOptions={{
                    headerRight: () => (
                        <View style={styles.headerRightContainer}>
                            <Text style={styles.userName}>{userName}</Text>
                            <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                                <Text style={styles.logoutText}>Sair</Text>
                            </TouchableOpacity>
                        </View>
                    ),
                }}
            >
                <Stack.Screen name="dashboard" options={{ headerTitle: 'Dashboard' }} />
                <Stack.Screen name="login" options={{ headerShown: false }} />
                <Stack.Screen name="admin/permissions" options={{ headerTitle: 'Gerenciamento de Permissões' }} />
            </Stack>
            <View style={styles.footer}>
                <Text style={styles.footerText}>🚀 Synaris | Versão {getAppVersion()}</Text>
            </View>
        </View>
    );
}

function LoadingScreen() {
    return (
        <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#6200EE" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    headerRightContainer: { flexDirection: 'row', alignItems: 'center', marginRight: 15 },
    userName: { color: '#6200EE', fontSize: 16, fontWeight: 'bold', marginRight: 10 },
    logoutButton: { backgroundColor: '#e74c3c', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6 },
    logoutText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
    footer: { padding: 10, backgroundColor: '#f8f9fa', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#ddd', position: 'absolute', bottom: 0, width: '100%' },
    footerText: { fontSize: 12, color: '#6c757d', fontWeight: '500' },
});
