import { Center, Spinner } from 'native-base'

export function Loading() {
  return (
    <Center flex={1} bg="gray.700">
      <Spinner bg="secondary.700" />
    </Center>
  )
}