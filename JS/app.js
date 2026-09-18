// Initial sample events (Requisito B)
const eventos = [
	{
		id: 1,
		titulo: "Workshop de Git e GitHub",
		tipo: "Workshop",
		data: "2026-09-25",
		local: "Laboratório 2",
		descricao: "Atividade prática sobre versionamento.",
		status: "Agendado"
	},
	{
		id: 2,
		titulo: "Palestra sobre Segurança na Web",
		tipo: "Palestra",
		data: "2026-10-05",
		local: "Auditório Principal",
		descricao: "Conscientização sobre boas práticas de segurança.",
		status: "Agendado"
	},
	{
		id: 3,
		titulo: "Feira de Tecnologia",
		tipo: "Feira",
		data: "2026-11-12",
		local: "Centro de Convenções",
		descricao: "Exposição de projetos e startups locais.",
		status: "Confirmado"
	}
];

document.addEventListener('DOMContentLoaded', () => {
	const links = document.querySelectorAll('a.nav-link[data-view]');
	const sections = {
		Dashboard: document.getElementById('Dashboard'),
		NovoEvento: document.getElementById('NovoEvento'),
		Eventos: document.getElementById('Eventos')
	};

	function renderDashboard() {
		const totalEl = document.getElementById('totalCount');
		const agendadosEl = document.getElementById('agendadosCount');
		const realizadosEl = document.getElementById('realizadosCount');
		if (!totalEl || !agendadosEl || !realizadosEl) return;

		const total = eventos.length;
		const agendados = eventos.filter(e => String(e.status).toLowerCase().includes('agend')).length;
		const realizados = eventos.filter(e => {
			const s = String(e.status).toLowerCase();
			return s.includes('realiz') || s.includes('confirm') || s.includes('conclu') || s.includes('feito');
		}).length;

		totalEl.textContent = total;
		agendadosEl.textContent = agendados;
		realizadosEl.textContent = realizados;
	}

	function renderEventos() {
		const container = sections.Eventos;
		if (!container) return;
		while (container.firstChild) container.removeChild(container.firstChild);

		const row = document.createElement('div');
		row.className = 'row';

		eventos.forEach(ev => {
			const col = document.createElement('div');
			col.className = 'col-md-4';

			const card = document.createElement('div');
			card.className = 'card mb-3';

			const body = document.createElement('div');
			body.className = 'card-body';

			const tipoBadge = document.createElement('span');
			tipoBadge.className = 'badge bg-info text-dark me-2';
			tipoBadge.textContent = ev.tipo;

			const statusBadge = document.createElement('span');
			const s = String(ev.status).toLowerCase();
			let statusClass = 'bg-secondary';
			if (s.includes('agend')) statusClass = 'bg-warning text-dark';
			if (s.includes('realiz') || s.includes('confirm') || s.includes('conclu') || s.includes('feito')) statusClass = 'bg-success';
			statusBadge.className = 'badge ' + statusClass + ' ms-1';
			statusBadge.textContent = ev.status;

			const title = document.createElement('h5');
			title.className = 'card-title mt-2';
			title.textContent = ev.titulo;

			const dateP = document.createElement('p');
			dateP.className = 'card-text mb-1';
			dateP.textContent = 'Data: ' + ev.data;

			const localP = document.createElement('p');
			localP.className = 'card-text mb-1';
			localP.textContent = 'Local: ' + ev.local;

			const descP = document.createElement('p');
			descP.className = 'card-text';
			descP.textContent = ev.descricao;

			const btnGroup = document.createElement('div');
			btnGroup.className = 'mt-2';

			const btnReal = document.createElement('button');
			btnReal.className = 'btn btn-sm btn-success me-2';
			btnReal.textContent = 'Marcar como Realizado';
			if (s.includes('realiz') || s.includes('confirm') || s.includes('conclu') || s.includes('feito')) {
				btnReal.disabled = true;
			}

			const btnDel = document.createElement('button');
			btnDel.className = 'btn btn-sm btn-danger';
			btnDel.textContent = 'Excluir';

			btnReal.addEventListener('click', () => {
				ev.status = 'Realizado';
				renderEventos();
				renderDashboard();
			});

			btnDel.addEventListener('click', () => {
				const idx = eventos.findIndex(x => x.id === ev.id);
				if (idx > -1) eventos.splice(idx, 1);
				renderEventos();
				renderDashboard();
			});

			body.appendChild(tipoBadge);
			body.appendChild(statusBadge);
			body.appendChild(title);
			body.appendChild(dateP);
			body.appendChild(localP);
			body.appendChild(descP);
			btnGroup.appendChild(btnReal);
			btnGroup.appendChild(btnDel);
			body.appendChild(btnGroup);

			card.appendChild(body);
			col.appendChild(card);
			row.appendChild(col);
		});

		container.appendChild(row);
	}

	function setupNovoEvento() {
		const container = sections.NovoEvento;
		if (!container) return;
		const form = document.getElementById('novoForm');
		const message = document.getElementById('novoMessage');
		if (!form) return;

		form.addEventListener('submit', (e) => {
			e.preventDefault();
			if (message) message.innerHTML = '';

			const titulo = form.querySelector('#titulo');
			const tipo = form.querySelector('#tipo');
			const dataEl = form.querySelector('#data');
			const local = form.querySelector('#local');
			const descricao = form.querySelector('#descricao');

			const tituloVal = titulo.value.trim();
			const tipoVal = tipo.value;
			const dataVal = dataEl.value;
			const localVal = local.value.trim();
			const descricaoVal = descricao.value.trim();

			const errors = [];
			if (!tituloVal) errors.push('Título é obrigatório.');
			if (!tipoVal) errors.push('Tipo é obrigatório.');
			if (!dataVal) errors.push('Data é obrigatória.');
			if (!localVal) errors.push('Local é obrigatório.');
			if (!descricaoVal) errors.push('Descrição é obrigatória.');

			if (errors.length) {
				if (message) message.innerHTML = `<div class="alert alert-danger"><ul>${errors.map(e=>`<li>${e}</li>`).join('')}</ul></div>`;
				return;
			}

			const newId = eventos.length ? Math.max(...eventos.map(ev => ev.id)) + 1 : 1;
			const novoEvento = {
				id: newId,
				titulo: tituloVal,
				tipo: tipoVal,
				data: dataVal,
				local: localVal,
				descricao: descricaoVal,
				status: 'Agendado'
			};

			eventos.push(novoEvento);
			form.reset();
			if (message) message.innerHTML = '<div class="alert alert-success">Evento cadastrado com sucesso.</div>';
		});
	}

	function showView(view) {
		Object.values(sections).forEach(s => {
			if (!s) return;
			s.style.display = (s.id === view) ? '' : 'none';
		});
		links.forEach(l => l.classList.toggle('active', l.dataset.view === view));
		if (view === 'Dashboard') renderDashboard();
		if (view === 'Eventos') renderEventos();
	}

	links.forEach(link => {
		link.addEventListener('click', (e) => {
			e.preventDefault();
			const view = link.dataset.view;
			if (!view) return;
			showView(view);
			history.replaceState(null, '', '#' + view);
		});
	});

	// initialize Novo Evento form
	setupNovoEvento();

	const initial = (location.hash && location.hash.length > 1) ? location.hash.slice(1) : 'Dashboard';
	showView(initial);
});
