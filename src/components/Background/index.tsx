"use client";

import { forwardRef, useEffect, useMemo, useState } from 'react';
import backgrounds from "@/../public/backgrounds/index.json";
import _ from 'lodash';
import Image from 'next/image';

type Props = {
    className?: string;
    children?: any;
    gradient?: boolean;
    credits?: boolean;
}
export default forwardRef<HTMLDivElement, Props>((props, ref) => {
    const [background, setBackground] = useState<{by: {url: string, name: string}, name: string, image: string}>();
    useEffect(() => setBackground(_.sample(backgrounds.artists)), []);
    
    return (
        <div ref={ref} className={`w-1/2 right-0 top-0 h-full absolute -z-[10] ${props.className ?? ""}`}>
            {
                props.gradient ? <div className="gradient from-black to-transparent bg-gradient-to-r -z-[1] absolute w-full h-full"></div> : null
            }
            {
                background ? <>
                    {
                        (props.credits ?? true) ? <a className='absolute z-[50] opacity-75 hover:opacity-100 bottom-2 right-4' href={background?.by?.url ?? "about:blank"} target="_blank" rel="noreferrer" referrerPolicy='no-referrer'>{background?.name} by {background?.by?.name}</a> : null
                    }
                    <div className={`background-container h-full w-full absolute flex items-center justify-end -z-[10] themed pointer-events-none`}>
                        <Image className='pointer-events-none' priority alt="A background with a music artist" style={{objectFit: "cover"}} fill src={`/backgrounds/artists/${background?.image}`}></Image>
                    </div>
                </> : null
            }
            {props.children}
        </div>
    )
})