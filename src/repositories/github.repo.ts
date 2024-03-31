import { Github } from "../models";
import { octokit } from "../utils";

export const getCommits = async (payload: Readonly<Github.Model>) => 
    await octokit.request(
        `GET /repos/${payload.owner}/${payload.repo}/pulls/${payload.pull_number}/commits`,
        {
            owner: payload.owner,
            repo: payload.repo,
            pull_number: payload.pr_number,
        }
    )