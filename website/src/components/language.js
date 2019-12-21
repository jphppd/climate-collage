import React from 'react';
import { setLocale } from 'react-redux-i18n';
import { connect } from 'react-redux';
import { updateData } from '../redux/actions';

const LanguageSelector = ({ language, translations, selectLanguage }) => (
  <div className="select is-fullwidth">
    <select
      id="languageSelector"
      value={language}
      onChange={selectLanguage}
    >
      {Object.keys(translations).map((lang) =>
        <option
          key={lang}
          value={lang}
        >
          {translations[lang].fullName}
        </option>
      )}
    </select>
  </div>
);

const mapStateToProps = state => ({
  language: state.i18n.locale,
  translations: state.i18n.translations
});

const mapDispatchToProps = dispatch => ({
  selectLanguage: event => {
    dispatch(setLocale(event.target.value));
    dispatch(updateData());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(LanguageSelector);
