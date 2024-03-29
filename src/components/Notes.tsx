/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type Session } from 'next-auth';
import { useSession } from 'next-auth/react';
import React, { useState, useEffect, type FC, type FormEvent, useRef } from 'react'
import { api } from '~/utils/api';
import Toaster from './Toaster';

interface NotesProps {
    userId: string;
    verseId: string;
    verseTranslation: string;
}

interface AIGenerateNoteButtonProps {
  setNewNoteValueCallback: React.Dispatch<React.SetStateAction<string>>;
  setToasterResultCallback: React.Dispatch<React.SetStateAction<string>>;
  setToasterMessageCallback: React.Dispatch<React.SetStateAction<string>>;
  verseId: string;
  verseTranslation: string;
  session: Session | null;
  
}

type savedNoteType = {
  id?: string,
  note?: string,
  saveTime?: Date
}[]

const SubmitNoteButton: FC = () => {
  return (
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    <button className="m-1 w-16 mr-2 bg-emerald-300 hover:bg-emerald-400 border border-dashed border-emerald-600 transition-all grid justify-items-center items-center rounded-md " type="submit">
        <svg className="w-5 stroke-white stroke-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" ><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5"/></svg>
    </button>
  )
}

const AIGenerateNoteButton: FC<AIGenerateNoteButtonProps> = ({ 
  setNewNoteValueCallback,
  setToasterResultCallback,
  setToasterMessageCallback,
  verseId, 
  verseTranslation, 
  session }) => {

  const [ AiGenerateNoteLoader, setAiGenerateNoteLoader ] = useState(false);
  const [surahNumber, verseNumber] = verseId.split("_");

  let res: { result: string; message?: string, data?: string };

  const aiGenerateNoteApi = api.openai.generateNote.useMutation();

  const handleAiGenerate = async () => {

    setAiGenerateNoteLoader((previous) => !previous)
    
    if (session?.user?.generateQuota && session?.user?.generateQuota > 0) {
      //Fetch
      if (surahNumber && verseNumber) {
        res = await aiGenerateNoteApi.mutateAsync({ surahNumber: surahNumber, verseNumber: verseNumber, verseTranslation: verseTranslation })
      }

      if (res.result === "AI_RESPONSE_RECEIVED" && res.data && res.message) {
        
        setNewNoteValueCallback(res.data)

        setToasterResultCallback(res.result);
        setToasterMessageCallback(res.message);
      
      } else if (res.result === "OUT_OF_GENERATE_QUOTA" && res.message) {

        setToasterResultCallback(res.result);
        setToasterMessageCallback(res.message);
        console.log(res.result, res.message);
        //Consider triggering modal here.

      } else if (res.result && res.message) {

        setToasterResultCallback(res.result);
        setToasterMessageCallback(res.message);
        console.log(res.result, res.message)

      }

    } else {

      const result = "NO_GENERATE_QUOTA"
      const message = "You have run out of AI Generate quota."
      setToasterResultCallback(result);
      setToasterMessageCallback(message);

      setNewNoteValueCallback("")
    
    }

    setAiGenerateNoteLoader((previous) => !previous)

    //FUTURE: TODO: Store this returned message in the database to avoid redundant OpenAI calls.
  }

  return (
    (AiGenerateNoteLoader) 
    // (true)
    ? (<div className="grid items-center align-center justify-center justify-items-center">
        <svg className="w-5 h-5 m-1 stroke-emerald-400 stroke-2 animate-spin" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 22c5.421 0 10-4.579 10-10h-2c0 4.337-3.663 8-8 8s-8-3.663-8-8c0-4.336 3.663-8 8-8V2C6.579 2 2 6.58 2 12c0 5.421 4.579 10 10 10z"/></svg>
      </div>)
    : (<button className="m-1 w-max py-1 px-2 text-white bg-purple-300 hover:bg-purple-400 border border-dashed border-purple-600 
    mr-2 transition-all grid grid-cols-2 justify-items-center items-center rounded-md" onClick={handleAiGenerate}>
        <div className="font-jost tracking-widest">AI</div>
        <svg className="w-5 h-5 stroke-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"/></svg>
    </button>)
  )
}

const Notes: FC<NotesProps> = ({ userId, verseId, verseTranslation }) => {

  const [ savedNoteValue, setSavedNoteValue ] = useState<savedNoteType>([{}]);
  const [ newNoteValue, setNewNoteValue ] = useState(""); //This is used to decide whether or not to render submit button
  const [toasterResult, setToasterResult] = useState<string>("");
  const [toasterMessage, setToasterMessage] = useState<string>("");
  const newNoteRef = useRef<HTMLFormElement>(null);

  const { data: session } = useSession();

  let snippetId = "";

  const snippet = api.db.getSnippetId.useQuery({ userId: userId, verseId: verseId  }).data

  if (snippet !== undefined) {
    snippetId = snippet[0]?.id ?? ""; //Assign to "" if indexed array is undefined
  }

  const getNotesApi = api.db.getNotes.useMutation()
  
  //Reset toaster after timeout
  useEffect(() => {
    console.log(toasterResult)
    if (toasterResult !== "") {
      const timeout = setTimeout(() => {
        setToasterResult("")
      }, 4000)
      return () => clearTimeout(timeout)
    }
  }, [toasterResult])

  //This useEffect runs on page load. A function will useQuery to get all saved notes.
  //If result set is not empty, update savedNoteValue with result set.
  useEffect(() => {

    //This async function is required as await can only be run inside an async function, but useEffect cannot be async.
    async function getNotesFetcher() {
      const dbNotes = await getNotesApi.mutateAsync({ userId: userId, snippetId: snippetId })
      
      if ( dbNotes?.result === "NOTES_RETRIEVED" ) {
          const contents = dbNotes?.data?.map(({ id, content, createdAt }) => {
            return { id: id, note: content, saveTime: createdAt }
          })

          if (contents !== undefined) {
            setSavedNoteValue(contents)
          }
      }
    }

    void getNotesFetcher();
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [snippetId])


  const submitNoteApi = api.db.addNote.useMutation();

  const handleNewNote = async (event: FormEvent) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    event.preventDefault();

    if (newNoteValue !== "") {
      //Append newNoteValue to savedNoteValue array
      setSavedNoteValue(previous => [...previous, {note: newNoteValue}])

      if (newNoteRef.current !== null) {
        console.log("newNoteRef")
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        newNoteRef.current.reset();
        setNewNoteValue("");
      }

      //Send newNoteValue to addNote API (which is possible as the procedure can defined first before running mutateAsync.)
      const res = await submitNoteApi.mutateAsync({ 
        userId: userId, 
        snippetId: snippetId,
        verseId: verseId, 
        content: newNoteValue 
      });
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      console.log(res)
      
      //This async function is required as await can only be run inside an async function, but useEffect cannot be async.
      //This is the exact same function used in the useEffect above. It is used here to refetch the content with date and ID.
      async function getNotesFetcher() {
        const dbNotes = await getNotesApi.mutateAsync({ userId: userId, snippetId: snippetId })
        
        if (dbNotes?.result === "NOTES_RETRIEVED") {
            const contents = dbNotes?.data?.map(({ id, content, createdAt }) => {
              return { id: id, note: content, saveTime: createdAt }
            })

            if (contents !== undefined) {
              setSavedNoteValue(contents)
            }
        } 
      }

      if (res.result === "OUT_OF_BOOKMARK_QUOTA" && res.message) {
        //Remove last value
        const originalArray = savedNoteValue.slice(0, savedNoteValue.length - 1)
        console.log("savedNoteValue", savedNoteValue)
        console.log("originalArray", originalArray)
        setSavedNoteValue([...originalArray])
        
        setToasterResult(res.result);
        setToasterMessage(res.message);

        //set Toast
        console.log("Toast message: ", res?.message)
      } else {
        void getNotesFetcher();
      }

    }
  }

  const deleteNoteApi = api.db.deleteNote.useMutation();

  const handleDeleteNote = async (event: React.MouseEvent<HTMLElement>) => {

    const eventTarget = event.target as HTMLElement;

    //WARNING: This needs to be changed if the structure of the notes card changes in any way. Good thing to add to a test module.
    const noteId = eventTarget?.parentElement?.parentElement?.parentElement?.id

    //Related to getNotesFetcher, we can manually remove the selected element from the savedNoteValue array.
    //This gives the impression of a faster feedback to the user.
    setSavedNoteValue((current) =>
      current.filter((element) => element.id !== noteId)
    );

    if (noteId) {
      const res = await deleteNoteApi.mutateAsync({ noteId: noteId })
      console.log(res)
    } else {
      console.log("Please reload and retry deleting.")
    }

    //This async function is required as await can only be run inside an async function, but useEffect cannot be async.
    //This is the exact same function used in the useEffect above. It is used here to refetch the content with date and ID.
    //The tweak here is that we pass an else clause if result is "NO_SAVED_NOTES", as we want to also re-render if all notes have been deleted.
    async function getNotesFetcher() {
      const dbNotes = await getNotesApi.mutateAsync({ userId: userId, snippetId: snippetId })
      
      if ( dbNotes?.result === "NOTES_RETRIEVED" ) {
          const contents = dbNotes?.data?.map(({ id, content, createdAt }) => {
            return { id: id, note: content, saveTime: createdAt }
          })

          if (contents !== undefined) {
            setSavedNoteValue(contents)
          }

      } else if ( dbNotes?.result === "NO_SAVED_NOTES") {
        setSavedNoteValue([{}])
      }
    }
    void getNotesFetcher();
  }

  return (
    <div className="w-full min-h-screen">
        <div className="w-full min-h-fit font-jost text-slate-600 text-xl ml-2 mb-2">
          My Notes
        </div>
        <form ref={newNoteRef} onSubmit={handleNewNote}>
          <div className="w-full bg-white rounded-xl shadow-inner border border-dashed border-slate-400 items-center p-2">
              <textarea name="noteInput" className="h-20 appearance-none resize-none w-full outline-none" placeholder={`Add note...`} value={newNoteValue} onChange={(event) => {
                  setNewNoteValue(event.target.value);
                }}>
              </textarea>
              <div className="content-end h-7 grid justify-items-end">
                {(newNoteValue.length === 0) 
                && (<AIGenerateNoteButton 
                setNewNoteValueCallback={setNewNoteValue}
                setToasterResultCallback={setToasterResult}
                setToasterMessageCallback={setToasterMessage}
                verseId={verseId} 
                verseTranslation={verseTranslation}
                session={session}/>)}
              </div>
          </div>
          <div className="h-7 grid justify-items-end">
              {(newNoteValue.length > 0) 
              && (<SubmitNoteButton/>)}
          </div>
        </form>
        <div className="w-full md:columns-2 lg:columns-3 items-baseline h-max mt-5 overflow-visible md:items-center md:align-top">
          {savedNoteValue.map(({ id, note, saveTime }) => {
            if (note !== undefined) { //This is required because the first element of savedNoteValue is empty (If there is no fetch)
              return (
              <div className="break-inside-avoid flex flex-col mb-2 py-2 px-3 align-center text-sm rounded-md 
              bg-slate-200 hover:border-slate-400 hover:shadow-sm
              shadow-inner border border-dashed border-slate-300 text-slate-500 transition-all" id={id} key={id}>
                <div>{note}</div>
                <div className="flex flex-row items-center mt-1 justify-between">
                  <div className="w-fit p-0.5 -mx-1 rounded-md text-xs text-slate-400 italic justify-start">{saveTime?.toLocaleString("en-GB")}</div>
                  <div onClick={handleDeleteNote} className="hover:cursor-pointer">
                    <svg className="w-5 h-5 stroke-slate-300 hover:stroke-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" ><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12"/></svg>
                  </div>
                </div>
              </div>)
            }
          })}
        </div>
        <div className="z-50">
          <Toaster status={toasterResult} message={toasterMessage}/>
        </div>
    </div>
  )
}

export default Notes;