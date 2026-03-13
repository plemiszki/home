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

  if (error) {
    return <p style={{ color: 'red', padding: '20px' }}>{error}</p>
  }

  if (!ready) {
    return null
  }

  return <SimpleDetails context={context} {...simpleDetailsProps} />
}

export default AlbumDetails
