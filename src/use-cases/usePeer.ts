import PeerJs, { DataConnection } from 'peerjs';
import { useEffect, useState } from 'react';

const usePeer = () => {
    const [availablePeer, setAvailablePeer] = useState<PeerJs>();
    const [connId, setConnId] = useState<string>('');
    const [conn, setConn] = useState<DataConnection>();

    const peerConfig = {
        host: "0.peerjs.com",
        port: 443,
        path: "/",
        pingInterval: 5000,
    }

    // const peerConfig = {
    //     host: "localhost",
    //     port: 5173,
    //     path: "/myapp",
    // }

    const createOffer = () => {
        setAvailablePeer(new PeerJs(peerConfig));
    }

    const acceptOffer = (offerId: string) => {
        setAvailablePeer(new PeerJs(offerId, peerConfig));
    }

    const connect = (otherOfferId: string) => {
        availablePeer?.on("connection", (pconn) => {
            console.log('conn:', pconn);
            pconn.on("data", (data) => {
                console.log("Received data", data);
            });
            setConn(pconn);
        });
        console.log('conn-outer id:', otherOfferId);
        availablePeer?.connect(otherOfferId);
    }

    const sendData = (data: any) => {
        console.log('data-to:', data);
        conn?.send(data);
    }

    useEffect(() => {
        if (availablePeer) {
            availablePeer.on('open', pconnId => {
                console.log('connid:', pconnId);
                setConnId(pconnId);
            });
        }
    }, [availablePeer])


    return {
        createOffer,
        acceptOffer,
        connect,
        connId,
        sendData,
    }

}

export { usePeer };

