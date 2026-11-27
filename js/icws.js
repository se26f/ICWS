const menuButton = document.querySelector(".menu-toggle");
const navigation = document.getElementById("site-nav");

function setMenu(open) {
  navigation.classList.toggle("show", open);
  menuButton.setAttribute("aria-expanded", String(open));
}
menuButton.addEventListener("click", () =>
  setMenu(menuButton.getAttribute("aria-expanded") !== "true"),
);
document.addEventListener("keydown", (event) => {
  if (
    event.key === "Escape" &&
    menuButton.getAttribute("aria-expanded") === "true"
  ) {
    setMenu(false);
    menuButton.focus();
  }
});
document.addEventListener("click", (event) => {
  if (!event.target.closest(".site-header")) setMenu(false);
});
matchMedia("(min-width: 992px)").addEventListener("change", () =>
  setMenu(false),
);

const contact = document.getElementById("contact-form");
if (contact) {
  const status = contact.querySelector(".form-status");
  const fields = Array.from(contact.querySelectorAll("[required]"));
  contact.querySelector('[type="submit"]').disabled = false;

  function validateField(field) {
    field.setCustomValidity(field.value.trim() ? "" : "Please complete this field.");
    field.setAttribute("aria-invalid", String(!field.validity.valid));
  }

  contact.addEventListener("input", (event) => {
    if (fields.includes(event.target) && event.target.hasAttribute("aria-invalid")) {
      validateField(event.target);
    }
    status.textContent = "";
  });

  contact.addEventListener("submit", (event) => {
    event.preventDefault();
    fields.forEach(validateField);
    contact.classList.add("was-validated");
    const invalid = fields.find((field) => !field.validity.valid);
    if (invalid) {
      status.textContent = "Check the highlighted fields and try again.";
      status.className = "form-status is-error";
      invalid.focus();
      return;
    }
    status.textContent = "Your entries are valid. This preview keeps your message in this tab.";
    status.className = "form-status is-success";
    contact.classList.remove("was-validated");
    fields.forEach((field) => field.removeAttribute("aria-invalid"));
  });
}
