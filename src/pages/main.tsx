import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { GetSessionParams, signIn, signOut, useSession } from "next-auth/react";

import { api } from "~/utils/api";
import PromptInput from "~/components/PromptInput";


import { getSession } from "next-auth/react"
import NavBar from "~/components/NavBar";
import MobileNavBar from "~/components/MobileNavBar";

export async function getServerSideProps(context: GetSessionParams | undefined) {
  const session = await getSession(context)

  if (!session) {
    return {
      redirect: {
        destination: 'auth/signin',
        permanent: false,
      },
    }
  }

  return {
    props: { session }
  }
}

const Main: NextPage = () => {


  return (
    <>
      <Head>
        <title>AI-Daleel</title>
        <meta name="description" content="AI-powered al-Quran daleel search" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col min-h-screen items-center bg-slate-100">
        <NavBar/><MobileNavBar/>
        <Link className="flex w-full ml-3 text-slate-600 font-zilla-slab-italic" href="/">Back</Link>
        <div className="flex flex-col w-full items-center gap-2 px-4 py-16">
          <div className="font-righteous text-3xl md:text-6xl">
            AI-Daleel
          </div>
          <div className="text-center text-sm md:text-md font-zilla-slab-italic">
            AI-powered al-Quran daleel search
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
