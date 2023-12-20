"use client";

// Component imports
import NavBar from "@/components/PageComponents/NavBar";
import Background from "@/components/Background";

// MUI Imports
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import FormLabel from "@mui/material/FormLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Snackbar from "@mui/material/Snackbar";

// React / Next Imports
import { ChangeEvent, FormEvent, useState, useEffect } from 'react';
import Image from "next/image";

// Data imports
import rules, { Rule } from "@/rules";
import constants from "@/constants";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Transition from "@/components/Transition";
import { signUp } from "@/server";
import { useAppContext } from "@/components/AppContext";

export default function Onboarding() {
    // App context
    const ctx = useAppContext();

    // Router for redirecting
    const router = useRouter();

    // Password needs to be saved in a state because it's not accessible in the onChange function
    const [password, setPassword] = useState<string>("");

    // Country needs to be saved in a state because it's for a non-native select
    const [country, setCountry] = useState<string>("");

    // Snackbar states
    const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
    const [snackbarMessage, setSnackbarMessage] = useState<string>("");
    
    // Transition out property
    const [transitionState, setTransitionState] = useState<boolean>(false);
    useEffect(() => setTransitionState(true), []);

    // Set the country to the user's language's country code
    useEffect(() => setCountry(navigator?.language?.split("-")?.at(-1) ?? ""), []);

    const onSubmit = async (ev: FormEvent<HTMLFormElement>) => {
        ev.preventDefault();
        setTransitionState(false);
        const data = new FormData(ev.target as HTMLFormElement);
        const result = await signUp(
            data.get("username") as string,
            data.get("email") as string,
            new Date(`${data.get("birthday")!} 00:00:00`),
            data.get("password") as string,
            data.get("country") as string,
            data.get("name") as string
        );
        
        if (result.success && result.token) {
            ctx?.setToken(result.token);
            router.push("/app?utm_from=signup");
        } else {
            setTransitionState(true);
            setSnackbarMessage("Couldn't sign up, try again later");
            setSnackbarOpen(true);
        }
    }

    // Validate each field individually when it changes
    const onChange = (ev: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, rule: Rule) => {
        const res = rule(ev.target.value);

        if (!res.valid) {
            ev.target.setCustomValidity(res.message ?? "Invalid");
            ev.target.reportValidity();
        } else {
            ev.target.setCustomValidity("");
            ev.target.reportValidity();
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
                        <TextField required onChange={ev => onChange(ev, rules.name)} name="name" label="Name" variant="standard" autoComplete="name"></TextField>
                    </FormControl>

                    <FormControl className="w-80 mb-4">
                        <TextField required onChange={ev => onChange(ev, rules.username)} name="username" label="Username" variant="standard" autoComplete="username"></TextField>
                    </FormControl>

                    <FormControl className="w-80 mb-4">
                        <TextField required onChange={ev => onChange(ev, rules.email)} name="email" label="Email" variant="standard" autoComplete="email" type="email"></TextField>
                    </FormControl>

                    <FormControl className="w-80 mb-4">
                        <FormLabel>Birthday</FormLabel>
                        <TextField required onChange={ev => onChange(ev, rules.birthday)} name="birthday" variant="standard" autoComplete="birthday" type="date"></TextField>
                    </FormControl>

                    <FormControl className="w-80 mb-4">
                        <FormLabel required>Country</FormLabel>
                        <Select required name="country" variant="standard" placeholder="Select your country" value={country} onChange={ev => setCountry(ev.target.value)}>
                            {
                                constants.availableCountries.map((country, i) => <MenuItem key={i} value={country.code}>{country.name}</MenuItem>)
                            }
                        </Select>
                    </FormControl>

                    <FormControl className="w-80 mb-4">
                        <TextField required onChange={ev => { onChange(ev, rules.password); setPassword(ev.target.value) }} name="password" label="Password" variant="standard" autoComplete="password" type="password"></TextField>
                    </FormControl>

                    <FormControl className="w-80 mb-2">
                        <TextField required onChange={ev => onChange(ev, val => rules.passwordConfirmation([password, val]))} name="passwordConfirmation" label="Password confirmation" variant="standard" type="password" autoComplete="password"></TextField>
                    </FormControl>

                    <Link href="/login" className="text-sm mb-4">Already have an account? Log in here</Link>

                    <div className="w-full flex-grow flex items-center justify-center">
                        <button type="submit" className="primary w-full">Sign up!</button>
                    </div>
                </form>
            </div>
        </>
    )
}