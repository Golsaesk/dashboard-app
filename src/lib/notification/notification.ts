export function playSound() {
  const audio = new Audio('/sounds/notify.mp3')
  audio.volume = 0.5
  audio.play().catch(() => {})
}

export function showToast(notification: { title: string }) {
  const el = document.createElement('div')

  el.innerText = `🔔 ${notification.title}`
  el.className =
    'fixed bottom-5 right-5 bg-zinc-900 text-white px-4 py-2 rounded-lg shadow-lg z-[9999]'

  document.body.appendChild(el)

  setTimeout(() => {
    el.remove()
  }, 3000)
}
