const csat = require('./csat.js');
const CONSTANT = require('./constant.js');

/**
 * When stale bot closes the issue this function will
 * invoke and post CSAT link on the issue.
 * This function will fetch all the issues closed within 20 minutes and
 * post the survey link if survey link is not posted already.
 * @param {!Object.<string,!Object>} github contains pre defined functions.
 *  context contains information about the workflow run.
 */
module.exports = async ({github, context}) => {
  let date = new Date();
  let totalMilliSeconds = date.getTime();
  let minutes = 20;
  let millisecondsToSubtract = minutes * 60 * 1000;
  let closeTime = totalMilliSeconds - millisecondsToSubtract;
  let newDate = new Date(closeTime);
  let ISOCloseTime = newDate.toISOString();
  let closeTimeIssues = await github.rest.issues.listForRepo({
    owner: context.repo.owner,
    repo: context.repo.repo,
    state: 'closed',
    labels: 'stale',
    since: ISOCloseTime
  });
  let issueList = closeTimeIssues.data;
  for (let i = 0; i < issueList.length; i++) {
    if (issueList[i].node_id && issueList[i].node_id.indexOf('PR') != -1)
      continue;

    let comments = await github.rest.issues.listComments({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: issueList[i].number
    });
    let noOfComments = comments.data.length;
    let lastComment = comments.data[noOfComments - 1];
    let strCom = JSON.stringify(lastComment);
    if (strCom.indexOf(CONSTANT.MODULE.CSAT.MSG) == -1) {
      context.payload.issue = {};
      context.payload.issue.number = issueList[i].number;
      context.payload.issue.labels = issueList[i].labels;
      context.payload.issue.html_url = issueList[i].html_url;
      await csat({github, context});
    }
  }
};