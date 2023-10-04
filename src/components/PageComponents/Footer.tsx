"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
const Footer = () =>{
    const [state, setState] = useState("");

    return (
        <>
            <section className="w-full min-h-screen pt-[10vw] relative" id="end">
                <a href="https://elmundo.es" className="z-10 absolute text-lg bottom-4 right-4 opacity-75 hover:opacity-100" target="_blank" rel="noreferrer">Background by EL MUNDO</a>
    
                <div className="bg-gradient-to-r from-black to-transparent h-full w-1/2 top-0 right-0 absolute bg-no-repeat -z-[1]"></div>
                <div className="background-container h-full w-1/2 top-0 right-0 absolute flex items-center justify-end -z-[2] themed">
                    <Image loading="lazy" alt="Dua Lipa with her left arm crossed and her right arm upwards with her head leaning against her right hand" style={{objectFit: "cover"}} fill={true} src={"/backgrounds/artists/dua-lipa.png"}></Image>
                </div>
                
                <h1 className="w-full h-8 pl-[5vw] pt-9 text-left text-3xl">Let&apos;s get a little closer...</h1>
    
                <div className="w-full mt-[10vh] flex justify-evenly items-center flex-wrap [&>*>h1]:mb-1 [&>*>h1]:text-2xl">
                    <div className="mx-5 my-3 max-md:flex-grow">
                        <h1>| <b>KORUS.</b> |</h1>
                        <ul>
                            <li><a href={`/learn/`}>| learn <b>MORE.</b> |</a></li>
                            <li><a href={`/pp/`}>| privacy <b>POLICY.</b> |</a></li>
                            <li><a href={`/tos/`}>| terms of <b>SERVICE.</b> |</a></li>
                            <li><a href={`/eula/`}>| end user license agreement <b>(EULA).</b> |</a></li>
                        </ul>
                    </div>
                    <div className="mx-5 my-3 max-md:flex-grow">
                        <h1>| <b>COMMUNITY.</b> |</h1>
                        <ul>
                            <li><a href={`/onboarding/`}>| <b>JOIN.</b> |</a></li>
                            <li><a href={`/app/contribute/`}>| <b>CONTRIBUTE.</b> |</a></li>
                            <li><a href={`/app/`}>| <b>EXPLORE.</b> |</a></li>
                            <li><a href={`/app/request/`}>| <b>REQUEST.</b> |</a></li>
                            <li><a href={`/app/create/`}>| <b>CREATE.</b> |</a></li>
                            <li><a href={`/guidelines/`}>| writing <b>GUIDELINES.</b> |</a></li>
                        </ul>
                    </div>
                    <div className="mx-5 my-3 max-md:flex-grow">
                        <h1>| <b>PRODUCTS.</b> |</h1>
                        <ul>
                            <li><a href={`/api/`}>| REST <b>API.</b> |</a></li>
                            <li><a href={`/apps/`}>| <b>APPS.</b> |</a></li>
                            <li><a href={`/design/`}>| design & <b>BRANDING.</b> |</a></li>
                            <li><a href={`/widgets/`}>| page <b>WIDGETS.</b> |</a></li>
                            <li><a href={`/dev/`}>| for <b>DEVELOPERS.</b> |</a></li>
                        </ul>
                    </div>
                </div>
                <div className="absolute flex flex-col items-center bottom-12 left-0 right-0">
                    <p className="flex flex-wrap text-lg">
                        Built with
                        <span className="relative aspect-square h-6 mx-1 inline-block">
                            <Image alt="Apple Red Heart Emoji" style={{objectFit: "cover"}} fill={true} src="/static/emojis/apple/red-heart_2764-fe0f.png"></Image>
                        </span>
                        in México 
                        <span className="relative aspect-square h-6 mx-1 inline-block">
                            <Image alt="Apple Mexico Flag Emoji" style={{objectFit: "cover"}} fill={true} src="/static/emojis/apple/flag-mexico_1f1f2-1f1fd.png"></Image>
                        </span> 
                    </p>
                    <p>&copy; Korus by Anthm, {new Date().getUTCFullYear()}</p>
                </div>
            </section>
        </>
    )
};

Footer.displayName = "Footer";
export default Footer;