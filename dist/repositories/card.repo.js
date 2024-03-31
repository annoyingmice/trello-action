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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postCardAttachment = exports.putCard = exports.getTheListACardIsIn = exports.updateChecklist = exports.getChecklist = exports.getCard = void 0;
const axios_1 = __importDefault(require("../axios"));
const getCard = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield axios_1.default.get(`/cards/${id}`, {
        params: {}
    });
});
exports.getCard = getCard;
const getChecklist = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield axios_1.default.get(`/cards/${id}/checklists`, {
        params: {}
    });
});
exports.getChecklist = getChecklist;
const updateChecklist = (id, idCheckItem, state) => __awaiter(void 0, void 0, void 0, function* () {
    return yield axios_1.default.put(`/cards/${id}/checkItem/${idCheckItem}`, {
        params: { state }
    });
});
exports.updateChecklist = updateChecklist;
const getTheListACardIsIn = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield axios_1.default.put(`/cards/${id}/list`, {
        params: {}
    });
});
exports.getTheListACardIsIn = getTheListACardIsIn;
const putCard = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    return yield axios_1.default.put(`/cards/${id}`, {
        params: {
            idList: payload.idList,
        }
    });
});
exports.putCard = putCard;
const postCardAttachment = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    return yield axios_1.default.put(`/cards/${id}/attachments`, {
        params: {
            name: payload.name,
            url: payload.url,
        }
    });
});
exports.postCardAttachment = postCardAttachment;
