// frontend/app/atendimento/index.tsx - Painel de atendimento de funcionários, clientes, fornecedores e parceiros.
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, globalStyles } from '../../constants/styles';

export default function Atendimento() {
  const router = useRouter();

  const navigateToSection = (section: string) => {
    switch (section) {
      case 'Ticket':
        router.push('/tickets');
        break;
      case 'Degustacao':
      case 'Pendencias':
      case 'Trocas':
        alert('Módulo em desenvolvimento. Aguarde novidades em breve!');
        break;
      default:
        alert('Seção não encontrada.');
    }
  };

  return (
    <ScrollView style={globalStyles.container}>
      {/* Cabeçalho */}
      <View style={globalStyles.header}>
        <Ionicons name="headset-outline" size={50} color={colors.primary} />
        <Text style={globalStyles.title}>Atendimento</Text>
        <Text style={globalStyles.subtitle}>Selecione o tipo de atendimento</Text>
      </View>

      {/* Menu de Opções */}
      <View style={globalStyles.menuContainer}>
        {[
          { label: 'Ticket', icon: 'document-text-outline' },
          { label: 'Degustação', icon: 'wine-outline' },
          { label: 'Pendências', icon: 'alert-circle-outline' },
          { label: 'Trocas', icon: 'repeat-outline' },
        ].map((item, index) => (
          <TouchableOpacity key={index} style={globalStyles.operationButton} onPress={() => navigateToSection(item.label)}>
            <Ionicons name={item.icon as keyof typeof Ionicons.glyphMap} size={30} color={colors.primary} />
            <Text style={globalStyles.operationButtonText}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}
