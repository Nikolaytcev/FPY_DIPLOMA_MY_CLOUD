import { createContext } from "react";

export interface IApp {
    setError: (e: React.SetStateAction<number>) => void,
    setIsLoggedIn: (e: React.SetStateAction<boolean>) => void,
    setShareLink: (e: React.SetStateAction<string>) => void,
    setUser: (e: React.SetStateAction<{id: number, status: string, username: string}>) => void,
    setIsFiles: (e: React.SetStateAction<boolean>) => void,
    error: number,
    isLoggedIn: boolean,
    user: {id: number, status: string, username: string},
    shareLink: string,
    isFiles: boolean
}

const appContext = {
    error: 0,
    isLoggedIn: false,
    user: {id: 0, status: '', username: ''},
    shareLink: '',
    isFiles: false,
    setError: () => {},
    setIsLoggedIn: () => {},
    setUser: () => {},
    setShareLink: () => {},
    setIsFiles: () => {}
}

export const AppContext = createContext<IApp>(appContext);