const priceAvtoInput = document.getElementById("price-avto"),
  initialPaymentInput = document.getElementById("initial-payment"),
  leasingPeriodInput = document.getElementById("leasing-period"),
  priceAvtoOutput = document.getElementById("price-avto-output"),
  initialPaymentOutput = document.getElementById("initial-payment-output"),
  leasingPeriodOutput = document.getElementById("leasing-period-output"),
  leasingAmount = document.getElementById("leasingAmount"),
  monthPay = document.getElementById("monthPay"),
  button = document.getElementById("button");

let mPay,
  initial,
  leasingSum;

/* Установление значений в ползунок */
const setValues = (input, output) => {

  let _this = input,
    min = parseInt(_this.min),
    max = parseInt(_this.max);
  _this.value = parseInt(_this.value);
  percent = ((_this.value - min) / (max - min)) * 100;

  // Если перемещен ползунок первоначального взноса
  if (output.dataset.persent) {
    output.value = format(Math.round(_this.value / 100 * priceAvtoInput.value));
    document.querySelector(".output__persent").innerHTML = _this.value + '%';
  } else {
    output.value = format(Math.round(_this.value));
  }

  moveSlider(_this, percent);
}

const moveSlider = (item, percent) => {
  // Перемещение ползунка
  item.nextElementSibling.querySelector(".slider__thumb").style.right = (100 - percent) + "%";
  item.nextElementSibling.querySelector(".slider__range").style.right = (100 - percent) + "%";

  calculation();
}

/* Подчсет значений */
const calculation = () => {

  //  ПЗ = Первоначальный взнос(в процентах) * Стоимость автомобиля = Math.round(initialPaymentInput.value / 100 * priceAvtoInput.value)
  initial = Math.round(initialPaymentInput.value / 100 * priceAvtoInput.value);
  initialPaymentOutput.value = format(initial);

  /* Ежемесячный платеж 
  (Стоимость автомобиля  - Первоначальный взнос) * ((Процентная ставка * (1 + Процентная ставка) ^ Срок кредита в месяцах) / ((1 + Процентная ставка) ^ Срок кредита в месяцах - 1))
  const monthPay = (price - initial) * ((0.035 * Math.pow((1 + 0.035), months)) / (Math.pow((1 + 0.035), months) - 1));
  */
  mPay = Math.round((priceAvtoInput.value - initial) * ((0.035) * Math.pow((1 + 0.035), leasingPeriodInput.value)) / (Math.pow((1 + 0.035), leasingPeriodInput.value) - 1));

  monthPay.innerHTML = format(mPay);
  /* Сумма договора лизинга
  Первоначальный взнос + Срок кредита в месяцах * Ежемесячный платеж
  */
  leasingSum = Math.round(initial + mPay * leasingPeriodInput.value);
  leasingAmount.innerHTML = format(leasingSum);
}

/* Установка событий в input при наборе текста*/
const addEventInput = (item, output) => {
  setValues(item, output);
  item.addEventListener("input", () => {
    setValues(item, output);
  });

  const thumb = item.nextElementSibling.querySelector(".slider__thumb");
  const range = item.nextElementSibling.querySelector(".slider__range");

  item.addEventListener("mouseover", function () {
    thumb.classList.add("slider__thumb_hover");
    range.classList.add("slider__range_hover");

    /* Состояние Active */
    range.classList.add("slider__range_active");
    output.parentNode.classList.add("output_active");
  });

  output.addEventListener("click", function () {
    thumb.classList.add("slider__thumb_hover");
    range.classList.add("slider__range_hover");

    /* Состояние Active */
    range.classList.add("slider__range_active");
    output.parentNode.classList.add("output_active");
  });

  item.addEventListener("mouseout", function () {
    thumb.classList.remove("slider__thumb_hover");
    range.classList.remove("slider__range_hover");

    /* Состояние Active */
    range.classList.remove("slider__range_active");
    output.parentNode.classList.remove("output_active");
  });

}

/* Состояние disabled для ползунка, если data-disabled=true у .slider */
const setSliderDisabled = (item) => {
  const slider = item.nextElementSibling;
  const sliderContainer = item.parentElement;
  if (slider.dataset.disabled) {
    sliderContainer.classList.add("container__elem_disabled");
    item.disabled = "true";
  }
}

/*  */
const deleteClass = () => {
  const items = document.querySelectorAll('.input-slider');
  const outputs = document.querySelectorAll('.output__value');

  for (item of items) {
    item.nextElementSibling.querySelector(".slider__thumb").classList.remove("slider__thumb_hover");
    item.nextElementSibling.querySelector(".slider__range").classList.remove("slider__range_hover");

    /* Состояние Active */
    item.nextElementSibling.querySelector(".slider__range").classList.remove("slider__range_active");
  }
  for (output of outputs) {
    output.parentNode.classList.remove("output_active");
  }
}

/* Если ткнули клавишей вне ввода */
document.onclick = function (e) {
  if (!e.target.classList.contains("output__value")) {
    deleteClass();
  };
};

/* Формат числа */
const format = (value) => {
  return new Intl.NumberFormat('ru-RU').format(value);
}

/* Невозможность ввода букв в инпут */
const setAddEventOutput = (input, output) => {
  output.addEventListener("keyup", (e) => {

    const setSliderInitial = () => {
      if (current > max) {
        current = max;
        output.value = format(max);
      } else if (current < min) {
        output.value = format(min);
        current = min;
      }

      if (output.dataset.persent) {
        let per = Math.round(current / priceAvtoInput.value * 100);
        document.querySelector(".output__persent").innerHTML = per + '%';
        // тут нужно подвинуть ползунок на определенное количество процентов
        //moveSlider(initialPaymentInput, 80);
      }
    }

    let current = output.value.replace(/[^\d]/g, "");

    let _this = input,
      min = parseInt(_this.min),
      max = parseInt(_this.max);

    input.value = output.value;

    if (output.dataset.persent) {
      min *= priceAvtoInput.value / 100;
      max *= priceAvtoInput.value / 100;
      input.value = Math.round(current / priceAvtoInput.value);
    }

    let percent = ((parseInt(current) - min) / (max - min)) * 100;

    if (percent > 100) {
      percent = 100;
      input.value = max;
    } else if (percent < 0) {
      percent = 0;
      input.value = min;
    }

    output.value = format(current);

    if (output.dataset.persent) {
      document.querySelector(".output__persent").innerHTML = input.value + '%';
    }
    moveSlider(input, percent);

    /* Если нажата enter */
    if (e.key === 'Enter') {
      deleteClass();
      e.preventDefault();
      e.target.blur();
      setSliderInitial();
    }
  });
}

// Отправка JSON на сервер
const sendJSON = () => {
  // Экземпляр запроса XHR
  let xhr = new XMLHttpRequest();
  let url = "https://eoj3r7f3r4ef6v4.m.pipedream.net";
  // Открытие соединения
  xhr.open("POST", url, true);
  // Заголовок
  xhr.setRequestHeader("Content-Type", "application/json");
  // Обработка ответа от сервера
  xhr.onreadystatechange = function () {
    // Если запрос принят и сервер ответил, что всё в порядке
    if (xhr.readyState === 4 && xhr.status === 200) {
      console.log(this.responseText);
    }
  };
  // Преобразование данных в JSON
  var data = JSON.stringify({
    "priceAvto": priceAvtoInput.value, //Cтоимость авто
    "initial": initial, //Первоначальный взнос
    "initialPercent": initialPaymentInput.value, //%
    "leasingPeriod": leasingPeriodInput.value, //Месяцы
    "monthPay": mPay, //Ежемесячный платеж
    "leasingSum": leasingSum //Сумма договора
  });

  // Отправка JSON на сервер
  xhr.send(data);
}

// Отправка данных на сервер по клику на кнопку
button.addEventListener("click", () => {
  sendJSON();
  const value = button.innerHTML;
  const elements = document.querySelectorAll('.container__elem');
  const ranges = document.querySelectorAll('.input-slider');

  const deleteClassButton = () => {
    button.classList.remove('button_loading');
    button.innerHTML = value;
    for (el of elements) {
      el.classList.remove('container__elem_disabled');
    }
    for (range of ranges) {
      range.disabled = false;
    }
  }

  const addLoadingButton = () => {
    button.innerHTML = `<img class="button__img" src="img/ellipse.svg" />`;
    button.classList.add('button_loading');
    for (el of elements) {
      el.classList.add('container__elem_disabled');
    }
    for (range of ranges) {
      range.disabled = true;
    }
  }
  addLoadingButton();
  setTimeout(deleteClassButton, 9 * 1000);
})


setValues(priceAvtoInput, priceAvtoOutput);
setValues(initialPaymentInput, initialPaymentOutput);
setValues(leasingPeriodInput, leasingPeriodOutput);

addEventInput(priceAvtoInput, priceAvtoOutput);
addEventInput(initialPaymentInput, initialPaymentOutput);
addEventInput(leasingPeriodInput, leasingPeriodOutput);

setSliderDisabled(priceAvtoInput);
setSliderDisabled(initialPaymentInput);
setSliderDisabled(leasingPeriodInput);

setAddEventOutput(priceAvtoInput, priceAvtoOutput);
setAddEventOutput(initialPaymentInput, initialPaymentOutput);
setAddEventOutput(leasingPeriodInput, leasingPeriodOutput);