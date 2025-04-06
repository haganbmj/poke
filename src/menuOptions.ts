import { NestableMenu } from "./types/NestableMenu";

export default {
  name: 'Home',
  children: [
    {
      name: 'Play a Card',
      children: [
        { name: '$deck', },
      ],
    },
    {
      name: 'Use an Ability',
      children: [
        { name: 'Of Active', },
        {
          name: 'Of Bench',
          children: [
            { name: 'Position #1', },
            { name: 'Position #2', },
            { name: 'Position #3', },
            { name: 'Position #4', },
            { name: 'Position #5', },
            { name: 'Position #6', },
            { name: 'Position #7', },
            { name: 'Position #8', },
          ],
        },
      ],
    },
    {
      name: 'Retreat Into',
      children: [
        { name: '$deck/pokemon', }
      ],
    },
    {
      name: 'Use an Attack',
      children: [
        { name: 'Attack #1', },
        { name: 'Attack #2', },
      ],
    },
    {
      name: 'See Something',
      children: [
        { name: 'My Discard', },
        { name: "Opponent's Discard", },
        { name: 'My Active', },
        { name: "Opponent's Active", },
        {
          name: 'My Bench',
          children: [
            { name: 'Position #1', },
            { name: 'Position #2', },
            { name: 'Position #3', },
            { name: 'Position #4', },
            { name: 'Position #5', },
            { name: 'Position #6', },
            { name: 'Position #7', },
            { name: 'Position #8', },
          ],
        },
        {
          name: "Opponent's Bench",
          children: [
            { name: 'Position #1', },
            { name: 'Position #2', },
            { name: 'Position #3', },
            { name: 'Position #4', },
            { name: 'Position #5', },
            { name: 'Position #6', },
            { name: 'Position #7', },
            { name: 'Position #8', },
          ],
        },
        { name: 'My Hand', },
        { name: 'My Deck', },
      ],
    },
    {
      name: 'Indicate a Card',
      children: [
        { name: '$deck', },
        { name: "Opponent's Active", },
        {
          name: "Opponent's Bench",
          children: [
            { name: 'Position #1', },
            { name: 'Position #2', },
            { name: 'Position #3', },
            { name: 'Position #4', },
            { name: 'Position #5', },
            { name: 'Position #6', },
            { name: 'Position #7', },
            { name: 'Position #8', },
          ],
        },
      ]
    },
    { name: 'Pass Turn', },
    {
      name: 'Other',
      children: [
        { name: 'Yes', },
        { name: 'No', },
        { name: 'Call Judge', },
        { name: '$notepad', },
      ],
    },
  ],
} as NestableMenu
