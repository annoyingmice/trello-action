import { Board, Card, c } from "../models";
import { getBoard, getCardFromBoardByNumber } from "../repositories/board.repo";
import { postCardAttachment } from "../repositories/card.repo";
import { context } from "../utils"
import { 
    getCardNumber, 
    getLists, 
    getCommitMessage, 
    getRepository, 
    getRepositoryOwner, 
    getCommitHash, 
    populateCommitUrl, 
    getListIndex 
} from "../utils";

export default async function () {
  // if target branch is the default branch
  // move card to done
    try {
        context.payload.pull_request.commits.forEach(item => console.log(item))
        const board                     = (await getBoard()).data as Board.Model;
        const cardNumber                = getCardNumber();
        const card                      = (await getCardFromBoardByNumber(cardNumber)).data as Card.Model;
        const commitMessage             = getCommitMessage();
        const repo                      = getRepository();
        const owner                     = getRepositoryOwner();
        const hash                      = getCommitHash();
        
        // if(board.closed) return c.setFailed("Oops! Board is closed.");
        // if(card.closed) return c.setFailed("Oops! Card is closed.");

        // const res = await postCardAttachment(
        //     card.id,
        //     {
        //         name: commitMessage,
        //         url: populateCommitUrl({
        //             owner,
        //             repo,
        //             hash,
        //         })
        //     }
        // );

        // c.setOutput('statusCode', res.status);

    } catch (err) {
        c.setFailed(err as Error);
    }
}