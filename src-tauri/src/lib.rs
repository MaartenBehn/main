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

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let mut bc = BudgetController::new();
    bc.add_budget("Budget One".to_string(), 123456789);

    tauri::Builder::default()
        .plugin(tauri_plugin_window::init())
        .plugin(tauri_plugin_shell::init())

        .manage(bc)

        .invoke_handler(tauri::generate_handler![
            greet,
            get_budgets
        ])

        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
