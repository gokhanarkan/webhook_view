import { customAlphabet } from "nanoid";

let clients = {};
let requests = [];

export const createId = (_, res) => {
  const id = customAlphabet("1234567890abcxyz", 10)();
  clients[id] = {};
  res.status(201).json({ id });
};

export const getRequests = (req, res) => {
  // Check user exists
  const client = req.params.id;
  if (!clients[client])
    return res.status(400).json({ error: "user not found" });

  clients[client].response = res;

  // Create headers
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    Connection: "keep-alive",
    "Cache-Control": "no-cache",
  });

  // Prepare response
  const data = requests.filter((request) => client == request.client);
  res.write(`data: ${JSON.stringify(data)}\n\n`);

  req.on("close", () => {
    console.log(`${client} Connection closed`);
    // TODO: Delete client and their requests
    // clients = clients.filter((c) => c !== client);
  });
};

export const saveRequest = async (req, res) => {
  // Check user exists
  const client = req.params.id;
  if (!clients[client])
    return res.status(400).json({ error: "user not found" });

  // Push to the collection
  requests.push({
    client,
    createdAt: Date.now(),
    request: {
      origin: req.headers.origin ?? "localhost",
      method: req.method,
      headers: req.headers,
      params: req.params,
      query: req.query,
      body: req.body,
    },
  });

  sendEventsToClient(
    clients[client],
    requests.filter((request) => request.client == client)
  );

  res.status(200).json({});
};

const sendEventsToClient = (_client, _requests) => {
  _client.response.write(`data: ${JSON.stringify(_requests)}\n\n`);
};
