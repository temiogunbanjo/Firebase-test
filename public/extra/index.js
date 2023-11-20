const getEnvironmentNamespace = () => {
  if (globals.environment === "white") {
    return "white-label";
  }

  return globals.environment;
};

const socketUrl = `${
  globals[globals.environment].searchBaseUrl
}/${getEnvironmentNamespace()}`;
const jwtToken = window.localStorage.getItem("token");

const socket = io(socketUrl, {
  auth: {
    token: jwtToken,
  },
});

const createPageResponse = (message) => {
  if (document.readyState === "complete") {
    const pageContent = document.querySelector("#view-extra-tab-content");
    // alert(message);
    const response = document.createElement("div", {});
    response.classList.add("chat");
    response.textContent = `${message}`;
    pageContent.appendChild(response);
  }
};

const createInfoResponse = (connected = true, message = null) => {
  if (document.readyState === "complete") {
    message = message || (connected ? "connected" : "disconnected");
    const pageContent = document.querySelector("#view-extra-tab-content");
    // alert(message);

    const response = document.createElement("div", {});
    response.classList.add(
      "chat",
      "info",
      connected ? "connected" : "disconnected"
    );
    response.textContent = message;
    pageContent.appendChild(response);
  }
};

socket.on("connect", () => {
  createInfoResponse(true);
});

socket.on("connect_error", (err) => {
  console.log(err);
  if (
    ["unauthorized", "invalid credentials", "jwt malformed"].includes(
      err?.message?.toLowerCase()
    )
  ) {
    // socket.auth.token = "efgh";
    createInfoResponse(false, err?.message);
    // socket.connect();
  }
});

socket.on("NEW_GAME_RESULT", (data) => {
  if (typeof data === "string") {
    createPageResponse(data);
  } else {
    createPageResponse(
      data?.message ||
        `[${data?.results?.gameId || "unknown"}]:====> ${
          data?.results?.results
        }`
    );
  }
});

socket.on("disconnect", (reason) => {
  if (reason === "io server disconnect") {
    // the disconnection was initiated by the server, you need to reconnect manually
    socket.connect();
  }
  createInfoResponse(false);
});


document.addEventListener("DOMContentLoaded", () => {
  setPageIndex(13, false);
  // fetchAllData();

  const queryString = window.location.search.replace("?", "");
  const queryParams = {};
  queryString.split("&").forEach((each) => {
    const [key, value] = each.split("=");
    queryParams[key] = value;
  });
});
