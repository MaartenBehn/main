use anyhow::{Result, bail};
use serde::{Serialize, Deserialize};

use crate::{id_manager::IdManager, account::{EntryId, Cent, Account}};

pub type BudgetId = usize;
pub type CategoryId = usize;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BudgetController {
    budgets: Vec<Option<Budget>>,
    categories: Vec<Option<Category>>,

    budget_id_manager: IdManager,
    category_id_manager: IdManager,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Category {
    pub name: String,
    pub budget_ids: Vec<BudgetId>,
    pub id: CategoryId,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Budget {
    pub name: String, 
    pub ammount: Cent,
    pub id: BudgetId,

    pub entries: Vec<EntryId>,
    pub entry_ammount: Cent,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BudegtUI {
    pub id: BudgetId,
    pub name: String,
    pub ammount: Cent,
    pub fill: Cent,
}

impl BudgetController {
    pub fn new() -> Self {
        Self {
            categories: Vec::new(),
            budgets: Vec::new(),

            budget_id_manager: IdManager::new(),
            category_id_manager: IdManager::new(),
        }
    }

    pub fn add_budget(&mut self, name: &str, ammount: Cent) -> BudgetId {

        let id = self.budget_id_manager.get_id();
        self.budgets.push(Some(Budget { name: name.to_string(), ammount, id, entries: Vec::new(), entry_ammount: 0 }));
        id
    }

    pub fn remove_budget(&mut self, account: &mut Account, id: BudgetId) -> Result<()> {
        if id == 0 {
            bail!("Can't remove main Budget id: 0 !");
        }

        let budget = self.get_budget(id)?;
        for entry_id in budget.entries.to_owned().iter(){
            account.set_budget_of_entry(self, *entry_id, 0);
        }

        self.budget_id_manager.free_id(id);
        self.budgets[id] = None;

        Ok(())
    }

    pub fn budget_id_valid(&self, id: BudgetId) -> bool{
        self.budget_id_manager.is_valid(id)
    }

    pub fn get_budget(&self, budget_id: BudgetId) -> Result<&Budget> {
        if !self.budget_id_manager.is_valid(budget_id) {
            bail!("Budget Id {:?} not valid for{:?}!", budget_id, self);
        }

        Ok(self.budgets[budget_id].as_ref().unwrap())
    }

    pub fn get_budget_mut(&mut self, budget_id: BudgetId) -> Result<&mut Budget> {
        if !self.budget_id_manager.is_valid(budget_id) {
            bail!("Budget Id {:?} not valid for{:?}!", budget_id, self);
        }

        Ok(self.budgets[budget_id].as_mut().unwrap())
    }

    pub fn update_budget_entry_ammount(&mut self, account: &mut Account, budget_id: BudgetId) -> Result<()>{
        self.get_budget_mut(budget_id)?.update_entry_ammount(account)
    }

    pub fn add_category(&mut self, name: String) -> CategoryId {

        let id = self.category_id_manager.get_id();
        self.categories.push(Some(Category { name, budget_ids: Vec::new(), id }));
        id
    }

    pub fn remove_category(&mut self, id: CategoryId) {
        if self.category_id_manager.free_id(id) {
            return;
        }

        self.categories[id] = None;
    }

    pub fn category_id_valid(&self, id: CategoryId) -> bool{
        self.category_id_manager.is_valid(id)
    }

    pub fn get_category(&mut self, category_id: CategoryId) -> Result<&mut Category> {
        if !self.category_id_manager.is_valid(category_id) {
            bail!("Category Id not valid!");
        }

        Ok(self.categories[category_id].as_mut().unwrap())
    }

    pub fn add_budget_to_category(&mut self, budget_id: BudgetId, category_id: CategoryId) -> Result<()>{
        
        let category = self.get_category(category_id)?;

        category.budget_ids.push(budget_id);
        
        Ok(())
    }

    pub fn remove_budget_from_category(&mut self, budget_id: BudgetId, category_id: CategoryId) -> Result<()>{
        if !self.budget_id_manager.is_valid(budget_id) {
            bail!("Budget Id not valid!");
        }

        let category = self.get_category(category_id)?;
        let mut found_id = None; 
        for (i, test_budget_id) in category.budget_ids.iter().enumerate() {
            if *test_budget_id == budget_id {
                found_id = Some(i);
                break;
            }
        }

        if found_id.is_some() {
            category.budget_ids.remove(found_id.unwrap());
        } else {
            bail!("Budget not in Category!");
        }
        
        Ok(())
    }

}


impl BudgetController {
    pub fn get_budgets_ui(&self) -> Vec<BudegtUI> {
        let mut budgets = Vec::new();

        for budget in self.budgets.iter() {
            if budget.is_some() {
                budgets.push(budget.as_ref().unwrap().to_ui());
            }
        }

        budgets
    }
}

impl Budget {
    pub fn update_entry_ammount(&mut self, account: &mut Account) -> Result<()>{
        self.entry_ammount = 0;
        for entry_id in self.entries.iter() {

            let entry = account.get_entry(*entry_id)?;
            self.entry_ammount += entry.ammount;
        }

        Ok(())
    }

    pub fn to_ui(&self) -> BudegtUI {
        BudegtUI { 
            id: self.id,
            name: self.name.to_owned(), 
            ammount: self.ammount, 
            fill: self.entry_ammount 
        }
    }
}

