import React, { useEffect, useState } from 'react'

function Album({ album }) {
  return (
    <div className="album">
      <p className="album-name">{album.name}</p>
      <ul>
        {album.files.map((file) => (
          <li key={file}>{file}</li>
        ))}
      </ul>
      <style jsx>{`
        .album {
          margin-bottom: 20px;
        }
        .album-name {
          font-family: 'TeachableSans-SemiBold';
          font-size: 14px;
          color: #2C2F33;
          margin-bottom: 5px;
        }
        li {
          font-size: 12px;
          color: #6c757d;
          margin-left: 20px;
          list-style: disc;
        }
      `}</style>
    </div>
  )
}

function Artist({ artist }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="artist">
      <p className="artist-name" onClick={() => setExpanded(!expanded)}>
        <span className="arrow">{expanded ? '▼' : '▶'}</span>
        {artist.name}
      </p>
      {expanded && artist.albums.map((album) => (
        <Album key={album.name} album={album} />
      ))}
      <style jsx>{`
        .artist {
          margin-bottom: 30px;
        }
        .artist-name {
          font-family: 'TeachableSans-Bold';
          font-size: 16px;
          color: #2C2F33;
          margin-bottom: 10px;
          border-bottom: solid 1px #e0e0e0;
          padding-bottom: 5px;
          cursor: pointer;
          user-select: none;
        }
        .arrow {
          margin-right: 8px;
          font-size: 12px;
        }
      `}</style>
    </div>
  )
}

function Files() {
  const [artists, setArtists] = useState([])

  useEffect(() => {
    fetch('/api/files')
      .then((res) => res.json())
      .then((body) => setArtists(body.artists))
  }, [])

  return (
    <div className="handy-component">
      <h1>Files</h1>
      <div className="white-box">
        {artists.map((artist) => (
          <Artist key={artist.name} artist={artist} />
        ))}
      </div>
    </div>
  )
}

export default Files
