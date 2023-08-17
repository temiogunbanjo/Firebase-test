function topupHandler(ev) {
  ev.preventDefault();
  const responseElement = document.querySelector("#topup-form .response");

  const amountField = document.querySelector(
    "#topup-form input[name='amount']"
  );
  const narrationField = document.querySelector(
    "#topup-form input[name='narration']"
  );
  const referenceField = document.querySelector(
    "#topup-form input[name='payReference']"
  );
  const paymentMethodInput = document.querySelector(
    "#topup-form input[name='paymentMethod']:checked"
  );

  responseElement.innerHTML = "Topping up wallet...";
  const payload = {
    amount: amountField?.value || 0,
    provider: paymentMethodInput?.value || null,
    narration: narrationField?.value || "Topping up...",
    payReference: referenceField?.value,
  };

  const apiUrl = `${globals[globals.environment].apiBaseUrl}/wallet/topup`;

  fetchAPI({
    url: apiUrl,
    method: "put",
    data: payload,
  })
    .then(async (result) => {
      try {
        // const result = await response.json();
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
        fetchAll();
      }
    })
    .catch((error) => {
      console.log(error);
      updateResponsePane(responseElement, error, "error");
    });
}

const approvalHandler = (ev) => {
  const roleValue = document.querySelector("#role-to-approve")?.value || "ordinaryagent";

  const payload = {
    chosenWeek: 21,
    chosenYear: `${new Date().getFullYear()}`,
    role: roleValue,
  };

  let apiUrl = "";
  if (globals?.user?.role === "superadmin") {
    apiUrl = `${
      globals[globals.environment].apiBaseUrl
    }/commissions/confirm-approval3-commissions`;
  } else if (globals?.user?.role === "superaccountant") {
    apiUrl = `${
      globals[globals.environment].apiBaseUrl
    }/commissions/confirm-approval2-commissions`;
  } else {
    apiUrl = `${
      globals[globals.environment].apiBaseUrl
    }/commissions/confirm-approval1-commissions`;
  }

  fetchAPI({
    url: apiUrl,
    method: "post",
    data: payload,
  })
    .then(async (result) => {
      try {
        const { status } = result;
        alert(
          result && result.data
            ? result?.data?.message || `Approved all ${payload.role} successfully`
            : status
        );
      } catch (error) {
        console.error(error);
      } finally {
        fetchAll();
      }
    })
    .catch((error) => {
      console.error(error);
    });
};

function viewCommissionsHandler(options = { page: 1, limit: 50 }) {
  // ev.preventDefault();
  const containerElement = document.querySelector("#results-container");
  const nextBtn = document.querySelector(
    "#results-pagination #next-results-page"
  );
  const prevBtn = document.querySelector(
    "#results-pagination #prev-results-page"
  );
  const pageCount = document.querySelector("#results-pagination #page-count");
  const pageTotal = document.querySelector("#results-pagination #total-pages");

  // containerElement.innerHTML = "Fetching results...";
  const apiUrl = `${
    globals[globals.environment].apiBaseUrl
  }/commissions/get-aggregate-commissions?page=${options.page}&limit=${
    options.limit
  }&week=21&type=${globals?.user?.role}&order=createdAt:DESC`;

  fetchAPI({
    url: apiUrl,
  })
    .then(async (result) => {
      try {
        // const result = await response.json();
        const { status } = result;

        if (result && result.data) {
          // const categoryObject = {};
          pageCount.innerHTML = options.page;
          pageTotal.innerHTML = Math.ceil(
            result.data.totalCount / options.limit
          );
          if (options.page === 1) {
            prevBtn.setAttribute("disabled", true);
          } else {
            prevBtn.removeAttribute("disabled");
          }

          nextBtn.setAttribute("data-page", options.page + 1);
          prevBtn.setAttribute("data-page", options.page - 1);

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
                  <div class="d-flex rows align-items-center">
                    <h3 style="margin: 10px 20px 0 0; text-transform: capitalize">${
                      result.name?.length > 35
                        ? `${result.name?.slice(0, 35)}...`
                        : result.name
                    }</h3>
                    <span class="status-indicator" data-status=${(() => {
                      switch (result.debtStatus) {
                        case "eligible":
                          return "won";

                        case "ineligible":
                          return "lost";

                        case "pending":
                          return "ongoing";

                        default:
                          return "";
                      }
                    })()} style="margin: 10px 0 0 0; font-size: 10px">${
                result.debtStatus
              }</span>
                  </div>

                  <div class="d-flex rows align-items-center">
                    <span class="fw-400" style="margin-left: 20px; font-size: 13px">${new Date(
                      result.createdAt
                    ).toUTCString()}</span>
                  </div>
                </div>  

                <div class="d-flex rows space-between">
                  <h5 style="margin-bottom: 10px; margin-top: 5px; color: #444444;">Downline of ${
                    result.uplineName
                  }</h5>
                </div>

                <div class="d-flex rows space-between">
                  <span>Role: ${result.agentLevel}</span>
                  <span class="fw-600" style="margin-left: 20px; margin-bottom: 3px">
                    <span class="status-indicator" data-status=${
                      result.approval1 ? "won" : "failed"
                    }>${result.approval1 ? "Approved" : "Not Approved"}</span>
                    / <span class="status-indicator" data-status=${
                      result.approval2 ? "won" : "failed"
                    }>${result.approval2 ? "Approved" : "Not Approved"}</span>
                    / <span class="status-indicator" data-status=${
                      result.approval3 ? "won" : "failed"
                    }>${result.approval3 ? "Approved" : "Not Approved"}</span>
                </div>

                <div class="d-flex rows space-between">
                  <span>Total Sales: <b style="color: #444444">NGN ${
                    result.totalSales
                  }</b></span>
                </div>

                <div class="d-flex rows space-between">
                  <span>Total Won: <b style="color: #444444">NGN ${
                    result.totalWon
                  }</b></span>
                </div>

                <div class="d-flex rows space-between">
                  <span>Total Commission: <b style="color: #444444">NGN ${
                    result.totalCommission
                  }</b></span>
                  <span class="status-indicator" data-status=${(() => {
                    switch (result.status) {
                      case "paid":
                        return "won";

                      case "failed":
                        return "lost";

                      case "pending":
                        return "ongoing";

                      default:
                        return "";
                    }
                  })()}>${result.status}</span>
                </div>
              </div>
            </div>`;
            })
            .join("");

          let approvalBtn = document.querySelector("#approve-commissions");
          if (data.length === 0) {
            if (approvalBtn) approvalBtn.setAttribute("disabled", true);
          } else {
            if (approvalBtn) approvalBtn.removeAttribute("disabled");
          }
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

function fetchAll() {
  viewCommissionsHandler({ page: 1, limit: 50 });
}

document.addEventListener("DOMContentLoaded", () => {
  setPageIndex(2);

  let nextBtn = document.querySelector(
    "#results-pagination #next-results-page"
  );
  let prevBtn = document.querySelector(
    "#results-pagination #prev-results-page"
  );
  const topupForm = document.querySelector("#topup-form");
  let approvalBtn = document.querySelector("#approve-commissions");

  if (approvalBtn) {
    approvalBtn.addEventListener("click", (ev) => {
      approvalHandler(ev);
      fetchAll();
    });
  }

  if (nextBtn && prevBtn) {
    nextBtn.addEventListener("click", (ev) => {
      const page = ev.target.getAttribute("data-page");
      viewCommissionsHandler({ page: parseInt(page, 10), limit: 50 });
    });

    prevBtn.addEventListener("click", (ev) => {
      const page = ev.target.getAttribute("data-page");
      viewCommissionsHandler({ page: parseInt(page, 10), limit: 50 });
    });
  }

  topupForm.addEventListener("submit", topupHandler);

  fetchAll();
  setInterval(() => {
    fetchAll();
  }, 0.333 * 60 * 1000);
});
