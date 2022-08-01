import { VStack, Text, Button, IButtonProps, useTheme } from "native-base";

type FilterProps = IButtonProps & {
  title: string;
  isActive?: boolean;
  type: 'open' | 'closed'
}

export function Filter({ title, type, isActive, ...rest }: FilterProps) {
  const { colors } = useTheme();

  const colorType = type === 'open' ? colors.secondary[700] : colors.green[300];

  return (
    <Button
      variant="outline"
      borderWidth={isActive ? 1 : 0}
      borderColor={colorType}
      bgColor="gray.600"
      flex={1}
      size="md"
      {...rest}
    >
      <Text 
        color={isActive ? colorType : colors.gray[300]}
        fontSize="xs"
        textTransform="uppercase"
      >
        {title}
      </Text>
    </Button>
  )
}