import { View, Text, StyleSheet, Image } from 'react-native';

export default function Index() {
  return (
    <View style={styles.container}>
      {/* Exemplo de imagem da internet */}
      <Image 
  source={{ uri: 'https://preview.redd.it/o-lobo-pid%C3%A3o-parou-de-ser-alimentado-e-agora-ele-est%C3%A1-v0-dforrhwdmazc1.jpeg?width=250&format=pjpg&auto=webp&s=d6e8131e5a7329138114cf49a2f7374a1db32ee7' }} // Link de imagem aleatória
  style={styles.logo} 
/>


      <Text style={styles.textoGrito}>
        AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA EU N AGUENTO MAIS 🚀
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#6a787d', 
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
    borderRadius: 50, // Deixa a imagem redonda
  },
  textoGrito: {
    color: '#020203', 
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 20,
    // Efeito de contorno (stroke)
    textShadowColor: '#fff', 
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 1,
  },
});
