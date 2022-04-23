"use strict";
//Responsive Nav
const navSlide = () => {
  const nav = document.querySelector(".nav-items");
  const burger = document.querySelector(".burger");
  const navLinks = document.querySelectorAll(".nav-items li");

  //toggle nav
  burger.addEventListener("click", () => {
    nav.classList.toggle("nav-active");
  });

  //animate links
  navLinks.forEach((link, index) => {
    link.style.animation = `navFadeIn .5s ease forwards ${index / 7}s`;
  });
};

const submitAnimation = () => {
  const submitBtn = document.querySelector(".btn-submit");
  const form = document.querySelector("form");

  submitBtn.addEventListener("click", () => {
    form.submit();
    submitBtn.style.animation = "btn-animation 1s ease";
    submitBtn.textContent = "✔";
  });
};

const orderBtns = () => {
  const orderBtn = document.querySelectorAll(".btn-order");
  const orderVal = document.getElementById("cars");
  for (let i = 0; i < orderBtn.length; i++) {
    orderBtn[i].addEventListener("click", () => {
      switch (i) {
        default:
          orderVal.value = "RWD";
          break;
        case 0:
          orderVal.value = "RWD";
          break;
        case 1:
          orderVal.value = "2AWD";
          break;
        case 2:
          orderVal.value = "3AWD";
          break;
      }
    });
  }
};

const app = () => {
  navSlide();
  submitAnimation();
  orderBtns();
};

app();
