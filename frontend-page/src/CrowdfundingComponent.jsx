import React, { useState, useEffect } from "react";
import {
  createProject,
  getProject,
  fundProject,
  finalizeProject,
} from "./soroban-contract-utils.js";
import { getAddress } from "@stellar/freighter-api";
import * as FreighterAPI from "@stellar/freighter-api";
import "./CrowdfundingComponent.css"; // Import your CSS

export default function CrowdfundingComponent() {
  const [projectId, setProjectId] = useState("");
  const [project, setProject] = useState(null);
  const [goal, setGoal] = useState("");
  const [duration, setDuration] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const testFreighterConnection = async () => {
      try {
        const isConnected = await FreighterAPI.isConnected();
        const isAllowed = await FreighterAPI.isAllowed();
        const address = await getAddress();
        console.log("Freighter isConnected:", isConnected);
        console.log("Freighter isAllowed:", isAllowed);
        console.log("Public Key from test function:", address);
      } catch (error) {
        console.error("Test function error:", error);
      }
    };
    testFreighterConnection();
  }, []);

  const handleCreateProject = async () => {
    setLoading(true);
    setError("");
    try {
      console.log("Attempting to get public key");
      const creator = await getAddress(); // Get public key of user
      console.log("Public Key:", creator);

      if (!creator) {
        setError("Failed to create project. No address found.");
        setLoading(false);
        return;
      }

      console.log(
        "Creating project with creator:",
        creator,
        "goal:",
        goal,
        "duration:",
        duration
      );
      const newProjectId = await createProject(
        creator,
        parseInt(goal),
        parseInt(duration)
      );
      console.log("New Project ID:", newProjectId);
      setProjectId(newProjectId);

      const project = await getProject(newProjectId);
      console.log("Project Details:", project);
      setProject(project); // Fetch the newly created project
    } catch (error) {
      console.error("Error creating project:", error);
      setError("Failed to create project. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFundProject = async () => {
    setLoading(true);
    setError("");
    try {
      const funder = await getAddress();
      console.log("Funder Public Key:", funder);

      if (!funder) {
        setError("Failed to fund project. No address found.");
        setLoading(false);
        return;
      }

      await fundProject(projectId, funder, parseInt(amount));
      setProject(await getProject(projectId)); // Refresh project data after funding
    } catch (error) {
      console.error("Error funding project:", error);
      setError("Failed to fund project. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFinalizeProject = async () => {
    setLoading(true);
    setError("");
    try {
      await finalizeProject(projectId);
      setProject(await getProject(projectId)); // Refresh project data after finalizing
    } catch (error) {
      console.error("Error finalizing project:", error);
      setError("Failed to finalize project. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Crowdfunding Project</h1>
      {error && <p className="error">{error}</p>}
      <div className="project-creation">
        <label>
          Goal (XLM):
          <input
            type="number"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="Enter goal"
          />
        </label>
        <label>
          Duration (days):
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="Enter duration"
          />
        </label>
        <button onClick={handleCreateProject} disabled={loading}>
          {loading ? "Creating Project..." : "Create Project"}
        </button>
      </div>
      {project && (
        <div className="project-details">
          <h2>Project Details</h2>
          <p>
            <strong>Project ID:</strong> {projectId}
          </p>
          <p>
            <strong>Creator:</strong>{" "}
            {project.creator ? project.creator : "N/A"}
          </p>
          <p>
            <strong>Goal:</strong> {project.goal} XLM
          </p>
          <p>
            <strong>Raised:</strong> {project.raised} XLM
          </p>
          <p>
            <strong>Deadline:</strong>{" "}
            {new Date(project.deadline * 1000).toLocaleString()}
          </p>
          <label>
            Amount to fund:
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
            />
          </label>
          <button onClick={handleFundProject} disabled={loading}>
            {loading ? "Processing..." : "Fund Project"}
          </button>
          <button onClick={handleFinalizeProject} disabled={loading}>
            {loading ? "Processing..." : "Finalize Project"}
          </button>
        </div>
      )}
    </div>
  );
}
