// Redimensionne et compresse une image côté navigateur avant l'envoi,
// pour que les uploads restent rapides et légers sur le plan gratuit Supabase.
export function compressImage(file, { maxDim = 1920, quality = 0.82 } = {}) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('Lecture du fichier impossible'))
    reader.onload = () => {
      const img = new Image()
      img.onerror = () => reject(new Error('Image illisible'))
      img.onload = () => {
        let w = img.width
        let h = img.height
        if (w > maxDim || h > maxDim) {
          if (w >= h) {
            h = Math.round(h * (maxDim / w))
            w = maxDim
          } else {
            w = Math.round(w * (maxDim / h))
            h = maxDim
          }
        }
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, w, h)

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Compression impossible'))
              return
            }
            resolve(blob)
          },
          'image/jpeg',
          quality
        )
      }
      img.src = reader.result
    }
    reader.readAsDataURL(file)
  })
}
