function loginUser() {
  const role = document.getElementById('role').value;
  const captchaInput = document.getElementById('captchaInput') ? document.getElementById('captchaInput').value.trim() : '';
  if(!window.currentCaptcha || captchaInput !== window.currentCaptcha){
    alert('Captcha incorrect. Please try again.');
    return;
  }

  // Basic client-side validation per role (demo only)
  if(role === 'student'){
    const email = document.getElementById('stuEmail') ? document.getElementById('stuEmail').value.trim() : '';
    const username = document.getElementById('stuUsername') ? document.getElementById('stuUsername').value.trim() : '';
    const pass = document.getElementById('stuPassword') ? document.getElementById('stuPassword').value : '';
    if(!email || !username || !pass) return alert('Please fill email, username and password');
    // store mock student credentials in localStorage (demo)
    localStorage.setItem('studentAuth', JSON.stringify({ email, username }));
    window.location.href = 'student.html';
    return;
  }

  if(role === 'tpo'){
    const id = document.getElementById('tpoId') ? document.getElementById('tpoId').value.trim() : '';
    const pass = document.getElementById('tpoPassword') ? document.getElementById('tpoPassword').value : '';
    if(!id || !pass) return alert('Please enter TPO ID and password');
    localStorage.setItem('tpoAuth', JSON.stringify({ id }));
    window.location.href = 'tpo.html';
    return;
  }

  if(role === 'alumni'){
    const email = document.getElementById('alEmail') ? document.getElementById('alEmail').value.trim() : '';
    const pass = document.getElementById('alPassword') ? document.getElementById('alPassword').value : '';
    if(!email || !pass) return alert('Please enter email and password');
    localStorage.setItem('alumniAuth', JSON.stringify({ email }));
    window.location.href = 'alumni.html';
    return;
  }

  alert('Unknown role');
}

// Expose for inline callers and Enter-key handling
window.loginUser = loginUser;