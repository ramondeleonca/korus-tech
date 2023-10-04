"use client";

import SearchRounded from "@mui/icons-material/SearchRounded";
import TextField from "@mui/material/TextField";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import Lottie from "react-lottie-player";
import burgerMenu from "@/../public/lottie/burgerMenu.json";
import { useAppContext } from "../AppContext";
import Link from "next/link";

type Props = {
    onBurgerMenuOpen?: () => void;
    onBurgerMenuClose?: () => void;
}
export default function AppHeader(props: Props) {
    const ctx = useAppContext();
    const router = useRouter();
    const [query, setQuery] = useState<string>("");
    const [burgerMenuPlaying, setBurgerMenuPlaying] = useState<boolean>(false);
    const [burgerMenuDirection, setBurgerMenuDirection] = useState<1 | -1>(-1);
    const [burgerMenuOpen, setBurgerMenuOpen] = useState<boolean>(false);
    const [userInfoOpen, setUserInfoOpen] = useState<boolean>(false);
    
    const onBurgerMenuClick = () => {
        setBurgerMenuOpen(val => !val);
        setBurgerMenuPlaying(true);
        setBurgerMenuDirection(val => val === 1 ? -1 : 1);
    }

    const onSubmit = (ev: FormEvent<HTMLFormElement>) => {
        ev.preventDefault();
        if (query && query.length) router.push(`/search?q=${encodeURIComponent(query)}`);
    }

    useEffect(() => {
        if (burgerMenuOpen && props.onBurgerMenuOpen) props.onBurgerMenuOpen();
        else if (!burgerMenuOpen && props.onBurgerMenuClose) props.onBurgerMenuClose(); 
    }, [burgerMenuOpen]);

    return (
        <div className="fixed top-0 left-0 w-full h-fit flex items-center justify-center px-8 py-4">
            <button className="unstyled p-0 mr-auto transition-transform duration-150 hover:scale-110 active:scale-90 z-[9999]" onClick={onBurgerMenuClick}>
                <Lottie className="aspect-square w-12" speed={2} direction={burgerMenuDirection} play={burgerMenuPlaying} onAnimationEnd={() => setBurgerMenuPlaying(false)} animationData={burgerMenu} loop={false}></Lottie>
            </button>

            <form onSubmit={onSubmit} className="w-1/3 flex items-end">
                <TextField name="q" fullWidth label="Search" variant="standard" value={query} onChange={ev => setQuery(ev.target.value)}></TextField>
                <button type="submit" className="unstyled transition-transform duration-150 hover:scale-110 active:scale-90"><SearchRounded fontSize="large" className="ml-2"></SearchRounded></button>
            </form>

            <div className="ml-auto relative">
                <button className="unstyled rounded-full overflow-hidden outline outline-1px outline-white z-50 relative" onClick={() => setUserInfoOpen(val => !val)}><img src={(ctx?.userData?.pfp?.small as any)?.url ?? "/static/nopfp.png"} alt="Profile Picture" className="h-12"></img></button>

                <div className={`profile-info w-72 absolute top-full right-0 origin-top-right transition-[transform,opacity] duration-500 ease-out-back z-50 mt-4 outline outline-1 outline-white bg-black ${userInfoOpen ? "scale-100" : "scale-0 ease-out-cubic! opacity-0"}`}>
                    <div className="header w-full p-2 flex items-center justify-between">
                        <div className="pfp aspect-square h-20 rounded-full overflow-hidden"><img src={(ctx?.userData?.pfp?.medium as any)?.url ?? "/static/nopfp.png"} alt="Profile Picture" className="w-full h-full"></img></div>
                        <div className="names">
                            <div className="name text-lg text-ellipsis">{ctx?.userData?.name ?? "Name"}</div>
                            <div className="tag text-sm text-gray-400 text-ellipsis">@{ctx?.userData?.username ?? "username"}</div>
                        </div>
                    </div>
                    
                    <button className="secondary w-full" onClick={() => router.push("/create")}>Create</button>
                    <button className="secondary w-full" onClick={() => router.push("/app")}>Home</button>
                    <button className="secondary w-full" onClick={() => router.push("/settings")}>Account Settings</button>
                    <button className="secondary w-full" onClick={() => ctx?.logOut()}>Log Out</button>
                </div>
                <div className={`profile-info-bg fixed left-0 top-0 z-20 w-full h-full ${userInfoOpen ? "open pointer-events-auto" : "closed pointer-events-none"}`} onClick={() => setUserInfoOpen(false)}></div>
            </div>

            <div className={`burger-menu-bg fixed left-0 top-0 z-50 w-full h-full bg-black transition-colors duration-500 ${burgerMenuOpen ? "open bg-opacity-50 pointer-events-auto" : "closed bg-opacity-0 pointer-events-none"}`} onClick={() => setBurgerMenuOpen(false)}></div>
            <div className={`burger-menu fixed left-0 top-0 z-50 w-1/3 h-full bg-black outline outline-1 transition-[transform,outline-color] duration-500 ease-out-cubic pt-24 ${burgerMenuOpen ? "open translate-x-0 outline-white" : "closed -translate-x-full outline-transparent"}`}>
                burger
            </div>
        </div>
    )
}