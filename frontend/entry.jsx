import $ from 'jquery'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import ReactModal from 'react-modal'
import { SimpleDetails, StandardIndex } from 'handy-components'

import NewEntity from './components/new-entity'

import configureStore from './store/store'
let store = configureStore();

$(document).ready(() => {

  ReactModal.setAppElement(document.body);
  const MyContext = React.createContext();

  $('#admin-sidebar ul a').each(function() {
    if (this.getAttribute('href') == window.location.pathname) {
      this.classList.add('highlight');
    };
  })

  window.Errors = {}

  if (document.querySelector('#albums-index')) {
    ReactDOM.render(
      <Provider context={ MyContext } store={ store }>
        <StandardIndex
          context={ MyContext }
          entityName='album'
          columns={ ['artistName', 'name'] }
          columnHeaders={ ['Artist', 'Album'] }
          modalDimensions={ { width: 900 } }
        >
          <NewEntity
            context={ MyContext }
            initialEntity={ { artistName: '', name: '' } }
          />
        </StandardIndex>
      </Provider>,
      document.querySelector('#albums-index')
    );
  }

  if (document.querySelector('#album-details')) {
    ReactDOM.render(
      <Provider context={ MyContext } store={ store }>
        <SimpleDetails
          context={ MyContext }
          entityName='album'
          initialEntity={ { artistName: '', name: '' } }
          fields={ [[
            { columnWidth: 5, entity: 'album', property: 'artistName' },
            { columnWidth: 5, entity: 'album', property: 'name' },
            { columnWidth: 2, entity: 'album', property: 'order' }
          ]] }
        />
      </Provider>,
      document.querySelector('#album-details')
    );
  }
});
