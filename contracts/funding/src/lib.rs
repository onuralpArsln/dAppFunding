#![no_std]
use soroban_sdk::{
    contract, contractimpl, Address, Env, IntoVal, Symbol, TryFromVal, Val,
    symbol_short, xdr::{ScErrorType, ScErrorCode}, // Updated import
};

#[derive(Clone)]
pub struct Project {
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
        let project_id = symbol_short!("p"); // Updated to symbol_short!
        let deadline = env.ledger().timestamp() + duration;
        let project = Project {
            creator,
            goal,
            deadline,
            raised: 0,
        };
        env.storage().instance().set(&project_id, &project);
        project_id
    }

    pub fn fund_project(env: Env, project_id: Symbol, funder: Address, amount: i128) {
        let mut project: Project = env.storage().instance().get(&project_id).unwrap();
        assert!(env.ledger().timestamp() < project.deadline, "Project has ended");
        project.raised += amount;
        env.storage().instance().set(&project_id, &project);
        let key = (project_id, funder);
        let current_funding: i128 = env.storage().persistent().get(&key).unwrap_or(0);
        env.storage().persistent().set(&key, &(current_funding + amount));
    }

    pub fn finalize_project(env: Env, project_id: Symbol) {
        let project: Project = env.storage().instance().get(&project_id).unwrap();
        assert!(env.ledger().timestamp() >= project.deadline, "Project is still active");
        if project.raised >= project.goal {
            // Transfer funds to creator
        } else {
            // Refund all contributors
        }
        env.storage().instance().remove(&project_id);
    }

    pub fn get_project(env: Env, project_id: Symbol) -> Project {
        env.storage().instance().get(&project_id).unwrap()
    }
}

impl TryFromVal<Env, Val> for Project {
    type Error = soroban_sdk::Error;

    fn try_from_val(env: &Env, val: &Val) -> Result<Self, Self::Error> {
        let (creator, goal, deadline, raised): (Address, i128, u64, i128) =
            TryFromVal::try_from_val(env, val).map_err(|_| soroban_sdk::Error::from((ScErrorType::Value, ScErrorCode::InternalError)))?;
        Ok(Project {
            creator,
            goal,
            deadline,
            raised,
        })
    }
}

impl IntoVal<Env, Val> for Project {
    fn into_val(&self, env: &Env) -> Val {
        (self.creator.clone(), self.goal, self.deadline, self.raised).into_val(env)
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::testutils::Address as _;

    #[test]
    fn test_create_project() {
        let env = Env::default();
        let contract_id = env.register_contract(None, CrowdfundingContract);
        let client = CrowdfundingContractClient::new(&env, &contract_id);

        let creator = Address::random(&env);
        let goal = 1000;
        let duration = 86400;

        let project_id = client.create_project(&creator, &goal, &duration);
        let project = client.get_project(&project_id);

        assert_eq!(project.creator, creator);
        assert_eq!(project.goal, goal);
        assert_eq!(project.raised, 0);
    }
}
