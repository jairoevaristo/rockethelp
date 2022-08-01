import { useState } from 'react';
import { VStack, Heading, Icon, useTheme } from "native-base";
import { Envelope, Key } from 'phosphor-react-native';
import { Alert } from 'react-native';
import auth from '@react-native-firebase/auth'

import { Input } from "../components/Input";
import { Button } from "../components/Button";

import Logo from '../assets/logo_primary.svg';

export function SignIn() {
  const { colors } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loadind, setLoading] = useState(false);

  function handleSignIn() {
    if (!email && !password) {
      return Alert.alert('Preecha seu e-mail e senha');
    }
    
    setLoading(true);
    auth()
      .signInWithEmailAndPassword(email, password)
      .catch((err) => {
        console.log(err)

        if (err.code === 'auth/invalid-email') {
          return Alert.alert('E-mail ou senha inválido');
        }

        if (err.code === 'auth/wrong-password') {
          return Alert.alert('E-mail ou senha inválido');
        }

        if (err.code === 'auth/user-not-found') {
          return Alert.alert('Usuário não cadastrado');
        }

        return Alert.alert('Não possível acessar');
      })
      .finally(() => setLoading(false))
  }

  return (
    <VStack flex={1} alignItems="center" bg="gray.600" pt={24} px={8}>
      <Logo />

      <Heading color="gray.100" fontSize="xl" mt={20} mb={6}>
        Acesse sua conta
      </Heading>

      <Input 
        placeholder="Email"
        InputLeftElement={<Icon ml={4} as={<Envelope color={colors.gray[300]} />} />}
        mb={4}
        onChangeText={setEmail}
      />

      <Input 
        placeholder="Senha"
        InputLeftElement={<Icon ml={4} as={<Key color={colors.gray[300]} />} />}
        secureTextEntry
        onChangeText={setPassword}
        mb={8}
      />

      <Button 
        isLoading={loadind} 
        title="Entrar" 
        w="full" 
        onPress={handleSignIn} 
      />
    </VStack>
  )
}