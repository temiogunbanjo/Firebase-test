function showHideDiv(divId, show) {
  const div = document.querySelector("#" + divId);
  if (show) {
    div.style = "display: visible";
  } else {
    div.style = "display: none";
  }
}

// Add a message to the messages element.
function appendMessage(payload) {
  console.log(payload);
  const messagesElement = document.querySelector("#messages");
  console.log(messagesElement);
  const dataHeaderElement = document.createElement("h5");
  const dataElement = document.createElement("pre");

  dataElement.style = "margin-left: 0; max-width: unset; width: 100%";
  dataElement.classList.add("response-pane");

  dataHeaderElement.textContent = "Received message:";
  dataElement.textContent = JSON.stringify(payload, null, 2);

  messagesElement.appendChild(dataHeaderElement);
  messagesElement.appendChild(dataElement);
}

// Clear the messages element of all children.
function clearMessages() {
  const messagesElement = document.querySelector("#messages");
  while (messagesElement.hasChildNodes()) {
    messagesElement.removeChild(messagesElement.lastChild);
  }
}

async function subscribeToNotification(deviceId) {
  try {
    console.log("Subscribing to notification...");
    // console.log(globals);
    const generalHeaders = {
      "Content-Type": "application/json;charset=utf-8",
      "x-api-key": globals[globals.environment].apiKey,
      mode: "no-cors",
    };

    if (!globals.token) {
      return false;
    }
    const subcribeResponse = await fetch(
      `${globals[globals.environment].apiBaseUrl}/auth/notifications/subcribe`,
      {
        method: "POST",
        body: JSON.stringify({
          deviceRegToken: deviceId,
        }),
        headers: {
          ...generalHeaders,
          authorization: `Bearer ${globals.token}`,
        },
      }
    );

    let tokenData = await subcribeResponse.json();
    return tokenData;
  } catch (error) {
    return error;
  }
}

async function unsubscribeToNotification(deviceId) {
  try {
    console.log("Unsubscribing from notification...");
    // console.log(globals);
    const generalHeaders = {
      "Content-Type": "application/json;charset=utf-8",
      "x-api-key": globals[globals.environment].apiKey,
      mode: "no-cors",
    };

    if (!globals.token) {
      return false;
    }
    const subcribeResponse = await fetch(
      `${globals[globals.environment].apiBaseUrl}/auth/notifications/subcribe`,
      {
        method: "POST",
        body: JSON.stringify({
          deviceRegToken: deviceId,
        }),
        headers: {
          ...generalHeaders,
          authorization: `Bearer ${globals.token}`,
        },
      }
    );

    let tokenData = await subcribeResponse.json();
    if (tokenData?.data) {
      console.log("Subbbbing");
    }

    console.log(tokenData);
  } catch (error) {
    return error;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  setPageIndex(2);
  const unsubscribeButton = document.querySelector("#unsubscribe-token");
  unsubscribeButton.addEventListener("click", () => {
    console.log("Unsubscribing...");
    // subscribeToNotification();
  });
});
