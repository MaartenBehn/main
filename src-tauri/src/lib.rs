use std::sync::Mutex;


use time::{Date, Month};

use account::{Account, EntryUI};
use budget::{BudgetController, BudegtUI, BudgetId};
use crate::bridge::*;

mod id_manager;
mod account;
mod budget;
mod bridge;

pub struct App {
    pub bc: Mutex<BudgetController>,
    pub account: Mutex<Account>,
}

impl App {
    fn new() -> Self {
        let mut bc = BudgetController::new();
        bc.add_budget("Main", 0);
        let budget_two_id = bc.add_budget("Budget Two", 34678977);
        let budget_three_id = bc.add_budget("Budget Three", 34977);

        let mut account = Account::new("main");
        account.add_entry(&mut bc, "entry1", 3412, "test note", budget_two_id, Date::from_calendar_date(2023, Month::July, 26).unwrap());
        account.add_entry(&mut bc, "entry2", 34545, "test note", budget_three_id, Date::from_calendar_date(2023, Month::July, 27).unwrap());
    
        Self { 
            bc: Mutex::new(bc), 
            account: Mutex::new(account) 
        }
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {

    let app = App::new();

    tauri::Builder::default()
        .plugin(tauri_plugin_window::init())
        .plugin(tauri_plugin_shell::init())

        .manage(app)

        .invoke_handler(tauri::generate_handler![
            greet,
            get_budgets,
            add_budget,
            edit_budget,
            delete_budget,
            get_entries
        ])

        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
