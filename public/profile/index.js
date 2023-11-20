const getFormValues = (formSelector, removeEmpty = true) => {
  const payload = {};

  document.querySelectorAll(`${formSelector} [name]`).forEach((el) => {
    // console.log(`${el.getAttribute("name")}, ${el.value}`);
    if (removeEmpty) {
      if (el.value) {
        payload[el.getAttribute("name")] = el.value;
      }
    } else {
      payload[el.getAttribute("name")] = el.value;
    }
  });

  console.log(payload);

  return payload;
};

const updateUserProfile = (ev) => {
  ev.preventDefault();

  const payload = getFormValues("#more-info-form");
  const userApiUrl = `${
    globals[globals.environment].apiBaseUrl
  }/user/update-user/${globals?.user?.userId}`;

  const agentApiUrl = `${
    globals[globals.environment].apiBaseUrl
  }/agent/update-profile/${globals?.user?.userId}`;

  console.log(globals?.user?.isAgent);
  fetchAPI({
    url: !globals?.user?.isAgent ? userApiUrl : agentApiUrl,
    method: "PUT",
    data: payload,
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      authorization: `Bearer ${globals.token}`,
      mode: "no-cors",
      "x-api-key": globals[globals.environment].apiKey,
    },
  })
    .then(async (result) => {
      console.log(result);
      if (result?.responsecode !== 200) {
        alert(result?.responsemessage);
      } else {
        const editBtn = document.querySelector("#edit-profile-btn");
        const updateForm = document.querySelector("#more-info-form");

        document.querySelector("#more-info").classList.toggle("hide", false);
        updateForm.classList.toggle("hide", true);
        editBtn.classList.toggle("hide", false);
      }
    })
    .catch((error) => {
      console.log(error);
      updateResponsePane(containerElement, error, "error");
    });
};

function viewUserProfile() {
  // ev.preventDefault();
  const updateForm = document.querySelector("#more-info-form");
  const avatarElement = document.querySelector("#user-avatar");
  const fullnameElement = document.querySelector("#user-fullname");
  const firstnameInputElement = document.querySelector("#user-firstname-input");
  const lastnameInputElement = document.querySelector("#user-lastname-input");

  const roleElement = document.querySelector("#user-role");
  const statusElement = document.querySelector("#user-status");
  const mobileElement = document.querySelector("#user-mobile");
  const mobileInputElement = document.querySelector("#user-mobile-input");
  const userIdElement = document.querySelector("#user-id");
  const userIdInputElement = document.querySelector("#user-id-input");
  const emailElement = document.querySelector("#user-email");
  const emailInputElement = document.querySelector("#user-email-input");
  const bankElement = document.querySelector("#user-bank");
  const bankInputElement = document.querySelector("#user-bank-input");
  const accountNameElement = document.querySelector("#user-account-name");
  const acNameInputElement = document.querySelector("#user-account-name-input");
  const accountNumberElement = document.querySelector("#user-account-number");
  const acNumberInputElement = document.querySelector(
    "#user-account-number-input"
  );
  const limitElement = document.querySelector("#user-daily-limit");
  const multiplierElement = document.querySelector("#user-multiplier");
  const refCodeElement = document.querySelector("#user-ref-code");

  const editBtn = document.querySelector("#edit-profile-btn");

  editBtn.addEventListener("click", (ev) => {
    document.querySelector("#more-info").classList.toggle("hide", true);
    updateForm.classList.toggle("hide", false);
    editBtn.classList.toggle("hide", true);
  });

  updateForm.addEventListener("submit", updateUserProfile);

  const downlinesContainer = document.querySelector("#downlines-container");
  downlinesContainer.innerHTML = "Fetching downlines...";

  const apiUrl = `${
    globals[globals.environment].apiBaseUrl
  }/user/fetch-authenticated-user`;

  fetchAPI({
    url: apiUrl,
    method: "get",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      authorization: `Bearer ${globals.token}`,
      mode: "no-cors",
      "x-api-key": globals[globals.environment].apiKey,
    },
  })
    .then(async (result) => {
      try {
        const { status } = result;

        if (result && result.data) {
          const { data } = result?.data;
          console.log(data);
          globals.user = data;

          avatarElement.src = data?.avatarUrl;
          fullnameElement.innerHTML = data?.firstname + " " + data?.lastname;
          firstnameInputElement.value = data?.firstname;
          lastnameInputElement.value = data?.lastname;
          roleElement.innerHTML = data?.role;
          statusElement.innerHTML = data?.status ? "Active" : "Suspended";
          statusElement.setAttribute(
            "data-status",
            data?.status ? "won" : "lost"
          );
          userIdElement.innerHTML = data?.userId || "-- --";
          userIdInputElement.value = data?.userId;
          mobileElement.innerHTML = data?.phone || "-- --";
          mobileInputElement.value = data?.phone;
          bankElement.innerHTML = data?.bankName || "-- --";
          bankInputElement.value = data?.bankName;
          emailElement.innerHTML = data?.email || "-- --";
          emailInputElement.value = data?.email;
          accountNumberElement.innerHTML = data?.accountNumber || "-- --";
          acNumberInputElement.value = data?.accountNumber;
          accountNameElement.innerHTML = data?.accountName || "-- --";
          acNameInputElement.value = data?.accountName;
          limitElement.innerHTML = data?.dailyLimit || "-- --";
          multiplierElement.innerHTML = data?.multiplier || "-- --";
          refCodeElement.innerHTML = data?.referralCode || "-- --";

          downlinesContainer.innerHTML = data?.downlines
            ?.map((downline) => {
              return `
              <div class="d-flex rows downline-card">
                <img src=${downline.avatarUrl} />
                <div class="d-flex cols" style="padding: 0 20px;">
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
        // updateResponsePane(containerElement, responsemessage, status);
      }
    })
    .catch((error) => {
      console.log(error);
      // updateResponsePane(containerElement, error, "error");
    });
}

const fetchAllData = () => {
  const mainBalanceElement = document.querySelector("#wallet-balance");
  const commissionBalanceElement = document.querySelector(
    "#commission-balance"
  );
  const winningBalanceElement = document.querySelector("#winning-balance");

  viewUserProfile();
  fetchUserBalance(mainBalanceElement, "main");
  fetchUserBalance(commissionBalanceElement, "commission");
  fetchUserBalance(winningBalanceElement, "winning");
};

document.addEventListener("DOMContentLoaded", () => {
  setPageIndex(1);
  fetchAllData();
});
