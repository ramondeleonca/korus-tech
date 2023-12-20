"use client";

import { useEffect, useMemo, useState } from "react";
import { KXLRC } from '@korusbyanthm/kxlrc';
import demoLyrics from "./../../../../public/demo.kxlrc.json";
import { Button, TextField } from "@mui/material";
import Image from 'next/image';
import PlayArrowRounded from "@mui/icons-material/PlayArrowRounded";
import PauseRounded from "@mui/icons-material/PauseRounded";
import Forward10Rounded from "@mui/icons-material/Forward10Rounded";
import Replay10Rounded from "@mui/icons-material/Replay10Rounded";
import AddCircleRounded from "@mui/icons-material/AddCircleRounded";

export type EditorProps = { lyrics: KXLRC };
function Editor(props: EditorProps) {
    const [lyrics, setLyrics] = useState(props.lyrics);
    props.lyrics.on("any", () => setLyrics(props.lyrics));
    
    useEffect(() => {
        console.log(lyrics);
    }, [lyrics]);

    return (
        <div className="editor hero relative flex">
            <div className="sidebar relative flex flex-col items-center justify-center h-full w-1/3 max-w-[500px]">
                <div className="absolute progress-bar-container top-0 w-full py-8">
                    <div className="progress-bar-content flex items-center justify-center">
                        <div className="progress-bar w-3/4 h-2 mr-2 rounded-full overflow-hidden bg-white bg-opacity-25 relative"><div className="progress h-full rounded-full bg-white" style={{width: "50%"}}></div></div>
                        <p>50%</p>
                    </div>
                </div>
                <div className="content w-full flex items-center justify-center">
                    <div className="cover w-3/4 aspect-square relative"><Image src={"/static/kittyponeo.png"} alt="" fill className="object-cover"></Image></div>
                </div>
                <div className="song-info flex flex-col items-center justify-center w-full">
                    <h1 className="text-xl mt-2">Reggaeton Champagne</h1>
                    <p className="opacity-75">Bellakath, Dani Flow</p>
                </div>
                <div className="song-progress-bar-container top-0 w-full py-4">
                    <div className="song-progress-bar-content flex items-center justify-center">
                        <p>2:05</p>
                        <div className="song-progress-bar w-3/4 h-2 mx-2 rounded-full overflow-hidden bg-white bg-opacity-25 relative"><div className="song-progress h-full rounded-full bg-white" style={{width: "50%"}}></div></div>
                        <p>4:11</p>
                    </div>
                </div>
                <div className="player-info">
                    <div className="player-controls w-full flex items-center justify-center text-6xl">
                        <button className="unstyled transition-all duration-200 ease-out-back hover:scale-125 active:scale-100 origin-center p-2" aria-label="Rewind 10 seconds"><Replay10Rounded fontSize="inherit"></Replay10Rounded></button>
                        <button className="unstyled transition-all duration-200 ease-out-back hover:scale-125 active:scale-100 origin-center p-2 mx-2" aria-label="Play"><PlayArrowRounded fontSize="inherit"></PlayArrowRounded></button>
                        <button className="unstyled transition-all duration-200 ease-out-back hover:scale-125 active:scale-100 origin-center p-2" aria-label="Fast Forward 10 sedonds"><Forward10Rounded fontSize="inherit"></Forward10Rounded></button>
                    </div>
                </div>
            </div>

            <div className="lines relative pl-4 w-max flex-grow overflow-auto">
                <form>
                    {lyrics?.lyrics?.map((line, index) => {
                        return (
                            <div key={line.edited?.timestamp ?? line?.text?.at(0)?.text ?? index}>
                                <div className="flex items-center">
                                    <Button variant="text" className="min-w-[0px] !p-2 rounded-full unstyled opacity-50" onClick={() => lyrics.add({}, index)}><AddCircleRounded fontSize="medium"></AddCircleRounded></Button>
                                    <TextField
                                        key={line?.text?.at(0)?.text ?? index}
                                        value={line?.text?.map(text => text.text).join(" ")}
                                        onChange={ev => {props.lyrics.edit({text: [{text: ev.target.value}]}, index)}}
                                        variant="filled"
                                        className="w-full"
                                        name={`line-${index}`}
                                    ></TextField>
                                </div>
                            </div>
                        )
                    })}
                </form>
            </div>
        </div>
    )
}

export default function Edit() {
    const lyrics = new KXLRC(demoLyrics);

    return (
        <Editor lyrics={lyrics}></Editor>
    )
};