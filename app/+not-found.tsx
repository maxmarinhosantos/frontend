// frontend/app/+not-found.tsx - Tratamento de rotas inexistentes (erro 404)
// Este arquivo trata rotas inexistentes (erro 404).
// Se o usuário tentar acessar uma rota que não existe (por exemplo, /abc),
// o expo-router redireciona automaticamente para este arquivo.

import { View, Text, Button } from 'react-native';
import { useRouter } from 'expo-router';

export default function NotFoundScreen() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 18, marginBottom: 10 }}>Página não encontrada</Text>
      <Button
        title="Voltar para Home"
        onPress={() => router.replace('/')}
      />
    </View>
  );
}
