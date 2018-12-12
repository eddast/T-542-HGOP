import axios from "axios";
const apiUrl = `http://${ process.env.API_URL }:${ process.env.API_PORT }`;

/**
 * Starts game from game api, then retrieves game state
 */
export const startGame = () =>
  axios.post(`${apiUrl}/start`).then(res => getState());

/**
 * Retrieves current state of the game from game api
 */
export const getState = () =>
  axios.get(`${apiUrl}/state`);

/**
 * Adds user guess as over 21 to game status
 */
export const guessOver21 = () =>
  axios.post(`${apiUrl}/guessOver21`);

/**
 * Adds user guess as under 21 to game status
 */
export const guess21OrUnder = () =>
  axios.post(`${apiUrl}/guess21OrUnder`);

/**
 * Helper function to convert cards format to svg
 * @param {string[]} cards all cards in deck
 */
export const convertCardNamesForSvg = cards => {
  return cards.map(card => {
    card = card.toLowerCase();
    if (card[0] === "1") {
      switch (card[1]) {
        case "1":   return `J${card[2]}`;
        case "2":   return `Q${card[2]}`;
        case "3":   return `K${card[2]}`;
        default:    return card;
      }
    } else {
      if (card[1] === "1") return `A${card[2]}`;
      else return card.slice(1);
    }
  });
};