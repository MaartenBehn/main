
use std::sync::Mutex;
use tauri::State;

use crate::{App, budget::{BudegtUI, BudgetId, BudgetController}, account::{EntryUI, Account, Cent}};

#[tauri::command(rename_all = "snake_case")]
pub fn greet(name: &str) -> String {
   format!("Hello, {}!", name)
}

#[tauri::command(rename_all = "snake_case")]
pub fn get_budgets(app: State<App>) -> Vec<BudegtUI> {
    let bc = &mut app.bc.lock().unwrap();
    let account = &mut app.account.lock().unwrap();

    bc.get_budgets_ui()
}

#[tauri::command(rename_all = "snake_case")]
pub fn add_budget(app: State<App>, name: &str, ammount: Cent) {
    let bc = &mut app.bc.lock().unwrap();

    bc.add_budget(name, ammount);
}

#[tauri::command(rename_all = "snake_case")]
pub fn edit_budget(app: State<App>, id: BudgetId, name: &str, ammount: Cent) {
    let bc = &mut app.bc.lock().unwrap();

    let res = bc.get_budget_mut(id);
    let budget = if res.is_err() {return} else {res.unwrap()};
    budget.name = name.to_string();
    budget.ammount = ammount;
}

#[tauri::command(rename_all = "snake_case")]
pub fn delete_budget(app: State<App>, id: BudgetId){
    let bc = &mut app.bc.lock().unwrap();
    let account = &mut app.account.lock().unwrap();

    bc.remove_budget(account, id);
}

#[tauri::command]
pub fn get_entries(app: State<App>) -> Vec<EntryUI> {
    let bc = &mut app.bc.lock().unwrap();
    let account = &mut app.account.lock().unwrap();

    account.get_entries(bc)
}