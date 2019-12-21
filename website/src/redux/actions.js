export const UPDATE_DATA = 'UPDATE_DATA';
export const LOAD_DATA = 'LOAD_DATA';
export const SET_DATA = 'SET_DATA';
export const SET_NETWORK = 'SET_NETWORK';

export const DISPLAY_BATCH = 'DISPLAY_BATCH';
export const DISPLAY_EDGES = 'DISPLAY_EDGE';
export const DISPLAY_MORE_INFO = 'DISPLAY_MORE_INFO';

export const SELECT_NODE = 'SELECT_NODE';
export const SELECT_EDGE = 'SELECT_EDGE';
export const UNSELECT_ALL = 'UNSELECT_ALL';

export const NodeBatch = {
  BATCH_1: 'BATCH_1',
  BATCH_12: 'BATCH_12',
  BATCH_123: 'BATCH_123',
  BATCH_1234: 'BATCH_1234',
  BATCH_12345: 'BATCH_12345'
};

export const displayBatch = batch => ({
  type: DISPLAY_BATCH,
  batch
});

export const displayEdges = (edge, checked) => ({
  type: DISPLAY_EDGES,
  edge,
  checked
});

export const displayMoreInfo = visible => ({
  type: DISPLAY_MORE_INFO,
  visible
});

export const setNetwork = network => ({
  type: SET_NETWORK,
  network
});

export const loadData = ({ edges, nodes }) => ({
  type: LOAD_DATA,
  edges,
  nodes
});

export const setData = () => ({
  type: SET_DATA
});

export const updateData = () => ({
  type: UPDATE_DATA
});

export const selectNode = nodeId => ({
  type: SELECT_NODE,
  nodeId
});

export const selectEdge = edgeId => ({
  type: SELECT_EDGE,
  edgeId
});

export const unselectAll = () => ({
  type: UNSELECT_ALL
});
