/*
 * Elements
 */
const nameInputFido2 = document.getElementById("name-fido2");
const registerBtnFido2 = document.getElementById("register-fido2");
const authenticateBtnFido2 = document.getElementById("authenticate-fido2");
const nameInputPush = document.getElementById("name-push");
const nameInputAdd = document.getElementById("name-add");
const codeInputPush = document.getElementById("code-push");
const codeInputAdd = document.getElementById("code-add");
const pushBtn = document.getElementById("button-push");
const addBtn = document.getElementById("button-add");

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

const handlerPushAuth = async () => {
  try {
    //1. Authenticate user
    await webSDK.authenticateWithFido2(nameInputPush.value);

    //2 Authorize code
    const res = await fetch(`/api/codes/push/authorize`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: nameInputPush.value,
        code: codeInputPush.value,
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      console.log(data);
      throw new Error(data.message);
    }
  } catch (e) {
    alert(e.message);
  }
};

const handlerAddAuth = async () => {
  try {
    //1. Authenticate user
    await webSDK.authenticateWithFido2(nameInputAdd.value);

    //2 Authorize code
    const res = await fetch(`/api/codes/add/authorize`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: nameInputAdd.value,
        code: codeInputAdd.value,
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      console.log(data);
      throw new Error(data.message);
    }
  } catch (e) {
    alert(e.message);
  }
};

registerBtnFido2.addEventListener("click", handlerRegisterFido2);
authenticateBtnFido2.addEventListener("click", handlerAuthenticateFido2);
pushBtn.addEventListener("click", handlerPushAuth);
addBtn.addEventListener("click", handlerAddAuth);
