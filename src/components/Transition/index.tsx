"use client"

import gsap from "gsap";
import { useEffect, useRef, useState } from 'react';
import styles from "./Transition.module.scss";

type Props = {state: boolean, hasLoader?: boolean, duration?: number};
const Transition = (props: Props) => {
    const spinnerRef = useRef<HTMLDivElement>(null);
    const transitionRef = useRef<HTMLDivElement>(null);
    const transitionPanelRef = useRef<HTMLDivElement>(null);
    const offscreenRef = useRef<HTMLDivElement>(null);

    const setLoader = (state?: boolean) => state ? transitionPanelRef.current?.appendChild(spinnerRef.current as any) : offscreenRef.current?.appendChild(spinnerRef.current as any);
    
    const setInState = () => {
        gsap.set(transitionRef.current, {translateX: "-100%"});
        gsap.set(transitionPanelRef.current, {translateX: "-100%"});
    }
    
    const transitionOut = (duration = 1) => {
        gsap.set(transitionRef.current, {translateX: 0});
        gsap.set(transitionPanelRef.current, {translateX: 0});
        gsap.to(transitionRef.current, {translateX: "-100%", duration: duration / 2, ease: "out.cubic"});
        gsap.to(transitionPanelRef.current, {translateX: "-100%", duration: duration / 2, ease: "out.cubic", delay: duration / 4});
    }

    const transitionIn = (duration = 1) => {
        setInState(); 
        gsap.to(transitionRef.current, {translateX: "-200%", duration: duration / 2, ease: "out.cubic", delay: duration / 4});
        gsap.to(transitionPanelRef.current, {translateX: "-200%", duration: duration / 2, ease: "out.cubic"});
    }

    // Do animation
    useEffect(() => {
        props.state ? transitionIn(props.duration) : transitionOut(props.duration);
    }, [props.state]);

    // Set loader
    useEffect(() => {
        setLoader(props.hasLoader);
    }, [props.hasLoader])

    return (
        <>
            <div className={styles.transition} ref={transitionRef}>
                <div className={styles.transition_panel} ref={transitionPanelRef}></div>
            </div>

            <div className={styles.offscreen} ref={offscreenRef}>
                <div className={styles.spinner} ref={spinnerRef}>
                    <div className={styles.spinner_child}></div>
                </div>
            </div>
        </>
    )
}

export default Transition;