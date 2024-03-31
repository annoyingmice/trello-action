import fetch from "../axios";
import { Card, ChecklistState, TrelloID, c } from "../models";

export const getCard = async (id: TrelloID) => 
    await fetch.get(
        `/cards/${id}`, 
        { 
            params: {}
        }
    );

export const getChecklist = async (id: TrelloID) => 
    await fetch.get(
        `/cards/${id}/checklists`, 
        { 
            params: {}
        }
    );

export const updateChecklist = async (id: TrelloID, idCheckItem: TrelloID, state: ChecklistState) => 
    await fetch.put(
        `/cards/${id}/checkItem/${idCheckItem}`, 
        { 
            state,
        }
    );

export const getTheListACardIsIn = async (id: TrelloID) => 
    await fetch.get(
        `/cards/${id}/list`,
        { 
            params: {}
        }
    );

export const putCard = async (id: TrelloID, payload: Card.Params) =>
    await fetch.put(
        `/cards/${id}`,
        { 
            idList: payload.idList,
        }
    );

export const postCardAttachment = async (id: TrelloID, payload: Card.AttachMent) =>
    await fetch.post(
        `/cards/${id}/attachments`,
        { 
            name: String(`[${payload.url}] ${payload.name}`),
        }
    );

export const postCardComment = async (id: TrelloID, payload: Card.AttachMent) =>
    await fetch.post(
        `/cards/${id}/actions/comments`,
        { 
            text: String(`[${payload.url}] ${payload.name}`)
        }
    ).catch(error => c.setFailed(error));
