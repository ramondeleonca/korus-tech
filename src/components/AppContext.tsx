"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useLocalStorage } from "react-use";
import { getMe, verifyToken } from "@/server"
import { useRouter } from "next/navigation";

export type AppContextType = {
    token: string | undefined;
    setToken: (token: string) => void;
    removeToken: () => void;
    userData: Awaited<ReturnType<typeof getMe>> | undefined;
    updateUserData: () => void;
    preventInvalidToken: () => void;
    logOut: () => void;
}
const AppContext = createContext<AppContextType | null>(null);

export type Props = {
    children: any;
}
export default function AppContextProvider(props: Props) {
    const router = useRouter();
    const [token, setToken, removeToken] = useLocalStorage<string>("token");
    const [userDataCache, setUserDataCache, removeUserDataCache] = useLocalStorage<AppContextType["userData"]>("userDataCache");

    const [userData, setUserData] = useState<AppContextType["userData"]>();
    useEffect(() => {if (userDataCache) setUserData(userDataCache)}, [userDataCache]);
    const updateUserData = async () => {
        if (token) {
            const result = await getMe(token);
            if (result.success) {
                setUserData(result);
                setUserDataCache(result);
            };
        }
    }
    useEffect(() => {updateUserData()}, [token]);

    const preventInvalidToken = async () => {
        if (!token || !(await verifyToken(token)).success) router.push("/login");
    }

    const logOut = () => {
        removeToken();
        removeUserDataCache();
        setUserData(undefined);
        router.push("/login");
    }
    
    return (
        <AppContext.Provider value={{
            token,
            setToken,
            removeToken,
            userData,
            updateUserData,
            preventInvalidToken,
            logOut
        }}>
            {props.children}
        </AppContext.Provider>
    )
}

export function useAppContext() {
    const ctx = useContext(AppContext);
    return ctx;
}