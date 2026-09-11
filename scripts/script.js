// ==========================================
// ЭЛЕМЕНТЫ ИНТЕРФЕЙСА (DOM)
// ==========================================

// Элементы переключения вкладок и тексты
const tabLogin = document.querySelector("#tab-login");
const tabRegister = document.querySelector("#tab-register");
const formTitle = document.querySelector("#form-title");
const submitBtn = document.querySelector("#submit-btn");
const registerFields = document.querySelector("#register-only-fields");
const formToggleText = document.querySelector("#form-toggle-text");

// Ссылки на поля ввода формы
const nameInput = document.querySelector("#name");
const phoneInput = document.querySelector("#phone");
const emailInput = document.querySelector("#login");
const passwordInput = document.querySelector("#password");
const authForm = document.querySelector("#auth-form");

// Динамический элемент (абзац) для вывода сообщений об ошибках или успехе
const requiredPar = document.createElement("p");
requiredPar.style.margin = "10px 0 0 0";
requiredPar.style.textAlign = "center";
requiredPar.style.fontWeight = "bold";

// ==========================================
// СОСТОЯНИЕ И ДАННЫЕ ПРИЛОЖЕНИЯ
// ==========================================

// Текущий режим формы: 'login' (вход) или 'register' (регистрация)
let currentMode = "login";

// Загрузка списка пользователей из LocalStorage. Если данных нет, создается пустой массив.
const users = localStorage.getItem("users")
  ? JSON.parse(localStorage.getItem("users"))
  : [];

// ==========================================
// ФУНКЦИИ ПЕРЕКЛЮЧЕНИЯ РЕЖИМОВ
// ==========================================

/**
 * Переключает интерфейс формы в режим "Вход" (Login).
 * Изменяет активные вкладки, тексты кнопок, скрывает поля регистрации
 * и обновляет ссылку для переключения.
 */
function switchToLogin() {
  currentMode = "login";

  // Визуальное переключение активной вкладки
  tabLogin.classList.add("active");
  tabRegister.classList.remove("active");

  // Обновление текстов интерфейса
  formTitle.textContent = "Log in to your account";
  submitBtn.textContent = "Log In";

  // Скрываем поля регистрации и убираем у них валидацию обязательности
  registerFields.style.display = "none";
  nameInput.removeAttribute("required");
  phoneInput.removeAttribute("required");

  // Динамическое обновление нижней текстовой ссылки
  formToggleText.innerHTML = `Don't have an account yet? <a href="#" id="link-register">Sign Up</a>`;

  // Переназначаем событие клика для только что созданной ссылки "Sign Up"
  document
    .getElementById("link-register")
    .addEventListener("click", (event) => {
      event.preventDefault(); // Отмена стандартного перехода по ссылке
      switchToRegister();
    });
}

/**
 * Переключает интерфейс формы в режим "Регистрация" (Register).
 * Показывает дополнительные поля, делает их обязательными
 * и обновляет ссылку для возврата на форму входа.
 */
function switchToRegister() {
  currentMode = "register";

  // Визуальное переключение активной вкладки
  tabRegister.classList.add("active");
  tabLogin.classList.remove("active");

  // Обновление текстов интерфейса
  formTitle.textContent = "Create your account";
  submitBtn.textContent = "Sign Up";

  // Показываем поля регистрации и делаем их обязательными для заполнения
  registerFields.style.display = "block";
  nameInput.setAttribute("required", "required");
  phoneInput.setAttribute("required", "required");

  // Динамическое обновление нижней текстовой ссылки
  formToggleText.innerHTML =
    'Already have an account? <a href="#" id="link-login">Log In</a>';

  // Переназначаем событие клика для только что созданной ссылки "Log In"
  document.getElementById("link-login").addEventListener("click", (event) => {
    event.preventDefault(); // Отмена стандартного перехода по ссылке
    switchToLogin();
  });
}

// ==========================================
// НАВЕШИВАНИЕ ОБРАБОТЧИКОВ СОБЫТИЙ КЛИКА
// ==========================================

// Клик по вкладкам
tabLogin.addEventListener("click", switchToLogin);
tabRegister.addEventListener("click", switchToRegister);

// Инициализация клика для стартовой ссылки "Sign Up" (до первого переключения)
document.getElementById("link-register").addEventListener("click", (event) => {
  event.preventDefault();
  switchToRegister();
});

// ==========================================
// ОБРАБОТКА ОТПРАВКИ ФОРМЫ (SUBMIT)
// ==========================================

authForm.addEventListener("submit", (event) => {
  event.preventDefault(); // Предотвращаем перезагрузку страницы при отправке формы
  requiredPar.remove(); // Удаляем старое сервисное сообщение, если оно было на экране

  // ------------------------------------------
  // ЛОГИКА РЕГИСТРАЦИИ
  // ------------------------------------------
  if (currentMode === "register") {
    // Валидация: проверяем, чтобы все поля были заполнены
    if (
      !nameInput.value ||
      !phoneInput.value ||
      !emailInput.value ||
      !passwordInput.value
    ) {
      requiredPar.innerText = "Все поля обязательны";
      requiredPar.style.color = "red";
      authForm.querySelector(".form-content").appendChild(requiredPar);
      return; // Прерываем выполнение, если есть пустые поля
    }

    // Проверяем в базе данных (массиве), занят ли вводимый email
    const isEmailTaken = users.some((user) => user.email === emailInput.value);

    if (isEmailTaken) {
      requiredPar.innerText = "Пользователь c такой почтой уже существует!";
      requiredPar.style.color = "red";
    } else {
      // Создаем объект нового пользователя
      const userData = {
        name: nameInput.value,
        phoneNumber: phoneInput.value,
        email: emailInput.value,
        password: passwordInput.value,
      };

      // Добавляем в массив и синхронизируем с LocalStorage
      users.push(userData);
      localStorage.setItem("users", JSON.stringify(users));

      // Очищаем поля формы
      authForm.reset();

      requiredPar.innerText = "Вы успешно зарегистрировались!";
      requiredPar.style.color = "green";

      // Через 1.5 секунды автоматически переводим пользователя на экран входа
      setTimeout(switchToLogin, 1500);
    }
  }
  // ------------------------------------------
  // ЛОГИКА ВХОДА (LOGIN)
  // ------------------------------------------
  else {
    // Валидация: проверяем заполнение основных полей для входа
    if (!emailInput.value || !passwordInput.value) {
      requiredPar.innerText = "Необходимо заполнить все поля";
      requiredPar.style.color = "red";
      authForm.querySelector(".form-content").appendChild(requiredPar);
      return;
    }

    // Ищем пользователя с совпадающей парой email и пароля
    const foundUser = users.find(
      (user) =>
        user.email === emailInput.value &&
        user.password === passwordInput.value,
    );

    if (!foundUser) {
      requiredPar.innerText = "Вы ввели неверную почту или пароль";
      requiredPar.style.color = "red";
    } else {
      // Если пользователь найден, очищаем экран и выводим личный кабинет/приветствие
      const container = document.querySelector(".container");
      container.innerHTML = "";

      // Выводим приветственное сообщение
      requiredPar.innerText = `Вы успешно вошли, ${foundUser.name}!`;
      requiredPar.style.color = "green";
      requiredPar.style.fontSize = "20px";
      container.appendChild(requiredPar);

      // Динамически создаем кнопку выхода (Logout)
      const btnLogout = document.createElement("button");
      btnLogout.innerText = "Logout";
      btnLogout.className = "submit";
      btnLogout.style.marginTop = "20px";

      // При клике на Logout просто перезагружаем страницу, возвращая исходное состояние приложения
      btnLogout.addEventListener("click", () => {
        location.reload();
      });

      container.appendChild(btnLogout);
      return; // Выходим из функции, чтобы не добавлять requiredPar повторно внизу
    }
  }

  // Добавляем сформированное текстовое сообщение (ошибка/успех) внутрь формы
  authForm.querySelector(".form-content").appendChild(requiredPar);
});
