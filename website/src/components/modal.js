import React from 'react';
import { connect } from 'react-redux';
import { I18n, Translate } from 'react-redux-i18n';
import { displayMoreInfo } from '../redux/actions';

const Modal = ({ visible, moreInfo, closeDisplayMoreInfo }) => {
  if (visible) {
    return (
      <div className="modal is-active">
        <div className="modal-background"/>
        <div className="modal-card">
          <header className="modal-card-head">
            <Translate className="modal-card-title" value="explanations.moreInfo"/>
            <button
              className="delete"
              aria-label="close"
              onClick={closeDisplayMoreInfo}
            />
          </header>
          <section className="modal-card-body has-text-justified"
                   dangerouslySetInnerHTML={{ __html: moreInfo }}/>
          <footer className="modal-card-foot"/>
        </div>
      </div>
    );
  }
  return <div/>;
};

const mapStateToProps = state => ({
  visible: state.display.moreInfo,
  moreInfo: I18n.t(`nodes.${state.selection.nodeId}.moreInfo`)
});

const mapDispatchToProps = dispatch => ({
  closeDisplayMoreInfo: () => dispatch(displayMoreInfo(false))
});

export default connect(mapStateToProps, mapDispatchToProps)(Modal);
