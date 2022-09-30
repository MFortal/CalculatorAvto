const priceAvtoInput = document.getElementById("price-avto"),
  initialPaymentInput = document.getElementById("initial-payment"),
  leasingPeriodInput = document.getElementById("leasing-period"),
  priceAvtoOutput = document.getElementById("price-avto-output"),
  initialPaymentOutput = document.getElementById("initial-payment-output"),
  leasingPeriodOutput = document.getElementById("leasing-period-output"),
  leasingAmount = document.getElementById("leasingAmount"),
  monthPay = document.getElementById("monthPay");

let _this,
  min,
  max,
  percent;

/*Разделение числа и добавление пробела*/
const thousandSeparator = (str) => {
  var parts = (str + '').split('.'),
    main = parts[0],
    len = main.length,
    output = '',
    i = len - 1;

  while (i >= 0) {
    output = main.charAt(i) + output;
    if ((len - i) % 3 === 0 && i > 0) {
      output = ' ' + output;
    }
    --i;
  }

  if (parts.length > 1) {
    output += '.' + parts[1];
  }
  return output;
};

/* Установление значений в ползунок */
const setValues = (input, output) => {

  _this = input,
    min = parseInt(_this.min),
    max = parseInt(_this.max);
  _this.value = parseInt(_this.value);
  percent = ((_this.value - min) / (max - min)) * 100;

  // Если перемещен ползунок первоначального взноса
  if (output.dataset.persent) {
    output.value = thousandSeparator(Math.round(_this.value / 100 * priceAvtoInput.value));
    document.querySelector(".output__persent").innerHTML = _this.value + '%';
  } else {
    output.value = thousandSeparator(Math.round(_this.value));
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
  const initial = Math.round(initialPaymentInput.value / 100 * priceAvtoInput.value);

  /* Ежемесячный платеж 
  (Стоимость автомобиля  - Первоначальный взнос) * ((Процентная ставка * (1 + Процентная ставка) ^ Срок кредита в месяцах) / ((1 + Процентная ставка) ^ Срок кредита в месяцах - 1))
  const monthPay = (price - initial) * ((0.035 * Math.pow((1 + 0.035), months)) / (Math.pow((1 + 0.035), months) - 1));
  */
  const mPay = Math.round((priceAvtoInput.value - initial) * ((0.035) * Math.pow((1 + 0.035), leasingPeriodInput.value)) / (Math.pow((1 + 0.035), leasingPeriodInput.value) - 1));

  monthPay.innerHTML = thousandSeparator(mPay) + ' ₽';
  /* Сумма договора лизинга
  Первоначальный взнос + Срок кредита в месяцах * Ежемесячный платеж
  */
  leasingAmount.innerHTML = thousandSeparator(Math.round(initial + mPay * leasingPeriodInput.value)) + ' ₽';
}

/* Установка событий в input */
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
    sliderContainer.classList.add("container-slider_disabled");
    item.disabled = "true";
  }
}


/* Если ткнули клавишей вне ввода */
document.onclick = function (e) {
  if (!e.target.classList.contains("output__value")) {

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
  };
};

/* Невозможность ввода букв в инпут */
const setAddEventOutput = (input, output) => {

  output.addEventListener("keyup", () => {
    let current = output.value.replace(/[^\d]/g, "");

    output.value = current;
    _this = input,
      min = parseInt(_this.min),
      max = parseInt(_this.max),
      percent = ((parseInt(output.value) - min) / (max - min)) * 100;

    if (percent > 100) {
      percent = 100;
      input.value = max;
    } else if (percent < 0) {
      percent = 0;
      input.value = min;
    } else {
      input.value = output.value;
    }

    moveSlider(input, percent);
  });

  output.addEventListener('keypress', function (e) {
    let currentValue = output.value;
    _this = input,
      min = parseInt(_this.min),
      max = parseInt(_this.max);

    if (e.key === 'Enter') {
      // if (output.value > max) {
      //   if (output.dataset.persent) {
      //     currentValue = Math.round(max / 100 * priceAvtoInput.value);
      //     console.log('много в процентах');
      //   } else {
      //     currentValue = max;
      //     console.log('много');
      //   }
      // } else if (output.value < min) {
      //   if (output.dataset.persent) {
      //     currentValue = Math.round(min / 100 * priceAvtoInput.value);
      //   } else {
      //     currentValue = min;
      //   }
      if (output.value > max) {
        if (output.dataset.persent) {
          currentValue = Math.round(max / 100 * priceAvtoInput.value);
        } else
          currentValue = max;
      } else if (output.value < min) {
        if (output.dataset.persent) {
          currentValue = Math.round(min / 100 * priceAvtoInput.value);
        } else {
          currentValue = min;
        }
      }
      output.value = thousandSeparator(currentValue);
    }
  });
}

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