import React from 'react'
import './App.css'
import { PeerConnecion } from './peer-connection/PeerConnection'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <PeerConnecion />
      </header>
    </div>
  )
}

export default App
