import React, { useState, useEffect } from 'react';
import { SorobanRpc, Contract, Server } from 'soroban-client';
import { xdr, Networks } from 'stellar-sdk';

const contractId = 'YOUR_CONTRACT_ID_HERE'; // Replace with your deployed contract ID
const rpcUrl = 'https://soroban-testnet.stellar.org';



const server = new Server("https://soroban-testnet.stellar.org");

function App() {
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({ goal: '', duration: '' });

  useEffect(() => {
    // Fetch projects from the contract
    // This is a placeholder and needs to be implemented based on your contract interaction
  }, []);

  const createProject = async () => {
    // Implement project creation logic
    console.log('Creating project:', newProject);
  };

  const fundProject = async (projectId, amount) => {
    // Implement funding logic
    console.log('Funding project:', projectId, amount);
  };

  return (
    <div>
      <h1>Crowdfunding App</h1>
      <div>
        <h2>Create Project</h2>
        <input
          type="number"
          placeholder="Goal"
          value={newProject.goal}
          onChange={(e) => setNewProject({ ...newProject, goal: e.target.value })}
        />
        <input
          type="number"
          placeholder="Duration (in months)"
          value={newProject.duration}
          onChange={(e) => setNewProject({ ...newProject, duration: e.target.value })}
        />
        <button onClick={createProject}>Create Project</button>
      </div>
      <div>
        <h2>Projects</h2>
        {projects.map((project) => (
          <div key={project.id}>
            <h3>{project.id}</h3>
            <p>Goal: {project.goal}</p>
            <p>Raised: {project.raised}</p>
            <p>Deadline: {new Date(project.deadline * 1000).toLocaleString()}</p>
            <input type="number" placeholder="Amount to fund" />
            <button onClick={() => fundProject(project.id, /* amount */)}>Fund</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;

