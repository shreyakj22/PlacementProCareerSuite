// Student front-end: profile save, resume PDF generation, live feed and simple application tracker

const studentMockProfile = { name: '', branch: 'CS', email: '', phone: '' };

function initStudent() {
	document.getElementById('saveProfile').addEventListener('click', () => {
		studentMockProfile.name = document.getElementById('stuName').value || studentMockProfile.name;
		studentMockProfile.branch = document.getElementById('stuBranch').value || studentMockProfile.branch;
		studentMockProfile.cgpa = parseFloat(document.getElementById('stuCgpa').value) || studentMockProfile.cgpa;
		studentMockProfile.email = document.getElementById('stuEmail').value || studentMockProfile.email;
		studentMockProfile.phone = document.getElementById('stuPhone').value || studentMockProfile.phone;
		localStorage.setItem('studentProfile', JSON.stringify(studentMockProfile));
		alert('Profile saved (local)');
		renderLiveFeed();
		renderJobBoard();
		renderMentorshipSlots();
		renderTracker();
	});

	document.getElementById('generatePdf').addEventListener('click', generateResumePdf);
	renderLiveFeed();
	renderJobBoard();
	renderMentorshipSlots();
	renderTracker();
}

function generateResumePdf() {
	const { jsPDF } = window.jspdf;
	const doc = new jsPDF();
	const name = document.getElementById('resName').value || '';
	const email = document.getElementById('resEmail').value || '';
	const phone = document.getElementById('resPhone').value || '';
	const projects = (document.getElementById('resProjects').value || '').split('\n').filter(Boolean);
	const skills = (document.getElementById('resSkills').value || '').split(',').map(s=>s.trim()).filter(Boolean);

	doc.setFontSize(18);
	doc.text(name || 'Student Name', 14, 20);
	doc.setFontSize(11);
	doc.text(`Email: ${email}`, 14, 30);
	doc.text(`Phone: ${phone}`, 14, 36);
	doc.text('Skills:', 14, 48);
	doc.text(skills.join(', '), 14, 54);
	doc.text('Projects:', 14, 68);
	let y = 74;
	projects.forEach(p => {
		doc.text('- ' + p, 16, y);
		y += 6;
	});
	doc.save((name || 'resume') + '.pdf');
}

function renderLiveFeed() {
	const feed = document.getElementById('liveFeed');
	const drives = JSON.parse(localStorage.getItem('drives') || '[]');
	const profile = JSON.parse(localStorage.getItem('studentProfile') || JSON.stringify(studentMockProfile));
	feed.innerHTML = '';
	if (!drives.length) {
		feed.innerHTML = '<div class="p-2 text-gray-600">No drives yet</div>';
		return;
	}
	drives.forEach(d => {
		// quick eligibility check
		const minCgpa = d.criteria.minCgpa || 0;
		const branches = d.criteria.branches || [];
		const eligible = (!minCgpa || (parseFloat(profile.cgpa || 0) >= minCgpa)) && (branches.length === 0 || branches.includes((profile.branch||'').toUpperCase()));
		const div = document.createElement('div');
		div.className = 'p-3 border-b flex justify-between items-start';
		div.innerHTML = `<div><div class=\"font-semibold\">${d.company}</div><div class=\"text-sm text-gray-600\">Criteria: CGPA ${d.criteria.minCgpa || 0} | Backlogs ≤ ${d.criteria.maxBacklogs || 0}</div></div><div class=\"text-right\"><div class=\"text-sm text-gray-500 mb-2\">${eligible? 'Eligible':'Not Eligible'}</div><button class=\"applyBtn bg-indigo-600 text-white px-3 py-1 rounded text-sm\" data-company=\"${d.company}\">Apply</button></div>`;
		feed.appendChild(div);
	});

	// attach apply handlers
	feed.querySelectorAll('.applyBtn').forEach(btn => btn.addEventListener('click', (e)=>{
		const company = e.target.dataset.company;
		applyToCompany(company);
	}));
}

function renderTracker() {
	const container = document.getElementById('tracker');
	const apps = JSON.parse(localStorage.getItem('applications') || '[]');
	container.innerHTML = '';
	if(!apps.length) container.innerHTML = '<div class="p-2 text-gray-600">No applications yet</div>';
	apps.forEach(a => {
		const div = document.createElement('div');
		div.className = 'p-2 border rounded mb-2';
		div.innerHTML = `<div class="font-semibold">${a.company}</div><div class="text-sm text-gray-600">Status: ${a.status}</div>`;
		container.appendChild(div);
	});
}

function applyToCompany(company) {
 	const apps = JSON.parse(localStorage.getItem('applications') || '[]');
 	if(apps.some(a=>a.company===company)) return alert('Already applied');
 	apps.push({ id: Date.now(), company, status: 'Applied', appliedAt: new Date().toISOString() });
 	localStorage.setItem('applications', JSON.stringify(apps));
 	renderTracker();
 	alert('Application recorded (local)');
}

// Job board & mentorship slots from alumni
function renderJobBoard() {
 	const board = document.getElementById('jobBoard');
 	if(!board) return;
 	const jobs = JSON.parse(localStorage.getItem('alumniJobs') || '[]');
 	board.innerHTML = '';
 	if(!jobs.length) return board.innerHTML = '<div class="text-gray-600 p-2">No alumni referrals yet</div>';
 	jobs.forEach(j => {
 		const div = document.createElement('div');
 		div.className = 'p-3 border rounded mb-2 flex justify-between items-start';
 		div.innerHTML = `<div><div class=\"font-semibold\">${j.company} — ${j.role}</div><div class=\"text-sm text-gray-600\">${j.desc}</div></div><div><button class=\"applyJobBtn bg-indigo-600 text-white px-3 py-1 rounded text-sm\" data-company=\"${j.company}\">Apply</button></div>`;
 		board.appendChild(div);
 	});
 	board.querySelectorAll('.applyJobBtn').forEach(b => b.addEventListener('click', e=>applyToCompany(e.target.dataset.company)));
}

function renderMentorshipSlots() {
 	const container = document.getElementById('mentorshipSlots');
 	if(!container) return;
 	const slots = JSON.parse(localStorage.getItem('mentorshipSlots') || '[]');
 	container.innerHTML = '';
 	if(!slots.length) return container.innerHTML = '<div class="text-gray-600 p-2">No mentorship slots available</div>';
 	slots.forEach(s => {
 		const div = document.createElement('div');
 		div.className = 'p-2 border rounded mb-2 flex justify-between items-center';
 		div.innerHTML = `<div>${s.date} ${s.time} ${s.taken? '(Booked)':''}</div><div><button class=\"bookMentBtn bg-indigo-600 text-white px-2 py-1 rounded\" data-id=\"${s.id}\">Book</button></div>`;
 		container.appendChild(div);
 	});
 	container.querySelectorAll('.bookMentBtn').forEach(b => b.addEventListener('click', e=>{
 		const id = parseInt(e.target.dataset.id);
 		bookMentorship(id);
 	}));
}

function bookMentorship(id) {
 	const slots = JSON.parse(localStorage.getItem('mentorshipSlots') || '[]');
 	const idx = slots.findIndex(s=>s.id===id);
 	if(idx===-1) return alert('Slot not found');
 	if(slots[idx].taken) return alert('Slot already taken');
 	slots[idx].taken = true;
 	localStorage.setItem('mentorshipSlots', JSON.stringify(slots));
 	renderMentorshipSlots();
 	alert('Mentorship slot booked (local)');
}

document.addEventListener('DOMContentLoaded', initStudent);
