import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, KeyboardAvoidingView, Platform, Alert, Dimensions, TouchableWithoutFeedback, Keyboard } from 'react-native';
import styled from 'styled-components/native';
import { Link } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import InputRedacao from '@/components/InputRedacao';
import Input from '@/components/Input';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; 
import { Link as ExpoRouterLink } from 'expo-router';

interface Redacao {
    id: string;
    titulo: string;
    texto: string;
}

export default function Visualizacao() {
    const [keyboardVisible, setKeyboardVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [titulo, setTitulo] = useState('');
    const [texto, setTexto] = useState('');
    const params = useLocalSearchParams();
    const router = useRouter();
    const [inputHeight, setInputHeight] = useState(200);
    const [alertShown, setAlertShown] = useState(false);
    
    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
            setKeyboardVisible(true);
        });
        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
            setKeyboardVisible(false);
        });

        return () => {
            keyboardDidHideListener.remove();
            keyboardDidShowListener.remove();
        };
    }, []);
    useEffect(() => {
        const initialTitulo = params.titulo as string || '';
        const initialTexto = params.texto as string || '';
        setTitulo(initialTitulo);
        setTexto(initialTexto);
    }, []);

    const handleTextChange = (text: string) => {
        // Permite que o texto seja maior que 2000, mas apenas atualiza o estado se estiver dentro do limite
        setTexto(text); // Atualiza o estado independentemente do comprimento
        
        // Se o texto atingir 2000 caracteres, mostra o alerta
        if (text.length >= 2000 && !alertShown) {
            Platform.OS === 'web' 
                ? window.alert('Atenção: Você atingiu 2000 caracteres! Aproximadamente 30 linhas')
                : Alert.alert('Atenção', 'Você atingiu 2000 caracteres! Aproximadamente 30 linhas');
            setAlertShown(true);
        } 
        // Se o texto for reduzido abaixo de 2000 caracteres, redefine o estado de alertShown
        else if (text.length < 2000) {
            setAlertShown(false);
        }
    };
    

    const saveToCache = async () => {
        if (!titulo.trim() || !texto.trim()) {
            Platform.OS === 'web' 
                    ? window.alert('A redação não pode estar vazia')
                    : Alert.alert('A redação não pode estar vazia');
                    return;
        }
    
        try {
            const existingRedacoes = await AsyncStorage.getItem('redacoes');
            const parsedRedacoes: Redacao[] = existingRedacoes ? JSON.parse(existingRedacoes) : [];
            const { id } = params; // Supondo que 'id' esteja sendo passado nos parâmetros
    
            const updatedRedacoes = parsedRedacoes.map(redacao => {
                if (redacao.id === id) {
                    return { ...redacao, titulo, texto };
                }
                return redacao;
            });
    
            await AsyncStorage.setItem('redacoes', JSON.stringify(updatedRedacoes));
            
            Alert.alert('Salvo', 'Sua redação foi salva com sucesso!');
            setIsEditing(false);
            router.push('/(groups)');
        } catch (error) {
            console.error('Erro ao salvar no cache:', error);
        }
    };
    

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >
            
                <ContainerBody>
                    <HeaderContainer>
                        {isEditing ? (
                            <Input
                                placeholder="Título"
                                value={titulo}
                                onChangeText={setTitulo}
                                style={{ flex: 1, marginRight: -68, fontSize:24, marginTop:-21, flexWrap:'wrap' }}
                            />
                        ) : (
                            <TituloTextoContainer>
                                <TituloTexto>{titulo || 'Sem título'}</TituloTexto>
                            </TituloTextoContainer>
                        )}



<Pressable
    style={estilo.botaosalvar}
    onPress={() => {
        if (isEditing) {
            saveToCache();
        } else {
            setIsEditing(true);
        }
    }}
>
    {isEditing ? (
        <MaterialIcons name="save" size={24} color="#18206f" />
    ) : (
        <MaterialIcons name="edit" size={24} color="#18206f" />
    )}
</Pressable>
                    </HeaderContainer>

                    <ContentContainer>
                    <ScrollView
    contentContainerStyle={{ paddingBottom: 10 }}
    style={{ flex: 1 }}
>
    {isEditing ? (
        <InputRedacao
            placeholder="Escreva sua redação..."
            multiline={true}
            style={{
                borderWidth: 1,
                padding: 10,
                minHeight: 700,  
                height: inputHeight > 200 ? inputHeight : 200, 
                maxHeight: '100%', 
            }}
            onContentSizeChange={(event) =>
                setInputHeight(event.nativeEvent.contentSize.height)
            }
            onChangeText={handleTextChange}
            value={texto}
        />
    ) : (
        <Texto>{texto || 'Escreva sua redação...'}</Texto>
    )}
</ScrollView>
                    </ContentContainer>

                    {!keyboardVisible && (
                    <Footer>

                <ButtonContainer href='/ia'>
                    <Icone source={require('../../assets/ia.png')} /> 
                </ButtonContainer>

                <ButtonContainer href='/(groups)'>
            <Icone source={require('../../assets/botao-de-inicio.png')} />
          </ButtonContainer>

                

                <ButtonContainer href='/sinonimos'>
                    <Icone source={require('../../assets/editor-de-texto.png')} /> 
                </ButtonContainer>

                    </Footer>
                )}
                </ContainerBody>
        </KeyboardAvoidingView>
    );
}

const ContainerBody = styled.View`
    flex: 1;
    background-color: #F5F5F5;
    justify-content: space-between;
    padding: 10px;
`;

const ContentContainer = styled.View`
    flex: 1;
    padding: 16px;
    margin-bottom: 67px;
    
`;

const HeaderContainer = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 7px;
    background-color: #F5F5F5;
    margin-top: 50px;
    margin-left:13px;
`;

const TituloTextoContainer = styled.View`
    flex: 1; 
    margin-right: 10px;

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

const estilo = StyleSheet.create({
    botaosalvar: {
        paddingBottom: 14,
        paddingTop: 14,
        width: 80,
        alignItems: 'center',
    }
});

const TituloTexto = styled.Text`
    font-size: 27px;
    font-weight: bold;
    color: #18206f;
    flex-wrap: wrap;
    margin-left: 5px;
`;

const Texto = styled.Text`
    font-size: 18px;
    padding: 10px;
    border-radius: 10px;
    background-color: #F5F5F5;
    text-align: justify;
`;