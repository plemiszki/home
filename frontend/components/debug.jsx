import React, { useEffect, useState } from 'react'

function Debug() {
  const [data, setData] = useState(null)

  useEffect(() => {
    function fetchData() {
      fetch('/api/debug')
        .then((res) => res.json())
        .then((body) => setData(body))
    }
    fetchData()
    const interval = setInterval(fetchData, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="handy-component">
      <div className="white-box">
        <p><strong>Track:</strong> {data?.track ?? '—'}</p>
        <p><strong>Album ID:</strong> {data?.albumId ?? '—'}</p>
        <p><strong>Processes:</strong> {data?.processes?.join(', ') || '—'}</p>
        <p><strong>mpv PIDs:</strong> {data?.mpvPids ?? '—'}</p>
      </div>
    </div>
  )
}

export default Debug
