import {
  DISPLAY_BATCH,
  DISPLAY_EDGES,
  DISPLAY_MORE_INFO,
  LOAD_DATA,
  SELECT_EDGE,
  SELECT_NODE,
  SET_NETWORK,
  UNSELECT_ALL
} from './actions';

/*
 * Default reducer.
 */
export default (state, action) => {

  switch (action.type) {
    case SET_NETWORK:
      return {
        ...state,
        visjs: {
          ...state.visjs,
          network: action.network
        }
      };

    case DISPLAY_BATCH:
      return {
        ...state,
        display: {
          ...state.display,
          node: action.batch
        },
        selection: {
          ...state.selection,
          nodeId: undefined
        }
      };

    case DISPLAY_EDGES:
      return {
        ...state,
        display: {
          ...state.display,
          edge: {
            ...state.display.edge,
            [action.edge]: action.checked
          }
        }
      };

    case DISPLAY_MORE_INFO:
      return {
        ...state,
        display: {
          ...state.display,
          moreInfo: action.visible
        }
      };

    case SELECT_NODE:
      return {
        ...state,
        selection: {
          ...state.selection,
          nodeId: action.nodeId
        }
      };

    case SELECT_EDGE:
      return {
        ...state,
        selection: {
          ...state.selection,
          edgeId: action.edgeId
        }
      };

    case UNSELECT_ALL:
      return {
        ...state,
        selection: {
          ...state.selection,
          nodeId: undefined,
          edgeId: undefined
        }
      };

    case LOAD_DATA:
      return {
        ...state,
        data: {
          ...state.data,
          edges: action.edges,
          nodes: action.nodes
        }
      };

    default:
      return { ...state };
  }
};
