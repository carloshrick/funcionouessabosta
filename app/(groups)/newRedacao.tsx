import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, View, Text, TouchableOpacity, FlatList, Image } from "react-native";
import styled from "styled-components/native";
import { useRouter } from 'expo-router';
import apiConfig from '../../api/axios';
import { Link as ExpoRouterLink } from 'expo-router';

export type Modelos = {
    id: number,
    titulo: string,
    imagem: string,
    corpo_redacao: string
};

export default function NewGroup() {
    const [modelos, setModelos] = useState<Modelos[]>([]);
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    const handleModeloClick = (modelo: Modelos) => {  
        router.push({
            pathname: './editmodelo',
            params: { modeloTexto: modelo.corpo_redacao, modeloTitulo: modelo.titulo }
        });
    };

    useEffect(() => {
        async function fetchModelos() {
            try {
                const response = await apiConfig.get('/modelos');
                setModelos(response.data);
            } catch (error) {
                console.error('Erro ao buscar modelos de redação:', error);
            }
            finally {
                setIsLoading(false);
            }
        }

        fetchModelos();
    }, []);


    if (isLoading) {
return (
<LoadingContainer>
    <Image source={require('../../assets/fundologin.png')}   />
</LoadingContainer>



    )}
    return (
        <ContainerBody>
            <Container>

            </Container>

            <Div>
                <ButtonNovo href='./criarredacao'>
                    <ButtonText>Criar a Partir do Zero</ButtonText>
                </ButtonNovo>
            </Div>

            <ContentContainer>
                <FlatList
                    data={modelos}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => handleModeloClick(item)}>
                            <Card>
                                <Imagem source={{ uri: item.imagem }} />
                                <CardTitle>{item.titulo}</CardTitle>
                            </Card>
                        </TouchableOpacity>
                    )}
                />
            </ContentContainer>

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
        </ContainerBody>
    );
}


const ContainerBody = styled.View`
    flex: 1;
    background-color: #F5F5F5;
    align-items: center;
`;

const Container = styled.View`
    padding: 10px;
    align-items: center;
    margin-top: 30px;
`;

const Div = styled.View`
    padding: 20px;
    align-items: center;
    width: 100%;
`;

const Title = styled.Text`
    font-size: 24px;
    font-weight: bold;
    color: #18206f;
    margin-top: -50px;
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

const ButtonNovo = styled(ExpoRouterLink)`
    height: 60px;
    width: 100%;
    border-radius: 8px;
    background-color: #18206f;
    padding-top: 17.5px;
    text-align: center;
`;

const ButtonText = styled.Text`
    color: white;
    font-size: 20px;
    font-weight: 700;
`;

const Card = styled.View`
    background-color: white;
    border-radius: 8px;
    margin: 10px;
    padding: 10px;
    shadow-color: #000;
    shadow-offset: 0px 2px;
    shadow-opacity: 0.25;
    shadow-radius: 3.84px;
    elevation: 5;
    width: 370px; 
    height: 180px;
`;

const Imagem = styled.Image`
    width: 100%;
    height: 120px;
    border-radius: 8px;
`;

const CardTitle = styled.Text`
    font-size: 18px;
    font-weight: bold;
    margin-top: 10px;
    text-align: center;
    color:#18206f;
`;

const ContentContainer = styled.View`
    flex: 1;
    width: 100%;
    align-items: center;
    justify-content: center;
    margin-bottom:100px;
`;

const LoadingContainer = styled.View`
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: center;
    background-color: white;
`;