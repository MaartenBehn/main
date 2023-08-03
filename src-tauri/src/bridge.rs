
use std::{sync::Mutex, thread, time};
use tauri::State;

use crate::{App, budget::{BudegtUI, BudgetId, BudgetController}, account::{EntryUI, Account, Cent, EntryId}};

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
pub fn edit_budget(app: State<App>, budget: BudegtUI) {
    let bc = &mut app.bc.lock().unwrap();

    bc.update_budget_with_ui(budget);
}

#[tauri::command(rename_all = "snake_case")]
pub fn remove_budget(app: State<App>, id: BudgetId){
    let bc = &mut app.bc.lock().unwrap();
    let account = &mut app.account.lock().unwrap();

    bc.remove_budget(account, id);
}

#[tauri::command(rename_all = "snake_case")]
pub fn get_entries(app: State<App>) -> Vec<EntryUI> {
    let bc = &mut app.bc.lock().unwrap();
    let account = &mut app.account.lock().unwrap();

    account.get_entries(bc)
}

#[tauri::command(rename_all = "snake_case")] // 
pub fn edit_entry(app: State<App>, entry: EntryUI) {
    let bc = &mut app.bc.lock().unwrap();
    let account = &mut app.account.lock().unwrap();

    account.update_with_ui(bc, entry);
}

#[tauri::command(rename_all = "snake_case")]
pub fn delete_entry(app: State<App>, id: EntryId){
    let bc = &mut app.bc.lock().unwrap();
    let account = &mut app.account.lock().unwrap();

    account.remove_entry(bc, id);
}