import { Outlet } from "react-router-dom";
import { useSocket } from "./SocketProvider";
import { invoke } from "@tauri-apps/api/tauri";
import { listen } from "@tauri-apps/api/event";
import { useEffect } from "react";
import { emit } from "@tauri-apps/api/event";

interface ITestPostEndpoint {
  a: number;
  b: number;
}

const TransactionProvider = () => {
  const { socket } = useSocket();

  socket.on("message-posted", async () => {
    await invoke("show_transaction_window");
  });

  function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function waitTwentySeconds() {
    console.log("Start");
    await delay(20000); // 20 seconds in milliseconds
    console.log("After 20 seconds");
  }

  useEffect(() => {
    const unlisten_endpoint = listen("test-post-endpoint", async (event) => {
      console.log(JSON.parse(event.payload as string));
      const json_data: ITestPostEndpoint = JSON.parse(event.payload as string);
      const c = json_data.a + json_data.b;
      console.log({ message: c });
      await waitTwentySeconds();
      emit("res-test-post-endpoint", JSON.stringify({ message: c }));
    });

    return () => {
      unlisten_endpoint.then((unlistenFn) => unlistenFn());
    };
  }, []);
  return (
    <>
      <Outlet />
    </>
  );
};

export default TransactionProvider;
