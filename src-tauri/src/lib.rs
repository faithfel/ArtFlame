// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use std::ffi::OsStr;
use sysinfo::{ProcessesToUpdate, System};

#[derive(serde::Serialize)]
    struct ProcessRuntime {
        pid: u32,
        name: String,
        run_time_seconds: u64,
        start_time_epoch: u64,
    }

#[tauri::command]
    fn get_software_runtime() -> Vec<ProcessRuntime> {
        
        const TARGET_SOFTWARE: &str = "sai2.exe";
        let mut sys = System::new();
        sys.refresh_processes(ProcessesToUpdate::All, true);

        sys.processes_by_exact_name(OsStr::new(TARGET_SOFTWARE))
            .map(|process| ProcessRuntime {
                pid: process.pid().as_u32(),
                name: process.name().to_string_lossy().into_owned(),
                run_time_seconds: process.run_time(),
                start_time_epoch: process.start_time(),
            })
            .collect()
    }

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![get_software_runtime])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
