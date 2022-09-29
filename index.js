const inputs = Array.from(document.querySelectorAll(".input-slider")),
  thumbs = Array.from(document.querySelectorAll(".slider__thumb")),
  ranges = Array.from(document.querySelectorAll(".slider__range")),
  outputSymbols = Array.from(document.querySelectorAll(".output__symbol")),
  outputs = Array.from(document.querySelectorAll(".output")),
  sliders = Array.from(document.querySelectorAll(".container-slider")),
  price = document.querySelector(".input-priceAvto"),
  leasingAmount = document.querySelector(".output__leasingAmount"),
  monthPay = document.querySelector(".output__monthPay");

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
const setValues = (input, i) => {
  var _this = input,
    min = parseInt(_this.min),
    max = parseInt(_this.max);
  _this.value = parseInt(_this.value);
  var percent = ((_this.value - min) / (max - min)) * 100;

  // Если перемещен ползунок первоначального взноса
  if (outputSymbols[i].dataset.persent) {
    outputSymbols[i].innerHTML = thousandSeparator(Math.round(_this.value / 100 * price.value));
    document.querySelector(".output__persent").innerHTML = _this.value + '%';
  } else {
    outputSymbols[i].innerHTML = thousandSeparator(Math.round(_this.value));
  }

  // Перемещение ползунка
  thumbs[i].style.right = (100 - percent) + "%";
  ranges[i].style.right = (100 - percent) + "%";

  calculation();
}

/* Подсчет значений */
const calculation = () => {
  /* Ежемесячный платеж 
  (Стоимость автомобиля inputs[0] - Первоначальный взнос) * ((Процентная ставка * (1 + Процентная ставка) ^ Срок кредита в месяцах) / ((1 + Процентная ставка) ^ Срок кредита в месяцах - 1))
  const monthPay = (price - initial) * ((0.035 * Math.pow((1 + 0.035), months)) / (Math.pow((1 + 0.035), months) - 1));
  */
  const mPay = Math.round((inputs[0].value - inputs[1].value) * ((0.035) * Math.pow((1 + 0.035), inputs[2].value)) / (Math.pow((1 + 0.035), inputs[2].value) - 1));
  monthPay.innerHTML = thousandSeparator(mPay) + ' ₽';

  /* Сумма договора лизинга
  Первоначальный взнос + Срок кредита в месяцах * Ежемесячный платеж
  */
  leasingAmount.innerHTML = thousandSeparator(Math.round((inputs[1].value / 100 * price.value) + mPay * inputs[2].value)) + ' ₽';
}

inputs.forEach((item, i) => {
  setValues(item, i);
  item.addEventListener("input", () => {
    setValues(item, i);
  });
})

inputs.forEach((item, i) => {
  item.addEventListener("mouseover", function () {
    thumbs[i].classList.add("slider__thumb_hover");
    ranges[i].classList.add("slider__range_hover");

    /* Состояние Active */
    ranges[i].classList.add("slider__range_active");
    outputs[i].classList.add("output_active");
  });

  item.addEventListener("mouseout", function () {
    thumbs[i].classList.remove("slider__thumb_hover");
    ranges[i].classList.remove("slider__range_hover");

    /* Состояние Active */
    ranges[i].classList.remove("slider__range_active");
    outputs[i].classList.remove("output_active");
  });
})

/* Состояние disabled, если data-disabled=true */
sliders.forEach((item, i) => {
  if (item.dataset.disabled) {
    item.classList.add("container-slider_disabled");
    inputs[i].disabled = "true";
  }
})