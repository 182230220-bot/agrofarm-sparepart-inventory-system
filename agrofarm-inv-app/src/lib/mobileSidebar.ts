export function initMobileSidebar() {
        if (document.getElementById('mobile-sidebar-toggle')) return;
        var app = document.getElementById('app');
        if (!app) return;

        var overlay = document.createElement('div');
        overlay.id = 'mobile-sidebar-overlay';
        overlay.setAttribute('aria-hidden', 'true');

        var button = document.createElement('button');
        button.id = 'mobile-sidebar-toggle';
        button.type = 'button';
        button.setAttribute('aria-label', 'Buka menu');
        button.innerHTML = '<i data-lucide="menu"></i>';

        document.body.appendChild(overlay);
        document.body.appendChild(button);

        function closeSidebar() {
            document.body.classList.remove('sidebar-mobile-open');
            button.setAttribute('aria-label', 'Buka menu');
            button.innerHTML = '<i data-lucide="menu"></i>';
            if (window.lucide && window.lucide.createIcons) window.lucide.createIcons();
        }

        function toggleSidebar() {
            var open = document.body.classList.toggle('sidebar-mobile-open');
            button.setAttribute('aria-label', open ? 'Tutup menu' : 'Buka menu');
            button.innerHTML = '<i data-lucide="' + (open ? 'x' : 'menu') + '"></i>';
            if (window.lucide && window.lucide.createIcons) window.lucide.createIcons();
        }

        button.addEventListener('click', toggleSidebar);
        overlay.addEventListener('click', closeSidebar);

        window.addEventListener('resize', function () {
            if (window.innerWidth > 767) closeSidebar();
        });
}
