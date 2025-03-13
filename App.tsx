// frontend/App.tsx
import 'expo-router/entry';
import { LogBox } from 'react-native';//Ignora avisos de depreciação

// WARN  props.pointerEvents is deprecated. Use style.pointerEvents
LogBox.ignoreLogs(['pointerEvents is deprecated']);
