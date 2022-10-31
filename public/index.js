function saveUser(token) {
  console.log(globals[globals.environment]);
  const responseElement = document.querySelector("#login-form .response");
  responseElement.innerHTML = responseElement.innerHTML + "<br>Saving user...";

  const apiUrl = `${
    globals[globals.environment].apiBaseUrl
  }/user/fetch-authenticated-user`;

  fetch(apiUrl, {
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      "x-api-key": globals[globals.environment].apiKey,
      authorization: `Bearer ${globals.token}`,
    },
  })
    .then(async (response) => {
      try {
        const result = await response.json();
        const { status } = result;

        if (result && result.data) {
          const { data } = result;
          const user = data?.data;
          console.log(user);
          globals.user = user;
          sessionStorage.setItem("user", JSON.stringify(user));
          responseElement.innerHTML =
            responseElement.innerHTML + "<br>User saved successfully!";
        } else {
          responseElement.innerHTML =
            responseElement.innerHTML + "<br>User saving failed!";
        }
      } catch (error) {
        console.log(error);
        const { status } = error;
        responseElement.innerHTML =
          responseElement.innerHTML + `<br>User saving failed:${status}!`;
      }
    })
    .catch((error) => {
      console.log(error);
      responseElement.innerHTML =
        responseElement.innerHTML + "<br>User saving failed!";
    });
}

// async function fetchUserById(userId) {
//   console.log(globals[globals.environment]);

//   const apiUrl = `${
//     globals[globals.environment].apiBaseUrl
//   }/user/fetch-user/${userId}`;

//   try {
//     const response = await fetch(apiUrl, {
//       headers: {
//         "Content-Type": "application/json;charset=utf-8",
//         authorization: `Bearer ${globals.token}`,
//         "x-api-key": globals[globals.environment].apiKey,
//       },
//     });
//     const result = await response.json();

//     if (result && result.data) {
//       const { data } = result;
//       const user = data?.data;
//       console.log(user);
//       return user;
//     } else {
//       return Promise.reject(result);
//     }
//   } catch (error) {
//     console.log(error);
//   }
// }

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

  const apiUrl = `${globals[globals.environment].apiBaseUrl}/auth/login`;
  fetch(apiUrl, {
    method: "post",
    body: JSON.stringify(payload),
    // mode: "no-cors",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      // mode: "no-cors",
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
          saveUser(token);
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

document.addEventListener("DOMContentLoaded", () => {
  setPageIndex(0);
  const loginForm = document.querySelector("#login-form");
  loginForm.addEventListener("submit", loginHandler);
});
