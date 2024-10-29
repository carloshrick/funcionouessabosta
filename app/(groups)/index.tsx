import React, { useEffect, useState } from 'react';
import styled from "styled-components/native";
import { View, Text, Pressable, ScrollView, Alert, Platform } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons'; 
import { Link as ExpoRouterLink } from 'expo-router';

interface Redacao {
    id: string;
    titulo: string;
    texto: string;
}

export default function Home() {
    const [redacoes, setRedacoes] = useState<Redacao[]>([]);
    const router = useRouter();

    useFocusEffect(
        React.useCallback(() => {
            loadFromCache();
        }, [])
    );

    const loadFromCache = async () => {
        try {
            const savedRedacoes = await AsyncStorage.getItem('redacoes');
            let parsedRedacoes: Redacao[] = savedRedacoes ? JSON.parse(savedRedacoes) : [];
            parsedRedacoes = parsedRedacoes.reverse();
            setRedacoes(parsedRedacoes);
        } catch (error) {
            console.error('Erro ao carregar do cache:', error);
        }
    };

    const removeRedacao = async (id: string) => {
        try {
            const existingRedacoes = await AsyncStorage.getItem('redacoes');
            const parsedRedacoes: Redacao[] = existingRedacoes ? JSON.parse(existingRedacoes) : [];

            const updatedRedacoes = parsedRedacoes.filter(redacao => redacao.id !== id);
            await AsyncStorage.setItem('redacoes', JSON.stringify(updatedRedacoes));

            Alert.alert('Excluído', 'Sua redação foi removida com sucesso!');
            loadFromCache(); 
        } catch (error) {
            console.error('Erro ao remover no cache:', error);
        }
    };

    const handleCardPress = (redacao: Redacao) => {
        router.push({
            pathname: '/visualizacao',
            params: {
                id: redacao.id,
                titulo: redacao.titulo,
                texto: redacao.texto
            }
        });
    };

    const downloadFile = async (titulo: string, texto: string) => {
        try {
            if (Platform.OS === 'web') {
                // Criar um blob a partir do texto
                const blob = new Blob([texto], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
    
                // Criar um elemento de link
                const a = document.createElement('a');
                a.href = url;
                a.download = `${titulo}.txt`; // Definindo o nome do arquivo
                document.body.appendChild(a); // Adiciona o link ao corpo do documento
                a.click(); // Clica no link para iniciar o download
                document.body.removeChild(a); // Remove o link do corpo
    
                Alert.alert('Sucesso', 'Arquivo baixado com sucesso.');
            } else {
                // Para dispositivos móveis, use o Expo FileSystem
                const fileUri = FileSystem.documentDirectory + `${titulo}.txt`;
                await FileSystem.writeAsStringAsync(fileUri, texto, { encoding: FileSystem.EncodingType.UTF8 });
                await Sharing.shareAsync(fileUri);
                Alert.alert('Sucesso', 'Arquivo baixado com sucesso.');
            }
        } catch (error) {
            console.error('Erro ao baixar o arquivo:', error);
            Alert.alert('Erro', 'Não foi possível baixar o arquivo.');
        }
    };

    return (
        <ContainerBody>
            <Container>
            <Title>
        <TitleTextMinhas>MINHAS</TitleTextMinhas>
        <TitleTextRedacoes>REDAÇÕES</TitleTextRedacoes>
    </Title>

                    
                <ScrollView>
                    {redacoes.length > 0 ? (
                        redacoes.map((redacao) => (
                            <Card key={redacao.id}>
                                <Pressable onPress={() => handleCardPress(redacao)} style={{ flex: 1 }}>
                                    <CardTitle>{redacao.titulo || 'Sem título'}</CardTitle>
                                    <CardText numberOfLines={3}>{redacao.texto || 'Sem conteúdo disponível.'}</CardText>
                                </Pressable>
                                {/* Botão para baixar a redação */}

                                <DownloadButton onPress={() => downloadFile(redacao.titulo, redacao.texto)}>

                                    <MaterialIcons name="file-download" size={24} color="#18206f" />

                                </DownloadButton>
                                <RemoveButton onPress={() => removeRedacao(redacao.id)}>
                                    <MaterialIcons name="delete" size={24} color="#18206f" />
                                </RemoveButton>
                            </Card>
                        ))
                    ) : (
                        <EmptyText>Nenhuma redação salva.</EmptyText>
                        
                    )}
                </ScrollView>
               
            </Container>

            <Footer>

                <ButtonContainer href='/ia'>
                    <Icone source={require('../../assets/ia.png')} /> 
                </ButtonContainer>

                <ButtonContainer href='/newRedacao'>
                    <Icone source={require('../../assets/mais.png')} /> 
                </ButtonContainer>

                <ButtonContainer href='/sinonimos'>
                    <Icone source={require('../../assets/editor-de-texto.png')} /> 
                </ButtonContainer>
            </Footer>
        </ContainerBody>
    );
}


const ContainerBody = styled.View`
    flex: 1;
    background-color: #F5F5F5;
    align-items: center;
`;

const Title = styled.View`
    flex-direction: column;
    align-items: center;
    margin-bottom: 20px;
`;

const DownloadButton = styled.Pressable`

`

const TitleText = styled.Text`
    font-size: 24px;
    font-weight: bold;
    color: #18206f;
`;

const TitleTextMinhas = styled(TitleText)`
    margin-bottom: 5px; 
    margin-top:-5;
`;

const TitleTextRedacoes = styled(TitleText)`

`;


const Card = styled.View`
    background-color: #fff;
    border-radius: 10px;
    padding: 16px;
    margin-top: 20px;
    margin-bottom:10px;
    width: 95%;
    shadow-color: #000;
    shadow-opacity: 0.2;
    shadow-radius: 3px;
    shadow-offset: 0px 2px;
    elevation: 5;
    min-height: 150px;  
    min-widht: 95%;
    margin-left:9.5px;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;

const CardTitle = styled.Text`
    font-size: 20px;
    font-weight: bold;
    color: #18206f;
    margin-bottom: 10px;
    min-height: 24px;  
`;

const CardText = styled.Text`
    font-size: 16px;
    color: #333;
    min-height: 48px;  
`;

const EmptyText = styled.Text`
    font-size: 18px;
    color: #999;
    margin-top: 20px;
`;

const Container = styled.View`
    flex: 1;
    background-color: #F5F5F5;
    padding: 16px;
    align-items: center;
    margin-top: 40px;
    margin-bottom:130px;
`;

const Footer = styled.View`
    width: 100%;
    position: absolute;
    bottom: 0;
    flex-direction: row;
    justify-content: space-around;
    background-color: #18206f;
    align-items: center;
    height: 90px;
`;

const ButtonContainer = styled(ExpoRouterLink)`
    height: 80px;
    width: 80px;
    align-items: center;
    border-radius: 8px;
    justify-content: center;
    padding-left: 28px;
    margin-top: 28px;
`;

const Icone = styled.Image`
    width: 30px;  
    height: 30px;
`;

const RemoveButton = styled(Pressable)`
    margin-left: 10px;
`;