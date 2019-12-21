import { I18n } from 'react-redux-i18n';
import {
  DISPLAY_BATCH,
  DISPLAY_EDGES,
  SELECT_EDGE,
  SELECT_NODE,
  SET_DATA,
  UNSELECT_ALL,
  UPDATE_DATA
} from './actions';
import { animOptions, hiddenNode, relationsColorMapping, visibleNode } from '../utils/constants';

/**
 * Quizz only: toggle visibiliy of selected node
 * @param nodeId: id of node
 * @param nodesSet: visjs.Dataset
 */
function toggleNodeVisibility(nodeId, nodesSet) {
  const node = nodesSet.get(nodeId);
  node.visible = !node.visible;

  if (node.visible) {
    Object.assign(node, visibleNode);
    node.label = I18n.t(`nodes.${node.id}.wrappedTitle`).replace(/\\n/g, '\n');
  } else {
    Object.assign(node, hiddenNode);
  }
  nodesSet.update(node);
}

/**
 * Update i18n elements of nodes
 * @param nodesSet: visjs.Dataset
 * @param currentLocale: string ('en', 'fr', ...)
 * @param isQuizzSession: boolean
 */
function updateI18nOfNodes(nodesSet, currentLocale, isQuizzSession) {
  if (!(nodesSet && currentLocale)) {
    return;
  }
  const newNodes = Object.values(nodesSet.get());
  newNodes.forEach(
    node => {
      node.label = isQuizzSession ? undefined : I18n.t(`nodes.${node.id}.wrappedTitle`).replace(/\\n/g, '\n');
      node.image = `data/images/${currentLocale}/node_recto_${node.id}.jpg`;
    });
  nodesSet.update(newNodes);
}

/**
 * Fill visjs.data from the fetched json data.
 */
function createDataViews(store, isQuizz) {
  const visjsData = store.getState().visjs.data;
  const newNodes = Object.values(store.getState().data.nodes);
  const newEdges = Object.values(store.getState().data.edges);

  newNodes.forEach(
    node => {
      node.visible = isQuizz;
      node.label = undefined;
      node.labelHighlightBold = true;
      node.font = {
        background: 'white',
        multi: true
      };
    }
  );

  newEdges.forEach(
    edge => {
      edge.arrows = 'to';
      edge.color = {
        color:
          relationsColorMapping[edge.relation]
      };
    }
  );
  visjsData.nodesSet.clear();
  visjsData.edgesSet.clear();
  visjsData.nodesSet.add(newNodes);
  visjsData.edgesSet.add(newEdges);
}

/*
 * Apply side-effects to interact with VisJS's network.
 */
const setNetworkMiddleware = store => dispatch => action => {
  dispatch(action);

  const network = store.getState().visjs.network;
  if (!network) {
    return;
  }

  const currentLocale = store.getState().i18n.locale;
  const isQuizz = store.getState().display.quizz;
  switch (action.type) {
    case SET_DATA:
      createDataViews(store, isQuizz);
      updateI18nOfNodes(store.getState().visjs.data.nodesSet, currentLocale, isQuizz);
      store.getState().visjs.data.nodesSet.forEach(
        node => toggleNodeVisibility(node.id, store.getState().visjs.data.nodesSet)
      );
      store.getState().visjs.network.setData({
        nodes: store.getState().visjs.data.nodes,
        edges: store.getState().visjs.data.edges
      });
      break;

    case UPDATE_DATA:
      updateI18nOfNodes(store.getState().visjs.data.nodesSet, currentLocale, isQuizz);
      break;

    case DISPLAY_BATCH:
      store.getState().visjs.data.nodes.refresh();
      network.fit({
        animation: animOptions
      });
      break;

    case DISPLAY_EDGES:
      store.getState().visjs.data.edges.refresh();
      break;

    case SELECT_NODE:
      if (isQuizz) {
        toggleNodeVisibility(action.nodeId, store.getState().visjs.data.nodesSet);
      }
      network.selectNodes([action.nodeId]);
      network.focus(action.nodeId, {
        scale: store.getState().display.quizz ? 1.2 : 2,
        animation: animOptions
      });
      break;

    case SELECT_EDGE:
      network.fit({
        nodes: network.getConnectedNodes(action.edgeId),
        animation: animOptions
      });
      break;

    case UNSELECT_ALL:
      network.fit({
        animation: animOptions
      });
      break;

    default:
      break;
  }
};

/*
const logger = store => dispatch => action => {
  console.log('dispatch', action);
  const result = dispatch(action);
  console.log('state', store.getState());
  return result;
};
*/

const middlewaresChain = [setNetworkMiddleware];
export default middlewaresChain;
