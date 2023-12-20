"use client";

import AppHeader from "@/components/AppHeader";
import { useAppContext } from "@/components/AppContext";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function App() {
    const router = useRouter();
    const ctx = useAppContext();

    ctx?.preventInvalidToken();

    return (
        <>
            <AppHeader></AppHeader>

            <Image src="/static/kittyponeo.png" alt={"Kittyponeo cover"} width={200} height={200}></Image>
            <Image src="/static/kittyponeo.png" alt={"Kittyponeo cover"} width={200} height={200}></Image>
            <Image src="/static/kittyponeo.png" alt={"Kittyponeo cover"} width={200} height={200}></Image>
            <Image src="/static/kittyponeo.png" alt={"Kittyponeo cover"} width={200} height={200}></Image>
            <Image src="/static/kittyponeo.png" alt={"Kittyponeo cover"} width={200} height={200}></Image>
            <Image src="/static/kittyponeo.png" alt={"Kittyponeo cover"} width={200} height={200}></Image>
            <Image src="/static/kittyponeo.png" alt={"Kittyponeo cover"} width={200} height={200}></Image>
            <Image src="/static/kittyponeo.png" alt={"Kittyponeo cover"} width={200} height={200}></Image>
            <Image src="/static/kittyponeo.png" alt={"Kittyponeo cover"} width={200} height={200}></Image>
            <Image src="/static/kittyponeo.png" alt={"Kittyponeo cover"} width={200} height={200}></Image>
            <Image src="/static/kittyponeo.png" alt={"Kittyponeo cover"} width={200} height={200}></Image>
            <Image src="/static/kittyponeo.png" alt={"Kittyponeo cover"} width={200} height={200}></Image>
            <Image src="/static/kittyponeo.png" alt={"Kittyponeo cover"} width={200} height={200}></Image>
        </>
    )
}