use crate::{budget::{BudgetId, BudgetController}, id_manager::IdManager};

use anyhow::{bail, Ok, Result};
use serde::{Serialize, Deserialize};
use time::Date;

pub type Cent = i32;
pub type EntryId = usize;

pub struct Account {
    name: String,
    entries: Vec<Option<Entry>>,

    entry_id_manager: IdManager,
}

pub struct Entry {
    pub id: EntryId,
    pub name: String,
    pub ammount: Cent,
    pub note: String,
    pub budget: BudgetId,
    pub date: Date,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EntryUI {
    pub id: EntryId,
    pub name: String,
    pub ammount: Cent,
    pub note: String,
    pub budget: BudgetId,
    pub budget_name: String,
    pub date: String,
}


impl Account {
    pub fn new(name: &str) -> Self {
        Self {
            name: name.to_string(),
            entries: Vec::new(),
            entry_id_manager: IdManager::new(),
        }
    }

    pub fn add_entry(&mut self, bc: &mut BudgetController, name: &str, ammount: Cent, note: &str, to_budget: BudgetId, time: Date) -> EntryId {

        let id = self.entry_id_manager.get_id();
        self.entries.push(Some(Entry {id: id, name: name.to_string(), ammount, note: note.to_string(), budget: to_budget, date: time}));
        self.set_budget_of_entry(bc, id, to_budget);
        id
    }

    pub fn remove_entry(&mut self, bc: &mut BudgetController, id: EntryId) -> Result<()> {

        // Remove entry form budget
        let entry = self.get_entry(id)?;
        let budget = bc.get_budget_mut(entry.budget)?;

        let mut found_index = None;
        for (i, entry_id) in budget.entries.iter().enumerate() {
            if *entry_id == id {
                found_index = Some(i);
            }
        }

        if found_index.is_some() {
            budget.entries.remove(found_index.unwrap());
            budget.update_entry_ammount(self)?;
        }

        // Delete Entry
        self.entry_id_manager.free_id(id);
        self.entries[id] = None;

        Ok(())
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
            let last_budget = bc.get_budget_mut(entry.budget)?;

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

        let budget = bc.get_budget_mut(budget_id)?;
        if !budget.entries.contains(&entry_id) {
            budget.entries.push(entry_id);
            budget.update_entry_ammount(self)?;
        }

        Ok(())
    }
}

impl Account {
    pub fn get_entries(&self, bc: &BudgetController) -> Vec<EntryUI> {
        let mut entries = Vec::new();
        for entry in self.entries.iter() {
            if entry.is_some() {
                entries.push(entry.as_ref().unwrap().to_ui(bc))
            }
        }

        entries
    }

    pub fn update_with_ui(&mut self, bc: &mut BudgetController, ui: EntryUI) -> Result<()> {
        let entry = self.get_entry(ui.id)?;

        entry.name = ui.name;
        entry.note = ui.note;

        let ammount_update = entry.ammount != ui.ammount;
        let budget_update = entry.budget != ui.budget;
        
        if ammount_update {
            let budget = bc.get_budget_mut(entry.budget)?;
            
            entry.ammount = ui.ammount;
            budget.update_entry_ammount(self)?;
        }

        if budget_update {
            self.set_budget_of_entry(bc, ui.id, ui.budget)?;
        }

        Ok(())
    }
}

impl Entry {
    fn to_ui(&self, bc: &BudgetController) -> EntryUI {
        let (year, month, day) = self.date.to_calendar_date();

        EntryUI { 
            id: self.id,
            name: self.name.to_string(), 
            ammount: self.ammount, 
            note: self.note.to_string(), 
            budget: self.budget,
            budget_name: bc.get_budget(self.budget).unwrap().name.to_string(),
            date: format!("{:}-{:02}-{:}", year, month as u8, day)
        }
    }
}