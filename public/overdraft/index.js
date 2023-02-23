function fetchUserBalance() {
  // ev.preventDefault();
  const containerElement = document.querySelector(
    "#transfer-form #transfer-balance"
  );

  // containerElement.innerHTML = "Fetching results...";
  const apiUrl = `${
    globals[globals.environment].apiBaseUrl
  }/user/fetch-authenticated-user`;

  fetchAPI({
    url: apiUrl, 
    method: "GET"
  })
    .then(async (result) => {
      try {
        const { status } = result;

        if (result && result.data) {
          // const categoryObject = {};

          console.log(result.data);
          const { data } = result?.data;

          containerElement.innerHTML = data.walletBalance;
        }
      } catch (error) {
        console.log(error);
        const { responsemessage, status } = error;
        updateResponsePane(containerElement, responsemessage, status);
      }
    })
    .catch((error) => {
      console.log(error);
      updateResponsePane(containerElement, error, "error");
    });
}

function viewSentOverdraftHandler(options = { page: 1, limit: 50 }) {
  // ev.preventDefault();
  const containerElement = document.querySelector("#sent-container");

  // containerElement.innerHTML = "Fetching results...";
  const apiUrl = `${
    globals[globals.environment].apiBaseUrl
  }/wallet/fetch-sent-overdraft?page=${options.page}&limit=${
    options.limit
  }&order=createdAt:DESC`;

  fetchAPI({
    url: apiUrl,
    method: "GET",
  })
    .then(async (result) => {
      try {
        const { status } = result;

        if (result && result.data) {
          // const categoryObject = {};
          console.log(result.data);
          const { data } = result?.data;

          containerElement.innerHTML = data
            .map((result, index) => {
              return `<div class="d-flex rows result-entry">
              <h3 class="" style="margin: 10px 20px 10px 10px;">${
                index + 1
              }.</h3>

              <div class="d-flex cols flex-grow">
                <div class="d-flex rows space-between align-items-center">
                  <h3 style="margin: 10px 20px 0 0;">${
                    result.uplineName
                  } &nbsp; => &nbsp; ${result.downlineName}</h3>
                  <span class="status-indicator" data-status=${(() => {
                    switch (result.status) {
                      case true:
                        return "won";

                      case false:
                        return "lost";

                      default:
                        return "";
                    }
                  })()}>${result.status}</span>
                </div>  

                <div class="d-flex rows space-between">
                  <h5 style="margin-bottom: 10px; margin-top: 5px; color: #444444; text-transform: uppercase">${
                    result.transactionId
                  }</h5>
                </div>

                <div class="d-flex rows space-between">
                  <span>Ref: ${result.referenceId}</span>
                </div>

                <div class="d-flex rows space-between">
                  <span>Initial Amount: <b style="color: #444444">${
                    result.initialAmount
                  }</b></span>
                 
                  <span>Rem. Amount: <b style="color: #444444">${
                    result.remainingAmount
                  }</b></span>
                </div>

                <div class="d-flex rows space-between" style="margin-top: 1rem">
                  <span class="fw-400" style="font-size: 13px">Expires On: <b style="color: #444444">${new Date(
                    result.expiresAt
                  ).toUTCString()}</b></span>
                </div>

                <div class="d-flex rows space-between" style="margin-top: 0.5rem">
                  <span class="fw-400" style="font-size: 13px">Created On: <b style="color: #444444">${new Date(
                    result.createdAt
                  ).toUTCString()}</b></span>
                </div>
              </div>
            </div>`;
            })
            .join("");
        }
      } catch (error) {
        console.log(error);
        const { responsemessage, status } = error;
        updateResponsePane(containerElement, responsemessage, status);
      }
    })
    .catch((error) => {
      console.log(error);
      updateResponsePane(containerElement, error, "error");
    });
}

function viewReceivedOverdraftHandler(options = { page: 1, limit: 50 }) {
  // ev.preventDefault();
  const containerElement = document.querySelector("#received-container");

  // containerElement.innerHTML = "Fetching results...";
  const apiUrl = `${
    globals[globals.environment].apiBaseUrl
  }/wallet/fetch-received-overdraft?page=${options.page}&limit=${
    options.limit
  }&order=createdAt:DESC`;

  fetch(apiUrl, {
    method: "get",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      authorization: `Bearer ${globals.token}`,
      mode: "no-cors",
      "x-api-key": globals[globals.environment].apiKey,
    },
  })
    .then(async (response) => {
      try {
        const result = await response.json();
        const { status } = result;

        if (result && result.data) {
          // const categoryObject = {};
          console.log(result.data);
          const { data } = result?.data;

          containerElement.innerHTML = data
            .map((result, index) => {
              return `<div class="d-flex rows result-entry">
              <h3 class="" style="margin: 10px 20px 10px 10px;">${
                index + 1
              }.</h3>

              <div class="d-flex cols flex-grow">
                <div class="d-flex rows space-between align-items-center">
                  <h3 style="margin: 10px 20px 0 0;">${
                    result.uplineName
                  } &nbsp; => &nbsp; ${result.downlineName}</h3>
                  <span class="status-indicator" data-status=${(() => {
                    switch (result.status) {
                      case true:
                        return "won";

                      case false:
                        return "lost";

                      default:
                        return "";
                    }
                  })()}>${result.status}</span>
                </div>  

                <div class="d-flex rows space-between">
                  <h5 style="margin-bottom: 10px; margin-top: 5px; color: #444444; text-transform: uppercase">${
                    result.transactionId
                  }</h5>
                </div>

                <div class="d-flex rows space-between">
                  <span>Ref: ${result.referenceId}</span>
                </div>

                <div class="d-flex rows space-between">
                  <span>Initial Amount: <b style="color: #444444">${
                    result.initialAmount
                  }</b></span>
                  <span>Rem. Amount: <b style="color: #444444">${
                    result.remainingAmount
                  }</b></span>
                </div>

                <div class="d-flex rows space-between" style="margin-top: 1rem">
                  <span class="fw-400" style="font-size: 13px">Expires On: <b style="color: #444444">${new Date(
                    result.expiresAt
                  ).toUTCString()}</b></span>
                </div>

                <div class="d-flex rows space-between" style="margin-top: 0.5rem">
                  <span class="fw-400" style="font-size: 13px">Created On: <b style="color: #444444">${new Date(
                    result.createdAt
                  ).toUTCString()}</b></span>
                </div>

                <div class="d-flex rows space-between" style="margin-top: 1rem">
                  <button onclick="repayOverdraft('${result.transactionId}', ${
                result.remainingAmount
              })">Return Overdraft</button>
                </div>
              </div>
            </div>`;
            })
            .join("");
        }
      } catch (error) {
        console.log(error);
        const { responsemessage, status } = error;
        updateResponsePane(containerElement, responsemessage, status);
      }
    })
    .catch((error) => {
      console.log(error);
      updateResponsePane(containerElement, error, "error");
    });
}

async function repayOverdraft(transactionId, amount) {
  console.log(transactionId, amount);
  const apiUrl = `${
    globals[globals.environment].apiBaseUrl
  }/wallet/repay-overdraft`;
  try {
    const response = await fetch(apiUrl, {
      method: "post",
      body: JSON.stringify({
        transactionId,
        amount,
      }),
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        authorization: `Bearer ${globals.token}`,
        mode: "no-cors",
        "x-api-key": globals[globals.environment].apiKey,
      },
    });

    const result = await response.json();
    const { status } = result;

    if (result && result.data) {
      // const { data } = result;
      const data = result?.data?.data;
      console.log(data);
      alert("returned");
      fetchAll();
    }
  } catch (error) {
    console.log(error);
    const { status } = error;
    console.log(status);
  }
}

function fetchAll() {
  fetchUserBalance();
  viewSentOverdraftHandler({ page: 1, limit: 50 });
  viewReceivedOverdraftHandler({ page: 1, limit: 50 });
}

function transferHandler(ev) {
  ev.preventDefault();
  const responseElement = document.querySelector("#transfer-form .response");
  const amountField = document.querySelector(
    "#transfer-form input[name='amount']"
  );
  const receipientInput = document.querySelector(
    "#transfer-form select[name='receipientId']"
  );

  const transactionPinInput = document.querySelector(
    "#transfer-form input[name='transactionPin']"
  );

  const dateInput = document.querySelector(
    "#transfer-form input[name='expiresAt']"
  );

  responseElement.innerHTML = "Send overdraft...";
  const payload = {
    amount: amountField?.value || 0,
    transactionPin: transactionPinInput?.value || "",
    receipientId: receipientInput?.value,
    expiresAt: new Date(
      Date.now() + 1000 || dateInput?.value || ""
    ).toISOString(),
  };

  console.log(payload);

  const apiUrl = `${
    globals[globals.environment].apiBaseUrl
  }/wallet/send-overdraft`;
  fetch(apiUrl, {
    method: "post",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      authorization: `Bearer ${globals.token}`,
      mode: "no-cors",
      "x-api-key": globals[globals.environment].apiKey,
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

        viewSentOverdraftHandler({ page: 1, limit: 50 });
        viewReceivedOverdraftHandler({ page: 1, limit: 50 });
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
  setPageIndex(11);
  const transferForm = document.querySelector("#transfer-form");
  transferForm.addEventListener("submit", transferHandler);

  const receipientSelect = document.querySelector(
    "#transfer-form select[name='receipientId']"
  );
  globals.user?.downlines.forEach((downline) => {
    const option = document.createElement("option");
    option.value = downline.userId;
    option.innerHTML = downline.firstname;

    receipientSelect.appendChild(option);
  });

  fetchAll();
});
