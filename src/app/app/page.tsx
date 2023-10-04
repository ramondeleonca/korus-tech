"use client";

import AppBar from "@/components/AppBar";
import { useAppContext } from "@/components/AppContext";
import Transition from "@/components/Transition";
import { useRouter } from "next/navigation";

export default function App() {
    const router = useRouter();
    const ctx = useAppContext();

    ctx?.preventInvalidToken();

    return (
        <>
            <AppBar></AppBar>
        </>
    )
}