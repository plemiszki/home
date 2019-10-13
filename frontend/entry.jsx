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

  window.Errors = {
    album: [
      "Album can't be blank"
    ]
  }

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
});
