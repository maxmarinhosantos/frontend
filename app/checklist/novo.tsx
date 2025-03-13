// frontend/app/checklist/novo.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Modal,
  TouchableOpacity,
  FlatList,
  Text,
  Alert,
  SafeAreaView,
  StatusBar,
  Platform,
} from "react-native";
import { Icon } from "@rneui/themed";
import { useLocalSearchParams, useRouter } from "expo-router";
import { globalStyles, colors, } from "../../constants/styles";
import axios from "axios";
import { API_URL } from "../../config";
import { fetchToken } from "../../utils/auth";
import { CheckTipo } from "../interfaces/check_tipo";

// Tipos definidos para reuso em outros componentes
interface ChecklistItem {
  id: string;
  item: string;
}

interface ChecklistGroup {
  grupo_nome: string;
  itens: ChecklistItem[];
}

interface VehicleData {
  num_frota: string;
  placa: string;
}

// Componente principal de checklist
export default function NovoChecklist() {
  // Estados do componente
  const [loading, setLoading] = useState(true);
  const [savingData, setSavingData] = useState(false);
  const [checkTipos, setCheckTipos] = useState<CheckTipo[]>([]);
  const [selectedCheckTipo, setSelectedCheckTipo] = useState<CheckTipo | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [checklistGrupos, setChecklistGrupos] = useState<ChecklistGroup[]>([]);
  const [selectedItens, setSelectedItens] = useState<Record<string, { valor: string; descricao?: string }>>({});
  const [vehicleData, setVehicleData] = useState<VehicleData | null>(null);

  // Hooks de navegação e parâmetros
  const router = useRouter();
  const { veiculoId } = useLocalSearchParams();



  
  // Função para salvar checklist
  const handleSave = async () => {
    // Validações
    if (!selectedCheckTipo) {
      Alert.alert("Aviso", "Selecione um tipo de checklist");
      return;
    }

    if (Object.keys(selectedItens).length === 0) {
      Alert.alert("Aviso", "Marque pelo menos um item no checklist");
      return;
    }

    // Verificar se algum item com "problema" não tem descrição
    const problemaSemDescricao = Object.entries(selectedItens).some(
      ([itemId, data]) =>
        data.valor === "problema" && (!data.descricao || data.descricao.trim() === "")
    );

    if (problemaSemDescricao) {
      Alert.alert("Aviso", "Por favor, descreva o problema em todos os itens marcados como 'Problema'");
      return;
    }

    try {
      setSavingData(true);

      // Obter token de autenticação
      const token = await fetchToken();
      if (!token) throw new Error("Token não encontrado");

      // Formatar dados para envio
      const detalhes = Object.entries(selectedItens).map(([itemId, data]) => ({
        item_id: itemId,
        valor: data.valor,
        descricao_problema: data.descricao?.trim() ? data.descricao : null,
      }));

      // Payload corrigido com os nomes esperados pelo backend
      const checklistPayload = {
        veiculoId: veiculoId,
        checkTipoId: selectedCheckTipo.id,
        descricao: null,
        detalhes,
      };

      // Enviar dados para API
      const response = await axios.post(`${API_URL}/api/checklist/novo`, checklistPayload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Extrair número do checklist e da OS da resposta
      const { checklistNumero, osNumero } = response.data;

      // Preparar mensagem de sucesso incluindo os números
      const successMessage = `Checklist #${checklistNumero} criado com sucesso!${osNumero ? `\n\nOrdem de Serviço #${osNumero} gerada automaticamente.` : ''
        }`;

      // Feedback e navegação
      Alert.alert("Sucesso", successMessage);
      router.push(`/veiculos/${veiculoId}/checklists`);
    } catch (error) {
      console.error("❌ Erro ao salvar checklist:", error);
      Alert.alert("Erro", "Não foi possível salvar o checklist. Verifique sua conexão ou tente novamente.");
    } finally {
      setSavingData(false);
    }
  };









  // Carregar dados iniciais
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obter token
        const token = await fetchToken();
        if (!token) {
          setLoading(false);
          return;
        }

        // Buscar tipos de checklist
        const { data: tiposData } = await axios.get(`${API_URL}/api/checklist/tipos`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCheckTipos(tiposData?.data || []);

        // Verificar se temos ID do veículo
        if (veiculoId) {
          // Buscar dados do veículo
          const { data: veiculoData } = await axios.get(`${API_URL}/api/veiculos/${veiculoId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          // Buscar itens de série do veículo
          const { data: itensSerie } = await axios.get(
            `${API_URL}/api/veiculos/${veiculoId}/itens-checklist`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          // Atualizar estados
          setVehicleData(veiculoData?.data || null);
          setChecklistGrupos(itensSerie?.data || []);
        } else {
          console.warn("⚠️ Nenhum ID de veículo encontrado.");
        }
      } catch (error) {
        console.error("❌ Erro ao carregar dados:", error);
        Alert.alert("Erro ao carregar", "Verifique sua conexão ou tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [veiculoId]);

  // Manipular seleção de item
  const handleItemSelection = (itemId: string, valor: string) => {
    setSelectedItens((prev) => ({
      ...prev,
      [itemId]: {
        valor,
        descricao: valor === "problema" ? prev[itemId]?.descricao || "" : undefined,
      },
    }));
  };

  
  
  // Manipular mudança na descrição do problema
  const handleDescricaoChange = (itemId: string, descricao: string) => {
    setSelectedItens((prev) => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        descricao,
      },
    }));
  };






  // Renderização de itens do checklist
// Renderização de itens do checklist
const renderChecklistItems = () => {
  if (!checklistGrupos || checklistGrupos.length === 0) {
    return <Text style={globalStyles.emptyState}>Nenhum item disponível para checklist</Text>;
  }

  return checklistGrupos.map((grupo, groupIndex) => (
    <View key={`grupo-${groupIndex}`} style={globalStyles.groupContainer}>
      <Text style={globalStyles.checklistGroupTitle}>{grupo.grupo_nome}</Text>
      {grupo.itens.map((item, itemIndex) => (
        <View key={`item-${item.id || itemIndex}`} style={globalStyles.checklistItemCard}>
          <Text style={globalStyles.checklistItemText}>{item.item}</Text>
          
          <View style={globalStyles.itemActions}>
            <TouchableOpacity
              style={[globalStyles.statusButton, selectedItens[item.id]?.valor === "ok" && globalStyles.selectedOkButton]}
              onPress={() => handleItemSelection(item.id, "ok")}
            >
              <Icon 
                name="check-circle" 
                type="feather" 
                size={18} 
                color={selectedItens[item.id]?.valor === "ok" ? colors.white : colors.success} 
              />
              <Text 
                style={[globalStyles.statusButtonText, selectedItens[item.id]?.valor === "ok" && globalStyles.selectedButtonText]}
              >
                OK
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[globalStyles.statusButton, globalStyles.warningButton, selectedItens[item.id]?.valor === "problema" && globalStyles.selectedWarningButton]}
              onPress={() => handleItemSelection(item.id, "problema")}
            >
              <Icon 
                name="alert-circle" 
                type="feather" 
                size={18} 
                color={selectedItens[item.id]?.valor === "problema" ? colors.white : colors.danger} 
              />
              <Text 
                style={[globalStyles.statusButtonText, selectedItens[item.id]?.valor === "problema" && globalStyles.selectedButtonText]}
              >
                Problema
              </Text>
            </TouchableOpacity>
          </View>

          {selectedItens[item.id]?.valor === "problema" && (
            <View>
              <TextInput
                style={globalStyles.problemInput}
                placeholder="Descreva o problema detalhadamente..."
                value={selectedItens[item.id]?.descricao || ""}
                onChangeText={(text) => handleDescricaoChange(item.id, text)}
                multiline
                numberOfLines={3}
                placeholderTextColor={colors.gray}
              />
              {/* Mensagem de erro caso a descrição seja obrigatória */}
              {selectedItens[item.id]?.valor === "problema" && !selectedItens[item.id]?.descricao?.trim() && (
                <Text style={globalStyles.errorMessage}>Este campo é obrigatório. Por favor, descreva o problema.</Text>
              )}
            </View>
          )}
        </View>
      ))}
    </View>
  ));
};









  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      {/* Cabeçalho */}
      <View style={globalStyles.pageHeader}>
        <Text style={globalStyles.headerTitle}>Novo Checklist</Text>
      </View>

      {/* Conteúdo principal */}
      {loading ? (
        <View style={globalStyles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={globalStyles.loadingText}>Carregando informações...</Text>
        </View>
      ) : (
        <ScrollView
          style={globalStyles.scrollContainer}
          contentContainerStyle={globalStyles.contentContainer}
        >
          {/* Informações do veículo */}
          {vehicleData ? (
            <View style={globalStyles.vehicleInfoCard}>
              <View style={globalStyles.vehicleInfoRow}>
                <Icon name="truck" type="feather" size={18} color={colors.primary} />
                <Text style={globalStyles.vehicleInfoLabel}>Frota:</Text>
                <Text style={globalStyles.vehicleInfoValue}>{vehicleData.num_frota}</Text>
              </View>
              <View style={globalStyles.vehicleInfoRow}>
                <Icon name="clipboard" type="feather" size={18} color={colors.primary} />
                <Text style={globalStyles.vehicleInfoLabel}>Placa:</Text>
                <Text style={globalStyles.vehicleInfoValue}>{vehicleData.placa}</Text>
              </View>
            </View>
          ) : (
            <View style={globalStyles.errorCard}>
              <Icon name="alert-triangle" type="feather" size={20} color={colors.danger} />
              <Text style={globalStyles.errorText}>Nenhum veículo encontrado</Text>
            </View>
          )}

          {/* Seleção de tipo de checklist */}
          <View style={globalStyles.section}>
            <Text style={globalStyles.sectionTitle}>Tipo de Checklist</Text>
            <TouchableOpacity
              style={globalStyles.selectButton}
              onPress={() => setModalVisible(true)}
            >
              <Text style={globalStyles.selectButtonText}>
                {selectedCheckTipo?.nome || "Selecione o tipo de checklist"}
              </Text>
              <Icon name="chevron-down" type="feather" size={20} color={colors.text.secondary} />
            </TouchableOpacity>
          </View>

          {/* Modal de seleção de tipo de checklist */}
          <Modal visible={modalVisible} animationType="slide" transparent>
            <View style={globalStyles.modalContainer}>
              <View style={globalStyles.modalContent}>
                <Text style={globalStyles.modalTitle}>Selecione o Tipo de Checklist</Text>

                <FlatList
                  data={checkTipos}
                  keyExtractor={(item) => (item.id ? item.id.toString() : `fallback-${Math.random()}`)}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={globalStyles.modalItem}
                      onPress={() => {
                        setSelectedCheckTipo(item);
                        setModalVisible(false);
                      }}
                    >
                      <Text style={globalStyles.modalItemText}>{item.nome}</Text>
                    </TouchableOpacity>
                  )}
                  style={globalStyles.modalList}
                />

                <TouchableOpacity
                  style={globalStyles.modalCloseButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={globalStyles.modalCloseButtonText}>Fechar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          {/* Itens do checklist */}
          <View style={globalStyles.section}>
            <Text style={globalStyles.sectionTitle}>Itens do Checklist</Text>
            {renderChecklistItems()}
          </View>
        </ScrollView>
      )}

      {/* Botão de salvar fixo no rodapé */}
      <View style={globalStyles.footer}>
        <TouchableOpacity
          style={globalStyles.saveButton}
          onPress={handleSave}
          disabled={savingData || loading}
        >
          {savingData ? (
            <ActivityIndicator size="small" color={colors.white} />
          ) : (
            <>
              <Icon
                name="save"
                type="feather"
                size={20}
                color={colors.white}
                style={globalStyles.saveIcon}
              />
              <Text style={globalStyles.saveButtonText}>Salvar Checklist</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}