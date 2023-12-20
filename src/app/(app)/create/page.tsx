"use client";

import AppBar from "@/components/AppHeader";
import { useAppContext } from "@/components/AppContext";

export default function Create() {
    const ctx = useAppContext();
    ctx?.preventInvalidToken();

    return (
        <>
            <AppBar></AppBar>
            Create
        </>
    )
}