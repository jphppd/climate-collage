import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import {
  i18nReducer,
  loadTranslations,
  setLocale,
  syncTranslationWithStore
} from 'react-redux-i18n';
import reduceReducers from 'reduce-reducers';
import thunk from 'redux-thunk';
import { DataView } from 'vis-network';
import rootReducer from './redux/reducers';
import middlewaresChain from './redux/middleware';
import { loadData, selectNode, setData, updateData } from './redux/actions';
import { Explanations, Fresque, Modal, Selectors } from './components';
import { getDefaultLanguage } from './utils/functions';
import { dataPath, fallbackLanguage, preloadedState, quizData } from './utils/constants';

/*
https://visjs.github.io/vis-network/docs/network/
https://visjs.github.io/vis-data/data/dataset.html
https://visjs.github.io/vis-data/data/dataview.html
*/

const buildApp = (store) => {
  let app;
  if (store.getState().display.quiz) {
    app = (
      <Provider store={store}>
        <Fresque/>
      </Provider>
    );
  } else {
    app = (
      <Provider store={store}>
        <section className="container is-fluid">
          <div className="columns">
            <div className="column">
              <Fresque/>
              <Explanations/>
            </div>
            <div className="column is-2">
              <Selectors/>
            </div>
          </div>
        </section>
        <Modal/>
      </Provider>
    );
  }
  return app;
};

(function(window) {

  preloadedState.visjs.data = {
    ...preloadedState.visjs.data,
    nodes: new DataView(preloadedState.visjs.data.nodesSet,
      { filter: node => node.batch <= parseInt(store.getState().display.node.slice(-1)) }
    ),
    edges: new DataView(preloadedState.visjs.data.edgesSet,
      { filter: edge => store.getState().display.edge[edge.relation] })
  };

  const store = createStore(
    reduceReducers((state, action) => ({
      ...state,
      i18n: i18nReducer(state.i18n, action)
    }), rootReducer),
    preloadedState,
    applyMiddleware(...middlewaresChain, thunk)
  );

  syncTranslationWithStore(store);

  fetch(dataPath.translations)
    .then(response => response.json())
    .then(translations => {
      store.dispatch(loadTranslations(translations));
      const defaultLanguage = getDefaultLanguage(window, Object.keys(translations)) || fallbackLanguage;
      store.dispatch(setLocale(defaultLanguage));
    })
    .then(() => fetch(dataPath.graph))
    .then(response => response.json())
    .then(graph => {
      store.dispatch(loadData({ ...graph }));
      store.dispatch(setData());
      store.dispatch(updateData());
    })
    .then(() => {
      if (store.getState().display.quiz) {
        store.dispatch(selectNode(quizData.firstNode));
      }
    });

  window.onresize = (event) => {
    if (store.getState().display.quiz) {
      store.getState().visjs.network.setSize(window.innerWidth, window.innerHeight);
    }
  };

  render(
    buildApp(store),
    document.getElementById('root')
  );
}(window));
