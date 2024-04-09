import { 
    context, 
    getCardNumber, 
    getCommitHash, 
    getCommitMessage,
    getLists, 
    getRepository, 
    getRepositoryOwner, 
    populateCommitUrl 
} from "../utils";
import { 
    getBoard, 
    getBoardLists, 
    getCardFromBoardByNumber 
} from "../repositories/board.repo";
import { 
    getTheListACardIsIn, 
    postCardAttachment,
} from "../repositories/card.repo";
import { 
    Board, 
    Card, 
    List, 
    c 
} from "../models";

export default async function () {
    try {
        const board                     = (await getBoard()).data as Board.Model;
        const cardNumber                = getCardNumber(context.payload.head_commit.message);
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

        const res = await postCardAttachment(
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

        c.setOutput('statusCode', res.status);

    } catch (err) {
        c.setFailed(err as Error);
    }
}