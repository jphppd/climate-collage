import React from 'react';
import { I18n, Translate } from 'react-redux-i18n';
import { connect } from 'react-redux';
import Form from './form.js';
import LanguageSelector from './language';
import { dataPath } from '../utils/constants';

const Selectors = ({ language }) => (
  <div className="sticky">
    <div className="box has-background-white-ter">
      <h1 className="title is-5 has-text-centered">
        <Translate value='selector.language'/>
      </h1>
      <LanguageSelector/>
    </div>

    <div className="box has-background-white-ter">
      <h1 className="title is-5 has-text-centered">
        <Translate value="selector.links"/>
      </h1>
      <div>
        <a
          href={dataPath.pdfDocs.replace(/LANG/, language)}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Translate value="selector.dl_doc"/>
        </a>
      </div>
      <div>
        <a
          href={I18n.t('mainWebsite')}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Translate value="climateCollage"/>
        </a>
      </div>
    </div>

    <div className="box has-background-white-ter">
      <h1 className="title is-5 has-text-centered">
        <Translate value="selector.filters.name"/>
      </h1>
      <Form/>
    </div>
  </div>
);

const mapStateToProps = state => ({
  language: state.i18n.locale
});

export default connect(mapStateToProps)(Selectors);
