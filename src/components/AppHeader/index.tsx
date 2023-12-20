"use client";

import SearchRounded from "@mui/icons-material/SearchRounded";
import HomeRounded from "@mui/icons-material/HomeRounded";
import HomeOutlined from "@mui/icons-material/HomeOutlined";
import Notifications from "@mui/icons-material/Notifications";
import NotificationsOutlined from "@mui/icons-material/NotificationsOutlined";
import AddCircle from "@mui/icons-material/AddCircle";
import AddCircleOutlineRounded from "@mui/icons-material/AddCircleOutlineRounded";
import SettingsRounded from "@mui/icons-material/SettingsRounded";
import SettingsOutlined from "@mui/icons-material/SettingsOutlined";
import LyricsRounded from "@mui/icons-material/LyricsRounded";
import LyricsOutlined from "@mui/icons-material/LyricsOutlined";
import EditRounded from "@mui/icons-material/EditRounded";
import EditOutlined from "@mui/icons-material/EditOutlined";
import TextField from "@mui/material/TextField";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import Lottie from "react-lottie-player";
import burgerMenu from "@/../public/lottie/burgerMenu.json";
import { useAppContext } from "../AppContext";
import SidebarLink from "../SidebarLink";
import { useDebounce } from "react-use";
import { search } from "@/server";
import styles from "./styles.module.scss";
import Image from "next/image";

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
    const [burgerMenuAnimationPosition, setBurgerMenuAnimationPosition] = useState<number>(0);
    const [searchResults, setSearchResults] = useState<Awaited<ReturnType<typeof search>> | null>(null);
    const [showResults, setShowResults] = useState<boolean>(false);
    
    const onBurgerMenuClick = () => {
        setBurgerMenuOpen(val => !val);
        setBurgerMenuPlaying(true);
        setBurgerMenuDirection(val => val === 1 ? -1 : 1);
        if (!burgerMenuOpen) setBurgerMenuAnimationPosition(1);
    }

    const onSubmit = (ev: FormEvent<HTMLFormElement>) => {
        ev.preventDefault();
        setQuery(new FormData(ev.currentTarget).get("q") as string);
        if (query && query.length) router.push(`/search?q=${encodeURIComponent(query)}`);
    }
    const onChange = (ev: FormEvent<HTMLFormElement>) => setQuery(new FormData(ev.currentTarget).get("q") as string);
    const [searchReady, cancelSearch] = useDebounce(() => {
        if (query && query.length) search({query}).then(results => setSearchResults(results));
    }, 250, [query]);

    useEffect(() => {
        console.log(searchResults);
    }, [searchResults]);

    useEffect(() => {
        if (burgerMenuOpen && props.onBurgerMenuOpen) props.onBurgerMenuOpen();
        else if (!burgerMenuOpen && props.onBurgerMenuClose) props.onBurgerMenuClose(); 
    }, [burgerMenuOpen]);

    { /* NOTE: This is a sticky header, so it's not in the main content flow. */ }
    { /* NOTE: Backdrop filter blur breaks the burger menu, figure out a way to work around */ }
    return (
        <div className="sticky top-0 left-0 w-full h-fit flex items-center justify-center z-50 px-8 py-4 bg-black">
            <button aria-label="Menu" className="unstyled p-0 mr-auto transition-transform duration-150 hover:scale-110 active:scale-90 z-[9999]" onClick={onBurgerMenuClick}>
                <Lottie className="aspect-square w-12" speed={2} direction={burgerMenuDirection} play={burgerMenuPlaying} onAnimationEnd={() => setBurgerMenuPlaying(false)} animationData={burgerMenu} loop={false} goTo={burgerMenuAnimationPosition}></Lottie>
            </button>

            <div className="w-1/3 relative flex">
                <form onSubmit={onSubmit} onChange={onChange} className="w-full flex items-center">
                    <TextField name="q" fullWidth label="Search" variant="standard" value={query} onChange={ev => setQuery(ev.target.value)} onFocus={() => setShowResults(true)} onBlur={() => setShowResults(false)} autoComplete="none"></TextField>
                    <button aria-label="Search" type="submit" className="unstyled transition-transform duration-150 hover:scale-110 active:scale-90"><SearchRounded fontSize="large" className="ml-2"></SearchRounded></button>
                </form>
                {
                    searchResults && query ? <div className={`results absolute top-full mt-2 left-0 w-full h-fit-content bg-black outline outline-1 outline-white transition-all ease-out-cubic duration-[500] origin-top ${showResults ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
                        {searchResults?.users?.length > 0 ? <>
                            <p className="w-full border-b border-white">Users:</p>
                            {searchResults.users.map((user, i) => <div key={i} className={`${styles.SearchResult} w-full h-16 flex cursor-pointer`}>
                                <div className="pfp aspect-square overflow-hidden h-full relative">
                                    <Image src={user.pfp?.small?.url ?? "/static/nopfp.png"} alt={`${user.name}${user.name?.endsWith("s") ? "'" : "'s"} Profile Picture`} style={{ objectFit: "cover" }} fill></Image>
                                </div>
                                <div className="grow flex items-center">
                                    <div className="names ml-4">
                                        <p className="name text-lg text-ellipsis">{user?.name ?? "Name"}</p>
                                        <p className="tag text-sm text-gray-400 text-ellipsis">@{user?.username ?? "username"}</p>
                                    </div>
                                </div>
                            </div>)}
                        </> : null}
    
                        {searchResults?.songs?.length > 0 ? <>
                            <p className="w-full border-b border-white">Songs:</p>
                            {searchResults.songs.map((song, i) => <div key={i} className="w-full h-16">
                                {song.id}
                            </div>)}
                        </> : null}
                    </div> : null
                }
            </div>

            <div className="w-1/3 relative flex items-center justify-end">
                {
                    ctx?.loggedIn ? <>
                        <button aria-label="My Profile" className="unstyled rounded-full overflow-hidden outline outline-1px outline-white z-50 relative h-12 w-12 aspect-square" onClick={() => setUserInfoOpen(val => !val)}><Image src={(ctx?.userData?.pfp?.small as any)?.url ?? "/static/nopfp.png"} fill className="object-cover" alt="Profile Picture"></Image></button>
                        <div className={`profile-info w-72 absolute top-full right-0 origin-top-right transition-[transform,opacity] duration-500 ease-out-back z-50 mt-4 outline outline-1 outline-white bg-black ${userInfoOpen ? "scale-100" : "scale-0 ease-out-cubic! opacity-0"}`}>
                            <div className="header w-full p-2 flex items-center justify-between">
                                <div className="pfp aspect-square h-20 rounded-full overflow-hidden relative"><Image src={(ctx?.userData?.pfp?.small as any)?.url ?? "/static/nopfp.png"} alt="Profile Picture" fill className="w-full h-full object-cover"></Image></div>
                                <div className="names">
                                    <p className="name text-lg text-ellipsis">{ctx?.userData?.name ?? "Name"}</p>
                                    <p className="tag text-sm text-gray-400 text-ellipsis">@{ctx?.userData?.username ?? "username"}</p>
                                </div>
                            </div>
                            
                            <button className="secondary w-full" onClick={() => router.push("/app/create")}>Create</button>
                            <button className="secondary w-full" onClick={() => router.push("/app")}>Home</button>
                            <button className="secondary w-full" onClick={() => router.push("/app/settings")}>Account Settings</button>
                            <button className="secondary w-full" onClick={() => ctx?.logOut()}>Log Out</button>
                        </div>
                        <div className={`profile-info-bg fixed left-0 top-0 z-20 w-full h-full ${userInfoOpen ? "open pointer-events-auto" : "closed pointer-events-none"}`} onClick={() => setUserInfoOpen(false)}></div>
                    </> : <>
                        {/* <button className="secondary" onClick={() => router.push("/login")}>Log In</button> */}
                        <button aria-label="Sign Up" className="primary" onClick={() => router.push("/onboarding")}>Sign Up</button>
                    </>
                }
            </div>

            <div className={`burger-menu-bg fixed left-0 top-0 z-50 w-full h-full bg-black transition-colors duration-500 ${burgerMenuOpen ? "open bg-opacity-50 pointer-events-auto" : "closed bg-opacity-0 pointer-events-none"}`} onClick={() => onBurgerMenuClick()}></div>
            <div className={`burger-menu flex flex-col items-start justify-normal fixed left-0 top-0 z-50 max-sm:bg-opacity-0 max-sm:saturate-[1.05] w-full md:w-1/2 lg:w-1/3 xl:w-1/4 h-full bg-opacity-25 backdrop-blur-md outline outline-1 transition-[transform,outline-color] duration-500 ease-out-cubic pt-24 ${burgerMenuOpen ? "open translate-x-0 outline-white" : "closed -translate-x-full outline-transparent"}`}>
                <SidebarLink durationPerLetter={0.15} className="ml-4 mb-10 outline outline-1 outline-white" href="/app" inactiveIcon={<HomeOutlined fontSize="large"></HomeOutlined>} activeIcon={<HomeRounded fontSize="large"></HomeRounded>}>Home</SidebarLink>
                <SidebarLink durationPerLetter={0.15} className="ml-4 mb-10 outline outline-1 outline-white" href="/app/activity" inactiveIcon={<NotificationsOutlined fontSize="large"></NotificationsOutlined>} activeIcon={<Notifications fontSize="large"></Notifications>}>Activity</SidebarLink>
                <SidebarLink durationPerLetter={0.15} className="ml-4 mb-10 outline outline-1 outline-white" href="/app/sing" inactiveIcon={<LyricsOutlined fontSize="large"></LyricsOutlined>} activeIcon={<LyricsRounded fontSize="large"></LyricsRounded>}>Sing</SidebarLink>
                <SidebarLink durationPerLetter={0.15} className="ml-4 mb-10 outline outline-1 outline-white" href="/app/create" inactiveIcon={<AddCircleOutlineRounded fontSize="large"></AddCircleOutlineRounded>} activeIcon={<AddCircle fontSize="large"></AddCircle>}>Create</SidebarLink>
                <SidebarLink durationPerLetter={0.15} className="ml-4 mb-10 outline outline-1 outline-white" href="/app/settings" inactiveIcon={<SettingsOutlined fontSize="large"></SettingsOutlined>} activeIcon={<SettingsRounded fontSize="large"></SettingsRounded>}>Settings</SidebarLink>
                <SidebarLink durationPerLetter={0.15} className="ml-4 mb-10 outline outline-1 outline-white" href="/app/edit" inactiveIcon={<EditOutlined fontSize="large"></EditOutlined>} activeIcon={<EditRounded fontSize="large"></EditRounded>}>Edit</SidebarLink>
                <p className="absolute bottom-1 left-4">&copy; Korus by Anthm, {new Date().getUTCFullYear()}</p>
            </div>
        </div>
    )
}