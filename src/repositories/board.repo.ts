import fetch from "../axios";
import { TR_BOARD } from "../models";

const base = `/boards/${TR_BOARD}`;

export const getBoard = async () => 
    await fetch.get(
        base, 
        {
            params: {},
        }
    );

export const getBoardLists = async () =>
    await fetch.get(
        `${base}/lists`, 
        {
            params: {},
        }
    );

export const getCardFromBoardByNumber = async (number: number) => {
    console.log(`${base}/cards/${number}`)
    return await fetch.get(
        `${base}/cards/${number}`, 
        {
            params: {},
        }
    );
}