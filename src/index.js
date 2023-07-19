const axios = require("axios");
const core = require(`@actions/core`);
const github = require(`@actions/github`);

const eventType = process.env.GITHUB_EVENT_NAME;
const { context = {} } = github;
const { head_commit, pull_request, repository } = context.payload;
const trello = `https://api.trello.com/1`;
let lists = [];

// Declare all inputs
const trToken = core.getInput(`tr-token`, { required: true }); // trello auth token
const trKey = core.getInput(`tr-key`, { required: true }); // trello api key
const trBoard = core.getInput(`tr-board`, { required: true }); // trello board ID
const trAction = core.getInput(`tr-action`, { required: true }); // trello actions ["comment", "attach", "move"]
const trMoveTo = core.getInput(`tr-move-to`) || undefined; // List name e.g ["To do", "Blocked", "Rework", "Progress", "QA", "Done"]
const ExceptionCardNotdFound = `No card ID was found. Please follow this commit format "[<#card>] (branch) <type>(optional): <message>".`;
const ExceptionListNotFound = `No list ID was found. Please make sure you provided the correct list name case sensitive.`;

// Axios custom instance
const fetch = axios.create({
  baseURL: trello,
  timeout: 1000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Interceptor always attach key, and token to the request
fetch.interceptors.request.use(
  (config) => {
    // Add your global parameters to the request config
    config.params = {
      ...config.params,
      key: trKey,
      token: trToken,
      // Add more parameters as needed
    };

    return config;
  },
  (error) => {
    // Handle request error
    return Promise.reject(error);
  }
);

/**
 * Get the conditions in array format
 * @param array|string options
 * @return array
 */
function condtions(options) {
  return options.split(`,`);
}

/**
 * Find the list id by name
 * @param string name
 * @return string
 */
function findListID(name) {
  const id = lists.find((item) => item.name === name)?.id;
  if (!id) {
    core.setFailed(ExceptionListNotFound);
  }
  return id;
}

/**
 * Get the card id from commit message
 * Note: commit format should be followed "[TR<#card>] (branch) <type>(optional): <message>"
 * @param string commit
 * @return number[]|undefined
 */
function getCardIDFromCommit(commit) {
  if (!commit) {
    core.setFailed(ExceptionCardNotdFound);
  }

  const regex = /\[(\w+\d+)\]/;
  const match = commit.match(regex);

  if (match && match[1]) {
    return match[1].match(/\d+/g);
  } else {
    core.setFailed(ExceptionCardNotdFound);
  }
  return;
}

/**
 * Get all list from board and assign to boards variable
 * @param boardID
 * @return void
 */
async function getBoardList(boardID) {
  try {
    const res = await fetch.get(`/boards/${boardID}/lists/open`);

    if (res?.data) {
      lists = res.data;
    }
  } catch (e) {
    core.setFailed(e.message);
  }
}

/**
 * Get card from board
 * @param string boardID
 * @param string|number cardID
 * @return object|undefined
 */
async function getCardFromBoard(boardID, cardID) {
  try {
    const res = await fetch.get(`/boards/${boardID}/cards/${cardID}`);
    return res?.data;
  } catch (e) {
    core.setFailed(e.message);
  }
}

/**
 * Process the action
 * @param string action
 * @param object data
 * @param object
 * @return Promise
 */
async function cardActions(action, data, card) {
  switch (action) {
    case "comment":
      await fetch.post(`/cards/${card.id}/actions/comments`, {
        text: `${data.author.name}: ${data.message} ${data.url}`,
      });
    case "attach":
      await fetch.post(`/cards/${card.id}/attachments`, {
        url: data.url,
      });
    case "move":
      if (eventType === `push` && trMoveTo) {
        await fetch.put(`/cards/${card.id}`, {
          idList: findListID(trMoveTo),
        });
      }

      if (eventType === `pull_request` && trMoveTo && data.merged) {
        await fetch.put(`/cards/${card.id}`, {
          idList: findListID(trMoveTo),
        });
      }
  }
}

/**
 * Attach commit to card
 * @param object data
 * @return void
 */
async function handleCommit(data) {
  try {
    console.log(head_commit);
    const cardIDs = getCardIDFromCommit(head_commit);
    cardIDs.forEach(async (cardID) => {
      const card = await getCardFromBoard(trBoard, cardID);

      if (!card) {
        core.setFailed(ExceptionCardNotdFound);
      }

      condtions(trAction).forEach((action) => cardActions(action, data, card));
    });

    core.setOutput(`Success`, `Commit successfully attacked`);
  } catch (e) {
    core.setFailed(e.message);
  }
}

/**
 * Handle pull_request
 * @param object data
 * @return void
 */
async function handlePull(data) {
  try {
    const altered = {
      ...data,
      url: `https://github.com/${repository.owner.login}/${repository.name}/pull/${data.number}`,
    };
    console.log(altered);
    const cardIDs = getCardIDFromCommit(altered.body);
    cardIDs.forEach(async (cardID) => {
      const card = await getCardFromBoard(trBoard, cardID);

      if (!card) {
        core.setFailed(ExceptionCardNotdFound);
      }

      // By default attach action only allowed in pull request
      condtions(trAction).forEach((action) =>
        cardActions(action, altered, card)
      );
    });

    core.setOutput(`Success`, `Commit successfully attacked`);
  } catch (e) {
    core.setFailed(e.message);
  }
}

async function run() {
  // Make sure to always load the lists first
  await getBoardList(trBoard);
  if (eventType === `push`) {
    // Run to handle commit
    await handleCommit(head_commit);
  }

  if (eventType === `pull_request`) {
    await handlePull(pull_request);
  }
}

run();
