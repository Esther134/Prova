document.addEventListener('DOMContentLoaded', () => {
	const links = document.querySelectorAll('a.nav-link[data-view]');
	const sections = {
		Dashboard: document.getElementById('Dashboard'),
		NovoEvento: document.getElementById('NovoEvento'),
		Eventos: document.getElementById('Eventos')
	};

	function showView(view) {
		Object.values(sections).forEach(s => {
			if (!s) return;
			s.style.display = (s.id === view) ? '' : 'none';
		});
		links.forEach(l => l.classList.toggle('active', l.dataset.view === view));
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

	const initial = (location.hash && location.hash.length > 1) ? location.hash.slice(1) : 'Dashboard';
	showView(initial);
});

const array