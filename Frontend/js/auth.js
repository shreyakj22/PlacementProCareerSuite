function loginUser() {

  const role = document.getElementById('role').value;
  const enteredCaptcha = document.getElementById('captchaInput').value;

  // CAPTCHA CHECK
  if (enteredCaptcha !== window.currentCaptcha) {
    alert("Invalid Captcha");
    return;
  }

  if (role === "student") {

    const email = document.getElementById('stuEmail').value;
    const username = document.getElementById('stuUsername').value;
    const password = document.getElementById('stuPassword').value;

    if (email && username && password) {
      window.location.href = "student.html";
    } else {
      alert("Please fill all student fields");
    }

  }

  else if (role === "tpo") {

    const tpoId = document.getElementById('tpoId').value;
    const password = document.getElementById('tpoPassword').value;

    if (tpoId && password) {
      window.location.href = "tpo.html";
    } else {
      alert("Please fill TPO details");
    }

  }

  else if (role === "alumni") {

    const email = document.getElementById('alEmail').value;
    const password = document.getElementById('alPassword').value;

    if (email && password) {
      window.location.href = "alumni.html";
    } else {
      alert("Please fill alumni details");
    }

  }
}
