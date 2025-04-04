import { NestableMenu } from "./types/NestableMenu";

export default {
    name: 'Home',
    children: [
        {
            name: 'Play',
            children: [
                { 
                    name: 'Pokemon',
                    children: [
                        { name: '$ref:deck/pokemon', },
                    ],
                },
            ],
        },
        {
            name: 'Ability',
            children: [
                {
                    name: 'Active',
                },
                {
                    name: 'Bench',
                    children: [
                        { name: '1', },
                        { name: '2', },
                        { name: '3', },
                        { name: '4', },
                        { name: '5', },
                        { name: '6', },
                        { name: '7', },
                        { name: '8', },
                    ],
                },
            ],
        },
        {
            name: 'Retreat Into',
            children: [
                { name: '$ref:deck/pokemon', }
            ],
        },
        {
            name: 'Attack',
            children: [
                { name: '1', },
                { name: '2', },
            ],
        },
        {
            name: 'See',
            children: [
                { name: 'My Discard', },
                { name: 'Opp Discard', },
                { name: 'My Active', },
                { name: 'Opp Active', },
                { name: 'My Bench', },
                { name: 'Opp Bench', },
                { name: 'My Hand', },
                { name: 'My Deck', },
            ],
        },
        {
            name: 'List',
        },
        {
            name: 'Pass Turn',
        },
        {
            name: 'Call Judge',
        },
    ],
} as NestableMenu