document.querySelector('#searchForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const searchTerm = document.querySelector('.search-bar').value;
    if (searchTerm.trim() !== '') this.submit();
});

document.querySelector('#lucky').addEventListener('click', function () {
    const searchTerm = document.querySelector('.search-bar').value;
    if (searchTerm.trim() !== '') {
        window.location.href = `https://www.google.com/search?q=${encodeURIComponent(searchTerm)}&btnI=I%27m+Feeling+Lucky`;
    }
});

document.querySelector('#themeButton').addEventListener('click', function () {
    const body = document.body;
    body.classList.toggle('dark-mode');
    if (body.classList.contains('dark-mode')) {
        this.textContent = '☀️ Modo Claro';
        localStorage.setItem('theme', 'dark');
    } else {
        this.textContent = '🌙 Modo Oscuro';
        localStorage.setItem('theme', 'light');
    }
});


