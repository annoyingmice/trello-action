"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TR_LISTS = exports.TR_BOARD = exports.TR_API_TOKEN = exports.TR_API_KEY = exports.c = exports.git = exports.Card = exports.List = exports.Board = void 0;
const core = __importStar(require("@actions/core"));
const github = __importStar(require("@actions/github"));
exports.Board = __importStar(require("./board.model"));
exports.List = __importStar(require("./list.model"));
exports.Card = __importStar(require("./card.model"));
exports.git = github;
exports.c = core;
exports.TR_API_KEY = core.getInput(`tr-key`, { required: true });
exports.TR_API_TOKEN = core.getInput(`tr-token`, { required: true });
exports.TR_BOARD = core.getInput(`tr-board`, { required: true });
exports.TR_LISTS = core.getInput(`tr-list`) || 'Back Logs,Bugs,In Progress,For QA,Done';
