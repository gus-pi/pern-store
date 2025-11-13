import arcjet, { tokenBucket, shield, detectBot } from '@arcjet/node';

import dotenv from 'dotenv';

dotenv.config();

//init arcjet
export const aj = arcjet({
    characteristics: ['ip.src'],
    rules: [
        //shild protects the app from attacks
        shield({ mode: 'LIVE' }),
        detectBot({
            mode: 'LIVE',
            //blocks all bots excecpt seach engine bots
            allow: ['CATEGORY:SEARCH_ENGINE'],
        }),
        //rate limiting
        tokenBucket({
            mode: 'LIVE',
            refillRate: 30,
            interval: 5,
            capacity: 20,
        }),
    ],
});
