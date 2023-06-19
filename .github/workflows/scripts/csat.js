const CONSTANT_VALUES = require('./constant');

/**
 * Invoked from staleCSAT.js and CSAT.yaml file to post survey link
 * in closed issue.
 * @param {!Object.<string,!Object>} github contains pre defined functions.
 *  context Information about the workflow run.
 * @return {null}
 */
module.exports = async ({github, context}) => {
  const issue = context.payload.issue.html_url;
  let baseUrl = '';
  // Loop over all ths label present in issue and check if specific label is
  // present for survey link.
  for (const label of context.payload.issue.labels) {
    if (label.name.includes(CONSTANT_VALUES.GLOBALS.LABELS.BUG) ||
        label.name.includes(CONSTANT_VALUES.GLOBALS.LABELS.BUG_INSTALL) ||
        label.name.includes(CONSTANT_VALUES.GLOBALS.LABELS.TYPE_PERFORMANCE) ||
        label.name.includes(CONSTANT_VALUES.GLOBALS.LABELS.TYPE_OTHER) ||
        label.name.includes(CONSTANT_VALUES.GLOBALS.LABELS.TYPE_SUPPORT) ||
        label.name.includes(CONSTANT_VALUES.GLOBALS.LABELS.TYPE_DOCS_BUG)) {
      console.log(
          `label-${label.name}, posting CSAT survey for issue =${issue}`);
      if (context.repo.repo.includes('mediapipe'))
        baseUrl = CONSTANT_VALUES.MODULE.CSAT.MEDIA_PIPE_BASE_URL;
      else
        baseUrl = CONSTANT_VALUES.MODULE.CSAT.BASE_URL;
    
      const yesCsat = document.createElement("a");
      yesCsat.textContent = CONSTANT_VALUES.MODULE.CSAT.YES;
      yesCsat.href =  baseUrl + CONSTANT_VALUES.MODULE.CSAT.SATISFACTION_PARAM +
      CONSTANT_VALUES.MODULE.CSAT.YES +
      CONSTANT_VALUES.MODULE.CSAT.ISSUEID_PARAM + issue
      
      const noCsat = document.createElement("a");
      noCsat.textContent = CONSTANT_VALUES.MODULE.CSAT.NO
      noCsat.href =  baseUrl + CONSTANT_VALUES.MODULE.CSAT.SATISFACTION_PARAM +
      CONSTANT_VALUES.MODULE.CSAT.NO +
      CONSTANT_VALUES.MODULE.CSAT.ISSUEID_PARAM + issue





    //   const yesCsat =
    //       (CONSTANT_VALUES.MODULE.CSAT.YES)
    //           .link(
    //               baseUrl + CONSTANT_VALUES.MODULE.CSAT.SATISFACTION_PARAM +
    //               CONSTANT_VALUES.MODULE.CSAT.YES +
    //               CONSTANT_VALUES.MODULE.CSAT.ISSUEID_PARAM + issue);
    //   const noCsat =
    //       (CONSTANT_VALUES.MODULE.CSAT.NO)
    //           .link(
    //               baseUrl + CONSTANT_VALUES.MODULE.CSAT.SATISFACTION_PARAM +
    //               CONSTANT_VALUES.MODULE.CSAT.NO +
    //               CONSTANT_VALUES.MODULE.CSAT.ISSUEID_PARAM + issue);
      const comment = CONSTANT_VALUES.MODULE.CSAT.MSG + '\n' + yesCsat + '\n' +
          noCsat + '\n';
      let issueNumber = context.issue.number ?? context.payload.issue.number;

      await github.rest.issues.createComment({
        issue_number: issueNumber,
        owner: context.repo.owner,
        repo: context.repo.repo,
        body: comment
      });
    }
  }
};