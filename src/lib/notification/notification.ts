export function playSound(): void {
  const audio = new Audio('/sounds/notify.mp3')
  audio.volume = 0.5
  audio.play().catch(() => {})
}

export type ToastVariant = 'info' | 'success' | 'error'
export function showToast(
  notification: { title: string; message?: string },
  variant: ToastVariant = 'info',
): void {
  const colours: Record<ToastVariant, string> = {
    info: 'bg-zinc-900 text-white',
    success: 'bg-emerald-600 text-white',
    error: 'bg-red-600 text-white',
  }

  const icons: Record<ToastVariant, string> = {
    info: '🔔',
    success: '✅',
    error: '❌',
  }

  const el = document.createElement('div')
  el.className = `fixed bottom-5 right-5 z-[9999] max-w-xs rounded-xl px-4 py-3 shadow-xl ${colours[variant]} animate-in slide-in-from-bottom-4 duration-200`

  el.innerHTML = `
    <div class="flex items-start gap-2">
      <span class="text-base">${icons[variant]}</span>
      <div>
        <p class="text-sm font-semibold leading-tight">${notification.title}</p>
        ${notification.message ? `<p class="text-xs opacity-80 mt-0.5">${notification.message}</p>` : ''}
      </div>
    </div>
  `

  document.body.appendChild(el)

  setTimeout(() => {
    el.style.opacity = '0'
    el.style.transition = 'opacity 0.3s'
    setTimeout(() => el.remove(), 300)
  }, 3500)
}
