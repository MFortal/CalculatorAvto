let inputRight = document.getElementById("input-right");
let thumb = document.querySelector(".slider__thumb");
let range = document.querySelector(".slider__range");

let outputSymbol = document.querySelector(".output__symbol");
let output = document.querySelector(".output");
let slider = document.querySelector(".container-slider");

function setRightValue() {
  var _this = inputRight,
    min = parseInt(_this.min),
    max = parseInt(_this.max);
  _this.value = parseInt(_this.value);
  var percent = ((_this.value - min) / (max - min)) * 100;
  outputSymbol.innerHTML = Math.round(_this.value);
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