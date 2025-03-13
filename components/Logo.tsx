// frontend/components/Logo.tsx
import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

const Logo = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/logo.png')} // Substitua pelo caminho correto do logotipo
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 20, // Espaçamento entre o logotipo e o restante do conteúdo
  },
  logo: {
    width: 150, // Largura do logotipo
    height: 50, // Altura do logotipo
  },
});

export default Logo;
