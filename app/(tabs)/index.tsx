import React, { useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, ScrollView } from 'react-native';

const MAPA_DO_JOGO = {
  inicio_rpg: {
    texto: "Você segura seu cajado mágico na entrada da Floresta dos Sussurros. Três caminhos se estendem à sua frente. Para onde sua intuição te leva?",
    opcoes: [
      { texto: "Seguir a Trilha Antiga", destino: 'trilha_antiga' },
      { texto: "Entrar no Pântano Sombrio", destino: 'pantano' },
      { texto: "Subir as Montanhas de Gelo", destino: 'montanhas' },
    ]
  },
  trilha_antiga: {
    texto: "A trilha parece calma, mas você avista uma fenda brilhante na raiz de uma árvore antiga. Deseja investigar ou continuar marchando?",
    opcoes: [
      { texto: "Vasculhar a fenda (Sorte/Azar)", destino: 'evento_fenda' },
      { texto: "Continuar marchando", destino: 'castelo_portao' },
    ]
  },
  pantano: {
    texto: "O pântano é traiçoeiro. Uma névoa tóxica começa a subir! Você precisa agir rápido.",
    opcoes: [
      { texto: "Usar feitiço de vento (Gasta 20 MP)", destino: 'pantano_sucesso', requerMp: 20 },
      { texto: "Correr pela lama", destino: 'pantano_dano' },
    ]
  },
  montanhas: {
    texto: "O vento congelante corta sua pele. No topo, você encontra um Dragão de Gelo adormecido guardando um fragmento rúnico.",
    opcoes: [
      { texto: "Roubar a runa furtivamente", destino: 'evento_dragao' },
      { texto: "Recuar para a Trilha Antiga", destino: 'trilha_antiga' },
    ]
  },
  castelo_portao: {
    texto: "Você finalmente alcança os portões do Castelo do Necromante. O chefe final aguarda lá dentro. Você está pronto?",
    opcoes: [
      { texto: "Invadir o Castelo (Batalha Final)", destino: 'batalha_final' },
      { texto: "Voltar para explorar mais", destino: 'inicio_rpg' },
    ]
  }
};

export default function Index() {
  const [tela, setTela] = useState('inicio');
  const [rotaAtual, setRotaAtual] = useState('inicio_rpg');
  const [vida, setVida] = useState(100);
  const [mana, setMana] = useState(50);
  const [xp, setXp] = useState(0);
  const [diario, setDiario] = useState('Sua jornada começou...');

  const reiniciarJogo = () => {
    setVida(100);
    setMana(50);
    setXp(0);
    setRotaAtual('inicio_rpg');
    setDiario('Sua jornada recomeçou...');
  };

  const navegarParaRota = (destino, requerMp = 0) => {
    if (mana < requerMp) {
      setDiario("✨ Mana insuficiente para lançar esse feitiço!");
      return;
    }

    let novaVida = vida;
    let novoMp = mana - requerMp;
    let novoXp = xp;
    let textoAcontecimento = "";

    if (destino === 'evento_fenda') {
      const chance = Math.random();
      if (chance > 0.5) {
        novoXp += 40;
        textoAcontecimento = "🍀 Sorte! Você encontrou um pergaminho antigo de XP (+40 XP).";
        destino = 'castelo_portao';
      } else {
        novaVida -= 25;
        textoAcontecimento = "💥 Armadilha! Um enxame de insectos arcanos te mordeu (-25 HP).";
        destino = 'castelo_portao';
      }
    } 
    else if (destino === 'evento_dragao') {
      const chance = Math.random();
      if (chance > 0.4) {
        novoXp += 100;
        textoAcontecimento = "🐉 Incrível! Você roubou a runa sem acordar o dragão (+100 XP)!";
        destino = 'castelo_portao';
      } else {
        novaVida -= 50;
        textoAcontecimento = "🔥 O Dragão acordou e lançou um sopro congelante (-50 HP).";
        destino = 'trilha_antiga';
      }
    }
    else if (destino === 'batalha_final') {
      const poderAtaque = Math.floor(Math.random() * 50) + 10;
      if (novoXp >= 80) {
        textoAcontecimento = `⚔️ Com o poder das runas e seus ${novoXp} XP, você obliterou o Necromante! VITÓRIA!`;
        destino = 'vitoria_final';
      } else {
        novaVida -= poderAtaque;
        textoAcontecimento = `💀 Você atacou, mas estava fraco. O Necromante contra-atacou causando ${poderAtaque} de dano!`;
        destino = novaVida - poderAtaque <= 0 ? 'gameover' : 'castelo_portao';
      }
    }
    else if (destino === 'pantano_sucesso') {
      textoAcontecimento = "🌪️ O vento dissipou a névoa! Você atravessou em segurança.";
      destino = 'castelo_portao';
    }
    else if (destino === 'pantano_dano') {
      novaVida -= 30;
      textoAcontecimento = "🤢 A névoa venenosa te sufocou um pouco (-30 HP).";
      destino = 'castelo_portao';
    }

    if (novaVida <= 0) {
      setVida(0);
      setRotaAtual('gameover');
      setDiario("💀 Você pereceu nas profundezas do reino.");
    } else {
      setVida(novaVida);
      setMana(novoMp);
      setXp(novoXp);
      setRotaAtual(destino);
      if (textoAcontecimento) setDiario(textoAcontecimento);
    }
  };

  const renderPaginaJogo = () => {
    if (rotaAtual === 'gameover') {
      return (
        <View style={styles.areaHistoria}>
          <Text style={[styles.textoHistoria, { borderLeftColor: 'red' }]}>GAME OVER{"\n\n"}O poder do mago se esvaiu. O reino caiu em trevas.</Text>
          <TouchableOpacity style={styles.btnEscolha} onPress={reiniciarJogo}>
            <Text style={styles.textoBotao}>Renascer (Tentar de Novo)</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (rotaAtual === 'vitoria_final') {
      return (
        <View style={styles.areaHistoria}>
          <Text style={[styles.textoHistoria, { borderLeftColor: '#00ffcc' }]}>🏆 VITÓRIA ÉPICA!{"\n\n"}{diario}{"\n\n"}Você gravou seu nome na história de Retro Classic Adventure!</Text>
          <TouchableOpacity style={[styles.btnEscolha, {backgroundColor: '#00ffcc'}]} onPress={reiniciarJogo}>
            <Text style={[styles.textoBotao, {color: '#000'}]}>Jogar Nova Campanha</Text>
          </TouchableOpacity>
        </View>
      );
    }

    const cenarioAtor = MAPA_DO_JOGO[rotaAtual];

    return (
      <View style={styles.containerJogo}>
        <View style={styles.statusTopo}>
          <Text style={styles.textoStatus}>❤️ HP: {vida}</Text>
          <Text style={styles.textoStatus}>✨ MP: {mana}</Text>
          <Text style={styles.textoStatus}>🎖️ XP: {xp}</Text>
          <TouchableOpacity style={styles.btnSair} onPress={() => setTela('inicio')}>
            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 11 }}>MENU</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.areaDiario}>
          <Text style={styles.textoDiario}>{diario}</Text>
        </View>

        <ScrollView contentContainerStyle={styles.areaHistoria}>
          <Text style={styles.textoHistoria}>{cenarioAtor.texto}</Text>
          {cenarioAtor.opcoes.map((opcao, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.btnEscolha} 
              onPress={() => navegarParaRota(opcao.destino, opcao.requerMp)}
            >
              <Text style={styles.textoBotao}>
                {opcao.texto} {opcao.requerMp ? `(-${opcao.requerMp} MP)` : ''}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  // --- RENDERIZADOR DAS PÁGINAS DE TEXTO (AQUI ESTÁ O SEU RELATÓRIO) ---
  const renderConteudoTexto = () => {
    if (tela === 'info') {
      return <Text style={styles.caixaTexto}>CRÉDITOS: Desenvolvido pelo mago dos RPG dos Código. Versão Alpha 1.0</Text>;
    }
    
    // ⚔️ SEU TRABALHO INTEIRO COLOCADO AQUI NO BOTÃO DESCRIÇÃO:
    if (tela === 'desc') {
      return (
        <ScrollView style={styles.caixaTextoRolavel}>
          <Text style={styles.tituloRelatorio}>📝 meu slogan ai </Text>
          
          <Text style={styles.topicoRelatorio}>1. Nome do App:</Text>
          <Text style={styles.subTextoRelatorio}>• Retro Classic Adventure</Text>
          
          <Text style={styles.topicoRelatorio}>2. Tipo de Fundo:</Text>
          <Text style={styles.subTextoRelatorio}>• Imagem Temática (Mago rpg sla vou pensar melhor dps)</Text>
          
          <Text style={styles.topicoRelatorio}>3. Cores Principais:</Text>
          <Text style={styles.subTextoRelatorio}>• Fundo: Preto Profundo / Opaco</Text>
          <Text style={styles.subTextoRelatorio}>• Botões: Roxo (#4b0082)</Text>
          <Text style={styles.subTextoRelatorio}>• Destaques: Verde Neon (#deff9a)</Text>
          
          <Text style={styles.topicoRelatorio}>4. Slogan:</Text>
          <Text style={styles.subTextoRelatorio}>• "um jogo classico de escolhas, em breve um jogo de turno com ataques em turno etc"</Text>
          
          <Text style={styles.topicoRelatorio}>5. Estilo Visual:</Text>
          <Text style={styles.subTextoRelatorio}>• Gamer / RPG Retrô de Escolhas</Text>
          
          <Text style={styles.topicoRelatorio}>6. Público-Alvo:</Text>
          <Text style={styles.subTextoRelatorio}>• Fãs de RPG, cultura geek e jogos casuais de tomada de decisão.</Text>
        </ScrollView>
      );
    }
    
    if (tela === 'funciona') {
      return <Text style={styles.caixaTexto}>COMO FUNCIONA: Explore caminhos nas abas do menu para ganhar XP. O azar pode tirar seu HP. Acumule 80 XP para ter força de vencer o chefe final!</Text>;
    }
    
    return <Text style={styles.textoGrito}>É só um prototipo blz? nao vou deixar que o jogo seja essa merda :/</Text>;
  };

  return (
    <ImageBackground 
      source={require('./imagens/slogan.png')} 
      style={styles.containerPrincipal}
      resizeMode="cover"
    >
      {tela === 'jogar' ? (
        renderPaginaJogo()
      ) : (
        <>
          <View style={styles.areaConteudo}>
            {renderConteudoTexto()}
          </View>

          <View style={styles.menuDireito}>
            <TouchableOpacity style={[styles.botao, styles.botaoJogar]} onPress={() => { setTela('jogar'); reiniciarJogo(); }}>
              <Text style={styles.textoBotao}>INICIAR RPG ⚔️</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.botao} onPress={() => setTela('info')}><Text style={styles.textoBotao}>Informações</Text></TouchableOpacity>
            <TouchableOpacity style={styles.botao} onPress={() => setTela('desc')}><Text style={styles.textoBotao}>Descrição</Text></TouchableOpacity>
            <TouchableOpacity style={styles.botao} onPress={() => setTela('funciona')}><Text style={styles.textoBotao}>Como funciona</Text></TouchableOpacity>
          </View>
        </>
      )}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  containerPrincipal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  areaConteudo: {
    flex: 1,
    justifyContent: 'center',
    paddingRight: 10,
    maxWidth: '65%',
    width: '100%',
  },
  menuDireito: {
    paddingBottom: 50,
    paddingRight: 20,
    gap: 10,
  },
  botao: {
    backgroundColor: '#4b0082',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#deff9a',
    minWidth: 160,
    alignItems: 'center',
  },
  botaoJogar: {
    backgroundColor: '#000000',
    borderColor: '#fff',
    marginBottom: 20,
  },
  textoBotao: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
    textAlign: 'center',
  },
  containerJogo: {
    flex: 1,
    width: '100%',
    backgroundColor: 'rgba(5, 5, 15, 0.75)', 
    paddingTop: 50,
  },
  statusTopo: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 20,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  textoStatus: {
    color: '#deff9a',
    fontWeight: 'bold',
    fontSize: 14,
    backgroundColor: '#111',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#4b0082',
  },
  btnSair: {
    backgroundColor: '#ff4d4d',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  areaDiario: {
    backgroundColor: 'rgba(75, 0, 130, 0.3)',
    marginHorizontal: 20,
    marginTop: 15,
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#deff9a',
  },
  textoDiario: {
    color: '#fff',
    fontSize: 13,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  areaHistoria: {
    paddingTop: 20,
    paddingBottom: 40,
    paddingHorizontal: 20,
    alignItems: 'flex-end',
    gap: 12,
  },
  textoHistoria: {
    color: '#fff',
    fontSize: 17,
    textAlign: 'right',
    backgroundColor: 'rgba(0,0,0,0.85)',
    padding: 18,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#deff9a',
    width: '100%',
    maxWidth: 340,
    marginBottom: 10,
  },
  btnEscolha: {
    backgroundColor: '#4b0082',
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#deff9a',
    width: '100%',
    maxWidth: 280,
    alignItems: 'center',
  },
  caixaTexto: {
    color: '#deff9a',
    fontSize: 16,
    textAlign: 'right',
    backgroundColor: 'rgba(0,0,0,0.85)',
    padding: 15,
    borderRadius: 10,
  },
  // Estilos exclusivos para a caixa rolável do relatório completo
  caixaTextoRolavel: {
    maxHeight: 350,
    backgroundColor: 'rgba(0,0,0,0.9)',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#4b0082',
  },
  tituloRelatorio: {
    color: '#deff9a',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  topicoRelatorio: {
    color: '#deff9a',
    fontSize: 13,
    fontWeight: 'bold',
    marginTop: 8,
  },
  subTextoRelatorio: {
    color: '#fff',
    fontSize: 12,
    paddingLeft: 5,
  },
  textoGrito: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'right',
  }
});