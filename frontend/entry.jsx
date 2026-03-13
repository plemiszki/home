import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import MainMenu from './components/main-menu'
import Tabs from './components/tabs'
import AlbumList from './components/album-list'
import NowPlaying from './components/now-playing'
import Subway from './components/subway'
import WakeButton from './components/wake-button'

import ReactModal from 'react-modal'
import { SimpleDetails, FullIndex } from 'handy-components'
import NewEntity from './components/new-entity'

window.addEventListener('DOMContentLoaded', () => {

  ReactModal.setAppElement(document.body);
  const MyContext = React.createContext();

  // PUBLIC:

  if (document.querySelector('#app')) {
    createRoot(document.querySelector('#wake-button')).render(
      <WakeButton />
    );
    createRoot(document.querySelector('#app')).render(
      <Router>
        <Routes>
          <Route path="/" element={ <MainMenu /> } />
          <Route path="/music" element={
            <Tabs
              tabs={ [
                { image: 'music-note', Component: NowPlaying },
                { image: 'guitar', Component: AlbumList, props: { key: 'modern', category: 'modern' } },
                { image: 'violin', Component: AlbumList, props: { key: 'classical', category: 'classical' } },
                { image: 'saxophone', Component: AlbumList, props: { key: 'jazz', category: 'jazz' } },
                { image: 'theatre', Component: AlbumList, props: { key: 'soundtrack', category: 'soundtrack' } },
                { image: 'ornament', Component: AlbumList, props: { key: 'christmas', category: 'christmas' } }
              ] }
            />
          } />
          <Route path="/subway" element={
            <Tabs
              hidden={ true }
              tabs={ [
                { image: 'music-note', Component: Subway }
              ] }
            />
          } />
        </Routes>
      </Router>
    );
  }

  if (document.querySelector('#album-list-modern')) {
    createRoot(document.querySelector('#album-list-modern')).render(
      <AlbumList category='modern' />
    );
  }

  if (document.querySelector('#album-list-classical')) {
    createRoot(document.querySelector('#album-list-classical')).render(
      <AlbumList category='classical' />
    );
  }

  if (document.querySelector('#album-list-jazz')) {
    createRoot(document.querySelector('#album-list-jazz')).render(
      <AlbumList category='jazz' />
    );
  }

  if (document.querySelector('#album-list-soundtrack')) {
    createRoot(document.querySelector('#album-list-soundtrack')).render(
      <AlbumList category='soundtrack' />
    );
  }

  if (document.querySelector('#album-list-christmas')) {
    createRoot(document.querySelector('#album-list-christmas')).render(
      <AlbumList category='christmas' />
    );
  }

  // ADMIN AREA:

  document.querySelectorAll('#admin-sidebar ul a').forEach((element) => {
    if (element.getAttribute('href') == window.location.pathname) {
      element.classList.add('highlight');
    };
  })

  window.Errors = {}

  if (document.querySelector('#albums-index')) {
    createRoot(document.querySelector('#albums-index')).render(
      <FullIndex
        context={ MyContext }
        entityName='album'
        columns={ ['artistName', 'name', 'category'] }
        columnHeaders={ ['Artist', 'Album', 'Category'] }
        modalDimensions={ { width: 900 } }
        includeNewButton={ true }
      >
        <NewEntity
          context={ MyContext }
          initialEntity={ { artistName: '', name: '' } }
        />
      </FullIndex>
    );
  }

  if (document.querySelector('#album-details')) {
    createRoot(document.querySelector('#album-details')).render(
      <SimpleDetails
        context={ MyContext }
        entityName='album'
        initialEntity={ { artistName: '', name: '', category: '1' } }
        customDeletePath='/admin/albums'
        fields={ [[
          { columnWidth: 5, entity: 'album', property: 'artistName' },
          { columnWidth: 5, entity: 'album', property: 'name' },
          { columnWidth: 2,
            entity: 'album',
            property: 'category',
            type: 'dropdown',
            options: [
              { id: '1', text: 'Modern' },
              { id: '2', text: 'Classical' },
              { id: '3', text: 'Christmas' },
              { id: '4', text: 'Jazz' },
              { id: '5', text: 'Soundtracks' },
            ],
            optionDisplayProperty: 'text',
            maxOptions: 5
          }
        ]] }
      />
    );
  }

});
