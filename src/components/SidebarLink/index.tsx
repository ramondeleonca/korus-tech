"use client";

import Link, { LinkProps } from "next/link";
import { twMerge } from "tailwind-merge";
import cn from "classnames";
import gsap, { Power2 } from "gsap";
import { useRef, MouseEvent } from "react";
import { usePathname } from "next/navigation";
import styles from "./styles.module.scss";

export type Props= LinkProps & {children: string, className?: string, durationPerLetter?: number, duration?: number, delayBetweenLetters?: number, ease?: gsap.EaseFunction, icon?: any, activeIcon?: any, inactiveIcon?: any, onClick?: (ev?: MouseEvent<HTMLAnchorElement, MouseEvent>) => void};
export default function SidebarLink(props: Props) {
    const containerRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();
    
    const onMouseEnter = () => {
        const timeline = gsap.timeline();

        const letters = [...containerRef.current?.children ?? []];
        const duration = props.durationPerLetter ?? ((props.duration ?? 0.75) / letters.length);
        const delay = props.delayBetweenLetters ?? duration / 2;
        for (let [index, letter] of letters.entries()) {
            timeline.to(letter, {duration: duration, y: -10, ease: props.ease ?? Power2.easeInOut}, index * delay);
            timeline.to(letter, {duration: duration, y: 0, ease: props.ease ?? Power2.easeInOut}, index * delay + duration);
        }
    };

    return (
        <Link {...props} onClick={ev => pathname !== props.href && props.onClick ? props.onClick(ev) : null} className={twMerge(cn(props?.className, "text-5xl", "unstyled", styles.SidebarLink, "p-4"))}>
            <span className="flex items-center justify-start flex-wrap" onMouseEnter={onMouseEnter} ref={containerRef}>
                <span className="mr-2 w-fit h-full flex items-center">
                    {(pathname === props.href ? props.activeIcon : props.inactiveIcon) ?? props.icon}
                </span>
                {props.children.split("").map((char, i) => <div key={i} className="inline-block">{char}</div>)}
            </span>
        </Link>
    )
}