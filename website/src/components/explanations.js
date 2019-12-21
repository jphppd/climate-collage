import React from 'react';
import { connect } from 'react-redux';
import { displayMoreInfo, selectNode } from '../redux/actions';
import { I18n, Translate } from 'react-redux-i18n';

/**
 * Side column, displaying origins and effects of a given card as a list.
 */
const SideList = ({ ...props }) => (
  <div>
    {props.cardsList.map(item => (
      <div key={item.nodeId}>
        <button
          className={'button is-fullwidth ' + item.nodeColor}
          onClick={() => props.selectNode(item.nodeId)}
        >
          {item.nodeId + ' ' + I18n.t(`nodes.${item.nodeId}.title`)}
        </button>
      </div>
    ))}
  </div>
);

const SideColumn = ({ ...props }) => (
  <div className="column">
    <h1 className="title is-4 has-text-weight-bold has-text-centered">
      <Translate value={props.title}/>
    </h1>
    <SideList {...props}/>
  </div>
);

const DisplayMoreInfo = ({ ...props }) => (
  <div className="has-text-right">
    {props.id ? <button className="button" onClick={props.openDisplayMoreInfo}>
      <Translate value="explanations.moreInfo"/>
    </button> : null}
  </div>
);

const CardColumn = ({ ...props }) => (
  <div className="column is-6">
    <h1 className="title is-4 has-text-weight-bold has-text-centered">
      {I18n.t('explanations.card')}
      {props.id ? ' ' + props.id + ' : ' + I18n.t(`nodes.${props.id}.title`) : null}
    </h1>
    <div
      className="has-text-justified"
      id="explanation-content"
      dangerouslySetInnerHTML={{ __html: props.id ? I18n.t(`nodes.${props.id}.info`) : null }}
    />
    <DisplayMoreInfo {...props}/>
  </div>
);

/*
 * Right column: information about the selected card.
 */
const ExplanationSection = ({
                              ...props
                            }) => (
  <div className="column">
    <div className="box has-background-white-ter">
      <div className="columns">
        <SideColumn title="explanations.origins" cardsList={props.origins}
                    selectNode={props.selectNode}/>
        <CardColumn {...props}/>
        <SideColumn title="explanations.effects" cardsList={props.effects}
                    selectNode={props.selectNode}/>
      </div>
    </div>
  </div>
);

const mapStateToProps = state => {
  const cardId = state.selection.nodeId;

  /* Only one relation: force black text for increased readability */
  let nbOfDisplayedRels = 0;
  for (const rel in state.display.edge) {
    if (state.display.edge[rel]) {
      nbOfDisplayedRels++;
    }
  }

  /* Default info. */
  var cardInfo = {
    id: cardId,
    origins: [],
    effects: []
  };

  if (cardId) {
    /* If available, fill information of cardInfo. */
    const card = state.data.nodes[cardId];

    for (const way of ['origins', 'effects']) {
      for (const rel of [
        {
          name: 'major',
          color: 'has-text-success'
        },
        {
          name: 'minor',
          color: 'has-text-warning'
        },
        {
          name: 'false',
          color: 'has-text-danger'
        },
        {
          name: 'simplified',
          color: 'has-text-info'
        }
      ]) {
        if (state.display.edge[rel.name]) {
          const color = nbOfDisplayedRels === 1 ? 'has-text-black' : rel.color;
          const cardRelations = card.relations[way][rel.name];

          cardInfo[way] = [
            ...cardInfo[way],
            ...Array.from(cardRelations, nodeId => ({
              nodeId: nodeId,
              nodeColor: color
            }))
          ];
        }
      }
    }
  }

  return cardInfo;
};

const mapDispatchToProps = dispatch => ({
  openDisplayMoreInfo: () => dispatch(displayMoreInfo(true)),
  selectNode: nodeId => dispatch(selectNode(nodeId))
});

export default connect(mapStateToProps, mapDispatchToProps)(ExplanationSection);
