import { useState, useEffect } from 'react';
import firestore from '@react-native-firebase/firestore';
import { useNavigation, useRoute } from "@react-navigation/native";
import { HStack, useTheme, VStack, Text, ScrollView, Box } from "native-base";
import { CircleWavyCheck, ClipboardText, DesktopTower, Hourglass } from 'phosphor-react-native';

import { OrderFirestoreDTO } from '../dtos/OrderFirestoreDTO';

import { dateFormat } from '../utils/firestoreDataFormat';

import { Header } from "../components/Header";
import { OrderData } from '../components/Order';
import { Loading } from '../components/Loading';
import { CardDetails } from '../components/CardDetails';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Alert } from 'react-native';

type RouteDetailsParams = {
  orderId: string;
}

type OrderDetails = OrderData & {
  description: string;
  solution: string;
  closed: string;
}

export function Details() {
  const routes = useRoute();
  const navigation = useNavigation();
  const { orderId } = routes.params as RouteDetailsParams;
  const { colors } = useTheme();

  const [loading, setLoading] = useState(true);
  const [solution, setSolution] = useState('');
  const [order, setOrder] = useState({} as OrderDetails);

  function handleOrderClose() {
    if (solution) {
      return Alert.alert('Informe a solução para encerrar a solicitação')
    }

    firestore()
      .collection<OrderFirestoreDTO>('order')
      .doc(orderId)
      .update({
        status: 'closed',
        solution,
        closed_at: firestore.FieldValue.serverTimestamp()
      })
      .then(() => navigation.goBack())
      .catch((err) => {
        console.log(err);
        Alert.alert('Não foi possível encerrar a solitação')
      })
  }

  useEffect(() => {
    firestore()
      .collection<OrderFirestoreDTO>('orders')
      .doc(orderId)
      .get()
      .then(doc => {
        const { patrimony, description, status, closed_at, created_at, solution } = doc.data();
        const closed = closed_at ? dateFormat(closed_at) : null;
        
        setOrder({
          id: doc.id,
          patrimony,
          closed,
          description,
          solution,
          status,
          when: dateFormat(created_at),
        });

        setLoading(false);
      });


  }, []);

  if (loading) {
    return <Loading />
  }

  return (
    <VStack
      flex={1}
      bg="gray.700"
    >
      <Box px={6} color="gray.700">
        <Header title="solicitação" />
      </Box>

      <HStack bg="gray.500" justifyContent="center" p={4}>
        {
          order.closed === 'closed'
            ? <CircleWavyCheck size={22} color={colors.green[300]} />
            : <Hourglass size={22} color={colors.secondary[700]} />
        }

        <Text 
          fontSize="sm"
          color={order.status === 'closed' ? colors.green[300] : colors.secondary[700]}
          ml={2}
          textTransform="uppercase"
        >
          {order.status === 'closed' ? 'finalizado' : 'em andamento'}
        </Text>
      </HStack>

      <ScrollView mx={5} showsVerticalScrollIndicator={false}>
        <CardDetails 
          title="equipamento"
          description={`Patrimônio ${order.patrimony}`}
          icon={DesktopTower}
        />

        <CardDetails 
          title="descrição do problema"
          description={order.description}
          icon={ClipboardText}
          footer={`Registrado em ${order.when}`}
        />

        <CardDetails 
          title="solução"
          description={order.solution}
          icon={CircleWavyCheck}
          footer={order.closed && `Encerrado em ${order.closed}`}
        >
          
        {
          order.status === 'open' &&
            <Input
              placeholder="Descrição da solução"
              onChangeText={setSolution}
              multiline
              textAlignVertical="top"
              h={24}
            />
        }

        </CardDetails>
      </ScrollView>

      { order.status === 'open' && 
        <Button 
          title="Encerrar solicitação"
          mt={5}
          onPress={handleOrderClose}
        /> 
      }
    </VStack>
  )
}