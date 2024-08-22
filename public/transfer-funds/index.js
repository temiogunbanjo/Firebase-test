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

  const apiUrl = `${
    globals[globals.environment].apiBaseUrl
  }/wallet/transfer-fund-to-user`;
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
      } catch (error) {
        console.log(error);
        const { responsemessage, status } = error;
        updateResponsePane(responseElement, responsemessage, status);
      } finally {
        fetchUserBalance(document.querySelector("#transfer-form #transfer-balance"));
      }
    })
    .catch((error) => {
      console.log(error);
      updateResponsePane(responseElement, error, "error");
    });
}

document.addEventListener("DOMContentLoaded", () => {
  setPageIndex(4);
  const transferForm = document.querySelector("#transfer-form");
  transferForm.addEventListener("submit", transferHandler);

  fetchUserBalance(document.querySelector("#transfer-form #transfer-balance"));
});
