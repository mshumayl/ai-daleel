import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import React, { type FC } from 'react'


const NavBar: FC = () => {
  const { data: sessionData } = useSession();

  return (
    <div className="bg-slate-200 border-slate-400 border-b border-dashed h-12 items-center w-full flex-row px-2 hidden sm:flex shadow-lg">
        <div className="ml-2 flex flex-row gap-4 w-1/3 font-zilla-slab-italic items-center">
            <Link className="" href="/">
              <svg className="transition-all stroke-emerald-500 fill-emerald-500 hover:stroke-emerald-300 hover:fill-emerald-300 w-10 h-10" xmlns="http://www.w3.org/2000/svg" version="1.0" viewBox="0 0 600 450"><defs><clipPath id="a"><path d="M115.441 314.129h76.102v76.101h-76.102Zm0 0"/></clipPath><clipPath id="b"><path d="M153.492 314.129c-21.015 0-38.05 17.035-38.05 38.05 0 21.016 17.035 38.051 38.05 38.051 21.016 0 38.051-17.035 38.051-38.05 0-21.016-17.035-38.051-38.05-38.051"/></clipPath><clipPath id="c"><path d="M394.219 310.41h76.101v76.106H394.22Zm0 0"/></clipPath><clipPath id="d"><path d="M432.27 310.41c-21.016 0-38.051 17.04-38.051 38.05 0 21.017 17.035 38.056 38.05 38.056 21.016 0 38.051-17.04 38.051-38.055 0-21.012-17.035-38.05-38.05-38.05"/></clipPath><clipPath id="e"><path d="M91.512 130.809h76.101v76.101H91.512Zm0 0"/></clipPath><clipPath id="f"><path d="M129.563 130.809c-21.016 0-38.051 17.035-38.051 38.05 0 21.016 17.035 38.051 38.05 38.051 21.016 0 38.051-17.035 38.051-38.05 0-21.016-17.035-38.051-38.05-38.051"/></clipPath><clipPath id="g"><path d="M426.16 131.559h76.102v76.101H426.16Zm0 0"/></clipPath><clipPath id="h"><path d="M464.21 131.559c-21.015 0-38.05 17.035-38.05 38.05 0 21.016 17.035 38.051 38.05 38.051 21.017 0 38.052-17.035 38.052-38.05 0-21.016-17.035-38.051-38.051-38.051"/></clipPath></defs><path fill="none" strokeLinecap="round" strokeWidth="26" d="m13.002 13 214.447-.001" transform="matrix(1.26912 -.73273 .73406 1.27144 158.187 325.026)"/><path fill="none" strokeLinecap="round" strokeWidth="26" d="M13 13.001 125.39 13" transform="matrix(-1.27877 -.71307 .71501 -1.28225 293.62 285.237)"/><path fill="none" strokeLinecap="round" strokeWidth="51" d="m25.501 25.502 105.922-.003" transform="matrix(-.63736 -.39602 .39582 -.63704 419.292 361.43)"/><path fill="none" strokeLinecap="round" strokeWidth="71" d="m35.5 35.5 280.157.003" transform="matrix(-.64847 -.37615 .37632 -.64876 305.966 200.911)"/><path fill="none" strokeLinecap="round" strokeWidth="71" d="m35.5 35.501 278.988-.002" transform="matrix(.64448 -.38366 .38365 .64445 262.341 155.038)"/><g clipPath="url(#a)"><g clipPath="url(#b)"><path d="M115.441 314.129h76.102v76.101h-76.102Zm0 0"/></g></g><g clipPath="url(#c)"><g clipPath="url(#d)"><path d="M394.219 310.41h76.101v76.106H394.22Zm0 0"/></g></g><g clipPath="url(#e)"><g clipPath="url(#f)"><path d="M91.512 130.809h76.101v76.101H91.512Zm0 0"/></g></g><g clipPath="url(#g)"><g clipPath="url(#h)"><path d="M426.16 131.559h76.102v76.101H426.16Zm0 0"/></g></g></svg>
            </Link>
            <Link className="hover:text-emerald-500" href="/main">Search</Link>
            <Link className="hover:text-emerald-500" href="/savedVerses">Bookmarks</Link>
            {/* <Link className="hover:text-emerald-500" href="/main">Find Daleel</Link> */}
        </div>
        <div className="mr-1 flex gap-4 justify-end w-2/3 font-zilla-slab-italic items-center">
            {(sessionData) ? (<div className="text-xs mr-1">Logged in as {sessionData.user.email}</div>) : (<></>)}
            {/* <Link className="text-xs self-center hover:text-emerald-500 border border-slate-500 px-1 bg-white border-dashed" href="/">LOG OUT</Link> */}
            <button
              className="text-xs self-center rounded-md p-1 bg-slate-100 hover:bg-slate-300 transition-all shadow-inner"
              onClick={sessionData ? () => void signOut() : () => void signIn()}
            >
            {sessionData ? "Sign out" : "Sign in"}
            </button>
        </div>
    </div>
  )
}

export default NavBar;