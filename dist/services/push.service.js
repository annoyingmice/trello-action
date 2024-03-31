"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const board_repo_1 = require("../repositories/board.repo");
const card_repo_1 = require("../repositories/card.repo");
const models_1 = require("../models");
function default_1() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const board = (yield (0, board_repo_1.getBoard)()).data;
            const cardNumber = (0, utils_1.getCardNumber)();
            const card = (yield (0, board_repo_1.getCardFromBoardByNumber)(cardNumber)).data;
            const currentCardListPosition = (yield (0, card_repo_1.getTheListACardIsIn)(card.id)).data;
            const boardLists = (yield (0, board_repo_1.getBoardLists)()).data;
            const lists = (0, utils_1.getLists)();
            const commitMessage = (0, utils_1.getCommitMessage)();
            const repo = (0, utils_1.getRepository)();
            const owner = (0, utils_1.getRepositoryOwner)();
            const hash = (0, utils_1.getCommitHash)();
            if (board.closed)
                return models_1.c.setFailed("Oops! Board is closed.");
            if (card.closed)
                return models_1.c.setFailed("Oops! Card is closed.");
            if (boardLists.length !== lists.length)
                return models_1.c.setFailed("Oops! Boards in .yml and trello mismatch.");
            if (!lists.includes(currentCardListPosition.name))
                return models_1.c.setFailed("Oops! Make sure you listed all the lists in your .yml config.");
            yield (0, card_repo_1.postCardAttachment)(card.id, {
                name: commitMessage,
                url: (0, utils_1.populateCommitUrl)({
                    owner,
                    repo,
                    hash,
                })
            });
            const index = (0, utils_1.getListIndex)(boardLists, currentCardListPosition.name);
            if (!index)
                return models_1.c.setFailed("Oops! Cannot find card in the list.");
            const list = boardLists[index + 1]; // move to next card
            const res = yield (0, card_repo_1.putCard)(card.id, {
                idList: list.id,
            });
            models_1.c.setOutput('statusCode', res.status);
        }
        catch (err) {
            models_1.c.setFailed(JSON.stringify(err));
        }
    });
}
exports.default = default_1;
