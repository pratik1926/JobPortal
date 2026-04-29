import * as signalR from "@microsoft/signalr";

const connection = new signalR.HubConnectionBuilder()
  .withUrl("https://localhost:7240/hubs/notification", {
    accessTokenFactory: () => localStorage.getItem("token")
  })
  .withAutomaticReconnect()
  .build();

// 🔥 SINGLETON START CONTROL
let isStarting = false;

const startConnection = async () => {
  if (
    connection.state === signalR.HubConnectionState.Disconnected &&
    !isStarting
  ) {
    try {
      isStarting = true;
      await connection.start();
      console.log("✅ SignalR Connected (global)");
    } catch (err) {
      console.error("❌ SignalR Error:", err);
      setTimeout(startConnection, 3000); // retry
    } finally {
      isStarting = false;
    }
  }
};

// 🔥 AUTO START (SAFE)
startConnection();

export default connection;