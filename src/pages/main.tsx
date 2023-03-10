import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

import { api } from "~/utils/api";
import PromptInput from "~/components/PromptInput";
import { FormEvent, useEffect, useState } from "react";

const Main: NextPage = () => {


  return (
    <>
      <Head>
        <title>Albaab</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen w-screen flex-row pt-2 items-start justify-center bg-slate-100">
        <div className="flex flex-col w-full items-center justify-center gap-2 px-4 py-16 ">
          <div className="text-3xl">
            Albaab
          </div>
          <div className="text-center">
            AI-powered al-Quran summarization
          </div>
          <div className="mt-10 md:p-10 w-full md:w-2/3 flex flex-col items-center">
              <PromptInput/>
          </div>
        </div>
      </main>
    </>
  );
};

export default Main;
