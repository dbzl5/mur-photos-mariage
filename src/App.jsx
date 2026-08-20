import { useCallback, useEffect, useRef, useState } from 'react'
import { supabase, BUCKET_NAME } from './supabaseClient'
import { CONFIG } from './config'
import UploadForm from './components/UploadForm'
import Gallery from './components/Gallery'
import Lightbox from './components/Lightbox'
import './App.css'

export default function App() {
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [toast, setToast] = useState({ text: '', show: false, err: false })
  const toastTimer = useRef(null)

  const showToast = useCallback((text, err = false) => {
    setToast({ text, show: true, err })
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast((t) => ({ ...t, show: false })), 3200)
  }, [])

  const loadPhotos = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('photos')
      .select('id, file_path, name, message, created_at')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Load error', error)
      showToast("Impossible de charger le mur pour l'instant.", true)
      setLoading(false)
      return
    }

    const withUrls = (data || []).map((row) => ({
      ...row,
      url: supabase.storage.from(BUCKET_NAME).getPublicUrl(row.file_path).data.publicUrl,
    }))
    setPhotos(withUrls)
    setLoading(false)
  }, [showToast])

  useEffect(() => {
    loadPhotos()
  }, [loadPhotos])

  async function handleDownloadAll() {
    if (photos.length === 0) {
      showToast('Pas encore de photo à télécharger.', true)
      return
    }
    const JSZip = (await import('jszip')).default
    const zip = new JSZip()

    showToast('Préparation du zip…')
    try {
      await Promise.all(
        photos.map(async (p, i) => {
          const res = await fetch(p.url)
          const blob = await res.blob()
          const safeName = (p.name || 'invite').replace(/[^a-z0-9]/gi, '_').toLowerCase()
          zip.file(`${safeName}_${i}.jpg`, blob)
        })
      )
      const content = await zip.generateAsync({ type: 'blob' })
      const url = URL.createObjectURL(content)
      const a = document.createElement('a')
      a.href = url
      a.download = `${CONFIG.partner1}-${CONFIG.partner2}-photos-mariage.zip`.replace(/\s+/g, '_')
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error(err)
      showToast('Le téléchargement groupé a échoué.', true)
    }
  }

  return (
    <>
      <header>
        <div className="eyebrow">Mur de photos des invités</div>
        <h1>
          {CONFIG.partner1}
          <span className="amp">&amp;</span>
          {CONFIG.partner2}
        </h1>
        <div className="date-line">{CONFIG.dateLabel}</div>
        <p className="subtitle">
          Vous avez capturé un joli moment aujourd'hui ? Déposez-le ici pour qu'on garde tous ces
          souvenirs. Aucun compte nécessaire.
        </p>
      </header>

      <main>
        <UploadForm onUploaded={loadPhotos} showToast={showToast} />

        <div className="gallery-header">
          <div>
            <h2>Le mur</h2>
            <div className="count">
              {loading
                ? 'Chargement…'
                : photos.length === 0
                ? "Aucune photo pour l'instant"
                : `${photos.length} photo${photos.length > 1 ? 's' : ''} partagée${photos.length > 1 ? 's' : ''}`}
            </div>
          </div>
          <div className="gallery-actions">
            <button className="btn btn-ghost" onClick={loadPhotos}>
              ↻ Actualiser
            </button>
            <button className="btn btn-ghost" onClick={handleDownloadAll}>
              ⇩ Tout télécharger
            </button>
          </div>
        </div>

        <Gallery photos={photos} loading={loading} onSelect={setSelected} />
      </main>

      <footer>
        Fait avec tendresse pour ce mariage · Vos photos restent stockées tant que le lien reste actif.
      </footer>

      <Lightbox photo={selected} onClose={() => setSelected(null)} />

      <div
        className={`toast${toast.show ? ' show' : ''}`}
        style={{ background: toast.err ? '#6B2737' : '#2B231D' }}
      >
        {toast.text}
      </div>
    </>
  )
}
