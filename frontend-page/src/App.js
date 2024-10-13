import React, { useState } from 'react';
import { SorobanRpc, Contract } from 'soroban-client';
import { xdr, Networks } from 'stellar-sdk';

const contractId = 'YOUR_CONTRACT_ID_HERE'; // Replace with your deployed contract ID
const rpcUrl = 'https://soroban-testnet.stellar.org';

function App() {
  const [name, setName] = useState('');
  const [greeting, setGreeting] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Adjust according to the actual structure of the SorobanRpc
    const server = new SorobanRpc(rpcUrl); // or check how to correctly instantiate it
    const contract = new Contract(contractId);

    try {
      const result = await server.simulateTransaction(
        contract.call('greet', xdr.ScVal.scSymbol(name))
      );

      if (result.result) {
        const greetingSymbol = xdr.ScVal.fromXDR(result.result.retval);
        setGreeting(greetingSymbol.sym());
      }
    } catch (error) {
      console.error('Error calling contract:', error);
    }
  };

  return (
    <div className="App">
      <h1>Soroban Frontend Demo</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
        />
        <button type="submit">Get Greeting</button>
      </form>
      {greeting && <p>{greeting}</p>}
    </div>
  );
}

export default App;