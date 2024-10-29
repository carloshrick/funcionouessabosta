import { TextInputProps } from "react-native";
import styled from "styled-components/native";

export default function InputRedacao({...rest}: TextInputProps) {
    return (
        <Container 
            placeholderTextColor={'#999'}
            {...rest}
        />
    );
}

const Container = styled.TextInput`
    flex: 1;
    margin-top: 10px;
    color: black;
    font-size: 18px;
    border-radius: 6px;
    padding: 20px;
    border-bottom-width: 2px;
    border-bottom-color: #18206f;
    text-align-vertical: top;
    border-color: transparent;
`;
