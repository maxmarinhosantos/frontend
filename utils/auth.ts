//frontend/utils/auth.ts
// Gerenciamento do Token Local
// 📌 Objetivo: Armazenar, recuperar e gerenciar o token JWT.
// Função Principal: Manipular o token de autenticação no dispositivo.
// Usa AsyncStorage (React Native) ou localStorage (Web) para salvar o token do usuário.
// Verifica se o token existe ou expirou e alerta o usuário caso precise se logar novamente. 

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

/**
 * Obtém o token de autenticação armazenado no dispositivo ou navegador.
 * - Usa `AsyncStorage` no React Native.
 * - Usa `localStorage` no navegador (Expo Web).
 * @returns {Promise<string | null>} O token ou `null` se não encontrado.
 */
export const fetchToken = async (): Promise<string | null> => {
    try {
        let token: string | null = null;

        if (typeof window !== "undefined" && window.localStorage) {
            // 🔹 Ambiente Web - LocalStorage
            console.log("🌍 Ambiente Web detectado");
            token = localStorage.getItem("user_token") || localStorage.getItem("token") || null;
        } else {
            // 📱 Ambiente React Native - AsyncStorage
            console.log("📱 Ambiente Mobile detectado");
            token = (await AsyncStorage.getItem("user_token")) || (await AsyncStorage.getItem("token"));
        }

        console.log("🔍 Token recuperado:", token);

        if (!token) {
            console.warn("⚠️ Nenhum token encontrado.");
            Alert.alert("Sessão Expirada", "Faça login novamente.");
            return null;
        }

        return token;
    } catch (error) {
        console.error("❌ Erro ao obter token:", error);
        Alert.alert("Erro", "Falha ao acessar credenciais.");
        return null;
    }

    
}

/**
 * Remove o token de autenticação armazenado no dispositivo.
 */
export const removeToken = async (): Promise<void> => {
    try {
        if (typeof window !== "undefined" && window.localStorage) {
            // Ambiente Web - Remover do localStorage
            console.log("🌍 Removendo token do localStorage...");
            localStorage.removeItem("user_token");
            localStorage.removeItem("token");
        } else {
            // Ambiente React Native - Remover do AsyncStorage
            console.log("📱 Removendo token do AsyncStorage...");
            await AsyncStorage.removeItem("user_token");
            await AsyncStorage.removeItem("token");
        }

        console.log("✅ Token removido com sucesso!");
    } catch (error) {
        console.error("❌ Erro ao remover token:", error);
    }
};



;
