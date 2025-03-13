// frontend/app/operacoes/index.tsx - Painel para gestão de operações e processos
// frontend/app/operacoes/index.tsx - Painel para gestão de operações e processos
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Ícones
import { useRouter } from 'expo-router';
import { globalStyles, typography } from '../../constants/styles';
import { colors } from '../../constants/styles'; // Ajuste o caminho conforme necessário

export default function Operacoes() {
  const router = useRouter();

  const navigateToSection = (section: string) => {
    switch (section) {
      case 'Checklist':
      case 'Caixas Plásticas':
      case 'Transbordo':
      case 'Viagens':
      case 'Orçamentos':
        alert('Módulo em desenvolvimento. Aguarde novidades em breve!');
        break;
      case 'Frota':
        router.push('/frota');
        break;
      default:
        alert('Seção não encontrada.');
    }
  };

  return (
    <ScrollView style={globalStyles.container}>
      <Text style={typography.title}>Gestão de Operações</Text>
      <Text style={typography.subtitle}>Selecione a operação desejada</Text>

      <View style={globalStyles.menuContainer}>
        {[
          { label: 'Caixas Plásticas', icon: 'cube-outline' },
          { label: 'Checklist', icon: 'list-outline' },
          { label: 'Transbordo', icon: 'swap-horizontal-outline' },
          { label: 'Viagens', icon: 'car-outline' },
          { label: 'Frota', icon: 'car-outline' },
          { label: 'Orçamentos', icon: 'cash-outline' },
        ].map((item, index) => (
          <TouchableOpacity
            key={index}
            style={globalStyles.operationButton}
            onPress={() => navigateToSection(item.label)}
          >
            <Ionicons name={item.icon as keyof typeof Ionicons.glyphMap} size={30} color={colors.primary} />

            <Text style={globalStyles.operationButtonText}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}
