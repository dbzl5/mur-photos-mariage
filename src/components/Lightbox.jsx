function formatDate(ts) {
  if (!ts) return ''
  const d = new Date(ts)
  return (
    d.toLocaleDateString('fr-CH', { day: 'numeric', month: 'short' }) +
    ' à ' +
    d.toLocaleTimeString('fr-CH', { hour: '2-digit', minute: '2-digit' })
  )
}

export default function Lightbox({ photo, onClose }) {
  if (!photo) return null

  function download() {
    const a = document.createElement('a')
    a.href = photo.url
    const safeName = (photo.name || 'invite').replace(/[^a-z0-9]/gi, '_').toLowerCase()
    a.download = `mariage_${safeName}_${photo.id}.jpg`
    a.target = '_blank'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  return (
    <div className="lightbox open" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <button className="lightbox-close" aria-label="Fermer" onClick={onClose}>
        ×
      </button>
      <div className="lightbox-panel">
        <img src={photo.url} alt={photo.message || photo.name} />
        <div className="lightbox-meta">
          <div className="who">{photo.name || 'Un invité'}</div>
          {photo.message && <div>{photo.message}</div>}
          <div style={{ marginTop: 2, opacity: 0.7 }}>{formatDate(photo.created_at)}</div>
        </div>
        <div className="lightbox-actions">
          <button className="btn btn-primary lightbox-download-btn" onClick={download}>
            Télécharger
          </button>
        </div>
      </div>
    </div>
  )
}
