import { type NextPage } from "next";
import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";
import ScrollContainer from "react-indiana-drag-scroll";
import { useEffect, useState, useRef } from "react";

import { api } from "@/utils/api";
import { cn } from "@/utils/utils";
import useScrollPosition from "@/hooks/useScrollPosition";
import { BillboardChartDatum } from "@/server/api/routers/charts";

const Home: NextPage = () => {
  const { x, ref: scrollContainerRef } = useScrollPosition<HTMLElement>();
  const chartsQuery = api.charts.getTopBillboardsChartsData.useQuery();
  const { data: charts = [] } = chartsQuery;

  let currentPosition: number | undefined = undefined;
  if (scrollContainerRef.current) {
    currentPosition = Math.floor((x - 144) / 288) + 1;
  }

  const currSong =
    typeof currentPosition !== "undefined"
      ? charts.at(currentPosition)
      : undefined;

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    el.scrollLeft = el.scrollWidth;
  }, [scrollContainerRef, charts]);

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <nav className="h-[64px] w-full bg-white/50"></nav>
        <ScrollContainer
          innerRef={scrollContainerRef}
          className="flex w-screen flex-1 items-center overflow-x-scroll py-16 text-white"
        >
          <div className="absolute left-1/2 top-1/2 z-[99999999] mt-2 flex h-80 w-80 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-end rounded-xl border-8 shadow-lg">
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                version="1.0"
                viewBox="0 0 1280.000000 1130.000000"
                preserveAspectRatio="xMidYMid meet"
                className="-mb-3 h-10 w-10 fill-white"
              >
                <metadata>
                  Created by potrace 1.15, written by Peter Selinger 2001-2017
                </metadata>
                <g
                  transform="translate(0.000000,1130.000000) scale(0.100000,-0.100000)"
                  fill="currentColor"
                  stroke="none"
                >
                  <path d="M6223 11238 c-13 -6 -36 -32 -52 -57 -16 -25 -510 -878 -1099 -1896 -1218 -2107 -2695 -4661 -4078 -7050 -766 -1325 -949 -1648 -952 -1681 -3 -35 1 -47 26 -75 l30 -34 6172 0 6172 0 29 33 c52 58 46 78 -104 337 -74 127 -492 849 -929 1605 -2253 3896 -5066 8758 -5078 8776 -29 47 -90 65 -137 42z" />
                </g>
              </svg>
            </>
          </div>
          <div
            className="h-72 flex-shrink-0"
            style={{
              width: "calc(50vw - 144px)",
              //                typeof window === "undefined" ? 0 : window.innerWidth / 2 - 144,
            }}
          />
          {charts.map((weekData, i) => {
            const active = i === currentPosition;
            return (
              <div
                key={i}
                className={cn(
                  "flex h-72 w-72 flex-shrink-0 flex-col items-center justify-center border-2 p-10 duration-300",
                  active ? "border-red-500" : "border-gray-400"
                )}
              >
                <div className="font-bold">{weekData.song}</div>
                <div>{weekData.artist}</div>
                <div>Weeks on Board: {weekData.weeksOnBoard}</div>
              </div>
            );
          })}
          <div
            className="h-72 flex-shrink-0"
            style={{
              width: "calc(50vw - 144px)",
            }}
          />
        </ScrollContainer>
        <div className="h-12">{currSong?.song}</div>
      </main>
    </>
  );
};

export default Home;

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();

  const { data: secretMessage } = api.example.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined }
  );

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
        {secretMessage && <span> - {secretMessage}</span>}
      </p>
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};
