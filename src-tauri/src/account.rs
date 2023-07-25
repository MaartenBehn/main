use crate::{budget::{BudgetId, BudgetController}, id_manager::IdManager};

use anyhow::{bail, Ok, Result};
use time::Date;

pub type Cent = i32;
pub type EntryId = usize;

pub struct Account {
    name: String,
    entries: Vec<Option<Entry>>,

    entry_id_manager: IdManager,
}

#[derive(Clone)]
pub struct Entry {
    pub name: String,
    pub ammount: Cent,
    pub note: String,
    pub budget: BudgetId,
    pub time: Date,
}


impl Account {
    pub fn new(name: String) -> Self {
        Self {
            name: name,
            entries: Vec::new(),
            entry_id_manager: IdManager::new(),
        }
    }

    pub fn add_entry(&mut self, bc: &mut BudgetController, name: String, ammount: Cent, note: String, to_budget: BudgetId, time: Date) -> EntryId {

        let id = self.entry_id_manager.get_id();
        self.entries.push(Some(Entry {name, ammount, note, budget: to_budget, time}));
        self.set_budget_of_entry(bc, id, to_budget);
        id
    }

    pub fn remove_entry(&mut self, id: EntryId) {
        if self.entry_id_manager.free_id(id) {
            return;
        }

        self.entries[id] = None;
    }

    pub fn get_entry(&mut self, entry_id: EntryId) -> Result<&mut Entry> {
        if !self.entry_id_manager.is_valid(entry_id) {
            bail!("Entry Id not valid!");
        }

        Ok(self.entries[entry_id].as_mut().unwrap())
    }

    pub fn set_budget_of_entry(&mut self, bc: &mut BudgetController, entry_id: EntryId, budget_id: BudgetId) -> Result<()> {
        
        let entry = self.get_entry(entry_id)?;
        if entry.budget != budget_id {
            let last_budget = bc.get_budget(entry.budget)?;

            let mut found_id = None;
            for (i, test_entry_id) in last_budget.entries.iter().enumerate() {
                if entry_id == *test_entry_id {
                    found_id = Some(i);
                }
            }

            if found_id.is_some() {
                last_budget.entries.remove(found_id.unwrap());
            }
        }

        entry.budget = budget_id;

        let budget = bc.get_budget(budget_id)?;
        if !budget.entries.contains(&entry_id) {
            budget.entries.push(entry_id);
            budget.update_entry_ammount(self)?;
        }

        Ok(())
    }
}