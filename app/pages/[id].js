import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
} from "@chakra-ui/react";
const ReactJson = dynamic(() => import("react-json-view"), { ssr: false });

export default function Event() {
  const router = useRouter();

  const [requests, setRequests] = useState([]);
  const [listening, setListening] = useState(false);

  useEffect(() => {
    if (!router.isReady) return;

    if (!listening) {
      const events = new EventSource(
        `http://localhost:3001/${router.query.id}`
      );

      events.onmessage = (event) => {
        const parsedData = JSON.parse(event.data);
        setRequests((requests) => requests.concat(parsedData));
      };

      setListening(true);
    }
  }, [router.isReady, listening, requests]);

  return (
    <main>
      <Accordion allowMultiple>
        {requests.map((r, i) => (
          <AccordionItem key={i}>
            <h2>
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  {r.request.method} request on {r.createdAt}
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              <ReactJson src={r.request} displayDataTypes={false} />
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </main>
  );
}
