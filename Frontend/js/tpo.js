// TPO Dashboard JS — Criteria Engine, Eligible Students, Interview Scheduler, Analytics

const students = [
  { id: 's1', name: 'Aisha Khan', email: 'aisha@example.com', phone: '9990001111', cgpa: 8.4, backlogs: 0, branch: 'CS' },
  { id: 's2', name: 'Rohit Verma', email: 'rohit@example.com', phone: '9990002222', cgpa: 7.5, backlogs: 0, branch: 'MCA' },
  { id: 's3', name: 'Priya Singh', email: 'priya@example.com', phone: '9990003333', cgpa: 6.2, backlogs: 1, branch: 'IT' },
  { id: 's4', name: 'Karan Mehta', email: 'karan@example.com', phone: '9990004444', cgpa: 9.0, backlogs: 0, branch: 'CS' },
  { id: 's5', name: 'Neha Gupta', email: 'neha@example.com', phone: '9990005555', cgpa: 7.1, backlogs: 2, branch: 'CS' },
  { id: 's6', name: 'Amit Sharma', email: 'amit@example.com', phone: '9990006666', cgpa: 8.8, backlogs: 0, branch: 'MCA' },
  { id: 's7', name: 'Sneha Patel', email: 'sneha@example.com', phone: '9990007777', cgpa: 7.8, backlogs: 0, branch: 'CS' },
  { id: 's8', name: 'Vikram Joshi', email: 'vikram@example.com', phone: '9990008888', cgpa: 6.9, backlogs: 1, branch: 'IT' },
  { id: 's9', name: 'Divya Nair', email: 'divya@example.com', phone: '9990009999', cgpa: 8.1, backlogs: 0, branch: 'MCA' },
  { id: 's10', name: 'Rahul Das', email: 'rahul@example.com', phone: '9990010000', cgpa: 7.3, backlogs: 0, branch: 'CS' }
];

let lastEligible = [];
let calendarInstance = null;

// Sidebar navigation
function showSection(name) {
  document.querySelectorAll('.dashboard-section').forEach(s => s.classList.add('hidden'));
  document.getElementById('sec-' + name).classList.remove('hidden');
  document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
  event.target.classList.add('active');

  if (name === 'scheduler' && !calendarInstance) {
    setTimeout(initScheduler, 100);
  }
  if (name === 'analytics') {
    renderAnalytics();
  }
  if (name === 'drives') {
    renderAllDrives();
  }
  if (name === 'eligible') {
    renderEligibleSection();
  }
}

function parseBranches(input) {
  if (!input) return [];
  return input.split(',').map(s => s.trim().toUpperCase()).filter(Boolean);
}

function showEligible() {
  const minCgpa = parseFloat(document.getElementById('minCgpa').value) || 0;
  const maxBacklogs = parseInt(document.getElementById('maxBacklogs').value) || 0;
  const branches = parseBranches(document.getElementById('branches').value);

  const eligible = students.filter(s =>
    s.cgpa >= minCgpa &&
    s.backlogs <= maxBacklogs &&
    (branches.length === 0 || branches.includes(s.branch.toUpperCase()))
  );

  lastEligible = eligible;

  // Show result in criteria section
  const driveResult = document.getElementById('driveResult');
  driveResult.innerHTML = `
    <div class="mt-4 p-4 rounded-lg ${eligible.length ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}">
      <span class="font-semibold ${eligible.length ? 'text-green-700' : 'text-red-700'}">
        ${eligible.length} Student${eligible.length !== 1 ? 's' : ''} Eligible
      </span>
    </div>
  `;

  // Also update eligible section
  renderEligibleSection();
  renderSchedulerStudents();
}

function renderEligibleSection() {
  const container = document.getElementById('studentsList');
  const countEl = document.getElementById('eligibleCount');
  const countText = document.getElementById('eligibleCountText');
  const noMsg = document.getElementById('noStudentsMsg');

  container.innerHTML = '';

  if (!lastEligible.length) {
    countEl.classList.add('hidden');
    noMsg.classList.remove('hidden');
    return;
  }

  noMsg.classList.add('hidden');
  countEl.classList.remove('hidden');
  countText.textContent = `${lastEligible.length} Students Eligible`;

  lastEligible.forEach(s => {
    const div = document.createElement('div');
    div.className = 'section-card student-item';
    div.draggable = true;
    div.dataset.id = s.id;
    div.dataset.name = s.name;
    div.dataset.email = s.email;
    div.innerHTML = `
      <div class="font-semibold text-gray-800">${s.name}</div>
      <div class="text-sm text-gray-500 mt-1">${s.branch} &nbsp;|&nbsp; CGPA: ${s.cgpa} &nbsp;|&nbsp; Backlogs: ${s.backlogs}</div>
      <div class="text-xs text-gray-400 mt-1">${s.email} &nbsp;|&nbsp; ${s.phone}</div>
    `;
    container.appendChild(div);
  });
}

function renderSchedulerStudents() {
  const container = document.getElementById('schedulerStudentsList');
  if (!container) return;
  container.innerHTML = '';

  if (!lastEligible.length) {
    container.innerHTML = '<div class="text-gray-500 text-sm text-center py-4">Filter students first using Criteria Engine</div>';
    return;
  }

  lastEligible.forEach(s => {
    const div = document.createElement('div');
    div.className = 'student-item p-3 border border-gray-200 rounded-lg bg-gray-50';
    div.draggable = true;
    div.dataset.id = s.id;
    div.dataset.name = s.name;
    div.dataset.email = s.email;
    div.innerHTML = `<div class="font-medium text-sm">${s.name}</div><div class="text-xs text-gray-500">${s.branch} | ${s.cgpa}</div>`;
    container.appendChild(div);
  });

  // Re-init draggable if calendar exists
  if (calendarInstance) {
    new FullCalendar.Draggable(container, {
      itemSelector: '.student-item',
      eventData: function(el) {
        return {
          title: el.dataset.name,
          extendedProps: { studentId: el.dataset.id, email: el.dataset.email }
        };
      }
    });
  }
}

function notifyEligible(list) {
  if (!list || !list.length) {
    alert('No eligible students to notify');
    return;
  }
  const recipients = list.map(s => ({ name: s.name, email: s.email, phone: s.phone }));
  console.log('Notify recipients:', recipients);
  alert(`📧 Notifications sent to ${recipients.length} students!\n\n${recipients.map(r => `• ${r.name} (${r.email})`).join('\n')}\n\n(Simulated — in production this sends email/SMS)`);
}

// FullCalendar Interview Scheduler
function initScheduler() {
  const calendarEl = document.getElementById('calendar');
  if (!calendarEl) return;

  calendarInstance = new FullCalendar.Calendar(calendarEl, {
    initialView: 'timeGridWeek',
    editable: true,
    droppable: true,
    selectable: true,
    height: 550,
    headerToolbar: { left: 'prev,next today', center: 'title', right: 'timeGridWeek,timeGridDay' },
    eventOverlap: false,
    slotMinTime: '09:00:00',
    slotMaxTime: '18:00:00',
    eventReceive: function(info) {
      const newEvent = info.event;
      const start = newEvent.start;
      const end = new Date(start.getTime() + 30 * 60 * 1000);
      newEvent.setEnd(end);

      const events = calendarInstance.getEvents().filter(e => e.id !== newEvent.id);
      const conflict = events.some(e => (e.start < newEvent.end) && (e.end > newEvent.start));
      if (conflict) {
        newEvent.remove();
        alert('⚠ Time slot conflict — cannot schedule overlapping interviews.');
        return;
      }

      if (!newEvent.extendedProps.studentId && info.draggedEl) {
        newEvent.setExtendedProp('studentId', info.draggedEl.dataset.id);
      }
      persistSchedules();
    },
    eventChange: function(info) {
      const changed = info.event;
      const events = calendarInstance.getEvents().filter(e => e.id !== changed.id);
      const conflict = events.some(e => (e.start < changed.end) && (e.end > changed.start));
      if (conflict) {
        info.revert();
        alert('⚠ Change would create overlap — reverted.');
        return;
      }
      persistSchedules();
    }
  });

  calendarInstance.render();

  // Make scheduler students draggable
  const schedulerList = document.getElementById('schedulerStudentsList');
  if (schedulerList) {
    new FullCalendar.Draggable(schedulerList, {
      itemSelector: '.student-item',
      eventData: function(el) {
        return {
          title: el.dataset.name,
          extendedProps: { studentId: el.dataset.id, email: el.dataset.email }
        };
      }
    });
  }

  loadPersistedSchedules();
  renderSchedulerStudents();
}

function persistSchedules() {
  if (!calendarInstance) return;
  const events = calendarInstance.getEvents();
  const serialized = events.map(e => ({
    id: e.id,
    title: e.title,
    start: e.start.toISOString(),
    end: e.end ? e.end.toISOString() : null,
    extendedProps: e.extendedProps
  }));
  localStorage.setItem('tpoSchedules', JSON.stringify(serialized));
}

function loadPersistedSchedules() {
  if (!calendarInstance) return;
  const raw = localStorage.getItem('tpoSchedules');
  if (!raw) return;
  try {
    const items = JSON.parse(raw);
    items.forEach(it => {
      calendarInstance.addEvent({ id: it.id, title: it.title, start: it.start, end: it.end, extendedProps: it.extendedProps });
    });
  } catch (e) {
    console.warn('Failed to load persisted schedules', e);
  }
}

// Analytics
function renderAnalytics() {
  const drives = JSON.parse(localStorage.getItem('drives') || '[]');
  const apps = JSON.parse(localStorage.getItem('applications') || '[]');
  const schedules = JSON.parse(localStorage.getItem('tpoSchedules') || '[]');

  document.getElementById('statTotalStudents').textContent = students.length;
  document.getElementById('statTotalDrives').textContent = drives.length;
  document.getElementById('statApplications').textContent = apps.length;
  document.getElementById('statScheduled').textContent = schedules.length;

  // Branch distribution
  const branchCount = {};
  students.forEach(s => { branchCount[s.branch] = (branchCount[s.branch] || 0) + 1; });
  const branchChart = document.getElementById('branchChart');
  branchChart.innerHTML = '';
  const colors = ['bg-indigo-500', 'bg-purple-500', 'bg-pink-500', 'bg-blue-500', 'bg-green-500'];
  let ci = 0;
  for (const [branch, count] of Object.entries(branchCount)) {
    const pct = Math.round((count / students.length) * 100);
    branchChart.innerHTML += `
      <div>
        <div class="flex justify-between text-sm mb-1"><span>${branch}</span><span class="font-medium">${count} students (${pct}%)</span></div>
        <div class="w-full bg-gray-200 rounded-full h-3"><div class="${colors[ci % colors.length]} h-3 rounded-full" style="width:${pct}%"></div></div>
      </div>
    `;
    ci++;
  }

  // Recent drives
  const recentDrives = document.getElementById('recentDrives');
  recentDrives.innerHTML = '';
  if (!drives.length) {
    recentDrives.innerHTML = '<div class="text-gray-500 text-sm">No drives created yet.</div>';
  } else {
    drives.slice(-5).reverse().forEach(d => {
      recentDrives.innerHTML += `
        <div class="p-3 border border-gray-100 rounded-lg">
          <div class="font-medium text-gray-800">${d.company}</div>
          <div class="text-xs text-gray-500">CGPA ≥ ${d.criteria.minCgpa} | Backlogs ≤ ${d.criteria.maxBacklogs} | ${d.criteria.branches.length ? d.criteria.branches.join(', ') : 'All'}</div>
        </div>
      `;
    });
  }
}

// All Drives list
function renderAllDrives() {
  const drives = JSON.parse(localStorage.getItem('drives') || '[]');
  const container = document.getElementById('allDrivesList');
  container.innerHTML = '';

  if (!drives.length) {
    container.innerHTML = '<div class="section-card text-gray-500 text-center py-8">No drives created yet. Use the Criteria Engine to create one.</div>';
    return;
  }

  drives.slice().reverse().forEach((d, i) => {
    const div = document.createElement('div');
    div.className = 'section-card flex justify-between items-center';
    div.innerHTML = `
      <div>
        <div class="font-semibold text-gray-800 text-lg">${d.company}</div>
        <div class="text-sm text-gray-500 mt-1">CGPA ≥ ${d.criteria.minCgpa} &nbsp;|&nbsp; Backlogs ≤ ${d.criteria.maxBacklogs} &nbsp;|&nbsp; ${d.criteria.branches.length ? d.criteria.branches.join(', ') : 'All Branches'}</div>
        <div class="text-xs text-gray-400 mt-1">Created: ${new Date(d.createdAt).toLocaleString()}</div>
      </div>
      <button class="deleteDriveBtn bg-red-100 hover:bg-red-200 text-red-600 px-3 py-2 rounded-lg text-sm transition" data-idx="${drives.length - 1 - i}">Delete</button>
    `;
    container.appendChild(div);
  });

  container.querySelectorAll('.deleteDriveBtn').forEach(btn => btn.addEventListener('click', e => {
    const idx = parseInt(e.target.dataset.idx);
    const drives = JSON.parse(localStorage.getItem('drives') || '[]');
    drives.splice(idx, 1);
    localStorage.setItem('drives', JSON.stringify(drives));
    renderAllDrives();
  }));
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('filterBtn').addEventListener('click', showEligible);

  document.getElementById('createDriveBtn').addEventListener('click', () => {
    const company = document.getElementById('company').value.trim();
    if (!company) return alert('Please enter a company name');

    const criteria = {
      minCgpa: parseFloat(document.getElementById('minCgpa').value) || 0,
      maxBacklogs: parseInt(document.getElementById('maxBacklogs').value) || 0,
      branches: parseBranches(document.getElementById('branches').value)
    };

    const drives = JSON.parse(localStorage.getItem('drives') || '[]');
    drives.push({ company, criteria, createdAt: new Date().toISOString() });
    localStorage.setItem('drives', JSON.stringify(drives));

    document.getElementById('driveResult').innerHTML = `
      <div class="mt-4 p-4 rounded-lg bg-green-50 border border-green-200">
        <span class="font-semibold text-green-700">✓ Drive "${company}" created successfully!</span>
      </div>
    `;

    showEligible();
  });

  document.getElementById('notifyBtn').addEventListener('click', () => notifyEligible(lastEligible));

  const quickBtn = document.getElementById('quickNotifyBtn');
  if (quickBtn) quickBtn.addEventListener('click', () => notifyEligible(lastEligible));
});
