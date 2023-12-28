import React, { useState } from "react";
import styled from "styled-components";
import { useDebouncedCallback } from "use-debounce";
import { usePeer } from "../use-cases/usePeer";

const PeerConnectionBox = styled.div`
    display: flex;
    flex-direction: column;
    row-gap: .5rem;
`;

const BasicInput = styled.input`
    height: 1.5rem;
`;


const PeerConnecion: React.FC = () => {
    const { createOffer, connect, connId, sendData } = usePeer();
    const isConnected = true;
    const [outerId, setOuterId] = useState('')

    const genOffer = async () => {
        const rs = await createOffer();
        console.log('rs:', rs);
    }

    const connectMe = () => {
        console.log('outer id:', outerId);
        connect(outerId);
    }

    const outerIdDebounced = useDebouncedCallback((value: string) => {
        setOuterId(value);
    }, 800);

    const onChangeOuterId = (evt: React.ChangeEvent<HTMLInputElement>) => {
        outerIdDebounced(evt.target.value);
    }

    const onChangeMsg = (evt: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (evt.key === 'Enter') {
            sendData(evt.currentTarget.value);
            evt.currentTarget.value = '';
        }
    }

    return (
        <PeerConnectionBox>
            <label>
                status: {isConnected ? 'connected' : 'not-connected'}
            </label>
            <button onClick={genOffer}>
                start peer
            </button>
            <label>
                {connId}
            </label>
            <label>
                <BasicInput type="text" onChange={onChangeOuterId} placeholder="put offer here" />
            </label>
            <button onClick={connectMe}>
                connect-me
            </button>

            <textarea onKeyUp={onChangeMsg} ></textarea>

        </PeerConnectionBox>
    )
}

export { PeerConnecion };

