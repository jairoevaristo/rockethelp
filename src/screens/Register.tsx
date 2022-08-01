import { useState } from "react";
import { Alert } from "react-native";
import { VStack } from "native-base";
import firestore from '@react-native-firebase/firestore';

import { Button } from "../components/Button";
import { Header } from "../components/Header";
import { Input } from "../components/Input";
import { useNavigation } from "@react-navigation/native";

export function Register() {
  const navigation = useNavigation();

  const [loading, setLoading] = useState(false);
  const [patrimony, setPatrimony] = useState('');
  const [description, setDescription] = useState('');

  function handleNewOrderRegister() {
    if (!patrimony && !description) {
      return Alert.alert('Preecha os campos');
    }

    setLoading(true);

    firestore()
      .collection('orders')
      .add({
        patrimony,
        description,
        status: 'open',
        created_at: firestore.FieldValue.serverTimestamp()
      }).then(() => {
        Alert.alert('Solicitação registrada com sucesso');
        navigation.goBack();
      })
      .catch((err) => {
        console.log(err);
        return Alert.alert('Não foi possível registrar o pedido');
      })
      .finally(() => setLoading(false))
  }

  return (
    <VStack 
      flex={1} 
      p={6} 
      bg="gray.600"
    >
      <Header title="Solicitação" />

      <Input 
        placeholder="Número do patrimônio"
        mt={5}
        onChangeText={setPatrimony}
      />

      <Input 
        placeholder="Descrição do problema"
        flex={1}
        mt={5}
        multiline
        textAlign="top"
        onChangeText={setDescription}
      />

      <Button 
        title="Cadastrar"
        mt={5}
        isLoading={loading}
        onPress={handleNewOrderRegister}
      />

    </VStack>
  )
}