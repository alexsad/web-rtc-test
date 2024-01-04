import PeerJs, { DataConnection } from 'peerjs';
import { useRef, useState } from 'react';

export interface IDataDetail {
    msg: string,
    id: string,
    userName: string,
    userId: string,
    date: number,
}

let gconn: DataConnection | null = null;
let gpeer: PeerJs | null = null;

const usePeer = () => {
    const [peerId, setPeerId] = useState<string>('');
    const [roomId, setRoomId] = useState<string>('');
    const _subData = useRef<(dataDetail: IDataDetail) => void>(() => { });

    const peerConfig = {
        host: location.hostname,
        port: Number(location.port || (location.protocol === 'https:' ? 443 : 80)),
        path: '/test-x',
    }

    // const peerConfig = {}

    const disconnect = () => {
        gpeer?.disconnect();
        gpeer?.destroy();
        gconn?.close();
        gconn = null;
        gpeer = null;
        setPeerId("");
        setRoomId("");
    }

    const subscribe = (fcb: (dataDetail: IDataDetail) => void) => {
        _subData.current = fcb;
    };

    const initialize = async () => {
        const peer = new PeerJs('', peerConfig);
        return new Promise<{
            peerId: string,
            peerInst: PeerJs,
        }>((success, error) => {
            peer.on('open', ppeerId => {
                success({
                    peerId: ppeerId,
                    peerInst: peer,
                });
            });
            peer.on('error', function (err) {
                error(err);
            })
        })
    }

    const startPeer = async () => {
        if (!!peerId) {
            return;
        }
        try {
            const { peerId, peerInst } = await initialize();
            peerInst?.on('connection', (pconn) => {
                pconn?.on("data", (data) => {
                    _subData.current(data as IDataDetail);
                    pconn.send(data as IDataDetail);
                });
                gconn = pconn;
            });

            setPeerId(peerId);
            setRoomId(peerId);

        } catch (error) {
            console.log(error);
        }
    }

    const joinToPeer = async (remotePeerId: string) => {
        if (!!peerId) {
            return;
        }
        try {
            const { peerId, peerInst } = await initialize();

            const pconn = peerInst?.connect(remotePeerId);
            pconn?.on('open', () => {
                gconn = pconn;
            })
            pconn?.on("data", (data) => {
                _subData.current(data as IDataDetail);
            });
            setRoomId(remotePeerId);
            setPeerId(peerId);
        } catch (error) {
            console.log(error);
        }
    }

    const sendData = (data: IDataDetail) => {
        gconn?.send(data);
    }


    return {
        startPeer,
        joinToPeer,
        sendData,
        subscribe,
        roomId,
        peerId,
        isHost: !!peerId && peerId === roomId,
        isConnected: !!peerId,
        disconnect,
    }

}

export { usePeer };

