//frontend/constants/styles.ts
import { StyleSheet, Platform, StatusBar, ViewStyle, TextStyle } from 'react-native';

//******* Inicio do colors ***********/
export const colors = {
  primary: '#3498db',
  success: '#27ae60',
  danger: '#e74c3c',
  warning: '#f39c12',
  light: '#f8f9fa',
  dark: '#2d3748',
  gray: '#a0aec0',
  grayLight: '#e1e4e8',
  grayDark: '#4a5568',
  white: '#ffffff',
  background: '#f8f9fa',
  cardBackground: '#ffffff',
  border: '#e1e4e8',
  text: {
    primary: '#2d3748',
    secondary: '#4a5568',
    light: '#718096',
    danger: '#e53e3e',
  },
  shadow: '#000000',
};
//******* Fim do colors ***********/

//******* Inicio do shadows ***********/
export const shadows: Record<string, ViewStyle> = {
  small: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  medium: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  large: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
};
//******* Fim do shadows ***********/

//******* Inicio do typography ***********/
export const typography: Record<string, TextStyle> = {
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
    color: colors.text.light,
  },
  body: {
    fontSize: 14,
    fontWeight: '400',
  },
  small: {
    fontSize: 12,
    fontWeight: '400',
  },
  cardText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.primary,
    marginTop: 8,
    textAlign: 'center',
  },
};
//******* Fim do typography ***********/

//******* Inicio do globalStyles ***********/
export const globalStyles = StyleSheet.create({

  menuContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: colors.background,
  },

  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.background,
  },
  text: {
    fontSize: 16,
    color: colors.text.primary,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  title: typography.title,
  subtitle: typography.subtitle,
  button: {
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 10,
    paddingVertical: 12,
  },
  input: {
    backgroundColor: colors.light,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    fontSize: 16,
    color: colors.text.primary,
    textAlign: 'left',
  } as TextStyle,
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  errorText: {
    color: colors.text.danger,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 10,
  },
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 10,
    marginBottom: 10,
    elevation: 3,
    ...shadows.medium,
  },
  cardText: typography.cardText,
  modalContent: {
    backgroundColor: colors.white,
    alignItems: 'center',
    ...shadows.large,
    width: '90%',
    borderRadius: 12,
    padding: 20,
  },
  footer: {
    padding: 16,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    ...shadows.medium,
    alignItems: 'center',
  },
  section: {
    marginBottom: 20,
  },
  emptyState: {
    textAlign: 'center',
    fontSize: 16,
    color: colors.text.light,
    marginVertical: 20,
    marginTop: 20,
  },
  checklistGroupTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 10,
  },
  checklistItemCard: {
    backgroundColor: colors.cardBackground,
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    ...shadows.small,
  },
  problemInput: {
    backgroundColor: colors.light,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    color: colors.text.primary,
    marginTop: 10,
  },
  buttonContainer: {
    flexDirection: 'row', // Alinha os botões na horizontal
    justifyContent: 'space-between', // Espaço entre os botões
    alignItems: 'center', // Alinha os botões verticalmente
    gap: 8, // Espaçamento entre os botões (opcional para RN > 0.71)
    marginTop: 10,
  },
  createButton: {
    backgroundColor: '#007bff',
    flex: 1,
    minWidth: '30%',
    marginHorizontal: 2,
    height: 40,
  },
  viewChecklistButton: {
    backgroundColor: '#28a745',
    flex: 1,
    minWidth: '30%',
    marginHorizontal: 2,
    height: 40,
  },
  osButtonContainer: {
    position: 'relative',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  osButton: {
    backgroundColor: '#ff9800',
    flex: 1,
    minWidth: '30%',
    marginHorizontal: 2,
    height: 40,
  },
  badge: {
    position: 'absolute',
    top: -8,
    right: 5,
    backgroundColor: 'red',
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 5,
    borderRadius: 10,
    zIndex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#ffffff',
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#f1f3f5',
    borderRadius: 6,
    padding: 8,
    borderWidth: 1,
    borderColor: '#ced4da',
    marginRight: 10,
  },
  addButton: {
    backgroundColor: '#28a745',
    paddingHorizontal: 15,
    borderRadius: 6,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.white,
  },
  saveIcon: {
    marginRight: 8,
  },
  checklistItemText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.primary,
  },
  itemActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  statusButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.light,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
    flex: 0.48,
  },
  selectedOkButton: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  warningButton: {
    borderColor: colors.danger,
  },
  selectedWarningButton: {
    backgroundColor: colors.danger,
    borderColor: colors.danger,
  },
  statusButtonText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
    color: colors.text.secondary,
  },
  selectedButtonText: {
    color: colors.white,
  },

  groupContainer: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: colors.cardBackground,
    borderRadius: 8,
    ...shadows.small,
  },
  pageHeader: {
    padding: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    ...shadows.medium,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: colors.text.light,
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  vehicleInfoCard: {
    backgroundColor: colors.cardBackground,
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    ...shadows.small,
  },
  vehicleInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  vehicleInfoLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text.secondary,
    marginLeft: 6,
  },
  vehicleInfoValue: {
    fontSize: 14,
    color: colors.text.primary,
    marginLeft: 4,
  },
  errorCard: {
    backgroundColor: colors.danger,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  
  errorMessage: {
    color: colors.danger, // Usando a cor de erro
    fontSize: 12,
    marginTop: 5,
    textAlign: "left",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.secondary,
    marginBottom: 12,
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: colors.light,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectButtonText: {
    fontSize: 16,
    color: colors.text.primary,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgb(246, 250, 246)',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 10,
    textAlign: 'center',
  },
  modalItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalItemText: {
    fontSize: 16,
    color: colors.text.primary,
  },
  modalList: {
    width: '100%',
    maxHeight: 300,
  },
  modalCloseButton: {
    marginTop: 16,
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalCloseButtonText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 14,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 10,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    ...shadows.medium,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: colors.light,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  associarButton: {
    backgroundColor: colors.success,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  gruposContainer: {
    padding: 12,
    backgroundColor: colors.cardBackground,
    borderRadius: 8,
    ...shadows.small,
  },
  grupoCard: {
    padding: 10,
    backgroundColor: colors.grayLight,
    borderRadius: 6,
    marginBottom: 8,
  },
  groupTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 5,
  },
  itemText: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  emptyText: {
    fontSize: 14,
    color: colors.text.light,
    textAlign: 'center',
    marginVertical: 10,
  },
  addModeloButton: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 10,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  addModeloButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.white,
    textAlign: 'center',
  },
  operationButton: {
    flex: 1, // Para que todos os botões tenham o mesmo tamanho proporcional
    minWidth: '30%', // Define um tamanho mínimo para evitar que fiquem muito pequenos
    maxWidth: '32%', // Evita que fiquem muito grandes e quebrem o layout
    aspectRatio: 1, // Mantém o botão quadrado
    backgroundColor: colors.white,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    margin: 5,
    ...shadows.small,
  },
  operationButtonText: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    color: colors.text.primary,
  },
  footerText: {
    fontSize: 12,
    color: '#6c757d',
    fontWeight: '500',
  },
  osCard: {
    backgroundColor: colors.white,
    borderRadius: 12, // 🔹 Bordas arredondadas para um design moderno
    padding: 15,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3, // 🔹 Elevação para Android
    borderWidth: 1,
    borderColor: colors.border, // 🔹 Borda sutil para destacar o card
    marginVertical: 8,
  },
  osHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  osTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.dark,
    marginLeft: 8,
  },
  osStatus: {
    fontSize: 14,
    fontWeight: 'bold',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    overflow: 'hidden',
    alignSelf: 'flex-start',
    textAlign: 'center',
    padding: 5,
    marginVertical: 5,
  },
  osStatusAberta: {
    backgroundColor: colors.warning,
    color: colors.white,
  },
  osStatusFechada: {
    backgroundColor: colors.success,
    color: colors.white,
  },
  osInfo: {
    fontSize: 14,
    color: colors.text.secondary,
    marginTop: 5,
  },
  osDetails: {
    marginTop: 5,
  },

  osInfoLabel: {
    fontWeight: 'bold',
    color: '#333',
  },

  newOsButton: {
    backgroundColor: '#007bff',
    borderRadius: 6,
    marginVertical: 10,
  },

  loadingIndicator: {
    marginTop: 20,
  },




});

//******* Fim do globalStyles ***********/