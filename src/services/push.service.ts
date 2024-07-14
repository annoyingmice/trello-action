import { 
    getCardNumber, 
    getCommitHash, 
    getCommitMessage,
    getLists, 
    getRepository, 
    getRepositoryOwner, 
    populateCommitUrl,
    getListIndex,
    isMain
} from "../utils";
import { 
    getBoard, 
    getBoardLists, 
    getCardFromBoardByNumber 
} from "../repositories/board.repo";
import { 
    getTheListACardIsIn, 
    postCardAttachment,
    putCard
} from "../repositories/card.repo";
import { 
    Board, 
    Card, 
    List, 
    git,
    c 
} from "../models";

export default async function () {
    try {
        const branch                    = git.context.ref.replace('refs/heads/', '');
        const board                     = (await getBoard()).data as Board.Model;
        const cardNumber                = getCardNumber(branch);
        const card                      = (await getCardFromBoardByNumber(cardNumber)).data as Card.Model;
        const currentCardListPosition   = (await getTheListACardIsIn(card.id)).data as List.Model;
        const boardLists                = (await getBoardLists()).data;
        const lists                     = getLists();
        const commitMessage             = getCommitMessage();
        const repo                      = getRepository();
        const owner                     = getRepositoryOwner();
        const hash                      = getCommitHash();

        if(board.closed) c.setFailed("Oops! Board is closed.");
        if(card.closed) c.setFailed("Oops! Card is closed.");
        if(boardLists.length !== lists.length) c.setFailed("Oops! Boards in .yml and trello mismatch.")
        if(!lists.includes(currentCardListPosition.name)) c.setFailed("Oops! Make sure you listed all the lists in your .yml config.");
        
        const index = getListIndex(boardLists, currentCardListPosition.name);
        if(!index) c.setFailed("Oops! Cannot find card in the list.");
        const list = boardLists[index+1]; // next card

        const resPostCard = await postCardAttachment(
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

        if(resPostCard.status == 400) {
            throw new Error(resPostCard.data);
        }

        if(isMain(branch)) {
            return c.setOutput('statusCode', resPostCard.status);
        }

        const res = await putCard(
            card.id,
            {
                idList: list.id,
            }
        );

        if(res.status == 400) {
            throw new Error(res.data);
        }

        c.setOutput('statusCode', resPostCard.status);

    } catch (err) {
        console.log('Error: ', JSON.stringify(err));
        c.setFailed(err as Error);
    }
}