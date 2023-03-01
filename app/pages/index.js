import { useRouter } from "next/router";
import {
  Button,
  Box,
  Container,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react";

export default function Home() {
  const router = useRouter();

  const { asPath } = router;
  const pathObjects = asPath.split("/");
  if (pathObjects && pathObjects.length === 3)
    router.push(`${pathObjects[1]}/${pathObjects[2]}`);

  const getId = () => {
    fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/create`)
      .then((response) => response.json())
      .then((data) => {
        localStorage.setItem(data.id, data.connectionKey);
        navigator.clipboard.writeText(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/${data.id}`
        );
        router.push(`${data.id}/${data.connectionKey}`);
      })
      .catch((err) => alert(err));
  };
  return (
    <div>
      <Container maxW="4xl" mt={20} mx="auto">
        <VStack>
          <Heading mb={2}>Hello!</Heading>
          <Box my={2}>
            <Text>
              Ever needed a temporary endpoint where you need to see the
              incoming request and payload?
            </Text>
            <Text>
              I know this may be oddly specific, but it seems from time to time
              I needed this.
            </Text>
            <Text>
              Simply click the button below, the webhook URL will be
              automatically copied.
            </Text>
            <Text>No need to refresh!</Text>
          </Box>
          <Button colorScheme="blue" onClick={getId}>
            Get ID
          </Button>
        </VStack>
      </Container>
    </div>
  );
}
