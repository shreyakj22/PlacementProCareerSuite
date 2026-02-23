// Frontend-only TPO logic: criteria engine, notify simulation, and scheduler

const students = [
  { id: 's1', name: 'Aisha Khan', email: 'aisha@example.com', phone: '9990001111', cgpa: 8.4, backlogs: 0, branch: 'CS' },
  { id: 's2', name: 'Rohit Verma', email: 'rohit@example.com', phone: '9990002222', cgpa: 7.5, backlogs: 0, branch: 'MCA' },
  { id: 's3', name: 'Priya Singh', email: 'priya@example.com', phone: '9990003333', cgpa: 6.2, backlogs: 1, branch: 'IT' },
  { id: 's4', name: 'Karan Mehta', email: 'karan@example.com', phone: '9990004444', cgpa: 9.0, backlogs: 0, branch: 'CS' },
  { id: 's5', name: 'Neha Gupta', email: 'neha@example.com', phone: '9990005555', cgpa: 7.1, backlogs: 2, branch: 'CS' }
];

let lastEligible = [];

function parseBranches(input) {
  if (!input) return [];
  return input.split(',').map(s => s.trim().toUpperCase()).filter(Boolean);
}

function validateBranchesAllowed(branches) {
  // Application policy: only CS and MCA allowed for placement drives
  const allowed = ['CS', 'MCA'];
  return branches.filter(b => allowed.includes(b));
}

function showEligible() {
  const minCgpa = parseFloat(document.getElementById('minCgpa').value) || 0;
  const maxBacklogs = parseInt(document.getElementById('maxBacklogs').value) || 0;
  const branchesInput = document.getElementById('branches').value;
  const branches = validateBranchesAllowed(parseBranches(branchesInput));

  const eligible = students.filter(s =>
    s.cgpa >= minCgpa &&
    s.backlogs <= maxBacklogs &&
    (branches.length === 0 || branches.includes(s.branch.toUpperCase()))
  );

  lastEligible = eligible;

  const driveResult = document.getElementById('driveResult');
  driveResult.innerHTML = `<div class="p-3 border rounded">${eligible.length} Students Eligible — <button id=\"quickNotify\" class=\"ml-2 bg-yellow-500 text-white px-3 py-1 rounded\">One-click Notify</button></div>`;

  document.getElementById('studentsList').innerHTML = '';
  eligible.forEach(s => {
    const div = document.createElement('div');
    div.className = 'student-item p-2 border rounded cursor-move bg-gray-50';
    div.draggable = true;
    div.dataset.id = s.id;
    div.dataset.name = s.name;
    div.dataset.email = s.email;
    div.innerHTML = `<div class=\"font-semibold\">${s.name}</div><div class=\"text-xs text-gray-600\">${s.branch} | CGPA: ${s.cgpa} | Backlogs: ${s.backlogs}</div>`;
    document.getElementById('studentsList').appendChild(div);
  });

  const quickBtn = document.getElementById('quickNotify');
  if (quickBtn) quickBtn.addEventListener('click', () => notifyEligible(eligible));
}

function notifyEligible(list) {
  if (!list || !list.length) {
    alert('No eligible students to notify');
    return;
  }
  // Simulated notify: in production this would call server APIs (email/SMS/push)
  const recipients = list.map(s => ({ name: s.name, email: s.email, phone: s.phone }));
  console.log('Notify recipients:', recipients);
  alert(`Notifications queued for ${recipients.length} students (simulated)`);
}

// Initialize FullCalendar with external drag-and-drop for students
function initScheduler() {
  const calendarEl = document.getElementById('calendar');

  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'timeGridWeek',
    editable: true,
    droppable: true,
    selectable: true,
    headerToolbar: { left: 'prev,next today', center: 'title', right: 'timeGridWeek,timeGridDay' },
    eventOverlap: false,
    drop: function(info) {
      // not used when using external draggable's eventReceive, but kept for safety
    },
    eventReceive: function(info) {
      // info.event contains the received event
      const newEvent = info.event;
      // Normalize event start/end
      const start = newEvent.start;
      const end = new Date(start.getTime() + 30 * 60 * 1000); // default 30 mins
      newEvent.setEnd(end);

      // Overlap prevention: check existing events (excluding this one)
      const events = calendar.getEvents().filter(e => e.id !== newEvent.id);
      const conflict = events.some(e => (e.start < newEvent.end) && (e.end > newEvent.start));
      if (conflict) {
        newEvent.remove();
        alert('Time slot conflict — cannot schedule overlapping interviews.');
        return;
      }

      // Attach student id in extendedProps
      if (!newEvent.extendedProps.studentId && info.draggedEl) {
        newEvent.setExtendedProp('studentId', info.draggedEl.dataset.id);
      }

      persistSchedules(calendar.getEvents());
    },
    eventChange: function(info) {
      // when event resized/moved, validate overlap
      const changed = info.event;
      const events = calendar.getEvents().filter(e => e.id !== changed.id);
      const conflict = events.some(e => (e.start < changed.end) && (e.end > changed.start));
      if (conflict) {
        info.revert();
        alert('Change would create overlap — reverted.');
        return;
      }
      persistSchedules(calendar.getEvents());
    }
  });

  calendar.render();

  // Make students list items draggable as external events
  new FullCalendar.Draggable(document.getElementById('studentsList'), {
    itemSelector: '.student-item',
    eventData: function(el) {
      return {
        title: el.dataset.name,
        extendedProps: { studentId: el.dataset.id, email: el.dataset.email }
      };
    }
  });

  // Load persisted schedules
  loadPersistedSchedules(calendar);
}

function persistSchedules(events) {
  const serialized = events.map(e => ({
    id: e.id,
    title: e.title,
    start: e.start.toISOString(),
    end: e.end ? e.end.toISOString() : null,
    extendedProps: e.extendedProps
  }));
  localStorage.setItem('tpoSchedules', JSON.stringify(serialized));
}

function loadPersistedSchedules(calendar) {
  const raw = localStorage.getItem('tpoSchedules');
  if (!raw) return;
  try {
    const items = JSON.parse(raw);
    items.forEach(it => {
      calendar.addEvent({ id: it.id, title: it.title, start: it.start, end: it.end, extendedProps: it.extendedProps });
    });
  } catch (e) {
    console.warn('Failed to load persisted schedules', e);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('filterBtn').addEventListener('click', showEligible);
  document.getElementById('createDriveBtn').addEventListener('click', () => {
    const company = document.getElementById('company').value || 'Unnamed Company';
    const criteria = {
      minCgpa: parseFloat(document.getElementById('minCgpa').value) || 0,
      maxBacklogs: parseInt(document.getElementById('maxBacklogs').value) || 0,
      branches: validateBranchesAllowed(parseBranches(document.getElementById('branches').value))
    };
    const drives = JSON.parse(localStorage.getItem('drives') || '[]');
    drives.push({ company, criteria, createdAt: new Date().toISOString() });
    localStorage.setItem('drives', JSON.stringify(drives));
    alert('Drive saved locally');
    showEligible();
  });

  document.getElementById('notifyBtn').addEventListener('click', () => notifyEligible(lastEligible));

  initScheduler();
});
