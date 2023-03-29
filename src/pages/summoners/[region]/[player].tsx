import React from "react";
import { GetServerSideProps } from "next";

type Props = {
  region: string;
  player: string;
};

export default function Player(props: Props) {
  return <div>[player]</div>;
}

export const getServerSideProps: GetServerSideProps = async context => {
  const { regionId, player } = context.query;

  // gets basic information about the player.. like their puuid, name, profileIconId, level, etc.
  const res = await fetch(
    `https://${regionId}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${player}?api_key=${process.env.RIOT_API_KEY}`
  );
  const basicPlayerInfo = await res.json();

  let route = "";
  switch (regionId) {
    case "na1":
    case "br1":
    case "la1":
    case "la2":
      route = "americas";
      break;
    case "kr":
    case "kp1":
      route = "asia";
      break;
    case "eun1":
    case "euw1":
    case "tr1":
    case "ru":
      route = "europe";
      break;
    default:
      break;
  }

  // gets the last x matches the player played
  const res2 = await fetch(
    `https://${route}.api.riotgames.com/lol/match/v5/matches/by-puuid/${basicPlayerInfo.puuid}/ids?count=5&api_key=${process.env.RIOT_API_KEY}`
  );
  const xMatchesId = (await res2.json()) as string[];

  const matches = await Promise.all(
    xMatchesId.map(async matchId => {
      const res3 = await fetch(
        `https://${route}.api.riotgames.com/lol/match/v5/matches/${matchId}?api_key=${process.env.RIOT_API_KEY}`
      );
      const match = await res3.json();

      return match;
    })
  );

  return {
    props: {
      basicPlayerInfo,
      matches
    }
  };
};
