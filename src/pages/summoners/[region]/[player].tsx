import React from "react";
import Head from "next/head";
import Image from "next/image";
import { GetServerSideProps } from "next";

const patch = "13.6.1";

type Props = {
  basicPlayerInfo: {
    name: string;
    profileIconId: number;
    summonerLevel: number;
    puuid: string;
  };
  extraPlayerInfo: [
    {
      tier: string;
      rank: string;
      leaguePoints: number;
      wins: number;
      losses: number;
    }
  ];
  matches: [
    {
      info: {
        gameCreation: number;
        gameDuration: number;
        gameMode: string;
        gameStartTimestamp: number;
        gameEndTimestamp: number;
        participants: [
          {
            championName: string;
            championLevel: number;
            summonerName: string;
            kills: number;
            deaths: number;
            assists: number;
            profileIcon: number;
            win: boolean;
          }
        ];
        teams: [
          {
            bans: string[];
            objectives: object;
            teamId: number;
            win: boolean;
          }
        ];
      };
    }
  ];
};

export default function Player(props: Props) {
  const { basicPlayerInfo, extraPlayerInfo, matches } = props;

  console.log(matches);

  function winrate() {
    return (
      (extraPlayerInfo[0].wins /
        (extraPlayerInfo[0].wins + extraPlayerInfo[0].losses)) *
      100
    ).toFixed(0);
  }

  function findPlayer(participants: any) {
    const player = participants.find(
      (participant: any) => participant.puuid === basicPlayerInfo.puuid
    );

    return player;
  }

  function gameEndedAgo(time: number) {
    const now = new Date().getTime();
    const difference = now - time;

    const seconds = difference / 1000;
    const minutes = seconds / 60;
    const hours = minutes / 60;
    const days = hours / 24;

    if (seconds >= 0 && seconds < 60) {
      return `${Math.floor(seconds)} seconds ago`;
    } else if (minutes >= 1 && minutes < 60) {
      return `${Math.floor(minutes)} minutes ago`;
    } else if (hours >= 1 && hours < 2) {
      return `an hour ago`;
    } else if (hours >= 2 && hours < 24) {
      return `${Math.floor(hours)} hours ago`;
    } else if (days >= 1 && days < 2) {
      return `a day ago`;
    } else if (days >= 2) {
      return `${Math.floor(days)} days ago`;
    }
  }

  function gameDuration(start: number, end: number) {
    const gameLength = end - start;
    const lengthInMinutes = Math.floor(gameLength / 1000 / 60);
    const lengthInSeconds = Math.floor((gameLength / 1000) % 60);

    return `${lengthInMinutes}m ${lengthInSeconds}s`;
  }

  function getSummonerSpell(spell: number) {
    switch (spell) {
      case 1:
        return "SummonerBoost";
      case 3:
        return "SummonerExhaust";
      case 4:
        return "SummonerFlash";
      case 6:
        return "SummonerHaste";
      case 7:
        return "SummonerHeal";
      case 11:
        return "SummonerSmite";
      case 12:
        return "SummonerTeleport";
      case 13:
        return "SummonerMana";
      case 14:
        return "SummonerDot";
      case 21:
        return "SummonerBarrier";
      case 30:
        return "SummonerPoroRecall";
      case 31:
        return "SummonerPoroThrow";
      case 32:
        return "SummonerSnowball";
      case 39:
        return "SummonerSnowURFSnowball_Mark";
      default:
        return "SummonerBoost";
    }
  }

  function getRunes(rune: number) {
    let runeName = "";
    switch (rune) {
      case 8000:
        runeName = "7201_Precision";
        break;
      case 8100:
        runeName = "7200_Domination";
        break;
      case 8200:
        runeName = "7202_Sorcery";
        break;
      case 8300:
        runeName = "7203_Whimsy";
        break;
      case 8400:
        runeName = "7204_Resolve";
        break;
      case 8112:
        runeName = "Domination/Electrocute/Electrocute";
        break;
      case 8124:
        runeName = "Domination/Predator/Predator";
        break;
      case 8128:
        runeName = "Domination/DarkHarvest/DarkHarvest";
        break;
      case 9923:
        runeName = "Domination/HailOfBlades/HailOfBlades";
        break;
      case 8351:
        runeName = "Inspiration/GlacialAugment/GlacialAugment";
        break;
      case 8360:
        runeName = "Inspiration/UnsealedSpellbook/UnsealedSpellbook";
        break;
      case 8369:
        runeName = "Inspiration/FirstStrike/FirstStrike";
        break;
      case 8005:
        runeName = "Precision/PressTheAttack/PressTheAttack";
        break;
      case 8008:
        runeName = "Precision/LethalTempo/LethalTempoTemp";
        break;
      case 8021:
        runeName = "Precision/FleetFootwork/FleetFootwork";
        break;
      case 8010:
        runeName = "Precision/Conqueror/Conqueror";
        break;
      case 8437:
        runeName = "Resolve/GraspOfTheUndying/GraspOfTheUndying";
        break;
      case 8439:
        runeName = "Resolve/VeteranAftershock/VeteranAftershock";
        break;
      case 8465:
        runeName = "Resolve/Guardian/Guardian";
        break;
      case 8214:
        runeName = "Sorcery/SummonAery/SummonAery";
        break;
      case 8229:
        runeName = "Sorcery/ArcaneComet/ArcaneComet";
        break;
      case 8230:
        runeName = "Sorcery/PhaseRush/PhaseRush";
        break;
      default:
        runeName = "RunesIcon";
        break;
    }

    return runeName;
  }

  function getKda(player: any) {
    const kda = (player.kills + player.assists) / player.deaths;

    return kda.toFixed(2);
  }

  function getMultiKill(player: any) {
    if (player.pentaKills >= 1) {
      return "Penta Kill";
    } else if (player.quadraKills >= 1) {
      return "Quadra Kill";
    } else if (player.tripleKills >= 1) {
      return "Triple Kill";
    } else if (player.doubleKills >= 1) {
      return "Double Kill";
    } else {
      return "";
    }
  }

  function getAverageCs(info: any, player: any) {
    const cs = player.totalMinionsKilled + player.neutralMinionsKilled;
    const averageCs = cs / (info.gameDuration / 60);

    return averageCs.toFixed(1);
  }

  function getKillPercent(teamArray: any, player: any) {
    const currentTeam = teamArray.filter(
      (team: any) => team.teamId === player.teamId
    );

    const totalTeamKills = currentTeam[0].objectives.champion.kills;
    const playerTakedowns = player.kills + player.assists;
    const killPercent = (playerTakedowns / totalTeamKills) * 100;

    return killPercent.toFixed(0);
  }

  return (
    <>
      <Head>
        <title>LoL Nexus</title>
        <meta
          name="description"
          content="Generated by create next app"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
        <link
          rel="icon"
          href="/favicon.ico"
        />
      </Head>
      <div className="h-screen w-screen overflow-hidden bg-[url('../assets/images/homepage-background-image.jpg')] bg-cover bg-center bg-no-repeat">
        <div className="flex h-full w-full flex-col items-center bg-white bg-opacity-50">
          <section className="mb-10 flex h-[140px] rounded border border-white bg-violet-500/50 text-gray-100">
            <div className="m-4 mt-4">
              <Image
                src={`http://ddragon.leagueoflegends.com/cdn/${patch}/img/profileicon/${basicPlayerInfo.profileIconId}.png`}
                width={100}
                height={100}
                alt="Profile Icon"
                className="rounded-2xl shadow"
              />
              <span className="relative left-[34px] bottom-[14px] rounded-2xl bg-violet-500 py-1 px-2 text-xs shadow">
                {basicPlayerInfo.summonerLevel}
              </span>
            </div>
            <div className="m-3">
              <p className="text-lg font-bold">{basicPlayerInfo.name}</p>
              <p>{`${extraPlayerInfo[0].tier} ${extraPlayerInfo[0].rank} ${extraPlayerInfo[0].leaguePoints} LP`}</p>
              <p>{`${extraPlayerInfo[0].wins}W ${extraPlayerInfo[0].losses}L`}</p>
              <p>{`Win Rate ${winrate()}%`}</p>
            </div>
          </section>

          <section className="border border-white bg-violet-500/50 p-2">
            {matches.map((match, index) => {
              const player = findPlayer(match.info.participants);
              const timeAgo = gameEndedAgo(match.info.gameEndTimestamp);
              const isWin = player.win ? "Victory" : "Defeat";

              const gameLength = gameDuration(
                match.info.gameStartTimestamp,
                match.info.gameEndTimestamp
              );

              const runeSelection = player.perks.styles;
              const rune1 = getRunes(runeSelection[0].selections[0].perk);
              const rune2 = getRunes(runeSelection[1].style);

              const multikill = getMultiKill(player);
              const averageCs = getAverageCs(match.info, player);
              const killPercent = getKillPercent(match.info.teams, player);

              const itemList = [
                player.item0,
                player.item1,
                player.item2,
                player.item3,
                player.item4,
                player.item5,
                player.item6
              ];

              return (
                <div
                  key={index}
                  className={`${
                    player.win ? "bg-blue-200/70" : "bg-red-200/70"
                  } mb-2 flex rounded last:mb-0`}
                >
                  <div
                    className={`${
                      player.win ? "bg-blue-700" : "bg-red-700"
                    } w-1.5 rounded-l`}
                  />
                  <div className="my-auto w-[150px] p-2">
                    <p
                      className={`${
                        player.win ? "text-blue-700" : "text-red-700"
                      } font-bold`}
                    >
                      {match.info.gameMode}
                    </p>
                    <p className="relative bottom-1 text-sm text-gray-700">
                      {timeAgo}
                    </p>
                    <div className="mt-1 mb-1 h-[1px] w-11 bg-gray-100" />
                    <p className="font-bold text-gray-700">{isWin}</p>
                    <p className="relative bottom-1 text-sm text-gray-700">
                      {gameLength}
                    </p>
                  </div>

                  <div className="my-auto">
                    <div className="flex">
                      <Image
                        src={`http://ddragon.leagueoflegends.com/cdn/${patch}/img/champion/${player.championName}.png`}
                        width={50}
                        height={50}
                        alt="Champion Icon"
                        className="rounded-full shadow"
                      />
                      <span className="relative top-[30px] right-5 flex h-5 w-5 items-center justify-center rounded-full bg-slate-700 text-center text-xs text-white">
                        {player.champLevel}
                      </span>

                      <div className="relative right-4 mr-5 flex">
                        <section>
                          <Image
                            src={`http://ddragon.leagueoflegends.com/cdn/13.6.1/img/spell/${getSummonerSpell(
                              player.summoner1Id
                            )}.png`}
                            width={23.5}
                            height={23.5}
                            alt="Summoner Spell 1"
                            className="mb-0.5 rounded shadow"
                          />
                          <Image
                            src={`http://ddragon.leagueoflegends.com/cdn/13.6.1/img/spell/${getSummonerSpell(
                              player.summoner2Id
                            )}.png`}
                            width={23.5}
                            height={23.5}
                            alt="Summoner Spell 2"
                            className="rounded shadow"
                          />
                        </section>
                        <section className="ml-1">
                          <Image
                            src={require(`../../../assets/perk-images/Styles/${rune1}.png`)}
                            width={23.5}
                            height={23.5}
                            alt="Rune 1"
                            className="mb-0.5 rounded-full bg-black"
                          />
                          <Image
                            src={require(`../../../assets/perk-images/Styles/${rune2}.png`)}
                            width={23.5}
                            height={23.5}
                            alt="Rune 2"
                            className="rounded"
                          />
                        </section>
                        <section className="ml-3 flex flex-col justify-center text-sm text-gray-900">
                          <p className="w-[75px]">
                            {`${player.kills} / ${player.deaths} / ${player.assists}`}
                          </p>
                          <p className="text-xs text-gray-700">{`${getKda(
                            player
                          )}:1 KDA`}</p>
                        </section>
                      </div>
                    </div>

                    <div className="mt-3 flex">
                      {itemList.map((item, index) =>
                        item !== 0 ? (
                          <Image
                            key={index}
                            src={`http://ddragon.leagueoflegends.com/cdn/${patch}/img/item/${item}.png`}
                            width={23.5}
                            height={23.5}
                            alt={`Item ${index + 1}`}
                            className={`mr-0.5 ${
                              index === 6 ? "rounded-full" : "rounded"
                            }`}
                          />
                        ) : (
                          <div
                            key={index}
                            className={`${
                              player.win ? "bg-blue-500" : "bg-red-500"
                            } mr-0.5 h-[23.5px] w-[23.5px] ${
                              index === 6 ? "rounded-full" : "rounded"
                            }`}
                          />
                        )
                      )}
                    </div>
                  </div>
                  <div className="mt-3 flex flex-col">
                    <div className="flex flex-col justify-center border border-transparent border-l-white pl-2">
                      <p className="text-xs text-gray-700">{`P/Kill ${killPercent}%`}</p>
                      <p className="text-xs text-gray-700">{`Control Ward ${player.visionWardsBoughtInGame}`}</p>
                      <p className="text-xs text-gray-700">
                        {`CS ${player.totalMinionsKilled} (${averageCs})`}
                      </p>
                    </div>

                    <p className="relative top-3.5 right-7 rounded-full bg-red-500 text-center text-sm text-white">
                      {multikill}
                    </p>
                  </div>

                  <div className="my-auto ml-7 flex">
                    <div
                      id="team1"
                      className="flex w-[150px] flex-col"
                    >
                      {match.info.participants.map((participant, index) => {
                        if (index < 5) {
                          return (
                            <div
                              className="flex py-0.5"
                              key={index}
                            >
                              <Image
                                src={`http://ddragon.leagueoflegends.com/cdn/${patch}/img/champion/${participant.championName}.png`}
                                width={15}
                                height={15}
                                alt="Champion"
                                className="rounded"
                              />
                              <span
                                className={`${
                                  player.summonerName ===
                                  participant.summonerName
                                    ? "font-bold"
                                    : ""
                                } ml-1 text-xs text-gray-700`}
                              >
                                {participant.summonerName}
                              </span>
                            </div>
                          );
                        }
                      })}
                    </div>
                    <div
                      id="team2"
                      className="flex w-[150px] flex-col"
                    >
                      {match.info.participants.map((participant, index) => {
                        if (index > 4) {
                          return (
                            <div
                              className="flex py-0.5"
                              key={index}
                            >
                              <Image
                                src={`http://ddragon.leagueoflegends.com/cdn/${patch}/img/champion/${participant.championName}.png`}
                                width={15}
                                height={15}
                                alt="Champion"
                                className="rounded"
                              />
                              <span
                                className={`${
                                  player.summonerName ===
                                  participant.summonerName
                                    ? "font-bold"
                                    : ""
                                } ml-1 text-xs text-gray-700`}
                              >
                                {participant.summonerName}
                              </span>
                            </div>
                          );
                        }
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </section>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async context => {
  const { regionId, player } = context.query;

  // gets basic information about the player.. like their puuid, name, profileIconId, level, etc.
  const res = await fetch(
    `https://${regionId}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${player}?api_key=${process.env.RIOT_API_KEY}`
  );
  const basicPlayerInfo = await res.json();

  // gets extra information about the player.. like their rank, wins, losses, etc.
  const res2 = await fetch(
    `https://${regionId}.api.riotgames.com/lol/league/v4/entries/by-summoner/${basicPlayerInfo.id}?api_key=${process.env.RIOT_API_KEY}`
  );
  const extraPlayerInfo = await res2.json();

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
  const res3 = await fetch(
    `https://${route}.api.riotgames.com/lol/match/v5/matches/by-puuid/${basicPlayerInfo.puuid}/ids?count=5&api_key=${process.env.RIOT_API_KEY}`
  );
  const xMatchesId = await res3.json();

  const matches = await Promise.all(
    xMatchesId.map(async (matchId: any) => {
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
      extraPlayerInfo,
      matches
    }
  };
};
