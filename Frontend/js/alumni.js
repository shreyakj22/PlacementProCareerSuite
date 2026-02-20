// Alumni Dashboard JS — Job Referral Board, Mentorship Slots

// Sidebar navigation
function showSection(name) {
  document.querySelectorAll('.dashboard-section').forEach(s => s.classList.add('hidden'));
  document.getElementById('sec-' + name).classList.remove('hidden');
  document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
  event.target.classList.add('active');

  if (name === 'myjobs') renderMyJobs();
}

function initAlumni() {
  document.getElementById('postJobBtn').addEventListener('click', postJob);
  document.getElementById('addSlotBtn').addEventListener('click', addSlot);
  renderSlots();
}

function postJob() {
  const company = document.getElementById('jobCompany').value.trim();
  const role = document.getElementById('jobRole').value.trim();
  const desc = document.getElementById('jobDesc').value.trim();
  if (!company || !role) return alert('Please enter company and role');

  const jobs = JSON.parse(localStorage.getItem('alumniJobs') || '[]');
  jobs.push({ id: Date.now(), company, role, desc });
  localStorage.setItem('alumniJobs', JSON.stringify(jobs));

  // Clear form
  document.getElementById('jobCompany').value = '';
  document.getElementById('jobRole').value = '';
  document.getElementById('jobDesc').value = '';

  const msg = document.getElementById('jobPostMsg');
  msg.classList.remove('hidden');
  setTimeout(() => msg.classList.add('hidden'), 2000);
}

function addSlot() {
  const date = document.getElementById('slotDate').value;
  const time = document.getElementById('slotTime').value;
  if (!date || !time) return alert('Select date and time');

  const slots = JSON.parse(localStorage.getItem('mentorshipSlots') || '[]');
  slots.push({ id: Date.now(), date, time, taken: false });
  localStorage.setItem('mentorshipSlots', JSON.stringify(slots));

  document.getElementById('slotDate').value = '';
  document.getElementById('slotTime').value = '';
  renderSlots();
}

function renderSlots() {
  const list = document.getElementById('slotsList');
  const slots = JSON.parse(localStorage.getItem('mentorshipSlots') || '[]');
  list.innerHTML = '';

  if (!slots.length) {
    list.innerHTML = '<div class="section-card text-gray-500 text-center py-8">No mentorship slots created yet.</div>';
    return;
  }

  slots.forEach(s => {
    const div = document.createElement('div');
    div.className = 'section-card flex justify-between items-center';
    div.innerHTML = `
      <div>
        <span class="font-medium text-gray-800">${s.date}</span>
        <span class="text-gray-500 ml-2">${s.time}</span>
        ${s.taken
          ? '<span class="ml-3 px-2 py-1 bg-orange-100 text-orange-600 rounded text-xs font-medium">Booked by Student</span>'
          : '<span class="ml-3 px-2 py-1 bg-green-100 text-green-600 rounded text-xs font-medium">Available</span>'}
      </div>
      <button class="deleteSlotBtn bg-red-100 hover:bg-red-200 text-red-600 px-3 py-2 rounded-lg text-sm transition" data-id="${s.id}">Remove</button>
    `;
    list.appendChild(div);
  });

  list.querySelectorAll('.deleteSlotBtn').forEach(b => b.addEventListener('click', (e) => {
    const id = parseInt(e.target.dataset.id);
    const slots = JSON.parse(localStorage.getItem('mentorshipSlots') || '[]');
    const filtered = slots.filter(s => s.id !== id);
    localStorage.setItem('mentorshipSlots', JSON.stringify(filtered));
    renderSlots();
  }));
}

function renderMyJobs() {
  const container = document.getElementById('myJobsList');
  const jobs = JSON.parse(localStorage.getItem('alumniJobs') || '[]');
  container.innerHTML = '';

  if (!jobs.length) {
    container.innerHTML = '<div class="section-card text-gray-500 text-center py-8">No jobs posted yet. Go to "Post Job Referral" to add one.</div>';
    return;
  }

  jobs.slice().reverse().forEach(j => {
    const div = document.createElement('div');
    div.className = 'section-card flex justify-between items-center';
    div.innerHTML = `
      <div>
        <div class="font-semibold text-gray-800">${j.company} — ${j.role}</div>
        <div class="text-sm text-gray-500 mt-1">${j.desc || 'No description'}</div>
      </div>
      <button class="deleteJobBtn bg-red-100 hover:bg-red-200 text-red-600 px-3 py-2 rounded-lg text-sm transition" data-id="${j.id}">Delete</button>
    `;
    container.appendChild(div);
  });

  container.querySelectorAll('.deleteJobBtn').forEach(b => b.addEventListener('click', (e) => {
    const id = parseInt(e.target.dataset.id);
    const jobs = JSON.parse(localStorage.getItem('alumniJobs') || '[]');
    const filtered = jobs.filter(j => j.id !== id);
    localStorage.setItem('alumniJobs', JSON.stringify(filtered));
    renderMyJobs();
  }));
}

document.addEventListener('DOMContentLoaded', initAlumni);
