function initAlumni() {
	document.getElementById('postJobBtn').addEventListener('click', postJob);
	document.getElementById('addSlotBtn').addEventListener('click', addSlot);
	renderSlots();
}

function postJob() {
	const company = document.getElementById('jobCompany').value.trim();
	const role = document.getElementById('jobRole').value.trim();
	const desc = document.getElementById('jobDesc').value.trim();
	if(!company || !role) return alert('Please enter company and role');
	const jobs = JSON.parse(localStorage.getItem('alumniJobs') || '[]');
	jobs.push({ id: Date.now(), company, role, desc });
	localStorage.setItem('alumniJobs', JSON.stringify(jobs));
	alert('Job posted (local)');
}

function addSlot() {
	const date = document.getElementById('slotDate').value;
	const time = document.getElementById('slotTime').value;
	if(!date || !time) return alert('Select date and time');
	const slots = JSON.parse(localStorage.getItem('mentorshipSlots') || '[]');
	slots.push({ id: Date.now(), date, time, taken: false });
	localStorage.setItem('mentorshipSlots', JSON.stringify(slots));
	renderSlots();
}

function renderSlots() {
	const list = document.getElementById('slotsList');
	const slots = JSON.parse(localStorage.getItem('mentorshipSlots') || '[]');
	list.innerHTML = '';
	if(!slots.length) list.innerHTML = '<div class="text-gray-600">No slots yet</div>';
	slots.forEach(s => {
		const div = document.createElement('div');
		div.className = 'p-2 border rounded flex justify-between items-center';
		div.innerHTML = `<div>${s.date} ${s.time} ${s.taken? '(Booked)':''}</div><button data-id="${s.id}" class="bookBtn bg-indigo-600 text-white px-2 py-1 rounded">Book</button>`;
		list.appendChild(div);
	});
	list.querySelectorAll('.bookBtn').forEach(b => b.addEventListener('click', (e)=>{
		const id = parseInt(e.target.dataset.id);
		bookSlot(id);
	}));
}

function bookSlot(id) {
	const slots = JSON.parse(localStorage.getItem('mentorshipSlots') || '[]');
	const idx = slots.findIndex(s=>s.id===id);
	if(idx===-1) return;
	if(slots[idx].taken) return alert('Slot already taken');
	slots[idx].taken = true;
	localStorage.setItem('mentorshipSlots', JSON.stringify(slots));
	alert('Slot booked (local)');
	renderSlots();
}

document.addEventListener('DOMContentLoaded', initAlumni);
