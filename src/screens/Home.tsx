import { useEffect, useState } from "react";
import { Center, FlatList, Heading, HStack, IconButton, Text, useTheme, VStack } from "native-base";
import { ChatTeardropText, SignOut } from "phosphor-react-native";
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import { Button } from "../components/Button";
import { Filter } from "../components/Filter";
import { Order, OrderData } from "../components/Order";

import Logo from '../assets/logo_secondary.svg'
import { useNavigation } from "@react-navigation/native";
import { Alert } from "react-native";
import { Loading } from "../components/Loading";
import { dateFormat } from "../utils/firestoreDataFormat";

export function Home() {
  const { colors } = useTheme();
  const navigation = useNavigation();

  const [statusSelected, setStatusSelected] = useState<'open' | 'closed'>('open');
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<OrderData[]>([
      {
      id: '123',
      patrimony: '432432432',
      when: '18/07/2022 às 10:00',
      status: 'open'
    }
  ]);

  function handleNewOrder () {
    navigation.navigate('new');
  }

  function handleOrderDetails(orderId: string) {
    navigation.navigate('details', { orderId });
  }

  function handleLogout() {
    auth()
      .signOut()
      .catch((err) => {
        console.log(err);
        return Alert.alert('Não foi posível sair');
      })
  }
  

  const renderItemComponent = (item: OrderData) => {
    return <Order data={item} onPress={() => handleOrderDetails(item.id)} />;
  }

  useEffect(() => {
    setLoading(true);

    const subscriber = firestore()
      .collection('orders')
      .where('status', '==', statusSelected)
      .onSnapshot(snapshot => {
        const data = snapshot.docs.map(doc => {
          const { patrimony, description, status, created_at } = doc.data();
          
          return {
            id: doc.id,
            patrimony,
            status,
            description,
            created_at,
            when: dateFormat(created_at),
          }
        });

        setOrders(data);
        setLoading(false);
      });

      return subscriber;
  }, [statusSelected]);

  return (
    <VStack flex={1} pb={6} bg="gray.700">
      <HStack
        w="full"
        justifyContent="space-between"
        alignItems="center"
        bg="gray.600"
        pt={12}
        pb={5}
        px={6}
      >
        <Logo />

        <IconButton
          icon={<SignOut size={26} color={colors.gray[300]} />}
          onPress={handleLogout}
        />
      </HStack>

      <VStack flex={1} px={6}>
        <HStack 
          w="full"
          mt={8}
          mb={4}
          justifyContent="space-between"
          alignItems="center"
        >
          <Heading color="gray.100">
            Solicitações
          </Heading>

          <Text color="gray.200">
            {orders.length}
          </Text>
        </HStack>
        
        <HStack space={3} mb={8}>
          <Filter 
            type="open" 
            title="em andamento"
            onPress={() => setStatusSelected('open')}
            isActive={statusSelected === 'open'}
          />

          <Filter 
            type="closed" 
            title="finalizados"
            onPress={() => setStatusSelected('closed')}
            isActive={statusSelected === 'closed'}
          />
        </HStack>

        {
          loading 
            ? <Loading /> 
            : <FlatList 
                data={orders}
                keyExtractor={item => String(item.id)}
                renderItem={({ item }) => renderItemComponent(item)}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
                ListEmptyComponent={() => (
                  <Center>
                    <ChatTeardropText color={colors.gray[300]} size={40} />
                    <Text color="gray.300" fontSize="xl" mb={6} textAlign="center">
                      Você ainda não possui {"\n"} 
                      solicitações {statusSelected === 'open' ? 'em andamento' : 'finalizados'}
                    </Text>
                  </Center>
                )}
            />
        }

        <Button title="Nova solicitação" onPress={handleNewOrder} />
      </VStack>
    </VStack>
  )
}