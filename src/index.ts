import { c } from './models';
import pushService from './services/push.service';

async function onPull() {}
async function onPullReview() {}
async function onPullReviewComment() {}
async function onIssue() {}
async function onIssueComment() {}
async function onWorkflowDispatch() {}
async function onSchedule() {}
async function onRepositoryDispatch() {}

async function run() {
  switch(process.env.GITHUB_EVENT_NAME) {
    case "push":
      return await pushService();
    case "pull_request":
      return await onPull();
    case "pull_request_review":
      return await onPullReview();
    case "pull_request_review_comment":
      return await onPullReviewComment();
    case "issues":
      return await onIssue();
    case "issue_comment":
      return await onIssueComment();
    case "workflow_dispatch":
      return await onWorkflowDispatch();
    case "schedule":
      return await onSchedule();
    case "repository_dispatch":
      return await onRepositoryDispatch();
    default:
      return c.setFailed("Event not supported");
  }
}

run();
