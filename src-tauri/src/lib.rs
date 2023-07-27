use time::{Date, Month};

use account::{Account, EntryUI};
use budget::{BudgetController, BudegtUI};

mod id_manager;
mod account;
mod budget;

#[tauri::command]
fn greet(name: &str) -> String {
   format!("Hello, {}!", name)
}

#[tauri::command]
fn get_budgets(bc: tauri::State<BudgetController>) -> Vec<BudegtUI> {
    bc.get_budgets_ui()
}

#[tauri::command]
fn get_entries(account: tauri::State<Account>, bc: tauri::State<BudgetController>) -> Vec<EntryUI> {
    account.get_entries(&bc)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let mut bc = BudgetController::new();
    let budget_one_id = bc.add_budget("Budget One", 40000);

    let mut account = Account::new("main");
    account.add_entry(&mut bc, "entry1", 3412, "test note", budget_one_id, Date::from_calendar_date(2023, Month::July, 26).unwrap());
    account.add_entry(&mut bc, "entry2", 34545, "test note", budget_one_id, Date::from_calendar_date(2023, Month::July, 27).unwrap());

    tauri::Builder::default()
        .plugin(tauri_plugin_window::init())
        .plugin(tauri_plugin_shell::init())

        .manage(bc)
        .manage(account)

        .invoke_handler(tauri::generate_handler![
            greet,
            get_budgets,
            get_entries
        ])

        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
