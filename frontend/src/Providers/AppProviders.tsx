import { FC, PropsWithChildren, useState } from "react"
import { AppContext } from "../contexst/AppContexst";

export const AppProvider: FC<PropsWithChildren> = ({ children}) => {
  const [error, setError] = useState<number>(0);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<{id: number, status: string, username: string}>({id: 0, status: '', username: ''});
  const [shareLink, setShareLink] = useState<string>('')
  const [isFiles, setIsFiles] = useState<boolean>(false)

  const variablies = {error, isLoggedIn, user, shareLink, isFiles}
  const setters = {setError, setIsLoggedIn, setUser, setShareLink, setIsFiles}

  

  return (
    <AppContext.Provider value={{...variablies, ...setters}}>
        {children}
    </ AppContext.Provider>
  )
}
