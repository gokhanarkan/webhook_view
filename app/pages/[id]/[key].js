import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Container,
  Text,
} from "@chakra-ui/react";
import dynamic from "next/dynamic";
const ReactJson = dynamic(() => import("react-json-view"), { ssr: false });

export default function Event() {
  const router = useRouter();

  const [requests, setRequests] = useState([]);
  const [listening, setListening] = useState(false);

  useEffect(() => {
    if (!router.isReady) return;

    if (!listening) {
      const { asPath } = router;
      const pathObjects = asPath.split("/");
      const eventId = pathObjects[1];
      const connectionKey = pathObjects[2];

      localStorage.setItem(eventId, connectionKey);

      const events = new EventSource(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/events/${router.query.id}/${connectionKey}`
      );

      events.onmessage = (event) => {
        const data = JSON.parse(event.data).sort(
          (x, y) => y.createdAt - x.createdAt
        );
        setRequests(data);
      };

      setListening(true);
    }
  }, [router.isReady, listening, requests]);

  return (
    <Container maxW="4xl">
      <Accordion allowMultiple>
        {requests.length
          ? requests.map((r, i) => (
              <AccordionItem key={i}>
                <h2>
                  <AccordionButton>
                    <Box flex="1" textAlign="left">
                      {r.request.method} request on{" "}
                      <b>{new Date(r.createdAt).toGMTString()}</b>
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  <ReactJson src={r.request} displayDataTypes={false} />
                </AccordionPanel>
              </AccordionItem>
            ))
          : null}
        <Text textAlign="center" mt={4}>
          No need to refresh this page. Webhook link should have been already
          copied.
        </Text>
      </Accordion>
    </Container>
  );
}
