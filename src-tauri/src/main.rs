// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command

use actix_web::{ web, App, HttpRequest, HttpResponse, HttpServer };
use actix_cors::Cors;
use machineid_rs::{ Encryption, HWIDComponent, IdBuilder };
use reqwest::header::ACCEPT;
use reqwest::{ header, Client };
use serde::{ Deserialize, Serialize };
use std::cmp::min;
use std::fs::File;
use std::io::prelude::*;
use std::path::{ Path, PathBuf };
use std::process::Command;
use std::sync::OnceLock;
use std::time::{ Instant, Duration };
use std::{ fs, io };
#[cfg(target_family = "unix")]
use std::os::unix::fs::PermissionsExt; // For Unix-specific permissions
use tauri::Manager;
use tauri::{ CustomMenuItem, SystemTray, SystemTrayEvent, SystemTrayMenu, SystemTrayMenuItem };
use futures_util::stream::StreamExt;

// use dotenv::dotenv;
// use std::env;

static APPHANDLE: OnceLock<tauri::AppHandle> = OnceLock::new();

#[cfg(target_family = "unix")]
fn create_named_mutex(name: &str) -> std::io::Result<std::os::unix::net::UnixListener> {
    let socket_path = Path::new(name);
    if socket_path.exists() {
        match std::os::unix::net::UnixStream::connect(socket_path) {
            Ok(mut stream) => {
                stream.write_all(b"ping")?;
                return Err(io::Error::new(io::ErrorKind::AlreadyExists, "Socket already in use"));
            }
            Err(_) => {
                // Previous instance did not clean up socket, remove it
                std::fs::remove_file(socket_path)?;
            }
        }
    }
    std::os::unix::net::UnixListener::bind(socket_path)
}

#[cfg(target_family = "windows")]
fn create_named_mutex(name: &str) -> std::io::Result<()> {
    use winapi::um::synchapi::CreateMutexA;
    use winapi::um::errhandlingapi::GetLastError;
    use winapi::shared::winerror::ERROR_ALREADY_EXISTS;

    let mutex_name = std::ffi::CString::new(name).expect("CString::new failed");
    let handle = unsafe { CreateMutexA(std::ptr::null_mut(), 0, mutex_name.as_ptr()) };

    if handle.is_null() {
        return Err(std::io::Error::last_os_error());
    }
    if (unsafe { GetLastError() }) == ERROR_ALREADY_EXISTS {
        return Err(std::io::Error::new(std::io::ErrorKind::AlreadyExists, "Mutex already exists"));
    }
    Ok(())
}

#[tokio::main]
async fn main() -> std::io::Result<()> {
    let mutex_name = "tauri_single_instance";

    if cfg!(target_os = "macos") {
        // Do nothing for macOS
    } else if cfg!(target_family = "unix") {
        // This will apply to other Unix-like systems (Linux, etc.)
        if create_named_mutex(mutex_name).is_err() {
            println!("Another instance is already running.");
            std::process::exit(1);
        }
    } else if cfg!(target_family = "windows") {
        // This applies to Windows
        if create_named_mutex(mutex_name).is_err() {
            println!("Another instance is already running.");
            std::process::exit(1);
        }
    }

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
                download_to_app_dir,
                unzip_windows,
                unzip_macos,
                untarbz2_macos,
                unzip_linux,
                move_appimage_linux,
                delete_file,
                run_url_args,
                open_directory,
                get_machine_id,
                is_window_visible,
                show_transaction_window,
                hide_transaction_window,
                set_tray_items_enabled,
                write_file
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

            #[derive(Deserialize, Serialize)]
            struct GetAccountReqType {
                chain: String, // solar, evm, bitcoin, solana
            }

            #[derive(Deserialize, Serialize)]
            struct GetBalanceReqType {
                chain: String, // solar, bitcoin, solana, ethereum, polygon, avalanche, arbitrum, binance, optimism
                address: String,
            }

            #[derive(Serialize, Deserialize, Clone)]
            struct Transfer {
                to: String,
                amount: String,
            }

            #[derive(Deserialize, Serialize)]
            struct SendTransactionReqType {
                chain: String, // solar, bitcoin, solana, ethereum, polygon, avalanche, arbitrum, binance, optimism
                transfers: Vec<Transfer>,
                note: String,
                memo: Option<String>,
                token: Option<String>,
                status: Option<String>,
                transaction: Option<String>,
            }

            #[derive(Deserialize, Serialize, Clone)]
            struct GetOrderResResultDataType {
                requestUserId: String,
                chain: String,
                transfers: Vec<Transfer>,
                note: String,
                memo: String,
                status: String,
                transaction: String,
                _id: String,
                createdAt: String,
                updatedAt: String,
            }

            #[derive(Deserialize, Serialize, Clone)]
            struct GetOrderResResultType {
                data: GetOrderResResultDataType,
                msg: String,
            }

            #[derive(Deserialize, Serialize)]
            struct GetOrderResType {
                msg: String,
                result: GetOrderResResultType,
            }

            #[derive(Deserialize, Serialize)]
            struct ValidateTokenReqType {
                token: String,
            }

            async fn validate_token(token: String) -> bool {
                APPHANDLE.get()
                    .expect("APPHANDLE is available")
                    .emit_all("validate-token", token)
                    .expect("failed to emit event validate-token");

                let (tx, rx) = std::sync::mpsc::channel();

                let response = APPHANDLE.get()
                    .expect("APPHANDLE is available")
                    .listen_global("res-validate-token", move |event| {
                        let payload = event.payload().unwrap().to_string();
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
                        let res = received == "true";
                        if !res {
                            println!("Invalid token");
                        }
                        return res;
                    }
                    Err(err) => {
                        println!("Error receiving message: {:?}", err);
                        APPHANDLE.get().expect("APPHANDLE is available").unlisten(response);
                        return false;
                    }
                }
            }

            async fn validate_chain(name: String) -> bool {
                if
                    name != "solar" &&
                    name != "bitcoin" &&
                    name != "solana" &&
                    name != "ethereum" &&
                    name != "polygon" &&
                    name != "binance" &&
                    name != "avalanche" &&
                    name != "arbitrum" &&
                    name != "optimism"
                {
                    println!("Invalid chain");
                    return false;
                }
                return true;
            }

            async fn validate_token_http(request: HttpRequest) -> HttpResponse {
                println!("-------> POST /validate-token");

                let token = request.headers().get("x-token");
                if let Some(token) = token {
                    let is_valid_token = validate_token(token.to_str().unwrap().to_string()).await;

                    if !is_valid_token {
                        return HttpResponse::Ok().body("false");
                    } else {
                        return HttpResponse::Ok().body("true");
                    }
                } else {
                    return HttpResponse::BadRequest().body("Token header is required");
                }
            }

            async fn get_account(
                request: HttpRequest,
                request_param: web::Json<GetAccountReqType>
            ) -> HttpResponse {
                println!("-------> POST /get-account");

                let is_valid_token = validate_token(
                    request.headers().get("x-token").unwrap().to_str().unwrap().to_string()
                ).await;
                if !is_valid_token {
                    return HttpResponse::InternalServerError().body("Invalid token");
                }

                let is_valid_chain = validate_chain(request_param.chain.clone()).await;
                if !is_valid_chain {
                    return HttpResponse::InternalServerError().body("Invalid chain");
                }

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

            async fn get_balance(
                request: HttpRequest,
                request_param: web::Json<GetBalanceReqType>
            ) -> HttpResponse {
                println!("-------> POST /get-balance");

                let is_valid_token = validate_token(
                    request.headers().get("x-token").unwrap().to_str().unwrap().to_string()
                ).await;
                if !is_valid_token {
                    return HttpResponse::InternalServerError().body("Invalid token");
                }

                let is_valid_chain = validate_chain(request_param.chain.clone()).await;
                if !is_valid_chain {
                    return HttpResponse::InternalServerError().body("Invalid chain");
                }
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

            async fn send_transaction(request_param: GetOrderResResultDataType) -> HttpResponse {
                println!("-------> POST /send-transaction");

                if request_param.transfers.len() > 1 && request_param.chain != "solar" {
                    println!("Invalid batch transfer {}", request_param.chain);
                    return HttpResponse::BadRequest().body(
                        format!(
                            "Batch transfer is not enabled for now on {} chain",
                            request_param.chain
                        )
                    );
                }

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

            async fn request_new_order(
                request: HttpRequest,
                request_param: web::Json<SendTransactionReqType>
            ) -> HttpResponse {
                println!("-------> POST /request-new-order");

                let is_valid_token = validate_token(
                    request.headers().get("x-token").unwrap().to_str().unwrap().to_string()
                ).await;
                if !is_valid_token {
                    return HttpResponse::InternalServerError().body("Invalid token");
                }

                let is_valid_chain = validate_chain(request_param.chain.clone()).await;
                if !is_valid_chain {
                    return HttpResponse::InternalServerError().body("Invalid chain");
                }

                if request_param.transfers.len() > 1 && request_param.chain != "solar" {
                    println!("Invalid batch transfer {}", request_param.chain);
                    return HttpResponse::BadRequest().body(
                        format!(
                            "Batch transfer is not enabled for now on {} chain",
                            request_param.chain
                        )
                    );
                }

                let mut param = request_param.into_inner();
                param.status = Some("pending".to_string());
                param.transaction = Some("transaction".to_string());

                let client = Client::new();

                match
                    client
                        .post("https://dev.tymt.com/api/orders/request-new-order")
                        .header(header::CONTENT_TYPE, "application/json")
                        .header(
                            "x-token",
                            request.headers().get("x-token").unwrap().to_str().unwrap().to_string()
                        )
                        .body(serde_json::to_string(&param).unwrap())
                        .send().await
                {
                    Ok(response) =>
                        match response.text().await {
                            Ok(json) => {
                                println!("!!!----> POST /request-new-order");
                                println!("{}", json);
                                HttpResponse::Ok().body(json)
                            }
                            Err(err) => {
                                eprintln!("Failed to parse response as JSON: {:?}", err);
                                HttpResponse::InternalServerError().body(
                                    "Failed to parse response as JSON"
                                )
                            }
                        }
                    Err(err) => {
                        eprintln!("Failed to send request: {:?}", err);
                        HttpResponse::InternalServerError().body("Failed to send request")
                    }
                }
            }

            #[derive(Deserialize, Serialize)]
            struct ExecuteOrderReqType {
                id: String,
            }
            async fn execute_order(
                request: HttpRequest,
                request_param: web::Json<ExecuteOrderReqType>
            ) -> HttpResponse {
                println!("-------> POST /execute-order");

                let is_valid_token = validate_token(
                    request.headers().get("x-token").unwrap().to_str().unwrap().to_string()
                ).await;
                if !is_valid_token {
                    return HttpResponse::InternalServerError().body("Invalid token");
                }

                let client = Client::new();

                println!("-------> https://dev.tymt.com/api/orders/orders/{}", request_param.id);
                match
                    client
                        .get(format!("https://dev.tymt.com/api/orders/orders/{}", request_param.id))
                        .header(
                            "x-token",
                            request.headers().get("x-token").unwrap().to_str().unwrap().to_string()
                        )
                        .send().await
                {
                    Ok(response) =>
                        match response.text().await {
                            Ok(json) => {
                                println!("{}", json);
                                let parsed_struct: GetOrderResType = serde_json
                                    ::from_str(&json)
                                    .unwrap();
                                let json_struct: web::Json<GetOrderResType> = web::Json(
                                    parsed_struct
                                );
                                send_transaction(json_struct.result.data.clone()).await
                            }
                            Err(err) => {
                                eprintln!("Failed to parse response as JSON: {:?}", err);
                                HttpResponse::InternalServerError().body(
                                    "Failed to parse response as JSON"
                                )
                            }
                        }
                    Err(err) => {
                        eprintln!("Failed to send request: {:?}", err);
                        HttpResponse::InternalServerError().body("Failed to send request")
                    }
                }
            }

            #[derive(Deserialize, Serialize)]
            struct SignMessageReqType {
                message: String,
                chain: String,
            }
            async fn sign_message(
                request: HttpRequest,
                request_param: web::Json<SignMessageReqType>
            ) -> HttpResponse {
                println!("-------> POST /sign-message");

                let is_valid_token = validate_token(
                    request.headers().get("x-token").unwrap().to_str().unwrap().to_string()
                ).await;
                if !is_valid_token {
                    return HttpResponse::InternalServerError().body("Invalid token");
                }

                let is_valid_chain = validate_chain(request_param.chain.clone()).await;
                if !is_valid_chain {
                    return HttpResponse::InternalServerError().body("Invalid chain");
                }

                let json_data = serde_json
                    ::to_string(&request_param)
                    .expect("Failed to serialize JSON data");
                println!("{}", json_data);

                APPHANDLE.get()
                    .expect("APPHANDLE is available")
                    .emit_all("POST-/sign-message", json_data)
                    .expect("failed to emit event POST /sign-message");

                let (tx, rx) = std::sync::mpsc::channel();

                let response = APPHANDLE.get()
                    .expect("APPHANDLE is available")
                    .listen_global("res-POST-/sign-message", move |event| {
                        let payload = event.payload().unwrap().to_string();
                        println!("!!!----> res POST /sign-message");
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
                        if received == "" {
                            return HttpResponse::InternalServerError().finish();
                        } else {
                            return HttpResponse::Ok().body(received);
                        }
                    }
                    Err(err) => {
                        println!("Error receiving message: {:?}", err);
                        APPHANDLE.get().expect("APPHANDLE is available").unlisten(response);
                        return HttpResponse::InternalServerError().finish();
                    }
                }
            }

            #[derive(Deserialize, Serialize)]
            struct VerifyMessageReqType {
                message: String,
                signature: String,
                chain: String,
            }
            async fn verify_message(
                request: HttpRequest,
                request_param: web::Json<VerifyMessageReqType>
            ) -> HttpResponse {
                println!("-------> POST /verify-message");

                let is_valid_token = validate_token(
                    request.headers().get("x-token").unwrap().to_str().unwrap().to_string()
                ).await;
                if !is_valid_token {
                    return HttpResponse::InternalServerError().body("Invalid token");
                }

                let json_data = serde_json
                    ::to_string(&request_param)
                    .expect("Failed to serialize JSON data");
                println!("{}", json_data);

                APPHANDLE.get()
                    .expect("APPHANDLE is available")
                    .emit_all("POST-/verify-message", json_data)
                    .expect("failed to emit event POST /verify-message");

                let (tx, rx) = std::sync::mpsc::channel();

                let response = APPHANDLE.get()
                    .expect("APPHANDLE is available")
                    .listen_global("res-POST-/verify-message", move |event| {
                        let payload = event.payload().unwrap().to_string();
                        println!("!!!----> res POST /verify-message");
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

            // Define the AbiInput struct
            #[derive(Serialize, Deserialize, Debug)]
            struct AbiInput {
                internalType: String,
                name: String,
                #[serde(rename = "type")]
                type_field: String,
            }

            // Define the AbiOutput struct
            #[derive(Serialize, Deserialize, Debug)]
            struct AbiOutput {
                internalType: String,
                name: String,
                #[serde(rename = "type")]
                type_field: String,
            }

            // Define the AbiFunction struct
            #[derive(Serialize, Deserialize, Debug)]
            struct AbiFunction {
                inputs: Vec<AbiInput>,
                name: String,
                outputs: Vec<AbiOutput>,
                stateMutability: String,
                #[serde(rename = "type")]
                type_field: String,
            }

            #[derive(Deserialize, Serialize)]
            struct SendContractReqType {
                contract_address: String,
                function_name: String,
                method_type: String,
                params: Vec<String>,
                abi: Vec<AbiFunction>,
                chain: String,
            }

            async fn send_contract(
                request: HttpRequest,
                request_param: web::Json<SendContractReqType>
            ) -> HttpResponse {
                println!("-------> POST /send-contract");

                let is_valid_token = validate_token(
                    request.headers().get("x-token").unwrap().to_str().unwrap().to_string()
                ).await;
                if !is_valid_token {
                    return HttpResponse::InternalServerError().body("Invalid token");
                }

                let json_data = serde_json
                    ::to_string(&request_param)
                    .expect("Failed to serialize JSON data");
                println!("{}", json_data);

                APPHANDLE.get()
                    .expect("APPHANDLE is available")
                    .emit_all("POST-/send-contract", json_data)
                    .expect("failed to emit event POST /send-contract");

                let (tx, rx) = std::sync::mpsc::channel();

                let response = APPHANDLE.get()
                    .expect("APPHANDLE is available")
                    .listen_global("res-POST-/send-contract", move |event| {
                        let payload = event.payload().unwrap().to_string();
                        println!("!!!----> res POST /send-contract");
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

            // dotenv().ok();
            // let port_str = dotenv
            //     ::var("VITE_APP_LOCAL_SERVER_PORT")
            //     .expect("VITE_APP_LOCAL_SERVER_PORT must be set");
            // let port: u16 = port_str
            //     .parse()
            //     .expect("VITE_APP_LOCAL_SERVER_PORT must be a valid u16");
            // println!("port {}", port);

            tauri::async_runtime::spawn(
                HttpServer::new(move || {
                    App::new()
                        .wrap(
                            Cors::default().allow_any_origin().allow_any_method().allow_any_header()
                        )
                        .route("/get-account", web::post().to(get_account))
                        .route("/get-balance", web::post().to(get_balance))
                        // .route("/send-transaction", web::post().to(send_transaction))
                        .route("/request-new-order", web::post().to(request_new_order))
                        .route("/execute-order", web::post().to(execute_order))
                        .route("/validate-token", web::post().to(validate_token_http))
                        .route("/sign-message", web::post().to(sign_message))
                        .route("/verify-message", web::post().to(verify_message))
                        .route("/send-contract", web::post().to(send_contract))
                })
                    .bind(("127.0.0.1", 3331))
                    .expect("Failed to bind address")
                    .run()
            );

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tymtLauncher");

    Ok(())
}

#[tauri::command]
fn run_url_args(url: String, args: Vec<String>) {
    println!("{}", url);
    for arg in args.clone() {
        println!("{}", arg);
    }

    let path = if url == "open" { Path::new(&args[1]) } else { Path::new(&url) };
    let working_directory = match path.parent() {
        Some(dir) => dir,
        None => {
            eprintln!("Failed to determine directory for {}", url);
            return;
        }
    };

    let mut command = Command::new(&url);
    command.current_dir(working_directory);
    println!("Setting working directory to: {:?}", working_directory);

    if args.is_empty() {
        println!("No command provided");

        match command.spawn() {
            Ok(_) => println!("Process started successfully"),
            Err(e) => eprintln!("Failed to start process: {}", e),
        }
    } else {
        for arg in args {
            command.arg(arg);
        }

        match command.spawn() {
            Ok(_) => println!("Process started successfully"),
            Err(e) => eprintln!("Failed to start process: {}", e),
        }
    }
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

#[tauri::command]
fn write_file(content: String, filepath: String) -> Result<(), String> {
    std::fs::write(&filepath, content).map_err(|e| e.to_string())?;
    Ok(())
}

#[derive(serde::Serialize)]
struct DownloadProgress {
    downloaded: u64,
    speed: Option<f64>,
    total_size: u64,
}

#[tauri::command]
async fn download_to_app_dir(
    app_handle: tauri::AppHandle,
    url: String,
    file_location: String
) -> Result<(), String> {
    let path = Path::new(&file_location);

    if let Some(parent) = path.parent() {
        if !parent.exists() {
            match fs::create_dir_all(&parent) {
                Err(why) => panic!("couldn't create directory: {}", why),
                Ok(_) => println!("Successfully created the directory"),
            }
        }
    }

    // fs::create_dir_all("./download/").expect("Error at create_dir_all");
    let start_time = Instant::now();
    let client = Client::new();
    let res = client
        .get(&url)
        .header(ACCEPT, "application/octet-stream")
        .send().await
        .or(Err(format!("Failed to GET from '{}'", &url)))?;
    let total_size = res
        .content_length()
        .ok_or(format!("Failed to get content length from '{}'", &url))?;

    let mut file = File::create(&path).or(
        Err(format!("Failed to create file '{}'", file_location))
    )?;
    let mut downloaded: u64 = 0;
    let mut stream = res.bytes_stream();

    let mut last_emit_time = Instant::now();

    while let Some(item) = stream.next().await {
        let chunk = item.or(Err(format!("Error while downloading file")))?;
        file.write_all(&chunk).or(Err(format!("Error while writing to file")))?;
        downloaded = min(downloaded + (chunk.len() as u64), total_size);
        let duration = start_time.elapsed().as_secs_f64();
        let speed = if duration > 0.0 {
            Some((downloaded as f64) / duration / 1024.0 / 1024.0)
        } else {
            None
        };

        if last_emit_time.elapsed() >= Duration::new(1, 0) {
            let progress = DownloadProgress {
                downloaded,
                speed,
                total_size,
            };

            app_handle
                .emit_all("game-download-progress", &progress)
                .expect("Failed to emit progress event");

            last_emit_time = Instant::now();
        }

        // println!("downloaded => {}", downloaded);
        // println!("total_size => {}", total_size);
        // println!("speed => {:?}", speed);
    }

    return Ok(());
}

#[tauri::command]
async fn unzip_windows(
    app_handle: tauri::AppHandle,
    file_location: String,
    install_dir: String
) -> Result<(), String> {
    let zip_path = PathBuf::from(file_location);
    let extract_path = PathBuf::from(install_dir);

    let _ = zip_extensions::read
        ::zip_extract(&zip_path, &extract_path)
        .map_err(|e| format!("Failed to unzip file: {}", e))?;

    Ok(())
}

#[tauri::command]
async fn unzip_linux(
    app_handle: tauri::AppHandle,
    file_location: String,
    install_dir: String
) -> Result<(), String> {
    let zip_path = PathBuf::from(file_location);
    let extract_path = PathBuf::from(install_dir);

    let _ = zip_extensions::read
        ::zip_extract(&zip_path, &extract_path)
        .map_err(|e| format!("Failed to unzip file: {}", e))?;

    Ok(())
}

#[tauri::command]
async fn move_appimage_linux(
    app_handle: tauri::AppHandle,
    file_location: String,
    install_dir: String
) -> Result<(), String> {
    let source_path = PathBuf::from(file_location);
    let destination_path = PathBuf::from(install_dir).join(
        source_path.file_name().ok_or("Invalid file name")?
    );

    fs::rename(&source_path, &destination_path).map_err(|e| format!("Failed to move file: {}", e))?;

    Ok(())
}

#[tauri::command]
async fn unzip_macos(
    app_handle: tauri::AppHandle,
    file_location: String,
    install_dir: String
) -> Result<(), String> {
    let status = Command::new("ditto")
        .arg("-x")
        .arg("-k")
        .arg(&file_location)
        .arg(&install_dir)
        .status()
        .map_err(|e| format!("Failed to execute ditto: {}", e))?;

    if status.success() {
        Ok(())
    } else {
        Err(format!("Failed to unzip: exit code {}", status.code().unwrap_or(-1)))
    }
}

#[tauri::command]
async fn untarbz2_macos(
    app_handle: tauri::AppHandle,
    file_location: String,
    install_dir: String
) -> Result<(), String> {
    let install_path = PathBuf::from(&install_dir);

    // Create the directory if it doesn't exist
    if !install_path.exists() {
        fs
            ::create_dir_all(&install_path)
            .map_err(|e| format!("Failed to create directory: {}", e))?;
    }

    let status = Command::new("tar")
        .args(["-xvjf", &file_location, "-C", &install_dir])
        .output()
        .map_err(|e| format!("Failed to execute tar: {}", e))?;

    if status.status.success() {
        Ok(())
    } else {
        Err(format!("Failed to unzip: exit code {}", status.status.code().unwrap_or(-1)))
    }
}

#[cfg(target_family = "unix")]
#[tauri::command]
async fn chmod_macos(app_handle: tauri::AppHandle, executable_path: String) -> Result<(), String> {
    let path = PathBuf::from(&executable_path);

    // Check if the file exists
    if !path.exists() {
        return Err(format!("File does not exist: {}", executable_path));
    }

    // Set the executable permission
    let mut permissions = fs
        ::metadata(&path)
        .map_err(|e| format!("Failed to get metadata: {}", e))?
        .permissions();

    permissions.set_mode(0o755); // Set permissions to rwxr-xr-x

    fs
        ::set_permissions(&path, permissions)
        .map_err(|e| format!("Failed to set permissions: {}", e))?;

    Ok(())
}

#[tauri::command]
async fn delete_file(app_handle: tauri::AppHandle, file_location: String) -> Result<(), String> {
    let path = PathBuf::from(file_location);

    fs::remove_file(&path).map_err(|e| format!("Failed to delete file: {}", e))?;

    Ok(())
}
