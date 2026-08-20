import { useState, useRef } from 'react'
import { supabase, BUCKET_NAME } from '../supabaseClient'
import { compressImage } from '../utils/compressImage'

export default function UploadForm({ onUploaded, showToast }) {
  const [files, setFiles] = useState([])
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [uploading, setUploading] = useState(false)
  const [statusText, setStatusText] = useState('')
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef(null)

  function pickFiles(fileList) {
    const imgs = Array.from(fileList).filter((f) => f.type.startsWith('image/'))
    setFiles(imgs)
  }

  function handleDrop(e) {
    e.preventDefault()
    setDragActive(false)
    if (e.dataTransfer.files?.length) pickFiles(e.dataTransfer.files)
  }

  async function handleUpload() {
    if (files.length === 0) return
    setUploading(true)
    let done = 0

    for (const file of files) {
      try {
        setStatusText(`Compression et envoi ${done + 1} / ${files.length}…`)
        const blob = await compressImage(file)
        const safeExt = 'jpg'
        const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${safeExt}`

        const { error: uploadError } = await supabase.storage
          .from(BUCKET_NAME)
          .upload(path, blob, { contentType: 'image/jpeg', upsert: false })

        if (uploadError) throw uploadError

        const { error: insertError } = await supabase.from('photos').insert({
          file_path: path,
          name: name.trim() || 'Un invité',
          message: message.trim() || null,
        })

        if (insertError) throw insertError
        done++
      } catch (err) {
        console.error('Upload error', err)
        showToast('Une photo n\'a pas pu être envoyée. Réessaie.', true)
      }
    }

    setStatusText(
      done > 0
        ? `${done} photo${done > 1 ? 's' : ''} ajoutée${done > 1 ? 's' : ''} au mur ✦`
        : ''
    )
    if (done > 0) showToast('Merci ! Photo ajoutée au mur.')
    setFiles([])
    if (fileInputRef.current) fileInputRef.current.value = ''
    setUploading(false)
    onUploaded()
  }

  return (
    <section className="upload-card">
      <h2>Ajouter une photo</h2>
      <p className="hint">
        Les photos sont compressées avant l'envoi et rejoignent le mur ci-dessous,
        visible par tous les invités.
      </p>

      <div className="field">
        <label htmlFor="guestName">Votre prénom (optionnel)</label>
        <input
          id="guestName"
          type="text"
          placeholder="Ex. Camille"
          maxLength={40}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="field">
        <label htmlFor="guestMsg">Un petit mot (optionnel)</label>
        <input
          id="guestMsg"
          type="text"
          placeholder="Ex. Le lancer de bouquet !"
          maxLength={80}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>

      <div
        className={`dropzone${dragActive ? ' drag' : ''}`}
        role="button"
        tabIndex={0}
        onClick={() => fileInputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click()
        }}
        onDragOver={(e) => {
          e.preventDefault()
          setDragActive(true)
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
          <path d="M12 16V4M12 4l-4 4M12 4l4 4" />
          <path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" />
        </svg>
        <div className="dz-title">
          {files.length === 0
            ? 'Touchez pour choisir une ou plusieurs photos'
            : `${files.length} photo${files.length > 1 ? 's' : ''} sélectionnée${files.length > 1 ? 's' : ''}`}
        </div>
        <div className="dz-sub">JPG, PNG — depuis votre pellicule ou l'appareil photo</div>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        style={{ display: 'none' }}
        onChange={(e) => pickFiles(e.target.files)}
      />

      <button
        className="btn btn-primary"
        disabled={files.length === 0 || uploading}
        onClick={handleUpload}
      >
        {uploading ? 'Envoi en cours…' : 'Envoyer sur le mur'}
      </button>
      <div className="upload-status">{statusText}</div>
    </section>
  )
}
