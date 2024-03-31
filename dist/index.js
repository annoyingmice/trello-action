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
const models_1 = require("./models");
const push_service_1 = __importDefault(require("./services/push.service"));
function onPull() {
    return __awaiter(this, void 0, void 0, function* () { });
}
function onPullReview() {
    return __awaiter(this, void 0, void 0, function* () { });
}
function onPullReviewComment() {
    return __awaiter(this, void 0, void 0, function* () { });
}
function onIssue() {
    return __awaiter(this, void 0, void 0, function* () { });
}
function onIssueComment() {
    return __awaiter(this, void 0, void 0, function* () { });
}
function onWorkflowDispatch() {
    return __awaiter(this, void 0, void 0, function* () { });
}
function onSchedule() {
    return __awaiter(this, void 0, void 0, function* () { });
}
function onRepositoryDispatch() {
    return __awaiter(this, void 0, void 0, function* () { });
}
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        switch (process.env.GITHUB_EVENT_NAME) {
            case "push":
                return yield (0, push_service_1.default)();
            case "pull_request":
                return yield onPull();
            case "pull_request_review":
                return yield onPullReview();
            case "pull_request_review_comment":
                return yield onPullReviewComment();
            case "issues":
                return yield onIssue();
            case "issue_comment":
                return yield onIssueComment();
            case "workflow_dispatch":
                return yield onWorkflowDispatch();
            case "schedule":
                return yield onSchedule();
            case "repository_dispatch":
                return yield onRepositoryDispatch();
            default:
                return models_1.c.setFailed("Event not supported");
        }
    });
}
run();
