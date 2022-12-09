function viewUserProfile() {
  // ev.preventDefault();
  const avatarElement = document.querySelector("#user-avatar");
  const fullnameElement = document.querySelector("#user-fullname");
  const roleElement = document.querySelector("#user-role");
  const statusElement = document.querySelector("#user-status");
  const mobileElement = document.querySelector("#user-mobile");
  const emailElement = document.querySelector("#user-email");
  const bankElement = document.querySelector("#user-bank");
  const accountNameElement = document.querySelector("#user-account-name");
  const accountNumberElement = document.querySelector("#user-account-number");
  const limitElement = document.querySelector("#user-daily-limit");
  const multiplierElement = document.querySelector("#user-multiplier");
  const refCodeElement = document.querySelector("#user-ref-code");

  const downlinesContainer = document.querySelector("#downlines-container");
  downlinesContainer.innerHTML = "Fetching downlines...";

  const apiUrl = `${
    globals[globals.environment].apiBaseUrl
  }/user/fetch-authenticated-user`;

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
          const { data } = result?.data;
          console.log(data);

          avatarElement.src = data?.avatarUrl;
          fullnameElement.innerHTML = data?.firstname + ' ' + data?.lastname;
          roleElement.innerHTML = data?.role;
          statusElement.innerHTML = data?.status ? "Active" : "Suspended";
          statusElement.setAttribute('data-status', (data?.status ? "won" : "lost"));
          mobileElement.innerHTML = data?.phone || '-- --';
          bankElement.innerHTML = data?.bankName || '-- --';
          emailElement.innerHTML = data?.email || '-- --';
          accountNumberElement.innerHTML = data?.accountNumber || '-- --';
          accountNameElement.innerHTML = data?.accountName || '-- --';
          limitElement.innerHTML = data?.dailyLimit || '-- --';
          multiplierElement.innerHTML = data?.multiplier || '-- --';
          refCodeElement.innerHTML = data?.referralCode || '-- --';

          downlinesContainer.innerHTML = data?.downlines
            ?.map((downline) => {
              return `
              <div class="d-flex cols downline-card">
                <img src=${downline.avatarUrl} />
                <div class="d-flex cols" style="padding: 20px;">
                  <h3 class="name">${downline.firstname} ${downline.lastname}</h3>
                  <h4 class="role">${downline.role}</h4>
                </div>
              </div>
            `;
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

const fetchAllData = () => {
  const mainBalanceElement = document.querySelector("#wallet-balance");
  const commissionBalanceElement = document.querySelector("#commission-balance");

  viewUserProfile();
  fetchUserBalance(mainBalanceElement, "main");
  fetchUserBalance(commissionBalanceElement, "commission");
};

document.addEventListener("DOMContentLoaded", () => {
  setPageIndex(1);
  fetchAllData();
});
