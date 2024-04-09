import { 
    getCommits,
} from "src/repositories/github.repo";
import { 
    Board, 
    Card, 
    List, 
    c 
} from "../models";
import { 
    getBoard, 
    getBoardLists, 
    getCardFromBoardByNumber 
} from "../repositories/board.repo";
import { getTheListACardIsIn, postCardAttachment, putCard } from "../repositories/card.repo";
import { 
    context, 
    getListIndex, 
    getLists,
} from "../utils"
import { 
    getCardNumber,
    getRepository, 
    getRepositoryOwner, 
    getCommitHash, 
    populateCommitUrl,
} from "../utils";

export default async function () {
  // if target branch is the default branch
  // move card to done
    try {
        const commits                   = await getCommits({
            owner:      getRepositoryOwner(),
            repo:       getRepository(),
            pr_number:  context.payload.pull_request?.number,
        });

        const commitMessage             = commits.data[commits.data.length-1].commit.message;
        const board                     = (await getBoard()).data as Board.Model;
        const cardNumber                = getCardNumber(commitMessage);
        const card                      = (await getCardFromBoardByNumber(cardNumber)).data as Card.Model;
        const repo                      = getRepository();
        const owner                     = getRepositoryOwner();
        const hash                      = getCommitHash();
        const boardLists                = (await getBoardLists()).data;
        const lists                     = getLists();
        const currentCardListPosition   = (await getTheListACardIsIn(card.id)).data as List.Model;
        
        if(board.closed) c.setFailed("Oops! Board is closed.");
        if(card.closed) c.setFailed("Oops! Card is closed.");
        if(boardLists.length !== lists.length) c.setFailed("Oops! Boards in .yml and trello mismatch.")
        if(!lists.includes(currentCardListPosition.name)) c.setFailed("Oops! Make sure you listed all the lists in your .yml config.");
        
        const index = getListIndex(boardLists, currentCardListPosition.name);
        if(!index) c.setFailed("Oops! Cannot find card in the list.");
        const list = boardLists[index+1]; // next card

        await postCardAttachment(
            card.id,
            {
                name: commitMessage,
                url: populateCommitUrl({
                    owner,
                    repo,
                    hash,
                })
            }
        );

        const res = await putCard(
            card.id,
            {
                idList: list.id,
            }
        );

        c.setOutput('statusCode', res.status);

    } catch (err) {
        c.setFailed(err as Error);
    }
}