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

  const apiUrl = `${
    globals[globals.environment].apiBaseUrl
  }/wallet/bank-withdrawal/initialize`;

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
          fetchUserById(globals?.user?.userId)
            .then((user) => {
              const { walletBalance } = user;
              const walletBalanceElement = document.querySelector(
                "#withdrawal-balance"
              );
              walletBalanceElement.innerHTML =
                parseFloat(walletBalance).toFixed(2);
            })
            .catch((error) => {
              console.log(error);
            });
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
  let nextBtn = null;
  let prevBtn = null;

  if (nextBtn && prevBtn) {
    nextBtn.addEventListener("click", (ev) => {
      const page = ev.target.getAttribute("data-page");
      viewGamesHandler({ page: parseInt(page, 10), limit: 50 });
    });

    prevBtn.addEventListener("click", (ev) => {
      const page = ev.target.getAttribute("data-page");
      viewGamesHandler({ page: parseInt(page, 10), limit: 50 });
    });
  }
});
