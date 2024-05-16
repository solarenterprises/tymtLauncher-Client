// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command

use std::sync::OnceLock;
use tauri::{ CustomMenuItem, SystemTray, SystemTrayEvent, SystemTrayMenu, SystemTrayMenuItem };
use actix_web::{ web, App, HttpResponse, HttpServer, Responder };
use serde::{ Deserialize, Serialize };
use dotenv::dotenv;
use std::env;

static APPHANDLE: OnceLock<tauri::AppHandle> = OnceLock::new();

#[tokio::main]
async fn main() -> std::io::Result<()> {
    let showvisible = CustomMenuItem::new("showVisible".to_string(), "Show tymtLauncher");
    let fullscreen = CustomMenuItem::new("fullscreen".to_string(), "Full-screen Mode  (F11)");
    let games = CustomMenuItem::new("games".to_string(), "Games");
    let wallet = CustomMenuItem::new("wallet".to_string(), "Wallet");
    let about = CustomMenuItem::new("about".to_string(), "About tymt");
    let signout = CustomMenuItem::new("signout".to_string(), "Sign Out");
    let quit = CustomMenuItem::new("quit".to_string(), "Quit");
    let disable_notifications = CustomMenuItem::new(
        "disable_notifications".to_string(),
        "Disable Notifications"
    );
    let tray_menu = SystemTrayMenu::new()
        .add_item(showvisible)
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(fullscreen)
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(games)
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(wallet)
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(signout)
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(disable_notifications)
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(about)
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(quit);

    let tray = SystemTray::new().with_menu(tray_menu);

    tauri::Builder
        ::default()
        .invoke_handler(
            tauri::generate_handler![
                download_and_unzip,
                download_appimage_linux,
                download_and_unzip_linux,
                download_and_unzip_macos,
                download_and_untarbz2_macos,
                download_and_unzip_windows,
                run_exe,
                run_linux,
                run_macos,
                run_app_macos,
                run_command,
                open_directory,
                get_machine_id,
                is_window_visible,
                show_transaction_window,
                hide_transaction_window,
                set_tray_items_enabled
            ]
        )
        .on_window_event(|event| {
            match event.event() {
                tauri::WindowEvent::CloseRequested { api, .. } => {
                    event.window().hide().unwrap();
                    api.prevent_close();
                }
                _ => {}
            }
        })
        .system_tray(tray)
        ///// SystemTray Event handlers
        .on_system_tray_event(|app, event| {
            match event {
                SystemTrayEvent::LeftClick { position: _, size: _, .. } => {
                    println!("system tray received a left click");
                }
                SystemTrayEvent::RightClick { position: _, size: _, .. } => {
                    println!("system tray received a right click");
                }
                SystemTrayEvent::DoubleClick { position: _, size: _, .. } => {
                    println!("system tray received a double click");
                    let window = app.get_window("tymtLauncher").unwrap();
                    window.show().unwrap();
                    window.set_focus().unwrap();
                }
                SystemTrayEvent::MenuItemClick { id, .. } =>
                    match id.as_str() {
                        "quit" => {
                            std::process::exit(0);
                        }
                        "hide" => {
                            let window = app.get_window("tymtLauncher").unwrap();
                            window.hide().unwrap();
                        }
                        "showVisible" => {
                            println!("showVisible received a left click");
                            let window = app.get_window("tymtLauncher").unwrap();
                            window.show().unwrap();
                            window.set_focus().unwrap();
                        }
                        "fullscreen" => {
                            let window = app.get_window("tymtLauncher").unwrap();
                            window.show().unwrap();
                            window.set_focus().unwrap();
                            window
                                .set_fullscreen(!window.is_fullscreen().unwrap())
                                .expect("failed to switch full-screen");
                        }
                        "wallet" => {
                            app.emit_all("wallet", "wallet").expect("failed to emit event wallet");
                            let window = app.get_window("tymtLauncher").unwrap();
                            window.show().unwrap();
                            window.set_focus().unwrap();
                        }
                        "games" => {
                            app.emit_all("games", "games").expect("failed to emit event games");
                            let window = app.get_window("tymtLauncher").unwrap();
                            window.show().unwrap();
                            window.set_focus().unwrap();
                        }
                        "about" => {
                            app.emit_all("about-tymt", "about").expect(
                                "failed to emit event about-tymt"
                            );
                        }
                        "signout" => {
                            app.emit_all("signout", "signout").expect(
                                "failed to emit event signout"
                            );
                            let window = app.get_window("tymtLauncher").unwrap();
                            window.show().unwrap();
                            window.set_focus().unwrap();
                        }
                        "disable_notifications" => {
                            app.emit_all("disable_notifications", "disable_notifications").expect(
                                "failed to emit event disable_notifications"
                            );
                        }
                        _ => {}
                    }
                _ => {}
            }
        })
        .setup(|app| {
            let app_handle = app.handle().clone();
            _ = APPHANDLE.set(app_handle);

            async fn hello() -> impl Responder {
                APPHANDLE.get()
                    .expect("APPHANDLE is available")
                    .emit_all("games", "games")
                    .expect("failed to emit event games");
                HttpResponse::Ok().body("Hello world!")
            }

            #[derive(Deserialize, Serialize)]
            struct MyJsonData {
                a: i32,
                b: i32,
            }

            async fn process_json(numbers: web::Json<MyJsonData>) -> HttpResponse {
                let json_data = serde_json
                    ::to_string(&numbers)
                    .expect("Failed to serialize JSON data");

                APPHANDLE.get()
                    .expect("APPHANDLE is available")
                    .emit_all("test-post-endpoint", json_data)
                    .expect("failed to emit event test-post-endpoint");

                let (tx, rx) = std::sync::mpsc::channel();

                let response = APPHANDLE.get()
                    .expect("APPHANDLE is available")
                    .listen_global("res-test-post-endpoint", move |event| {
                        let payload = event.payload().unwrap().to_string();
                        println!("res-test-post-endpoint {}", payload);
                        match tx.send(payload) {
                            Ok(()) => {
                                println!("Message sent successfully");
                            }
                            Err(err) => {
                                println!("Error sending message: {:?}", err);
                            }
                        }
                    });

                match rx.recv() {
                    Ok(received) => {
                        println!("Received: {}", received);
                        APPHANDLE.get().expect("APPHANDLE is available").unlisten(response);
                        return HttpResponse::Ok().body(format!("Sum of a and b is: {}", received));
                    }
                    Err(err) => {
                        println!("Error receiving message: {:?}", err);
                        APPHANDLE.get().expect("APPHANDLE is available").unlisten(response);
                        return HttpResponse::InternalServerError().finish();
                    }
                }
            }

            #[derive(Deserialize, Serialize)]
            struct GetAccountReqType {
                chain: String, // solar, evm, bitcoin, solana
            }
            async fn get_account(request_param: web::Json<GetAccountReqType>) -> HttpResponse {
                println!("-------> POST /get-account");

                let json_data = serde_json
                    ::to_string(&request_param)
                    .expect("Failed to serialize JSON data");
                println!("{}", json_data);

                APPHANDLE.get()
                    .expect("APPHANDLE is available")
                    .emit_all("POST-/get-account", json_data)
                    .expect("failed to emit event POST /get-account");

                let (tx, rx) = std::sync::mpsc::channel();

                let response = APPHANDLE.get()
                    .expect("APPHANDLE is available")
                    .listen_global("res-POST-/get-account", move |event| {
                        let payload = event.payload().unwrap().to_string();
                        println!("!!!----> res POST /get-account");
                        println!("{}", payload);
                        match tx.send(payload) {
                            Ok(()) => {
                                // println!("Message sent successfully");
                            }
                            Err(err) => {
                                println!("Error sending message: {:?}", err);
                            }
                        }
                    });

                match rx.recv() {
                    Ok(received) => {
                        // println!("Received: {}", received);
                        APPHANDLE.get().expect("APPHANDLE is available").unlisten(response);
                        return HttpResponse::Ok().body(received);
                    }
                    Err(err) => {
                        println!("Error receiving message: {:?}", err);
                        APPHANDLE.get().expect("APPHANDLE is available").unlisten(response);
                        return HttpResponse::InternalServerError().finish();
                    }
                }
            }

            #[derive(Deserialize, Serialize)]
            struct GetBalanceReqType {
                chain: String, // solar, bitcoin, solana, ethereum, polygon, avalanche, arbitrum, binance, optimism
                address: String,
            }
            async fn get_balance(request_param: web::Json<GetBalanceReqType>) -> HttpResponse {
                println!("-------> POST /get-balance");

                let json_data = serde_json
                    ::to_string(&request_param)
                    .expect("Failed to serialize JSON data");
                println!("{}", json_data);

                APPHANDLE.get()
                    .expect("APPHANDLE is available")
                    .emit_all("POST-/get-balance", json_data)
                    .expect("failed to emit event POST /get-balance");

                let (tx, rx) = std::sync::mpsc::channel();

                let response = APPHANDLE.get()
                    .expect("APPHANDLE is available")
                    .listen_global("res-POST-/get-balance", move |event| {
                        let payload = event.payload().unwrap().to_string();
                        println!("!!!----> res POST /get-balance");
                        println!("{}", payload);
                        match tx.send(payload) {
                            Ok(()) => {
                                // println!("Message sent successfully");
                            }
                            Err(err) => {
                                println!("Error sending message: {:?}", err);
                            }
                        }
                    });

                match rx.recv() {
                    Ok(received) => {
                        APPHANDLE.get().expect("APPHANDLE is available").unlisten(response);
                        return HttpResponse::Ok().json(received);
                    }
                    Err(err) => {
                        println!("Error receiving message: {:?}", err);
                        APPHANDLE.get().expect("APPHANDLE is available").unlisten(response);
                        return HttpResponse::InternalServerError().finish();
                    }
                }
            }

            #[derive(Deserialize, Serialize)]
            struct SendTransactionReqType {
                chain: String, // solar, bitcoin, solana, ethereum, polygon, avalanche, arbitrum, binance, optimism
                to: String,
                amount: String,
            }
            async fn send_transaction(
                request_param: web::Json<SendTransactionReqType>
            ) -> HttpResponse {
                println!("-------> POST /send-transaction");

                show_transaction_window(APPHANDLE.get().unwrap().clone()).await;

                let json_data = serde_json
                    ::to_string(&request_param)
                    .expect("Failed to serialize JSON data");
                println!("{}", json_data);

                APPHANDLE.get()
                    .expect("APPHANDLE is available")
                    .emit_all("POST-/send-transaction", json_data)
                    .expect("failed to emit event POST /send-transaction");

                let (tx, rx) = std::sync::mpsc::channel();

                let response = APPHANDLE.get()
                    .expect("APPHANDLE is available")
                    .listen_global("res-POST-/send-transaction", move |event| {
                        let payload = event.payload().unwrap().to_string();
                        println!("!!!----> res POST /send-transaction");
                        println!("{}", payload);
                        match tx.send(payload) {
                            Ok(()) => {
                                // println!("Message sent successfully");
                            }
                            Err(err) => {
                                println!("Error sending message: {:?}", err);
                            }
                        }
                    });

                match rx.recv() {
                    Ok(received) => {
                        // println!("Received: {}", received);
                        APPHANDLE.get().expect("APPHANDLE is available").unlisten(response);
                        return HttpResponse::Ok().body(received);
                    }
                    Err(err) => {
                        println!("Error receiving message: {:?}", err);
                        APPHANDLE.get().expect("APPHANDLE is available").unlisten(response);
                        return HttpResponse::InternalServerError().finish();
                    }
                }
            }

            dotenv().ok();
            let port_str = env
                ::var("VITE_APP_LOCAL_SERVER_PORT")
                .expect("VITE_APP_LOCAL_SERVER_PORT must be set");
            let port: u16 = port_str
                .parse()
                .expect("VITE_APP_LOCAL_SERVER_PORT must be a valid u16");

            tauri::async_runtime::spawn(
                HttpServer::new(move || {
                    App::new()
                        .route(
                            "/game-request",
                            web::get().to(move || hello())
                        )
                        .route("/test-post-endpoint", web::post().to(process_json))
                        .route("/get-account", web::post().to(get_account))
                        .route("/get-balance", web::post().to(get_balance))
                        .route("/send-transaction", web::post().to(send_transaction))
                })
                    .bind(("127.0.0.1", port))
                    .expect("Failed to bind address")
                    .run()
            );

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tymtlauncher");

    Ok(())
}

// use std::os::unix::fs::PermissionsExt;
use std::fs::File;
use std::io::prelude::*;
use std::path::Path;
use std::path::PathBuf;
use std::process::Command;
use std::{ fs, io };
use tauri::Manager;
use machineid_rs::{ IdBuilder, Encryption, HWIDComponent };

fn copy_dir_all(src: impl AsRef<Path>, dst: impl AsRef<Path>) -> io::Result<()> {
    fs::create_dir_all(&dst)?;
    for entry in fs::read_dir(src)? {
        let entry = entry?;
        let ty = entry.file_type()?;
        if ty.is_dir() {
            copy_dir_all(entry.path(), dst.as_ref().join(entry.file_name()))?;
        } else {
            fs::copy(entry.path(), dst.as_ref().join(entry.file_name()))?;
        }
    }
    Ok(())
}

#[tauri::command]
async fn download_appimage_linux(
    app_handle: tauri::AppHandle,
    url: String,
    target: String
) -> bool {
    let app_dir = app_handle
        .path_resolver()
        .app_data_dir()
        .unwrap()
        .into_os_string()
        .into_string()
        .to_owned()
        .unwrap();
    let response = reqwest::get(&url).await.unwrap();
    let location = (app_dir.to_string() + &target + "/tmp.AppImage").to_owned();

    println!("{}", location);

    let path = Path::new(&location);

    println!("{}", path.display());

    if let Some(parent) = path.parent() {
        // Check if the parent directory exists, if not, create it
        if !parent.exists() {
            match fs::create_dir_all(&parent) {
                Err(why) => panic!("couldn't create directory: {}", why),
                Ok(_) => println!("Successfully created the directory"),
            }
        }
    }

    let mut file = match File::create(&path) {
        Err(why) => panic!("couldn't create {}", why),
        Ok(file) => file,
    };

    let content = response.bytes().await.unwrap();
    let _ = file.write_all(content.as_ref());
    println!("download done");

    let status = Command::new("chmod")
        .args(&["+x", &location])
        .status()
        .expect("Failed to run chmod command");

    if !status.success() {
        eprintln!("Failed to make tymtLauncher.AppImage executable");
        return false;
    }

    println!("Download AppImage Linux Done.");

    return true;
}

#[tauri::command]
async fn download_and_unzip(app_handle: tauri::AppHandle, url: String, target: String) -> bool {
    println!("{}", url);
    println!("{}", target);

    let app_dir = app_handle
        .path_resolver()
        .app_data_dir()
        .unwrap()
        .into_os_string()
        .into_string()
        .to_owned()
        .unwrap();

    let response = reqwest::get(&url).await.unwrap();

    let zip_location = (app_dir.to_string() + "/tmp.zip").to_owned();
    println!("{}", zip_location);

    let path = Path::new(&zip_location);

    if let Some(parent) = path.parent() {
        // Check if the parent directory exists, if not, create it
        if !parent.exists() {
            match fs::create_dir_all(&parent) {
                Err(why) => panic!("couldn't create directory: {}", why),
                Ok(_) => println!("Successfully created the directory"),
            }
        }
    }

    let mut file = match File::create(&path) {
        Err(why) => panic!("couldn't create {}", why),
        Ok(file) => file,
    };
    let content = response.bytes().await.unwrap();
    let _ = file.write_all(content.as_ref());

    let final_location = app_dir.to_string() + &target;
    println!("{}", final_location);
    let _ = zip_extensions::read::zip_extract(
        &PathBuf::from(path),
        &PathBuf::from(final_location.clone())
    );
    println!("checking for folders");

    let count = fs::read_dir(final_location.clone()).unwrap().count();
    println!("found {} folders", count);
    if count == 1 {
        for file in fs::read_dir(final_location.clone()).unwrap() {
            if fs::metadata(file.as_ref().unwrap().path()).unwrap().is_dir() {
                let _ = copy_dir_all(file.as_ref().unwrap().path(), final_location.clone());
                fs::remove_dir_all(file.as_ref().unwrap().path()).unwrap();
            }
        }
    }

    let _ = fs::remove_file(&path);

    let _ = Command::new("chmod").args(["+x", &final_location]).spawn();

    println!("done");
    return true;
}

#[tauri::command]
async fn download_and_unzip_windows(
    app_handle: tauri::AppHandle,
    url: String,
    target: String
) -> bool {
    println!("{}", url);
    println!("{}", target);

    let app_dir = app_handle
        .path_resolver()
        .app_data_dir()
        .unwrap()
        .into_os_string()
        .into_string()
        .to_owned()
        .unwrap();

    let response = reqwest::get(&url).await.unwrap();

    let zip_location = (app_dir.to_string() + "/tmp.zip").to_owned();
    println!("{}", zip_location);

    let path = Path::new(&zip_location);

    if let Some(parent) = path.parent() {
        // Check if the parent directory exists, if not, create it
        if !parent.exists() {
            match fs::create_dir_all(&parent) {
                Err(why) => panic!("couldn't create directory: {}", why),
                Ok(_) => println!("Successfully created the directory"),
            }
        }
    }

    let mut file = match File::create(&path) {
        Err(why) => panic!("couldn't create {}", why),
        Ok(file) => file,
    };

    let content = response.bytes().await.unwrap();
    let total_size = content.len();
    let part_size = total_size / 100; // This determines the size of each part.

    for i in 0..100 {
        let start = i * part_size;
        let end = if i == 99 { total_size } else { start + part_size };
        let part = &content[start..end];

        file.write_all(part).expect("Failed to write part to file");
        let progress = (((i + 1) as f64) / 100.0) * 100.0; // i + 1 to make progress go from ~1% to 100%
        println!("Downloading {} %", progress);
        app_handle.emit_all("download-progress", &progress).expect("Failed to emit progress event");
    }

    let zip_file1 = File::open(&path).unwrap();

    let _zip = zip::ZipArchive::new(zip_file1).unwrap();

    let final_location = app_dir.to_string() + &target;
    println!("{}", final_location);
    let _ = zip_extensions::read::zip_extract(
        &PathBuf::from(path),
        &PathBuf::from(final_location.clone())
    );
    println!("checking for folders");

    let count = fs::read_dir(final_location.clone()).unwrap().count();
    println!("found {} folders", count);
    if count == 1 {
        for file in fs::read_dir(final_location.clone()).unwrap() {
            if fs::metadata(file.as_ref().unwrap().path()).unwrap().is_dir() {
                let _ = copy_dir_all(file.as_ref().unwrap().path(), final_location.clone());
                fs::remove_dir_all(file.as_ref().unwrap().path()).unwrap();
            }
        }
    }

    let _ = fs::remove_file(&path);

    let _ = Command::new("chmod").args(["+x", &final_location]).spawn();

    println!("done");
    return true;
}

#[tauri::command]
async fn download_and_unzip_linux(
    app_handle: tauri::AppHandle,
    url: String,
    target: String,
    exeLocation: String
) -> bool {
    println!("{}", url);
    println!("{}", target);

    let app_dir = app_handle
        .path_resolver()
        .app_data_dir()
        .unwrap()
        .into_os_string()
        .into_string()
        .to_owned()
        .unwrap();

    let response = reqwest::get(&url).await.unwrap();

    let zip_location = (app_dir.to_string() + "/tmp.zip").to_owned();
    println!("{}", zip_location);

    let path = Path::new(&zip_location);

    if let Some(parent) = path.parent() {
        // Check if the parent directory exists, if not, create it
        if !parent.exists() {
            match fs::create_dir_all(&parent) {
                Err(why) => panic!("couldn't create directory: {}", why),
                Ok(_) => println!("Successfully created the directory"),
            }
        }
    }

    let mut file = match File::create(&path) {
        Err(why) => panic!("couldn't create {}", why),
        Ok(file) => file,
    };

    let content = response.bytes().await.unwrap();
    let total_size = content.len();
    let part_size = total_size / 100; // This determines the size of each part.

    for i in 0..100 {
        let start = i * part_size;
        let end = if i == 99 { total_size } else { start + part_size };
        let part = &content[start..end];

        file.write_all(part).expect("Failed to write part to file");

        let progress = (((i + 1) as f64) / 100.0) * 100.0; // i + 1 to make progress go from ~1% to 100%

        println!("Downloading {} %", progress);
        app_handle.emit_all("download-progress", &progress).expect("Failed to emit progress event");
    }

    let zip_file1 = File::open(&path).unwrap();

    let _zip = zip::ZipArchive::new(zip_file1).unwrap();

    let final_location = app_dir.to_string() + &target;
    println!("{}", final_location);
    let _ = zip_extensions::read::zip_extract(
        &PathBuf::from(path),
        &PathBuf::from(final_location.clone())
    );
    println!("checking for folders");

    let count = fs::read_dir(final_location.clone()).unwrap().count();
    println!("found {} folders", count);
    if count == 1 {
        for file in fs::read_dir(final_location.clone()).unwrap() {
            if fs::metadata(file.as_ref().unwrap().path()).unwrap().is_dir() {
                let _ = copy_dir_all(file.as_ref().unwrap().path(), final_location.clone());
                fs::remove_dir_all(file.as_ref().unwrap().path()).unwrap();
            }
        }
    }

    let _ = fs::remove_file(&path);

    let exePath = app_dir.to_string() + &target + &exeLocation;

    let _ = Command::new("chmod").args(["u+x", &exePath]).spawn();

    println!("done");
    return true;
}

#[tauri::command]
async fn download_and_unzip_macos(
    app_handle: tauri::AppHandle,
    url: String,
    target: String,
    exeLocation: String
) -> bool {
    println!("{}", url);
    println!("{}", target);

    let app_dir = app_handle
        .path_resolver()
        .app_data_dir()
        .unwrap()
        .into_os_string()
        .into_string()
        .to_owned()
        .unwrap();

    let response = reqwest::get(&url).await.unwrap();

    let zip_location = (app_dir.to_string() + "/tmp.zip").to_owned();
    println!("{}", zip_location);

    let path = Path::new(&zip_location);

    // Ensure the directory exists
    if let Some(parent) = path.parent() {
        // Check if the parent directory exists, if not, create it
        if !parent.exists() {
            match fs::create_dir_all(&parent) {
                Err(why) => panic!("couldn't create directory: {}", why),
                Ok(_) => println!("Successfully created the directory"),
            }
        }
    }

    let mut file = match File::create(&path) {
        Err(why) => panic!("couldn't create {}", why),
        Ok(file) => file,
    };
    let content = response.bytes().await.unwrap();
    let _ = file.write_all(content.as_ref());

    let final_location = app_dir.to_string() + &target;
    println!("{}", final_location);
    let _ = zip_extensions::read::zip_extract(
        &PathBuf::from(path),
        &PathBuf::from(final_location.clone())
    );
    println!("checking for folders");

    let count = fs::read_dir(final_location.clone()).unwrap().count();
    println!("found {} folders", count);
    if count == 1 {
        for file in fs::read_dir(final_location.clone()).unwrap() {
            if fs::metadata(file.as_ref().unwrap().path()).unwrap().is_dir() {
                let _ = copy_dir_all(file.as_ref().unwrap().path(), final_location.clone());
                fs::remove_dir_all(file.as_ref().unwrap().path()).unwrap();
            }
        }
    }

    let _ = fs::remove_file(&path);

    let exePath = app_dir.to_string() + &target + &exeLocation;

    let _ = Command::new("chmod").args(["+x", &exePath]).spawn();

    println!("done");
    return true;
}

#[tauri::command]
async fn download_and_untarbz2_macos(
    app_handle: tauri::AppHandle,
    url: String,
    target: String,
    exeLocation: String
) -> bool {
    println!("{}", url);
    println!("{}", target);

    let app_dir = app_handle
        .path_resolver()
        .app_data_dir()
        .unwrap()
        .into_os_string()
        .into_string()
        .to_owned()
        .unwrap();

    let response = reqwest::get(&url).await.unwrap();

    let tarbz2_location = (app_dir.to_string() + "/tmp.tar.bz2").to_owned();
    println!("{}", tarbz2_location);

    let path = Path::new(&tarbz2_location);

    // Ensure the directory exists
    if let Some(parent) = path.parent() {
        // Check if the parent directory exists, if not, create it
        if !parent.exists() {
            match fs::create_dir_all(&parent) {
                Err(why) => panic!("couldn't create directory: {}", why),
                Ok(_) => println!("Successfully created the directory"),
            }
        }
    }

    // Download start
    let mut file = match File::create(&path) {
        Err(why) => panic!("couldn't create {}", why),
        Ok(file) => file,
    };
    let content = response.bytes().await.unwrap();
    file.write_all(content.as_ref()).unwrap();
    // Download end

    let final_location = app_dir.to_string() + &target;
    println!("{}", final_location);

    let final_path = Path::new(&final_location);

    if !final_path.exists() {
        match fs::create_dir_all(&final_path) {
            Err(why) => panic!("couldn't create directory: {}", why),
            Ok(_) => println!("Successfully created the directory"),
        }
    }

    // Untarbz2
    Command::new("tar")
        .args(["-xvjf", &tarbz2_location, "-C", &final_location])
        .output()
        .expect("failed to unzip");

    // Remove tar.bz2
    let _ = fs::remove_file(&path);

    let exePath = app_dir.to_string() + &target + &exeLocation;

    // Make it executable
    Command::new("chmod").args(["+x", &exePath]).output().expect("failed to make it executable");

    println!("done");
    return true;
}

#[tauri::command]
fn run_command(command: String) {
    // Split the command line into the executable and its arguments
    let parts: Vec<&str> = command.split_whitespace().collect();
    if parts.is_empty() {
        println!("No command provided");
        return;
    }

    let (exe, args) = parts.split_at(1);

    // Start building the command with the executable
    let mut command_0 = Command::new(exe[0]);

    // Add each argument
    for arg in args {
        command_0.arg(*arg);
    }

    // Attempt to spawn the process
    match command_0.spawn() {
        Ok(_) => println!("Process started successfully"),
        Err(e) => eprintln!("Failed to start process: {}", e),
    }
}

#[tauri::command]
fn run_exe(url: String) {
    // Split the command line into the executable and its arguments
    println!("{}", url);
    let parts: Vec<&str> = url.split_whitespace().collect();
    if parts.is_empty() {
        println!("No command provided");
        return;
    }

    let (exe, args) = parts.split_at(1);

    println!("{}", exe[0]);

    // Start building the command with the executable
    let mut command = Command::new(exe[0]);

    // Add each argument
    for arg in args {
        command.arg(*arg);
    }

    // Attempt to spawn the process
    match command.spawn() {
        Ok(_) => println!("Process started successfully"),
        Err(e) => eprintln!("Failed to start process: {}", e),
    }
}

#[tauri::command]
fn run_linux(url: String) {
    // Use std::process::Command to run your .exe file
    Command::new(url).spawn().expect("failed to execute process");
}

#[tauri::command]
fn run_macos(url: String) {
    Command::new(url).spawn().expect("failed to execute process");
}

#[tauri::command]
fn run_app_macos(url: String) {
    Command::new("open").args([url]).spawn().expect("failed to execute process");
}

#[tauri::command]
fn open_directory(path: &str) {
    let mut cmd = if cfg!(target_os = "windows") {
        Command::new("explorer")
    } else if cfg!(target_os = "macos") {
        Command::new("open")
    } else {
        Command::new("xdg-open")
    };
    cmd.arg(path);

    match cmd.output() {
        Ok(output) => println!("Opened directory successfully: {:?}", output),
        Err(e) => println!("Failed to open directory: {}", e),
    }
}

#[tauri::command]
fn get_machine_id() -> Result<String, String> {
    let mut builder = IdBuilder::new(Encryption::SHA256);
    builder.add_component(HWIDComponent::SystemID);
    let hwid = builder.build("tymtLauncher").map_err(|err| err.to_string())?;

    Ok(hwid)
}

#[tauri::command]
fn is_window_visible(window: tauri::Window) -> bool {
    window.is_visible().unwrap_or(false)
}

#[tauri::command]
async fn show_transaction_window(app_handle: tauri::AppHandle) {
    if let Some(window) = app_handle.get_window("tymt_d53_transaction") {
        if let Err(e) = window.show() {
            eprintln!("Failed to show window: {}", e);
        }
    } else {
        eprintln!("Window 'tymt_d53_transaction' not found");
    }

    if let Some(window_to_hide) = app_handle.get_window("tymtLauncher") {
        if let Err(e) = window_to_hide.hide() {
            eprintln!("Failed to hide window 'tymtLauncher': {}", e);
        }
    } else {
        eprintln!("Window 'tymtLauncher' not found");
    }

    let item_ids = vec![
        "showVisible".to_string(),
        "fullscreen".to_string(),
        "games".to_string(),
        "wallet".to_string(),
        "about".to_string(),
        "signout".to_string(),
        "quit".to_string(),
        "disable_notifications".to_string()
    ];
    let enabled = false;
    set_tray_items_enabled(app_handle, item_ids, enabled).await
}

#[tauri::command]
async fn hide_transaction_window(app_handle: tauri::AppHandle) {
    if let Some(window) = app_handle.get_window("tymt_d53_transaction") {
        if let Err(e) = window.hide() {
            eprintln!("Failed to hide window: {}", e);
        }
    } else {
        eprintln!("Window 'tymt_d53_transaction' not found");
    }

    if let Some(window_to_hide) = app_handle.get_window("tymtLauncher") {
        if let Err(e) = window_to_hide.show() {
            eprintln!("Failed to show window 'tymtLauncher': {}", e);
        }
    } else {
        eprintln!("Window 'tymtLauncher' not found");
    }

    let item_ids = vec![
        "showVisible".to_string(),
        "fullscreen".to_string(),
        "games".to_string(),
        "wallet".to_string(),
        "about".to_string(),
        "signout".to_string(),
        "quit".to_string(),
        "disable_notifications".to_string()
    ];
    let enabled = true;
    set_tray_items_enabled(app_handle, item_ids, enabled).await
}

#[tauri::command]
async fn set_tray_items_enabled(
    app_handle: tauri::AppHandle,
    item_ids: Vec<String>,
    enabled: bool
) {
    let tray_handle = app_handle.tray_handle();
    for item_id in item_ids {
        let _ = tray_handle.get_item(&item_id).set_enabled(enabled);
    }
}
