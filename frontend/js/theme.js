// Shared look, loaded right after the Tailwind CDN script on every page.
tailwind.config = {
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: "#0066FF", dark: "#0044CC", light: "#E6F0FF" },
      },
      fontFamily: {
        sans: ["Outfit", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
      backgroundImage: {
        "primary-gradient": "linear-gradient(135deg, #0066FF 0%, #00A3FF 100%)",
        "auth-photo": "linear-gradient(rgba(15, 23, 42, 0.45), rgba(15, 23, 42, 0.45)), url('assets/images/vet-clinic.jpg')",
        "banner-vet": "linear-gradient(90deg, rgba(0, 68, 204, 0.9), rgba(0, 102, 255, 0.35)), url('assets/images/vet-checkup.jpg')",
        "banner-owner": "linear-gradient(90deg, rgba(0, 68, 204, 0.9), rgba(0, 102, 255, 0.35)), url('assets/images/medical-bg.jpg')",
      },
      boxShadow: {
        card: "0 20px 25px -5px rgba(0, 102, 255, 0.1), 0 10px 10px -5px rgba(0, 102, 255, 0.05)",
        nav: "0 10px 15px -3px rgba(0, 102, 255, 0.05), 0 4px 6px -2px rgba(0, 102, 255, 0.02)",
        btn: "0 4px 15px rgba(0, 102, 255, 0.25)",
      },
    },
  },
};

const favicon = document.createElement("link");
favicon.rel = "icon";
favicon.href = "assets/logo-mark.png";
document.head.append(favicon);

const font = document.createElement("link");
font.rel = "stylesheet";
font.href = "https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap";
document.head.append(font);

const style = document.createElement("style");
style.type = "text/tailwindcss";
style.textContent = `
  @layer components {
    .brand { @apply inline-flex items-center gap-2 text-xl font-bold text-slate-900; }

    .public-nav { @apply sticky top-0 z-30 border-b border-primary/10 bg-white/95 shadow-nav backdrop-blur; }
    .public-nav-inner { @apply mx-auto flex h-[70px] w-full max-w-[1100px] items-center justify-between gap-3 px-5; }
    .public-link { @apply text-sm font-medium text-slate-900 hover:text-primary sm:text-base; }
    .public-link-active { @apply text-primary; }

    .sidebar { @apply fixed inset-y-0 left-0 z-40 hidden w-[280px] flex-col border-r border-slate-200 bg-white lg:flex; }
    .sidebar-open { @apply flex; }
    .sidebar-header { @apply flex h-[70px] shrink-0 items-center border-b border-slate-200 px-6; }
    .sidebar-links { @apply flex flex-1 flex-col overflow-y-auto py-5; }
    .nav-link { @apply flex w-full items-center gap-3 border-l-4 border-transparent px-6 py-3 text-left font-medium text-slate-600 transition-colors hover:bg-primary-light hover:text-primary; }
    .nav-link-active { @apply border-primary bg-primary-light text-primary; }
    .nav-link-danger { @apply hover:border-red-500 hover:bg-red-100 hover:text-red-500; }
    .sidebar-backdrop { @apply fixed inset-0 z-30 bg-slate-900/40 lg:hidden; }
    .topbar { @apply flex h-[70px] items-center justify-between gap-3 border-b border-slate-200 bg-white px-5 lg:ml-[280px] lg:justify-end lg:px-8; }
    .menu-button { @apply -ml-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-slate-900 hover:bg-primary-light lg:hidden; }
    .user-info { @apply flex min-w-0 items-center gap-3; }
    .avatar { @apply flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white; }

    .page { @apply flex w-full max-w-[1380px] flex-col gap-5 px-5 py-8 lg:pl-[312px] lg:pr-8; }
    .page-narrow { @apply mx-auto flex w-full max-w-[460px] flex-col gap-4 px-5 py-10 sm:py-14; }
    .page-title { @apply text-3xl font-bold tracking-tight text-slate-900; }
    .page-subtitle { @apply mt-1 text-slate-600; }
    .auth-bg { @apply bg-auth-photo bg-cover bg-fixed bg-center; }
    .page-banner { @apply flex min-h-[140px] flex-wrap items-end justify-between gap-2 rounded-2xl bg-cover p-6 shadow-card; }
    .page-banner .page-title { @apply text-white; }
    .banner-vet { @apply bg-banner-vet bg-[center_10%]; }
    .banner-owner { @apply bg-banner-owner bg-center; }
    .text-link { @apply font-semibold text-primary underline; }

    .card { @apply rounded-2xl border border-primary/10 bg-white p-6 shadow-card; }
    .form { @apply flex flex-col gap-4; }
    .form-grid { @apply grid gap-4 sm:grid-cols-2; }
    .label { @apply mb-2 block text-sm font-semibold text-slate-700; }
    .input { @apply block min-h-[46px] w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-base text-slate-900 placeholder:text-slate-400 transition-shadow focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15 disabled:bg-slate-100 disabled:text-slate-500 aria-[invalid=true]:border-red-500; }
    .hint { @apply mt-1 text-sm text-slate-500; }
    .field-error { @apply mt-1 text-sm text-red-600; }

    .btn { @apply inline-flex min-h-[44px] items-center justify-center gap-2 rounded-2xl bg-primary-gradient px-5 py-2.5 text-center font-semibold text-white shadow-btn transition-transform hover:-translate-y-px active:scale-[.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:translate-y-0 disabled:opacity-60; }
    .btn-full { @apply w-full; }
    .btn-secondary { @apply inline-flex min-h-[44px] items-center justify-center gap-2 rounded-2xl border-2 border-primary bg-white px-5 py-2 text-center font-semibold text-primary shadow-nav transition-transform hover:-translate-y-px active:scale-[.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary; }

    .notice { @apply rounded-lg bg-primary-light px-3 py-2 text-sm text-slate-700; }
    .notice-error { @apply rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700; }
    .notice-success { @apply rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700; }
    .choice-group { @apply grid grid-cols-2 gap-1 rounded-[10px] bg-slate-200 p-1; }
    .choice { @apply flex cursor-pointer items-center justify-center rounded-lg px-3 py-2 text-center text-sm font-semibold text-slate-500 transition-colors has-[:checked]:bg-white has-[:checked]:font-bold has-[:checked]:text-primary has-[:checked]:shadow has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary; }
    .badge { @apply inline-block rounded-full px-3 py-1 text-xs font-semibold; }

    .pet-grid { @apply grid gap-5 sm:grid-cols-2 xl:grid-cols-3; }
    .pet-card { @apply relative flex min-w-0 flex-col items-center gap-1 text-center; }
    .pet-id { @apply absolute right-4 top-4 rounded-full bg-slate-200 px-3 py-0.5 text-xs font-bold text-slate-600; }
    .pet-avatar { @apply mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-primary-light text-slate-900; }
    .pet-details { @apply mt-2 mb-4 flex w-full flex-col gap-1 rounded-lg bg-slate-50 p-3 text-sm text-slate-700; }
  }
`;
document.head.append(style);
