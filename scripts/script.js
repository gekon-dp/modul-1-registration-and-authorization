// Реализовать формы регистрации и логина.
// Данные зарегистрированных пользователей хранить в массиве объектов в localStorage.
// Для обеих форм сделать проверку на пустые поля при отправке.
// При вводе неверного логина или пароля выводить сообщение об ошибке.
// При успешном логине и регистрации выводит сообщение и очищать поля.

// Элементы переключения вкладок и тексты
const tabLogin = document.querySelector("#tab-login");
const tabRegister = document.querySelector("#tab-register");
const formTitle = document.querySelector("#form-title");
const submitBtn = document.querySelector("#submit-btn");
const registerFields = document.querySelector("#register-only-fields");
const formToggleText = document.querySelector("#form-toggle-text");

// Ссылки на поля ввода
const nameInput = document.querySelector("#name");
const phoneInput = document.querySelector("#phone");
const emailInput = document.querySelector("#login");
const passwordInput = document.querySelector("#password");
const authForm = document.querySelector("#auth-form");

// Cообщений об ошибках / успехе
const requiredPar = document.createElement("p");
requiredPar.style.margin = "10px 0 0 0";
requiredPar.style.textAlign = "center";
requiredPar.style.fontWeight = "bold";

let currentMode = "login";

const users = localStorage.getItem("users")
  ? JSON.parse(localStorage.getItem("users"))
  : [];

// Функция переключения на LOGIN
function switchToLogin() {
  currentMode = "login";
  tabLogin.classList.add("active");
  tabRegister.classList.remove("active");
  formTitle.textContent = "Log in to your account";
  submitBtn.textContent = "Log In";

  // Скрываем поля регистрации и убираем обязательность
  registerFields.style.display = "none";
  nameInput.removeAttribute("required");
  phoneInput.removeAttribute("required");

  formToggleText.innerHTML = `Don't have an account yet? <a href="#" id="link-register">Sign Up</a>`;

  // Переназначаем событие для новой ссылки в innerHTML
  document
    .getElementById("link-register")
    .addEventListener("click", (event) => {
      event.preventDefault();
      switchToRegister();
    });
}

// Функция переключения на REGISTER
function switchToRegister() {
  currentMode = "register";
  tabRegister.classList.add("active");
  tabLogin.classList.remove("active");
  formTitle.textContent = "Create your account";
  submitBtn.textContent = "Sign Up";

  registerFields.style.display = "block";
  nameInput.setAttribute("required", "required");
  phoneInput.setAttribute("required", "required");

  formToggleText.innerHTML =
    'Already have an account? <a href="#" id="link-login">Log In</a>';

  document.getElementById("link-login").addEventListener("click", (event) => {
    event.preventDefault();
    switchToLogin();
  });
}

tabLogin.addEventListener("click", switchToLogin);
tabRegister.addEventListener("click", switchToRegister);

document.getElementById("link-register").addEventListener("click", (event) => {
  event.preventDefault();
  switchToRegister();
});

authForm.addEventListener("submit", (event) => {
  event.preventDefault();
  requiredPar.remove();

  // Логика регисрации
  if (currentMode === "register") {
    if (
      !nameInput.value ||
      !phoneInput.value ||
      !emailInput.value ||
      !passwordInput.value
    ) {
      requiredPar.innerText = "Все поля обязательны";
      requiredPar.style.color = "red";
      authForm.querySelector(".form-content").appendChild(requiredPar);
      return;
    }

    // Проверяем, занят ли email
    const isEmailTaken = users.some((user) => user.email === emailInput.value);

    if (isEmailTaken) {
      requiredPar.innerText = "Пользователь c такой почтой уже существует!";
      requiredPar.style.color = "red";
    } else {
      // Сохраняем нового пользователя
      const userData = {
        name: nameInput.value,
        phoneNumber: phoneInput.value,
        email: emailInput.value,
        password: passwordInput.value,
      };

      users.push(userData);
      localStorage.setItem("users", JSON.stringify(users));

      // Сбрасываем значения формы
      authForm.reset();

      requiredPar.innerText = "Вы успешно зарегистрировались!";
      requiredPar.style.color = "green";

      setTimeout(switchToLogin, 1500);
    }
  } else {
    // Логика входа
    if (!emailInput.value || !passwordInput.value) {
      requiredPar.innerText = "Необходимо заполнить все поля";
      requiredPar.style.color = "red";
      authForm.querySelector(".form-content").appendChild(requiredPar);
      return;
    }

    const foundUser = users.find(
      (user) =>
        user.email === emailInput.value &&
        user.password === passwordInput.value,
    );

    if (!foundUser) {
      requiredPar.innerText = "Вы ввели неверную почту или пароль";
      requiredPar.style.color = "red";
    } else {
      const container = document.querySelector(".container");
      container.innerHTML = "";

      // Выводим приветствие
      requiredPar.innerText = `Вы успешно вошли, ${foundUser.name}!`;
      requiredPar.style.color = "green";
      requiredPar.style.fontSize = "20px";
      container.appendChild(requiredPar);

      // Кнопка выхода (Logout)
      const btnLogout = document.createElement("button");
      btnLogout.innerText = "Logout";
      btnLogout.className = "submit";
      btnLogout.style.marginTop = "20px";
      btnLogout.addEventListener("click", () => {
        location.reload();
      });
      container.appendChild(btnLogout);
      return;
    }
  }

  authForm.querySelector(".form-content").appendChild(requiredPar);
});
