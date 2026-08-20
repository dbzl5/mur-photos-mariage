const ROTATIONS = [-3, 2, -1.5, 3, -2.5, 1.5, -1, 2.5]

export default function Gallery({ photos, loading, onSelect }) {
  if (loading) {
    return <div className="empty-state">Chargement du mur…</div>
  }

  if (photos.length === 0) {
    return (
      <div className="empty-state">
        <div className="big">Le mur est encore vide</div>
        Soyez le premier·ère à y accrocher un souvenir.
      </div>
    )
  }

  return (
    <div className="wall">
      {photos.map((p, i) => (
        <div
          key={p.id}
          className="polaroid"
          style={{ transform: `rotate(${ROTATIONS[i % ROTATIONS.length]}deg)` }}
          role="button"
          tabIndex={0}
          onClick={() => onSelect(p)}
          onKeyDown={(e) => e.key === 'Enter' && onSelect(p)}
        >
          <img src={p.url} alt={p.message || `Photo partagée par ${p.name}`} loading="lazy" />
          <div className="caption">
            <div className="who">{p.name || 'Un invité'}</div>
            {p.message && <div className="msg">{p.message}</div>}
          </div>
        </div>
      ))}
    </div>
  )
}
