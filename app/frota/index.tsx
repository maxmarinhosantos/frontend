// frontend/app/frota/index.tsx - Painel para gestão da frota
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Ícones
import { useRouter } from 'expo-router';
import { globalStyles } from '../../constants/styles'; // ✅ Importando estilos globais
import { colors } from '../../constants/styles'; // ✅ Importando as cores globais

export default function FrotaMenu() {
  const router = useRouter(); // Controle de navegação

  /**
   * Função para navegar para uma seção específica.
   */
  const navigateToSection = (section: string) => {
    switch (section) {
      case 'Marca':
        router.push('/marcas');
        break;
      case 'Modelo':
        router.push('/modelos');
        break;
      case 'Grupo de Ítens':
        router.push('/grupos-itens-serie');
        break;
      case 'Itens Série':
        router.push('/itens-serie');
        break;
      case 'Veiculos':
        router.push('/veiculos');
        break;
      default:
        alert('Seção não encontrada.');
    }
  };

  return (
    <ScrollView style={globalStyles.container}>
      <Text style={globalStyles.title}>Gestão da Frota</Text>
      <Text style={globalStyles.subtitle}>Selecione a categoria desejada</Text>

      <View style={globalStyles.menuContainer}>
        {[
          { label: 'Marca', icon: 'pricetag-outline' },
          { label: 'Modelo', icon: 'car-sport-outline' },
          { label: 'Grupo de Ítens', icon: 'list-outline' },
          { label: 'Itens Série', icon: 'list-outline' },
          { label: 'Veiculos', icon: 'car-outline' },
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
