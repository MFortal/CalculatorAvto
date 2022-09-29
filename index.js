let inputRight = document.getElementById("input-right"),
  thumb = document.querySelector(".slider__thumb"),
  range = document.querySelector(".slider__range"),
  outputSymbol = document.querySelector(".output__symbol"),
  output = document.querySelector(".output"),
  slider = document.querySelector(".container-slider");

/*Разделение числа и добавление пробела*/
var thousandSeparator = function (str) {
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
function setRightValue() {
  var _this = inputRight,
    min = parseInt(_this.min),
    max = parseInt(_this.max);
  _this.value = parseInt(_this.value);
  var percent = ((_this.value - min) / (max - min)) * 100;
  outputSymbol.innerHTML = thousandSeparator(Math.round(_this.value));
  thumb.style.right = (100 - percent) + "%";
  range.style.right = (100 - percent) + "%";
}
setRightValue();

inputRight.addEventListener("input", setRightValue);

inputRight.addEventListener("mouseover", function () {
  thumb.classList.add("slider__thumb_hover");
  range.classList.add("slider__range_hover");

  /* Состояние Active */
  range.classList.add("slider__range_active");
  output.classList.add("output_active");
});

inputRight.addEventListener("mouseout", function () {
  thumb.classList.remove("slider__thumb_hover");
  range.classList.remove("slider__range_hover");

  /* Состояние Active */
  range.classList.remove("slider__range_active");
  output.classList.remove("output_active");
});

/* Состояние disabled, если data-disabled=true */
if (slider.dataset.disabled) {
  slider.classList.add("container-slider_disabled");
  inputRight.disabled = "true";
}