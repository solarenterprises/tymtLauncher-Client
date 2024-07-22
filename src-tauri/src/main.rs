// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command

use actix_web::{ web, App, HttpRequest, HttpResponse, HttpServer };
use actix_cors::Cors;
use machineid_rs::{ Encryption, HWIDComponent, IdBuilder };
use reqwest::{ header, Client };
use serde::{ Deserialize, Serialize };
use std::fs::File;
use std::io::prelude::*;
use std::path::{ Path, PathBuf };
use std::process::Command;
use std::sync::OnceLock;
use std::{ fs, io };
use tauri::Manager;
use tauri::{ CustomMenuItem, SystemTray, SystemTrayEvent, SystemTrayMenu, SystemTrayMenuItem };
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

    if cfg!(target_family = "unix") {
        if create_named_mutex(mutex_name).is_err() {
            println!("Another instance is already running.");
            std::process::exit(1);
        }
    } else if cfg!(target_family = "windows") {
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
                download_and_unzip,
                download_appimage_linux,
                download_and_unzip_linux,
                download_and_unzip_macos,
                download_and_untarbz2_macos,
                download_and_unzip_windows,
                run_exe,
                run_url_args,
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
                    let window = app.get_window("tymtLauncherDebug").unwrap();
                    window.show().unwrap();
                    window.set_focus().unwrap();
                }
                SystemTrayEvent::MenuItemClick { id, .. } =>
                    match id.as_str() {
                        "quit" => {
                            std::process::exit(0);
                        }
                        "hide" => {
                            let window = app.get_window("tymtLauncherDebug").unwrap();
                            window.hide().unwrap();
                        }
                        "showVisible" => {
                            println!("showVisible received a left click");
                            let window = app.get_window("tymtLauncherDebug").unwrap();
                            window.show().unwrap();
                            window.set_focus().unwrap();
                        }
                        "fullscreen" => {
                            let window = app.get_window("tymtLauncherDebug").unwrap();
                            window.show().unwrap();
                            window.set_focus().unwrap();
                            window
                                .set_fullscreen(!window.is_fullscreen().unwrap())
                                .expect("failed to switch full-screen");
                        }
                        "wallet" => {
                            app.emit_all("wallet", "wallet").expect("failed to emit event wallet");
                            let window = app.get_window("tymtLauncherDebug").unwrap();
                            window.show().unwrap();
                            window.set_focus().unwrap();
                        }
                        "games" => {
                            app.emit_all("games", "games").expect("failed to emit event games");
                            let window = app.get_window("tymtLauncherDebug").unwrap();
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
                            let window = app.get_window("tymtLauncherDebug").unwrap();
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

                match
                    client
                        .get(format!("https://dev.tymt.com/api/orders/orders/{}", request_param.id))
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
        .expect("error while running tymtLauncherDebug");

    Ok(())
}

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
    target: String,
    authorization: Option<String>
) -> bool {
    let app_dir = app_handle
        .path_resolver()
        .app_data_dir()
        .unwrap()
        .into_os_string()
        .into_string()
        .to_owned()
        .unwrap();

    let client = Client::new();
    let response = if let Some(auth) = authorization {
        client
            .get(&url)
            .header(header::CONTENT_TYPE, "application/json")
            .header(header::AUTHORIZATION, format!("{}", auth))
            .send().await
            .unwrap()
    } else {
        client.get(&url).send().await.unwrap()
    };

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
        eprintln!("Failed to make tymtLauncherDebug.AppImage executable");
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
    target: String,
    authorization: Option<String>
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

    let client = Client::new();
    let response = if let Some(auth) = authorization {
        client
            .get(&url)
            .header(header::CONTENT_TYPE, "application/json")
            .header(header::AUTHORIZATION, format!("{}", auth))
            .send().await
            .unwrap()
    } else {
        client.get(&url).send().await.unwrap()
    };

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
    exeLocation: String,
    authorization: Option<String>
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

    let client = Client::new();
    let response = if let Some(auth) = authorization {
        client
            .get(&url)
            .header(header::CONTENT_TYPE, "application/json")
            .header(header::AUTHORIZATION, format!("{}", auth))
            .send().await
            .unwrap()
    } else {
        client.get(&url).send().await.unwrap()
    };

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

    Command::new("ditto")
        .arg("-x")
        .arg("-k")
        .arg(path)
        .arg(final_location)
        .status()
        .expect("Failed to ditto unzip!");

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
    let hwid = builder.build("tymtLauncherDebug").map_err(|err| err.to_string())?;

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

    if let Some(window_to_hide) = app_handle.get_window("tymtLauncherDebug") {
        if let Err(e) = window_to_hide.hide() {
            eprintln!("Failed to hide window 'tymtLauncherDebug': {}", e);
        }
    } else {
        eprintln!("Window 'tymtLauncherDebug' not found");
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

    if let Some(window_to_hide) = app_handle.get_window("tymtLauncherDebug") {
        if let Err(e) = window_to_hide.show() {
            eprintln!("Failed to show window 'tymtLauncherDebug': {}", e);
        }
    } else {
        eprintln!("Window 'tymtLauncherDebug' not found");
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
