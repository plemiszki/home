import React, { useEffect, useState } from 'react'
import { SimpleDetails } from 'handy-components'

function AlbumDetails({ context, simpleDetailsProps }) {
  const [error, setError] = useState(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const id = window.location.pathname.split('/').pop()
    fetch(`/api/albums/${id}`)
      .then((res) => {
        if (res.ok) {
          setReady(true)
        } else {
          return res.json().then((body) => setError(body.error))
        }
      })
  }, [])

  function deleteAlbum() {
    const id = window.location.pathname.split('/').pop()
    fetch(`/api/albums/${id}`, { method: 'DELETE' }).then(() => {
      window.location.href = '/admin/albums'
    })
  }

  if (error) {
    return (
      <div style={{ padding: '20px' }}>
        <p style={{ color: 'red', marginBottom: '20px' }}>{error}</p>
        <button
          onClick={deleteAlbum}
          style={{
            backgroundColor: 'red',
            color: 'white',
            borderRadius: '100px',
            padding: '15px 40px',
            fontFamily: '"TeachableSans-Medium"',
            border: 'none',
            cursor: 'pointer',
            letterSpacing: '1.08px',
            fontSize: '12px',
          }}
        >
          Delete Album
        </button>
      </div>
    )
  }

  if (!ready) {
    return null
  }

  return <SimpleDetails context={context} {...simpleDetailsProps} />
}

export default AlbumDetails
