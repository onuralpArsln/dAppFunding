#![no_std]
use soroban_sdk::{contract, contractimpl, vec, Env, String, Vec, log, symbol_short, Symbol};


struct Project {
    creator: Address,
    goal: i128,
    deadline: u64,
    raised: i128,
}

#[contract]
pub struct CrowdfundingContract;

#[contractimpl]
impl CrowdfundingContract {
    pub fn create_project(env: Env, creator: Address, goal: i128, duration: u64) -> Symbol {
        let project_id = symbol_short!("p", env.ledger().sequence());
        let deadline = env.ledger().timestamp() + duration;
        let project = Project {
            creator,
            goal,
            deadline,
            raised: 0,
        };
        env.storage().set(&project_id, &project);
        project_id
    }

    pub fn fund_project(env: Env, project_id: Symbol, funder: Address, amount: i128) {
        let mut project: Project = env.storage().get(&project_id).unwrap();
        assert!(env.ledger().timestamp() < project.deadline, "Project has ended");
        project.raised += amount;
        env.storage().set(&project_id, &project);
        let key = (project_id, funder);
        let current_funding = env.storage().get(&key).unwrap_or(0);
        env.storage().set(&key, &(current_funding + amount));
    }

    pub fn finalize_project(env: Env, project_id: Symbol) {
        let project: Project = env.storage().get(&project_id).unwrap();
        assert!(env.ledger().timestamp() >= project.deadline, "Project is still active");
        if project.raised >= project.goal {
            // Transfer funds to creator
            // (Implementation depends on how you handle token transfers)
        } else {
            // Refund all contributors
            // (Implementation depends on how you handle token transfers)
        }
        env.storage().remove(&project_id);
    }

    pub fn get_project(env: Env, project_id: Symbol) -> Project {
        env.storage().get(&project_id).unwrap()
    }
}