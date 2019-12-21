import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Network } from 'vis-network';

import { visjsOptions } from '../utils/constants';
import { selectEdge, selectNode, setData, setNetwork, unselectAll } from '../redux/actions';

const netIdentifier = require('uuid/v4')();

class Fresque extends Component {
  /*
   * Get a pointer cursor when hovering on a element.
   */
  onHover(network) {
    network.canvas.body.container.style.cursor = 'pointer';
  }

  /*
   * Get a default cursor when blurring an element.
   */
  onBlur(network) {
    network.canvas.body.container.style.cursor = 'default';
  }

  /*
   * Trigger actions when clicking on an element.
   */
  onClick(network, clickProperties) {
    if (clickProperties.nodes.length) {
      this.props.selectNode(clickProperties.nodes[0]);
    } else if (clickProperties.edges.length) {
      this.props.selectEdge(clickProperties.edges[0]);
    } else {
      this.props.unselectAll();
    }
  }

  componentDidMount() {
    const network = new Network(
      document.getElementById(netIdentifier),
      {},
      this.props.quizz ? visjsOptions.quizz : visjsOptions.noquizz
    );

    network.on('click', properties => this.onClick(network, properties));
    network.on('hoverNode', params => this.onHover(network));
    network.on('blurNode', params => this.onBlur(network));
    if (!this.props.quizz) {
      network.on('hoverEdge', params => this.onHover(network));
      network.on('blurEdge', params => this.onBlur(network));
    }

    this.props.setNetwork(network);
  }

  render() {
    return <div className={'vis-container'} id={netIdentifier}/>;
  }
}

const mapStateToProps = state => ({
  quizz: state.display.quizz
});

const mapDispatchToProps = dispatch => ({
  setNetwork: network => dispatch(setNetwork(network)),
  setData: network => dispatch(setData(network)),
  selectNode: nodeId => dispatch(selectNode(nodeId)),
  selectEdge: edgeId => dispatch(selectEdge(edgeId)),
  unselectAll: () => dispatch(unselectAll())
});

export default connect(mapStateToProps, mapDispatchToProps)(Fresque);
