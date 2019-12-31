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
      <Translate value={props.title} />
    </h1>
    <SideList {...props} />
  </div>
);

const DisplayMoreInfo = ({ ...props }) => (
  <div className="has-text-right">
    {props.cardId ? (
      <button className="button" onClick={props.openDisplayMoreInfo}>
        <Translate value="explanations.moreInfo" />
      </button>
    ) : null}
  </div>
);

const CardColumn = ({ ...props }) => (
  <div className="column is-6">
    <h1 className="title is-4 has-text-weight-bold has-text-centered">
      {props.cardId
        ? I18n.t('explanations.card') +
          ' ' +
          props.cardId +
          ' : ' +
          I18n.t(`nodes.${props.cardId}.title`)
        : I18n.t('explanations.elt_placeholder')}
    </h1>
    <div
      className="has-text-justified"
      id="explanation-content"
      dangerouslySetInnerHTML={{
        __html: props.cardId ? I18n.t(`nodes.${props.cardId}.info`) : null
      }}
    />
    <DisplayMoreInfo {...props} />
  </div>
);

const RelationColumn = ({ ...props }) => (
  <div className="column is-6">
    <h1 className="title is-4 has-text-weight-bold has-text-centered">
      {I18n.t('explanations.relation') +
        ' ' +
        props.relationFrom +
        ' → ' +
        props.relationTo}
    </h1>
    <div
      className="has-text-justified"
      id="explanation-content"
      dangerouslySetInnerHTML={{
        __html: props.relationId
          ? I18n.t(`edges.${props.relationId}.info`)
          : null
      }}
    />
  </div>
);

const ExplanationSection = ({ ...props }) => (
  <div className="column">
    <div className="box has-background-white-ter">
      <div className="columns">
        {props.cardId || props.relationId ? (
          <SideColumn
            title="explanations.origins"
            cardsList={props.origins}
            selectNode={props.selectNode}
          />
        ) : null}
        {props.cardId ? <CardColumn {...props} /> : null}
        {props.relationId ? <RelationColumn {...props} /> : null}
        {props.cardId || props.relationId ? (
          <SideColumn
            title="explanations.effects"
            cardsList={props.effects}
            selectNode={props.selectNode}
          />
        ) : null}
      </div>
    </div>
  </div>
);

const fillCardInfo = (state, cardId) => {
  /* Only one relation: force black text for increased readability */
  let nbOfDisplayedRels = 0;
  for (const rel in state.display.edge) {
    if (state.display.edge[rel]) {
      nbOfDisplayedRels++;
    }
  }

  const cardInfo = {
    cardId: cardId,
    origins: [],
    effects: []
  };

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
  return cardInfo;
};

const fillRelationInfo = (state, relationId) => {
  const [origin, effect] = relationId.split('_');

  return {
    relationId: relationId,
    relationFrom: origin,
    relationTo: effect,
    origins: [{ nodeId: origin }],
    effects: [{ nodeId: effect }]
  };
};

const mapStateToProps = state => {
  /* Default info. */
  let out = {
    cardId: state.selection.nodeId,
    relationId: state.selection.edgeId,
    origins: [],
    effects: []
  };

  if (out.relationId) {
    out = {
      ...out,
      ...fillRelationInfo(state, out.relationId)
    };
  }

  if (out.cardId) {
    out = {
      ...out,
      ...fillCardInfo(state, out.cardId)
    };
  }

  return out;
};

const mapDispatchToProps = dispatch => ({
  openDisplayMoreInfo: () => dispatch(displayMoreInfo(true)),
  selectNode: nodeId => dispatch(selectNode(nodeId))
});

export default connect(mapStateToProps, mapDispatchToProps)(ExplanationSection);
