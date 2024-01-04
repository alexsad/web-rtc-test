import express from 'express';
import { ExpressPeerServer } from 'peer';
// const peerServer = PeerServer({ port: 8878, path: "/test-x", key: 'oxente', proxied: true });
import path from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();

app.enable("trust proxy");

const isProd = process?.env?.NODE_ENV === 'prod';
const serverPort = isProd ? 443 : 9000;

const root = path.join(path.dirname('dist'));

app.use(express.static("dist"));

// app.get("/", function (req, res) { res.redirect("/index.html"); });

// app.get('*', function (req, res) {
//     res.sendFile('index.html', { root });
// });

// app.get("/decks", (req, res) => {
//     res.sendFile(path.join(__dirname, "dist", "index.html"));
// });

// app.get("/catalog/:deckId", (req, res) => {
//     res.sendFile(path.join(__dirname, "dist", "index.html"));
// });


// app.get("/deck-selection/*", (req, res) => {
//     res.sendFile(path.join(__dirname, "dist", "index.html"));
// });

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