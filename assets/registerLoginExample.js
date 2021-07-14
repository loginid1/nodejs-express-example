/*
 * Elements
 */
const nameInputFido2 = document.getElementById("name-fido2");
const registerBtnFido2 = document.getElementById("register-fido2");
const authenticateBtnFido2 = document.getElementById("authenticate-fido2");

const messageElem = document.querySelector(".message");

const dataElem = document.querySelector("data");
const baseUrl = dataElem.dataset.baseUrl;
const clientId = dataElem.dataset.clientId;

const webSDK = new web.default(baseUrl, clientId);

const handlerRegisterFido2 = async () => {
  try {
    const result = await webSDK.registerWithFido2(nameInputFido2.value);
    const res = await fetch("/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jwt: result.jwt, user: result.user }),
    });

    if (res.ok) {
      window.location.replace("/dashboard");
    }
  } catch (e) {
    console.log(e);
    alert(e.message);
  }
};

const handlerAuthenticateFido2 = async () => {
  try {
    const result = await webSDK.authenticateWithFido2(nameInputFido2.value);
    const res = await fetch("/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jwt: result.jwt, user: result.user }),
    });

    if (res.ok) {
      window.location.replace("/dashboard");
    }
  } catch (e) {
    console.log(e);
    alert(e.message);
  }
};

registerBtnFido2.addEventListener("click", handlerRegisterFido2);
authenticateBtnFido2.addEventListener("click", handlerAuthenticateFido2);
