import { Github } from "../models";
import { octokit } from "../utils";

export const getCommits = async (payload: Readonly<Github.Model>) => 
    await octokit.request(
        `GET /repos/${payload.owner}/${payload.repo}/pulls/${payload.pr_number}/commits`,
        {
            owner: payload.owner,
            repo: payload.repo,
            pull_number: payload.pr_number,
        }
    )
export const getMainBranch = async (payload: Readonly<Github.Model>) =>
    await octokit.request(
        `GET /repos/${payload.owner}/${payload.repo}`,
        {
            owner: payload.owner,
            repo: payload.repo,
        }
    )