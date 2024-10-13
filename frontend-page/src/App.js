import React from 'react';
import CrowdfundingComponent from './CrowdfundingComponent';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1 className="text-3xl font-bold underline mb-4">
          Soroban Crowdfunding DApp
        </h1>
      </header>
      <main>
        <CrowdfundingComponent />
      </main>
    </div>
  );
}

export default App;