/* Parse url, return the array of parameters/values */
const getUrlQueryStrings = (window) => {
  const oParametre = {};

  if (window.location.search.length > 1) {
    for (var aItKey, nKeyId = 0, aCouples = window.location.search.substr(1).split('&'); nKeyId < aCouples.length; nKeyId++) {
      aItKey = aCouples[nKeyId].split('=');
      oParametre[unescape(aItKey[0])] = aItKey.length > 1 ? unescape(aItKey[1]) : '';
    }
  }
  return oParametre;
};

/* Try to guess the default language */
export const getDefaultLanguage = (window, availLanguage) => {
  const queryLanguage = getUrlQueryStrings(window).lang;
  if (availLanguage.indexOf(queryLanguage) >= 0) {
    return queryLanguage;
  }

  const navigatorUserLang = (navigator.language || navigator.userLanguage);
  const navigatorUserLangShort = navigatorUserLang.split('-', 1)[0];
  if (availLanguage.indexOf(navigatorUserLangShort) >= 0) {
    return navigatorUserLangShort;
  }

  return undefined;
};

/* Look in the query parameters of the url, deduce if we are in quizz mode */
export const isQuizz = (window) => {
  const quizz = getUrlQueryStrings(window).quizz;
  if (quizz) {
    return quizz === 'true';
  }
  return false;
};
