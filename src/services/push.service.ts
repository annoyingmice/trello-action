import { getCardNumber, getCommitHash, getCommitMessage, getDefaultBranch, getListIndex, getLists, getRepository, getRepositoryOwner, populateCommitUrl } from "../utils";
import { getBoard, getBoardLists, getCardFromBoardByNumber } from "../repositories/board.repo";
import { getTheListACardIsIn, postCardAttachment, putCard } from "../repositories/card.repo";
import { Board, Card, List, c } from "../models";

export default async function () {
    try {
        const board                     = (await getBoard()).data as Board.Model;
        const cardNumber                = getCardNumber();
        console.log(cardNumber);
        const card                      = (await getCardFromBoardByNumber(cardNumber)).data as Card.Model;
        console.log(card.id)
        const currentCardListPosition   = (await getTheListACardIsIn(card.id)).data as List.Model;
        console.log(currentCardListPosition)
        const boardLists                = (await getBoardLists()).data;
        console.log(boardLists)
        const lists                     = getLists();
        const commitMessage             = getCommitMessage();
        const repo                      = getRepository();
        const owner                     = getRepositoryOwner();
        const hash                      = getCommitHash();

        if(board.closed) return c.setFailed("Oops! Board is closed.");
        if(card.closed) return c.setFailed("Oops! Card is closed.");
        if(boardLists.length !== lists.length) return c.setFailed("Oops! Boards in .yml and trello mismatch.")
        if(!lists.includes(currentCardListPosition.name)) return c.setFailed("Oops! Make sure you listed all the lists in your .yml config.");

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

        const index = getListIndex(boardLists, currentCardListPosition.name);
        if(!index) return c.setFailed("Oops! Cannot find card in the list.");
        const list = boardLists[index+1]; // move to next card
        console.log(lists);

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