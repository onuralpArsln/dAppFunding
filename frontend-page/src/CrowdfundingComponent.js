import React, { useState } from 'react';
import { createProject, getProject, fundProject, finalizeProject } from './soroban-contract-utils';
import { getPublicKey } from '@stellar/freighter-api';

export default function CrowdfundingComponent() {
    const [projectId, setProjectId] = useState('');
    const [project, setProject] = useState(null);
    const [goal, setGoal] = useState('');
    const [duration, setDuration] = useState(''); // Duration in days
    const [amount, setAmount] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Function to handle creating a new project
    const handleCreateProject = async () => {
        setLoading(true);
        setError('');
        try {
            const creator = await getPublicKey();  // Get public key of user
            const newProjectId = await createProject(creator, parseInt(goal), parseInt(duration)); // Pass duration as days
            setProjectId(newProjectId);
            setProject(await getProject(newProjectId)); // Fetch the newly created project
        } catch (error) {
            console.error('Error creating project:', error);
            setError('Failed to create project. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleFundProject = async () => {
        setLoading(true);
        setError('');
        try {
            const funder = await getPublicKey();
            await fundProject(projectId, funder, parseInt(amount));
            setProject(await getProject(projectId)); // Refresh project data after funding
        } catch (error) {
            console.error('Error funding project:', error);
            setError('Failed to fund project. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleFinalizeProject = async () => {
        setLoading(true);
        setError('');
        try {
            await finalizeProject(projectId);
            setProject(await getProject(projectId)); // Refresh project data after finalizing
        } catch (error) {
            console.error('Error finalizing project:', error);
            setError('Failed to finalize project. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Crowdfunding Project</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}

            {/* Input fields for project creation */}
            <div className="mb-4">
                <input
                    type="number"
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    placeholder="Goal (XLM)"
                    className="border p-2 mr-2"
                />
                <input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="Duration (in days)"
                    className="border p-2 mr-2"
                />
                <button
                    onClick={handleCreateProject}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    disabled={loading}
                >
                    {loading ? 'Creating Project...' : 'Create Project'}
                </button>
            </div>

            {/* Display project details */}
            {project && (
                <div className="border p-4 rounded">
                    <h2 className="text-xl font-semibold mb-2">Project Details</h2>
                    <p><strong>Creator:</strong> {project.creator}</p>
                    <p><strong>Goal:</strong> {project.goal} XLM</p>
                    <p><strong>Raised:</strong> {project.raised} XLM</p>
                    <p><strong>Deadline:</strong> {new Date(project.deadline * 1000).toLocaleString()}</p>

                    {/* Input for funding the project */}
                    <div className="mt-4">
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Amount to fund"
                            className="border p-2 mr-2"
                        />
                        <button
                            onClick={handleFundProject}
                            className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded mr-2"
                            disabled={loading}
                        >
                            {loading ? 'Processing...' : 'Fund Project'}
                        </button>
                        <button
                            onClick={handleFinalizeProject}
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                            disabled={loading}
                        >
                            {loading ? 'Processing...' : 'Finalize Project'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
