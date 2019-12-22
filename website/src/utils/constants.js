import { DataSet } from 'vis-data';
import { NodeBatch } from '../redux/actions';
import { isQuiz } from './functions';

/* Fallback language, when all other methods failed */
export const fallbackLanguage = 'en';

/* Where to find some data */
export const dataPath = {
  translations: 'data/content/translations.json',
  graph: 'data/content/graph.json',
  pdfDocs: 'data/dl/documentation_LANG.pdf'
};

/* Quiz related data */
export const quizData = {
  firstNode: '14' /* first visible node */
};

/* Visjs: edges colors */
export const relationsColorMapping = {
  major: 'green',
  minor: 'orange',
  false: 'red',
  simplified: '#209cee' /* bulma's has-text-info (blue) */
};

/* Visjs: how to display hidden nodes */
export const hiddenNode = {
  visible: false,
  shape: 'dot',
  label: undefined,
  size: 10
};

/* Visjs: how to display visible nodes */
export const visibleNode = {
  visible: true,
  shape: 'image',
  size: 25
};

/* Visjs: animation options */
export const animOptions = {
  duration: 600,
  easingFunction: 'easeInOutQuad'
};

/* Visjs: network options */
const visjsBaseOptions = {
  autoResize: true,
  edges: {
    chosen: false,
    color: {
      highlight: 'darkviolet',
      hover: 'darkviolet'
    },
    hoverWidth: width => 5 * width,
    selectionWidth: width => 5 * width,
    smooth: {
      type: 'cubicBezier',
      roundness: 0.3
    }
  },
  physics: false,
  interaction: {
    hover: true
  }
};

export const visjsOptions = {
  quiz: {
    ...visjsBaseOptions,
    height: `${window.innerHeight}px`,
    edges: {
      ...visjsBaseOptions.edges,
      chosen: false
    }
  },
  noquiz: {
    ...visjsBaseOptions,
    height: '600px',
    edges: {
      ...visjsBaseOptions.edges,
      chosen: true
    }
  }
};


/* Redux: initial state */
export const preloadedState = {
  visjs: {
    /* Network object from visjs-network */
    network: undefined,
    data: {
      nodesSet: new DataSet(),
      edgesSet: new DataSet(),
      nodes: undefined,
      edges: undefined
    }
  },
  data: {
    nodes: [],
    edges: []
  },
  display: {
    quiz: isQuiz(window),
    /* Booleans: display or not elements */
    edge: {
      major: true,
      minor: false,
      false: false,
      simplified: false
    } /* Major, minor links in the graph */,
    moreInfo: false /* Modal with more information */,
    node: NodeBatch.BATCH_12345 /* Cards batch */
  },
  selection: {
    /* Selection from user */
    nodeId: undefined,
    edgeId: undefined
  },
  i18n: {
    locale: undefined,
    translations: {}
  }
};
