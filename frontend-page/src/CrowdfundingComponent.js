import React, { useState, useEffect } from 'react';
import { createProject, fundProject, getProject, finalizeProject } from './soroban-contract-utils';
import { getPublicKey } from '@stellar/freighter-api';

export default function CrowdfundingComponent() {
    const [projectId, setProjectId] = useState('');
    const [project, setProject] = useState(null);
    const [amount, setAmount] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (projectId) {
            fetchProject();
        }
    }, [projectId]);

    const fetchProject = async () => {
        setLoading(true);
        setError('');
        try {
            const fetchedProject = await getProject(projectId);
            setProject(fetchedProject);
        } catch (error) {
            console.error('Error fetching project:', error);
            setError('Failed to fetch project. Please check the Project ID and try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateProject = async () => {
        setLoading(true);
        setError('');
        try {
            const creator = await getPublicKey();
            const goal = 1000; // Example goal
            const duration = 86400; // Example duration (1 day in seconds)
            const newProjectId = await createProject(creator, goal, duration);
            setProjectId(newProjectId);
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
            await fetchProject(); // Refresh project data
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
            await fetchProject(); // Refresh project data
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
            <button
                onClick={handleCreateProject}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
                disabled={loading}
            >
                {loading ? 'Processing...' : 'Create New Project'}
            </button>
            <div className="mb-4">
                <input
                    type="text"
                    value={projectId}
                    onChange={(e) => setProjectId(e.target.value)}
                    placeholder="Enter Project ID"
                    className="border p-2 mr-2"
                />
                <button
                    onClick={fetchProject}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    disabled={loading}
                >
                    {loading ? 'Fetching...' : 'Fetch Project'}
                </button>
            </div>
            {project && (
                <div className="border p-4 rounded">
                    <h2 className="text-xl font-semibold mb-2">Project Details</h2>
                    <p>Creator: {project.creator}</p>
                    <p>Goal: {project.goal}</p>
                    <p>Deadline: {new Date(project.deadline * 1000).toLocaleString()}</p>
                    <p>Raised: {project.raised}</p>
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