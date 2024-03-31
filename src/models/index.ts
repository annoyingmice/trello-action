import * as core from "@actions/core";
import * as github from "@actions/github";

export * as Board from "./board.model";
export * as List from "./list.model";
export * as Card from "./card.model";
export * as Github from "./github.model";

export const git    = github;
export const c      = core;

export const TR_API_KEY     = core.getInput(`tr-key`,   { required: true });
export const TR_API_TOKEN   = core.getInput(`tr-token`, { required: true });
export const TR_BOARD       = core.getInput(`tr-board`, { required: true });
export const TR_LISTS       = core.getInput(`tr-list`) || 'Back Logs,Bugs,In Progress,For QA,Done';
export const GH_TOKEN       = core.getInput(`gh-token`, { required: true });

export type ActionTypes         = "opened"|"closed"|"reopened"|"synchronize";
export type ChecklistState      = "complete" | "incomplete";
export type TrelloID            = string;
export type GithubContext       = Readonly<typeof github.context>;
export type GithubIssue         = Readonly<typeof github.context.payload.issue>;
export type Prefs = {
    green: string;
    yellow: string;
    orange: string;
    red: string;
    purple: string;
    blue: string;
    sky: string;
    lime: string;
    pink: string;
    black: string;
}
export type Limit = {
    attachment?: {
        perBoard?: LimitObject
    }
}
export type LimitObject = {
    status?: "ok" | "warning";
    disableAt?: string;
    warnAt?: string;
}

export interface Model {
    [key: string]: any;
}