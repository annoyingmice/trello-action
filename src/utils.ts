import { 
    ActionTypes, 
    TR_LISTS, 
    git, 
    GithubContext, 
    GithubIssue 
} from "./models";

const context: GithubContext = git.context;

export const getCommitMessage   = (): Readonly<string> => context.payload.head_commit.message;
export const getCardNumber      = (): Readonly<number> => {
    console.log(context.payload.head_commit.message, context.payload.head_commit.message.match(/\d+/g)[0]);
    return context.payload.head_commit.message.match(/\d+/g)[0]
};
export const getActionType      = (): Readonly<ActionTypes> => <ActionTypes>context.payload.action;
export const getOwner           = (): Readonly<string> => context.payload.commits[0].author.username;
export const getRepository      = (): Readonly<string> => context.repo.repo;
export const getRepositoryOwner = (): Readonly<string> => context.repo.owner;
export const getCommitHash      = (): Readonly<string> => context.sha;
export const getReviewComments  = (): Readonly<string[]> => context.payload.review.comments;
export const getIssue           = (): Readonly<GithubIssue> => context.payload.issue;
export const getIssueComment    = (): Readonly<GithubIssue> => <GithubIssue>context.payload.issue?.comments;
export const getDefaultBranch   = (): Readonly<string> => <string>context.payload.repository?.default_branch;
export const getLists           = (): Readonly<string[]> => TR_LISTS.split(',');
export const populateCommitUrl  = (payload: any): Readonly<string> => `https://github.com/${payload.owner}/${payload.repo}/commit/${payload.hash}`;
export const getListIndex       = (lists: any[], target: string): Readonly<number> => lists.map(item => item.name).indexOf(target);
