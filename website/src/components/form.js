import React from 'react';
import { connect } from 'react-redux';
import { I18n, Translate } from 'react-redux-i18n';
import { displayBatch, displayEdges, NodeBatch } from '../redux/actions';

/*
 * Filter the displayed edges
 */
const EdgeFilter = ({ onChangeEdge, edge, name }) => (
  <label className="checkbox">
    <input
      className="checkbox"
      type="checkbox"
      name={name}
      defaultChecked={edge[name]}
      onChange={event => onChangeEdge(event, name)}
    />
    <span style={{ paddingLeft: '1em' }}><Translate value={'selector.filters.' + name}/></span>
  </label>
);

const EdgesFilter = ({ edge, onChangeEdge }) => {
  const edges = ['major',
    'minor',
    'false',
    'simplified'
  ];
  return (
    <div>
      {edges.map(name => (
        <div className="check" key={name}>
          <EdgeFilter
            onChangeEdge={onChangeEdge}
            edge={edge}
            name={name}
          />
        </div>
      ))}
    </div>
  );
};

/*
 * Filter the displayed nodes, according to their batches
 */
const NodeFilter = ({ nodeBatch, onChangeBatch }) => (
  <div className="select is-fullwidth">
    <select
      id="nodesFilter"
      defaultValue={nodeBatch}
      onChange={onChangeBatch}
    >
      <option value={NodeBatch.BATCH_1}>{I18n.t('selector.filters.batch1')}</option>
      <option value={NodeBatch.BATCH_12}>{I18n.t('selector.filters.batch12')}</option>
      <option value={NodeBatch.BATCH_123}>{I18n.t('selector.filters.batch123')}</option>
      <option value={NodeBatch.BATCH_1234}>{I18n.t('selector.filters.batch1234')}</option>
      <option value={NodeBatch.BATCH_12345}>{I18n.t('selector.filters.batch12345')}</option>
    </select>
  </div>
);

/*
 * Choose edges and nodes to display.
 */
const Form = ({ ...props }) => (
  <div>
    <div className="panel">
      <h2 className="title is-6 has-text-centered">
        <Translate value="selector.filters.cards"/>
      </h2>
      <NodeFilter {...props}/>
    </div>
    <div className="panel">
      <h2 className="title is-6 has-text-centered">
        <Translate value="selector.filters.relations"/>
      </h2>
      <EdgesFilter {...props}/>
    </div>
  </div>
);

const mapStateToProps = state => ({
  nodeBatch: state.display.node,
  edge: state.display.edge,
  i18n: state.i18n
});

const mapDispatchToProps = dispatch => ({
  onChangeBatch: event => dispatch(displayBatch(event.target.value)),
  onChangeEdge: (event, edge) => dispatch(displayEdges(edge, event.target.checked))
});

export default connect(mapStateToProps, mapDispatchToProps)(Form);
