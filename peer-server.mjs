import express from 'express';
import { ExpressPeerServer } from 'peer';
// const peerServer = PeerServer({ port: 8878, path: "/test-x", key: 'oxente', proxied: true });

const app = express();

app.enable("trust proxy");

const isProd = process?.env?.NODE_ENV === 'prod';
const serverPort = isProd ? 443 : 9000;

app.use('/', express.static('dist'));

const server = app.listen(serverPort, () => {
    console.log(`App listening on port ${serverPort}`);
    console.log("Press Ctrl+C to quit.");
});

const peerServer = ExpressPeerServer(server, {
    path: "/test-x",
    debug: true,
    // key: 'a-secret-key'
});

app.use("/", peerServer);

