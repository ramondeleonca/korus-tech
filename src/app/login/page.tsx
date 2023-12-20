"use client";

// Component imports
import NavBar from "@/components/PageComponents/NavBar";
import Background from "@/components/Background";

// MUI Imports
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Snackbar from "@mui/material/Snackbar";

// React / Next Imports
import { FormEvent, useState, useEffect } from 'react';
import Image from "next/image";

// Data imports
import Link from "next/link";
import { useRouter } from "next/navigation";
import Transition from "@/components/Transition";
import { logIn } from "@/server";
import { useAppContext } from "@/components/AppContext";

export default function Onboarding() {
    // App context
    const ctx = useAppContext();

    // Router for redirecting
    const router = useRouter();

    // Snackbar states
    const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
    const [snackbarMessage, setSnackbarMessage] = useState<string>("");
    
    // Transition out property
    const [transitionState, setTransitionState] = useState<boolean>(false);
    useEffect(() => setTransitionState(true), []);

    const onSubmit = async (ev: FormEvent<HTMLFormElement>) => {
        ev.preventDefault();
        setTransitionState(false);
        
        // Get form data
        const formData = new FormData(ev.currentTarget);
        const username = formData.get("username") as string;
        const password = formData.get("password") as string;

        // Validate form data
        const result = await logIn(username, password)

        if (result.success && result.token) {
            ctx?.setToken(result.token);
            router.push("/app?utm_from=signup");
        } else {
            setTransitionState(true);
            setSnackbarMessage(result?.message ?? "Can't log in, try again later");
            setSnackbarOpen(true);
        }
    }

    return (
        <>
            <NavBar></NavBar>
            <Background gradient ></Background>
            <Transition state={transitionState} hasLoader></Transition>

            <Snackbar open={snackbarOpen} onClose={() => setSnackbarOpen(false)} message={snackbarMessage}></Snackbar>

            <div className="hero flex items-center justify-center flex-col">
                <div className="image-container relative w-40 h-40 aspect-square">
                    <Image alt="Korus logo" style={{objectFit: "cover"}} fill={true} src="/static/logo.png"></Image>
                </div>

                <form onSubmit={onSubmit} className="flex flex-col items-start justify-center">

                    <FormControl className="w-80 mb-4">
                        <TextField required name="username" label="Username or Email" variant="standard" autoComplete="username"></TextField>
                    </FormControl>

                    <FormControl className="w-80 mb-4">
                        <TextField required name="password" label="Password" variant="standard" autoComplete="password" type="password"></TextField>
                    </FormControl>

                    <Link href="/onboarding" className="text-sm mb-4">Don&apos;t have an account? Sign up in here</Link>

                    <div className="w-full flex-grow flex items-center justify-center">
                        <button type="submit" className="primary w-full">Log in</button>
                    </div>
                </form>
            </div>
        </>
    )
}