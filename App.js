import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import axios from 'axios';
import { SvgUri } from 'react-native-svg';

const chave = 'b9be6281';

export default function TelaClima() {
  const [cidade, setCidade] = useState('');
  const [clima, setClima] = useState(null);
  const [carregando, setCarregando] = useState(false);

  const buscarClima = async () => {
    if (!cidade.trim()) return;

    setCarregando(true);
    setClima(null);

    try {
      const resposta = await axios.get('https://api.hgbrasil.com/weather', {
        params: {
          key: chave,
          city_name: cidade,
        },
      });

      if (resposta.data && resposta.data.results) {
        setClima(resposta.data.results);
      } else {
        alert('Cidade não encontrada');
      }
    } catch (erro) {
      alert('Erro ao buscar dados');
    } finally {
      setCarregando(false);
    }
  };

  const getIconUri = (condition) =>
    `https://assets.hgbrasil.com/weather/icons/conditions/${condition}.svg`;

  return (
    <ScrollView contentContainerStyle={estilos.container}>
      <TextInput
        style={estilos.input}
        placeholder="Digite o nome da cidade"
        placeholderTextColor="#ccc"
        value={cidade}
        onChangeText={setCidade}
        onSubmitEditing={buscarClima}
        returnKeyType="search"
      />
      <TouchableOpacity style={estilos.botao} onPress={buscarClima}>
        <Text style={estilos.textoBotao}>Buscar Clima</Text>
      </TouchableOpacity>

      {carregando && (
        <View style={{ marginTop: 20 }}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={{ color: 'white', marginTop: 10 }}>Carregando clima...</Text>
        </View>
      )}

      {clima && (
        <>
          <View style={estilos.secaoPrincipal}>
            <View style={estilos.linhaCidade}>
              <Text style={estilos.cidade}>{clima.city}</Text>
              <SvgUri
                width={20}
                height={20}
                uri={getIconUri(clima.condition_slug)}
              />
            </View>

            <SvgUri
              width={80}
              height={80}
              uri={getIconUri(clima.condition_slug)}
            />

            <Text style={estilos.temperatura}>{clima.temp}º</Text>
            <Text style={estilos.subtitulo}>{clima.description}</Text>
            <Text style={estilos.subtituloPequeno}>
              Max.: {clima.forecast[0].max}º  Min.: {clima.forecast[0].min}º
            </Text>
          </View>

          {/* Próximos dias */}
          <View style={estilos.cartao}>
            <Text style={estilos.tituloSecao}>Próximos dias</Text>
            {clima.forecast && clima.forecast.length > 1 ? (
              clima.forecast.slice(1, 6).map((dia, indice) => (
                <View key={indice} style={estilos.linhaPrevisao}>
                  <Text style={estilos.diaPrevisao}>{dia.weekday}</Text>
                  {/* Exibe o condition para debug */}
                  <Text style={{ color: 'white', marginRight: 5 }}>{dia.condition}</Text>
                  <SvgUri
                    width={24}
                    height={24}
                    uri={getIconUri(dia.condition)}
                  />
                  <Text style={estilos.tempPrevisao}>
                    {dia.max}º  |  {dia.min}º
                  </Text>
                </View>
              ))
            ) : (
              <Text style={{ color: 'white' }}>Previsão não disponível</Text>
            )}
          </View>
        </>
      )}
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#1D3E90',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  input: {
    backgroundColor: '#244DA1',
    borderRadius: 12,
    padding: 12,
    width: '100%',
    color: 'white',
    marginBottom: 10,
  },
  botao: {
    backgroundColor: '#133B88',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  textoBotao: {
    color: 'white',
    fontWeight: 'bold',
  },
  secaoPrincipal: {
    alignItems: 'center',
    marginBottom: 30,
  },
  linhaCidade: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  cidade: {
    fontSize: 24,
    color: 'white',
    marginRight: 5,
  },
  temperatura: {
    fontSize: 48,
    color: 'white',
    fontWeight: 'bold',
  },
  subtitulo: {
    fontSize: 16,
    color: 'white',
  },
  subtituloPequeno: {
    fontSize: 14,
    color: 'white',
    opacity: 0.7,
  },
  cartao: {
    backgroundColor: '#244DA1',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    marginBottom: 20,
  },
  tituloSecao: {
    color: 'white',
    fontSize: 18,
    marginBottom: 10,
  },
  linhaPrevisao: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  diaPrevisao: {
    color: 'white',
    fontSize: 16,
  },
  tempPrevisao: {
    color: 'white',
    fontSize: 16,
  },
});
