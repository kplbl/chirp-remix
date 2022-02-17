import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

async function seed() {
  const kody = await db.user.create({
    data: {
      username: "kody",
      // this is a hashed version of "twixrox"
      passwordHash:
        "$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu/1u",
      avatarSVG: `<svg xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:cc="http://creativecommons.org/ns#" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none"><metadata><rdf:RDF><cc:Work><dc:format>image/svg+xml</dc:format><dc:type rdf:resource="http://purl.org/dc/dcmitype/StillImage"/><dc:title>Miniavs - Free Avatar Creator</dc:title><dc:creator><cc:Agent><dc:title>Webpixels</dc:title></cc:Agent></dc:creator><dc:source>https://www.figma.com/community/file/923211396597067458</dc:source><cc:license rdf:resource="https://creativecommons.org/licenses/by/4.0/"/></cc:Work><cc:License rdf:about="https://creativecommons.org/licenses/by/4.0/"><cc:permits rdf:resource="https://creativecommons.org/ns#Reproduction"/><cc:permits rdf:resource="https://creativecommons.org/ns#Distribution"/><cc:permits rdf:resource="https://creativecommons.org/ns#DerivativeWorks"/><cc:requires rdf:resource="https://creativecommons.org/ns#Notice"/><cc:requires rdf:resource="https://creativecommons.org/ns#Attribution"/></cc:License></rdf:RDF></metadata><mask id="avatarsRadiusMask"><rect width="64" height="64" rx="0" ry="0" x="0" y="0" fill="#fff"/></mask><g mask="url(#avatarsRadiusMask)"><g><path d="M45.887 36.1C45.887 45.021 42 55 35.5 56.5a14.512 14.512 0 0 1-.5-.062v9.433S31.357 68 26.5 68 18 64.523 18 64.523V42a5 5 0 0 1-1.303-9.829C15.36 22.643 17.51 13 32.002 13c14.587 0 14.235 11.08 13.957 19.815-.037 1.145-.072 2.25-.072 3.284Z" fill="rgba(245, 208, 197, 1)"/><path d="M18 42.002v22.523s3.643 3.477 8.5 3.477 8.5-2.13 8.5-2.13V56.44c-7.26-1.02-13.894-7.502-16.454-14.467-.18.02-.361.03-.546.03Z" fill="#000" fill-opacity=".07"/><path d="M16.697 32.172A5.002 5.002 0 0 0 18 42c.185 0 .367-.01.546-.03-.718-1.955-1.116-3.949-1.116-5.87a46.698 46.698 0 0 1-.733-3.928ZM34.696 56.392C27.951 55.3 21.79 49.53 19.001 43.105L19 43.5c0 5.654 6.267 14.474 9.383 15.487 2.568.835 5.397.657 6.313-2.594Z" fill="#000" fill-opacity=".07"/><rect x="36" y="41" width="3" height="2" rx="1" fill="#000" fill-opacity=".07"/></g><g><rect x="7" y="60" width="40" height="23" rx="9" fill="rgba(224, 90, 51, 1)"/><path d="M17 58h19v3s-5 1-9.5 1-9.5-1-9.5-1v-3Z" fill="rgba(224, 90, 51, 1)"/><path d="M17 58h19v2s-3 1.5-9.5 1.5S17 60 17 60v-2Z" fill="#000" fill-opacity=".2"/><path d="M16.5 59a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2s-5 1-10 1-10-1-10-1Z" fill="rgba(224, 90, 51, 1)"/></g><g><path d="M20.673 28.222v6.018c0 .762-.673 1.761-1.173 2.261-.5.5-2 1.5-2.85 1.5-.848 0-3.539-.451-4.826-2.257-1.287-1.805-.893-11.322 0-13.54.892-2.218 4.183-6.888 8.85-10.452 3.38-2.582 7.665-4.717 12.871-5.345C58.485 3.397 49.218 20.987 46 25.5c-5.5-2-9.5-2.5-16.717-1.518-7.217.983-8.016 1.982-8.61 4.239Z" fill="rgba(27, 11, 71, 1)"/></g><g transform="translate(1)"><path d="M27.93 46a1 1 0 0 1 1-1h9.142a1 1 0 0 1 1 1 5 5 0 0 1-5 5H32.93a5 5 0 0 1-5-5Z" fill="#66253C"/><path d="M35.756 50.708a4.992 4.992 0 0 1-1.684.29H32.93a5 5 0 0 1-4.996-4.8c.764-.285 1.898-.253 3.017-.22.356.01.71.02 1.05.02 2.21 0 4 1.568 4 3.5 0 .426-.087.833-.245 1.21Z" fill="#B03E67"/><path d="M29 45h10v1a1 1 0 0 1-1 1h-8a1 1 0 0 1-1-1v-1Z" fill="#fff"/></g><g transform="translate(0 -1)"><g/><path d="M43 37.5a1.5 1.5 0 0 1-3 0v-1.227c0-.15.122-.273.273-.273h2.454c.15 0 .273.122.273.273V37.5ZM33 37.5a1.5 1.5 0 0 1-3 0v-1.227c0-.15.122-.273.273-.273h2.454c.15 0 .273.122.273.273V37.5Z" fill="rgba(27, 11, 71, 1)"/><path stroke="rgba(27, 11, 71, 1)" stroke-linecap="round" d="M29.5 36.5h4M39.5 36.5h4"/></g><g/><g><g fill="#1B0B47"><path d="M37.5 43c-6.5 1.5-11 2-11 2s1 2.5 3.5 2c2-.4 6-1.333 7.5-2v-2ZM38 43c6 1 10 1.756 10 1.756s-1.119 2.183-3.5 1.744l-.32-.059C42.256 46.088 39.35 45.553 38 45v-2Z"/></g></g></g></svg>`,
    },
  });

  await Promise.all(
    getPosts().map((post) => {
      const data = { posterId: kody.id, ...post };
      return db.post.create({ data });
    })
  );
}

seed();

function getPosts() {
  // shout-out to https://icanhazdadjoke.com/

  return [
    {
      content: `I never wanted to believe that my Dad was stealing from his job as a road worker. But when I got home, all the signs were there.`,
    },
    {
      content: `I was wondering why the frisbee was getting bigger, then it hit me.`,
    },
    {
      content: `Why do trees seem suspicious on sunny days? Dunno, they're just a bit shady.`,
    },
    {
      content: `Why don't skeletons ride roller coasters? They don't have the stomach for it.`,
    },
    {
      content: `Why don't you find hippopotamuses hiding in trees? They're really good at it.`,
    },
    {
      content: `What did one plate say to the other plate? Dinner is on me!`,
    },
    {
      content: `My first time using an elevator was an uplifting experience. The second time let me down.`,
    },
  ];
}
