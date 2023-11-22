//  Going to call each piece of Idea, Object, Time, and Action as a "play" 
//  since it is either something we watch or review that happened previously
//  or something we plan on making happen in the future.

import localforage from "localforage";
import { matchSorter } from "match-sorter";
import sortBy from "sort-by";

export async function getPlays(query) {
  await fakeNetwork(`getPlays:${query}`);
  let plays = await localforage.getItem("plays");
  if (!plays) plays = [];
  if (query) {
    plays = matchSorter(plays, query, { keys: ["first", "last"] });
  }
  return plays.sort(sortBy("last", "createdAt"));
}

export async function createPlay() {
  await fakeNetwork();
  let id = Math.random().toString(36).substring(2, 9);
  let play = { id, createdAt: Date.now() };
  let plays = await getPlays();
  plays.unshift(play);
  await set(plays);
  return play;
}

export async function getPlay(id) {
  await fakeNetwork(`play:${id}`);
  let plays = await localforage.getItem("plays");
  let play = plays.find(play => play.id === id);
  return play ?? null;
}

export async function updatePlay(id, updates) {
  await fakeNetwork();
  let plays = await localforage.getItem("plays");
  let play = plays.find(play => play.id === id);
  if (!play) throw new Error("No play found for", id);
  Object.assign(play, updates);
  await set(plays);
  return play;
}

export async function deletepPay(id) {
  let plays = await localforage.getItem("plays");
  let index = plays.findIndex(play => play.id === id);
  if (index > -1) {
    plays.splice(index, 1);
    await set(plays);
    return true;
  }
  return false;
}

function set(plays) {
  return localforage.setItem("plays", plays);
}

// fake a cache so we don't slow down stuff we've already seen
let fakeCache = {};

async function fakeNetwork(key) {
  if (!key) {
    fakeCache = {};
  }

  if (fakeCache[key]) {
    return;
  }

  fakeCache[key] = true;
  return new Promise(res => {
    setTimeout(res, Math.random() * 800);
  });
}
