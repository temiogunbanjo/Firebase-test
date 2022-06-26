const globals = {
  apiBaseUrl: "https://lottery-api.gamepro.tech/api/v1",
  socketUrl: "http://localhost:3001/push_notifier_space",
  apiKey: "USR.Qg6bmE-oGQi9b-SxA1Vb-Sggcbw-dwlaE8-G",
  token: localStorage.getItem("token") || null,
  notificationOptions: {
    dir: "auto",
  },
};

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

function showTabContent(tabId) {
  document.querySelectorAll(".navigation-content").forEach((content) => {
    if (content.id && content.id.includes(tabId)) {
      content.classList.toggle("hide", false);
    } else {
      content.classList.toggle("hide", true);
    }
  });
}

const updateResponsePane = (responseElement, dataResponse, status) => {
  responseElement.textContent = typeof dataResponse !== "object"
    ? dataResponse
    : JSON.stringify(dataResponse, null, 2);
};

async function subscribeToNotification(deviceId) {
  try {
    console.log("Subscribing to notification...");
    // console.log(globals);
    const generalHeaders = {
      "Content-Type": "application/json;charset=utf-8",
      "x-api-key": globals.apiKey,
      mode: "no-cors",
    };

    if (!globals.token) {
      return false;
    }
    const subcribeResponse = await fetch(
      `${globals.apiBaseUrl}/auth/notifications/subcribe`,
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
      "x-api-key": globals.apiKey,
      mode: "no-cors",
    };

    if (!globals.token) {
      return false;
    }
    const subcribeResponse = await fetch(
      `${globals.apiBaseUrl}/auth/notifications/subcribe`,
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

function loginHandler(ev) {
  ev.preventDefault();
  const responseElement = document.querySelector("#login-form .response");
  const emailField = document.querySelector("#login-form input[name='email']");
  const passwordField = document.querySelector(
    "#login-form input[name='password']"
  );

  responseElement.innerHTML = "Logging in...";

  const payload = {
    email: emailField.value,
    password: passwordField.value,
  };

  const apiUrl = `${globals.apiBaseUrl}/auth/login`;
  fetch(apiUrl, {
    method: "post",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      mode: "no-cors",
    },
  })
    .then(async (response) => {
      try {
        const result = await response.json();
        const { status } = result;

        if (result && result.data) {
          const { data } = result;
          const { token } = data?.data;

          globals.token = token;
          localStorage.setItem("token", token);

          updateResponsePane(responseElement, data, status);
        } else {
          updateResponsePane(responseElement, result, status);
        }
      } catch (error) {
        console.log(error);
        const { status } = error;
        updateResponsePane(responseElement, error, status);
      }
    })
    .catch((error) => {
      console.log(error);
      updateResponsePane(responseElement, error, "error");
    });
}

function withdrawalHandler(ev) {
  ev.preventDefault();
  const responseElement = document.querySelector("#withdrawal-form .response");
  const amountField = document.querySelector(
    "#withdrawal-form input[name='amount']"
  );
  const paymentMethodInput = document.querySelector(
    "#withdrawal-form input[name='paymentMethod']:checked"
  );

  responseElement.innerHTML = "Making withdrawal in...";
  const payload = {
    amount: amountField?.value || 0,
    paymentMethod: paymentMethodInput?.value || null,
  };

  const apiUrl = `${globals.apiBaseUrl}/wallet/bank-withdrawal/initialize`;
  fetch(apiUrl, {
    method: "post",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      authorization: `Bearer ${globals.token}`,
      mode: "no-cors",
      "x-api-key": globals.apiKey,
    },
  })
    .then(async (response) => {
      try {
        const result = await response.json();
        const { status } = result;

        if (result && result.data) {
          const { data } = result;
          updateResponsePane(responseElement, data, status);
        } else {
          updateResponsePane(responseElement, result, status);
        }
      } catch (error) {
        console.log(error);
        const { responsemessage, status } = error;
        updateResponsePane(responseElement, responsemessage, status);
      }
    })
    .catch((error) => {
      console.log(error);
      updateResponsePane(responseElement, error, "error");
    });
}

function transferHandler(ev) {
  ev.preventDefault();
  const responseElement = document.querySelector("#transfer-form .response");
  const amountField = document.querySelector(
    "#transfer-form input[name='amount']"
  );
  const receipientInput = document.querySelector(
    "#transfer-form input[name='receipientId']"
  );

  const transactionPinInput = document.querySelector(
    "#transfer-form input[name='transactionPin']"
  );

  responseElement.innerHTML = "Making transfer...";
  const payload = {
    amount: amountField?.value || 0,
    transactionPin: transactionPinInput?.value || "",
    receipientId: receipientInput?.value || "",
  };

  const apiUrl = `${globals.apiBaseUrl}/wallet/transfer-fund-to-user`;
  fetch(apiUrl, {
    method: "post",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      authorization: `Bearer ${globals.token}`,
      mode: "no-cors",
      "x-api-key": globals.apiKey,
    },
  })
    .then(async (response) => {
      try {
        const result = await response.json();
        const { status } = result;

        if (result && result.data) {
          const { data } = result;
          updateResponsePane(responseElement, data, status);
        } else {
          updateResponsePane(responseElement, result, status);
        }
      } catch (error) {
        console.log(error);
        const { responsemessage, status } = error;
        updateResponsePane(responseElement, responsemessage, status);
      }
    })
    .catch((error) => {
      console.log(error);
      updateResponsePane(responseElement, error, "error");
    });
}

document.addEventListener("DOMContentLoaded", () => {
  const navTabs = document.querySelectorAll("#navigation ul li");
  const loginForm = document.querySelector("#login-form");
  const withdrawalForm = document.querySelector("#withdrawal-form");
  const transferForm = document.querySelector("#transfer-form");
  const unsubscribeButton = document.querySelector("#unsubscribe-token");

  navTabs.forEach((tab) => {
    console.log(tab);
    tab.addEventListener("click", (ev) => {
      showTabContent(ev.currentTarget.id);
    });
  });

  loginForm.addEventListener("submit", loginHandler);
  withdrawalForm.addEventListener("submit", withdrawalHandler);
  transferForm.addEventListener("submit", transferHandler);

  unsubscribeButton.addEventListener("click", () => {
    console.log("Unsubscribing...");
    // subscribeToNotification();
  });
});
