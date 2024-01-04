import React, { useState } from "react";
import styled from "styled-components";
import { useDebouncedCallback } from "use-debounce";
import { useMount } from "../use-cases/useMount";
import { IDataDetail, usePeer } from "../use-cases/usePeer";

const PeerConnectionBox = styled.div`
    display: flex;
    flex-direction: column;
    row-gap: .5rem;
`;

const BasicInput = styled.input`
    height: 1.5rem;
`;

const MsgItem = styled.li`
    text-align: left;  
`;

const PeerConnecion: React.FC = () => {
    const { startPeer, isHost, sendData, joinToPeer, subscribe, roomId, peerId, isConnected } = usePeer();
    const [msgs, setMsgs] = useState<IDataDetail[]>([]);
    const [userName, setUserName] = useState<string>('')
    const hasUserName = userName.trim().length > 3;

    const changeUserNameDebounced = useDebouncedCallback((value: string) => {
        setUserName(value);
    }, 800);

    const onChangeUserName = (evt: React.ChangeEvent<HTMLInputElement>) => {
        changeUserNameDebounced(evt.target.value);
    }

    const onChangeMsg = (evt: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (evt.key === 'Enter') {
            const msgDetail = {
                date: new Date().getTime(),
                msg: evt.currentTarget.value,
                userName,
                id: `${new Date().getTime()}_${peerId}`,
                userId: peerId,
            };

            sendData(msgDetail);

            if (isHost) {
                setMsgs(oldMsgs => [
                    ...oldMsgs,
                    msgDetail,
                ])
            }

            evt.currentTarget.value = '';
        }
    }

    const startPeerHandle = async () => {
        await startPeer();
    }

    const joinPeerHandle = async () => {
        const remotePeerId = prompt("");
        if (remotePeerId && remotePeerId.trim().length > 8) {
            await joinToPeer(remotePeerId);
        }
    }

    useMount(async () => {
        subscribe(msgDetail => {
            setMsgs(oldMsgs => [
                ...oldMsgs,
                msgDetail,
            ])
        })
    });

    if (!isConnected) {
        return (
            <PeerConnectionBox>
                <label>
                    status: {isConnected ? 'connected' : 'not-connected'} v.0.0.1
                </label>
                <label>
                    <BasicInput type="text" onChange={onChangeUserName} placeholder="put your name here" />
                </label>
                <button disabled={!hasUserName} onClick={startPeerHandle}>
                    create a room
                </button>
                <button disabled={!hasUserName} onClick={joinPeerHandle}>
                    join a room
                </button>
            </PeerConnectionBox>
        )
    }

    return (
        <PeerConnectionBox>
            <label>
                status: {isConnected ? 'connected' : 'not-connected'}
            </label>
            <label>
                room id: {roomId}
            </label>
            <ol>
                {msgs.map((msgDetail) => (
                    <MsgItem
                        key={`${msgDetail.id}`}
                    >
                        @{msgDetail.userName}, {msgDetail.msg}
                    </MsgItem>
                ))}
            </ol>
            <label>
                your msg:
            </label>
            <textarea placeholder="write a msg and press enter to send!" onKeyUp={onChangeMsg} ></textarea>
        </PeerConnectionBox>
    )
}

export { PeerConnecion };

