const supportForm = document.getElementById("supportForm");

if (supportForm) {
  const fullNameInput = document.getElementById("fullName");
  const emailInput = document.getElementById("email");
  const subjectInput = document.getElementById("subject");
  const messageInput = document.getElementById("message");
  const consentInput = document.getElementById("consent");
  const formStatus = document.getElementById("formStatus");

  const validators = {
    fullName: (value) => {
      const trimmed = value.trim();
      if (trimmed.length < 2) {
        return "Please enter at least 2 characters for your name.";
      }
      if (!/^[a-zA-Z][a-zA-Z\s'-]+$/.test(trimmed)) {
        return "Name can only contain letters, spaces, apostrophes, and hyphens.";
      }
      return "";
    },
    email: (value) => {
      const trimmed = value.trim();
      if (trimmed.length === 0) {
        return "Please enter your email address.";
      }
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
      if (!emailPattern.test(trimmed)) {
        return "Please enter a valid email address.";
      }
      return "";
    },
    subject: (value) => {
      const trimmed = value.trim();
      if (trimmed.length < 3) {
        return "Subject must be at least 3 characters long.";
      }
      return "";
    },
    message: (value) => {
      const trimmed = value.trim();
      if (trimmed.length < 20) {
        return "Message must be at least 20 characters long.";
      }
      return "";
    },
    consent: (checked) => {
      if (!checked) {
        return "Please confirm consent so we can contact you.";
      }
      return "";
    },
  };

  const fields = {
    fullName: {
      input: fullNameInput,
      errorId: "fullNameError",
      groupSelector: ".field-group",
    },
    email: {
      input: emailInput,
      errorId: "emailError",
      groupSelector: ".field-group",
    },
    subject: {
      input: subjectInput,
      errorId: "subjectError",
      groupSelector: ".field-group",
    },
    message: {
      input: messageInput,
      errorId: "messageError",
      groupSelector: ".field-group",
    },
    consent: {
      input: consentInput,
      errorId: "consentError",
      groupSelector: ".checkbox-group",
    },
  };

  function setFieldState(fieldName, errorMessage) {
    const field = fields[fieldName];
    const errorElement = document.getElementById(field.errorId);
    const fieldGroup = field.input.closest(field.groupSelector);
    const hasError = Boolean(errorMessage);

    if (errorElement) {
      errorElement.textContent = errorMessage;
    }

    if (fieldGroup) {
      fieldGroup.classList.toggle("has-error", hasError);
    }

    field.input.setAttribute("aria-invalid", hasError ? "true" : "false");
    return !hasError;
  }

  function validateField(fieldName) {
    const field = fields[fieldName];
    if (!field || !validators[fieldName]) {
      return true;
    }

    const value =
      fieldName === "consent" ? field.input.checked : field.input.value;
    const errorMessage = validators[fieldName](value);
    return setFieldState(fieldName, errorMessage);
  }

  function clearFormStatus() {
    formStatus.textContent = "";
    formStatus.classList.remove("success", "error");
  }

  fullNameInput.addEventListener("blur", () => validateField("fullName"));
  emailInput.addEventListener("blur", () => validateField("email"));
  subjectInput.addEventListener("blur", () => validateField("subject"));
  messageInput.addEventListener("blur", () => validateField("message"));
  consentInput.addEventListener("change", () => validateField("consent"));

  [fullNameInput, emailInput, subjectInput, messageInput].forEach(
    (fieldInput) => {
      fieldInput.addEventListener("input", () => {
        const fieldName = fieldInput.name;
        if (document.getElementById(`${fieldName}Error`).textContent) {
          validateField(fieldName);
        }
        clearFormStatus();
      });
    },
  );

  supportForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const validationResults = [
      validateField("fullName"),
      validateField("email"),
      validateField("subject"),
      validateField("message"),
      validateField("consent"),
    ];

    const isFormValid = validationResults.every(Boolean);

    clearFormStatus();

    if (!isFormValid) {
      formStatus.textContent =
        "Please fix the highlighted fields before submitting.";
      formStatus.classList.add("error");
      return;
    }

    formStatus.textContent =
      "Your message has been sent. We will reply as soon as possible.";
    formStatus.classList.add("success");
    supportForm.reset();

    Object.keys(fields).forEach((fieldName) => {
      setFieldState(fieldName, "");
    });
  });
}
