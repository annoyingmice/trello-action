import { 
    getCommits,
} from "src/repositories/github.repo";
import { 
    Board, 
    Card, 
    List, 
    git,
    c 
} from "../models";
import { 
    getBoard, 
    getBoardLists, 
    getCardFromBoardByNumber 
} from "../repositories/board.repo";
import { getTheListACardIsIn, postCardComment, putCard } from "../repositories/card.repo";
import { 
    context, 
    getCardNumbers, 
    getListIndex, 
    getLists,
    isMain,
} from "../utils"
import {
    getRepository, 
    getRepositoryOwner, 
    getCommitHash, 
    populateCommitUrl,
} from "../utils";

async function process (payload: { [key: string]: string }) {
    const resPostCard = await postCardComment(
        payload.card,
        {
            name: payload.commitMessage,
            url: populateCommitUrl({
                owner: payload.owner,
                repo: payload.repo,
                hash: payload.hash,
            })
        }
    );

    if(resPostCard.status != 200) {
        throw new Error(resPostCard.data);
    }

    const res = await putCard(
        payload.card,
        {
            idList: payload.list,
        }
    );

    if(res.status != 200) {
        throw new Error(res.data);
    }

    c.setOutput('statusCode', res.status);
}

export default async function () {
  // if target branch is the default branch
  // move card to done
    try {
        const commits                   = await getCommits({
            owner:      getRepositoryOwner(),
            repo:       getRepository(),
            pr_number:  context.payload.pull_request?.number,
        });
        
        const pull_request              = git.context.payload.pull_request;
        const pr_body                   = pull_request?.body as string;
        const commitMessage             = commits.data[commits.data.length-1].commit.message;

        const board                     = (await getBoard()).data as Board.Model;
        
        const cardNumbers               = getCardNumbers(pr_body);
        const repo                      = getRepository();
        const owner                     = getRepositoryOwner();
        const hash                      = getCommitHash();
        const boardLists                = (await getBoardLists()).data;
        const lists                     = getLists();
        
        if(board.closed) return c.setFailed("Oops! Board is closed.");
        if(boardLists.length !== lists.length) return c.setFailed("Oops! Boards in .yml and trello mismatch.");

        cardNumbers.forEach(async card => {
            const model = (await getCardFromBoardByNumber(card)).data as Card.Model;
            const position = (await getTheListACardIsIn(model.id)).data as List.Model;
            const index = getListIndex(boardLists, position.name);
            const list = boardLists[index+1]; // next card

            if(model.closed) return c.setFailed("Oops! Card is closed.");
            if(!lists.includes(position.name)) return c.setFailed("Oops! Make sure you listed all the lists in your .yml config.");
            if(!index) return c.setFailed("Oops! Cannot find card in the list.");

            await process({
                card: model.id,
                commitMessage,
                owner,
                repo,
                hash,
                list: list.id,
            });
        });

    } catch (err) {
        console.log('Error: ', JSON.stringify(err));
        c.setFailed(err as Error);
    }
}