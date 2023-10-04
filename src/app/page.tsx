"use client";

// Imports
import _ from "lodash";
import Lottie from "react-lottie-player";

// GSAP Imports
import { gsap, Power3 } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

// React / Next Imports
import { useEffect, useRef, useState } from "react";
import NextLocomotiveScroll, { useNextLocomotiveScroll } from "next-locomotive-scroll";
import Image from "next/image";
import { useCopyToClipboard } from "react-use";

// Component imports
import Footer from "@/components/PageComponents/Footer";
import NavBar from "@/components/PageComponents/NavBar";
import Polaroid from "@/components/PageComponents/Polaroid";

// JSON Imports
import backgrounds from "@/../public/backgrounds/index.json";
import sample from "@/../public/sample.json";
import scrollAnimationData from "@/../public/lottie/scroll.json";
import introTexts from "@/../public/intro.json";
import useLoaded from "@/hooks/useLoaded";


// Register GSAP Plugins
gsap.registerPlugin(ScrollTrigger);

// Constants
const homeSnippetChangeInterval = 10000;
const homeSnippetChangeDuration = 0.75 / 2;
const homeSnippetChangeStagger = 0.15;
const homeSnippetChangeOffset = 50;

const locomotiveScrollOptions = {
	getDirection: true,
	getSpeed: true,
	smooth: true,
	smartphone: {
		smooth: true
	},
	tablet: {
		smooth: true
	},
	lerp: 0.05,
	touchMultiplier: 2
} as import("locomotive-scroll").InstanceOptions;

export default function Index() {
	// State hooks
	const [homeBackground, setHomeBackground] = useState<typeof backgrounds.random[number]>(null as any)
	useEffect(() => setHomeBackground(_.sample(backgrounds.random as any)), []);

	const [homeSnippet, setHomeSnippet] = useState<typeof sample[number]>(null as any);
	useEffect(() => setHomeSnippet(_.sample(sample) as any), []);

	const [karaokeSnippet, setKaraokeSnippet] = useState<typeof sample[number]>(null as any);
	useEffect(() => setKaraokeSnippet(_.sample(sample) as any), []);

	const [sharingSnippets, setSharingSnippets] = useState<typeof sample[number][]>(null as any);
	useEffect(() => setSharingSnippets(_.sampleSize(sample, 5) as any), []);

	const loaded = useLoaded();
	const locomotiveScroll = useNextLocomotiveScroll();

	useEffect(() => {
		if (locomotiveScroll?.instance) {
			locomotiveScroll.instance.on("scroll", ScrollTrigger.update);
			ScrollTrigger.scrollerProxy(locomotiveScroll.wrapperRef.current, {
				scrollTop(value) {
					return value ? (locomotiveScroll.instance?.scrollTo as any)(value ?? 0, 0, 0) : (locomotiveScroll?.instance as any)?.scroll?.instance?.scroll?.y;
				},
				getBoundingClientRect() {
					return {top: 0, left: 0, width: window.innerWidth, height: window.innerHeight};
				},
				pinType: locomotiveScroll.wrapperRef.current?.style?.transform ? "transform" : "fixed"
			});
			ScrollTrigger.defaults({ scroller: locomotiveScroll.wrapperRef.current, start: "top top" });
			ScrollTrigger.refresh();
		}
	}, [loaded, locomotiveScroll]);

	// Refs
	const snippetRef = useRef<HTMLDivElement>(null);
	const snippetTextRef = useRef<HTMLDivElement>(null);
	const snippetSongRef = useRef<HTMLDivElement>(null);
	const introRef = useRef<HTMLDivElement>(null);
	const textsRef = useRef<HTMLDivElement>(null);
	const karaokeRef = useRef<HTMLDivElement>(null);
	const karaokeTexts = useRef<HTMLHeadingElement>(null);
	const polaroidsRef = useRef<HTMLDivElement>(null);

    const [changeHomeSnippetLoopTimeout, setChangeHomeSnippetLoopTimeout] = useState<NodeJS.Timeout>(null as never)
    const changeHomeSnippetLoop = () => {
        const snippetChangeTl = gsap.timeline();
        snippetChangeTl
        .add("start")
        .to(snippetTextRef.current, {x: homeSnippetChangeOffset, opacity: 0, ease: Power3.easeOut, duration: homeSnippetChangeDuration}, "start")
        .to(snippetSongRef.current, {x: homeSnippetChangeOffset, opacity: 0, ease: Power3.easeOut, delay: homeSnippetChangeStagger, duration: homeSnippetChangeDuration}, "start")
        .add("middle")
        .set(snippetTextRef.current, {x: -homeSnippetChangeOffset}, "middle")
        .set(snippetSongRef.current, {x: -homeSnippetChangeOffset}, "middle")
        .add(() => setHomeSnippet(_.sample(sample) as any), "middle")
        .add("end", `+=${homeSnippetChangeStagger}`)
        .to(snippetTextRef.current, {x: 0, opacity: 1, ease: Power3.easeOut, duration: homeSnippetChangeDuration}, "end")
        .to(snippetSongRef.current, {x: 0, opacity: 1, ease: Power3.easeOut, delay: homeSnippetChangeStagger, duration: homeSnippetChangeDuration}, "end");

        setChangeHomeSnippetLoopTimeout(setTimeout(changeHomeSnippetLoop, homeSnippetChangeInterval));
    };
    useEffect(() => {
        changeHomeSnippetLoop();
        return () => clearTimeout(changeHomeSnippetLoopTimeout);
    }, []);

	// Copy home snippet function
	const [clipboardVal, copyToClipboard] = useCopyToClipboard();
	const copyHomeSnippet = () => copyToClipboard(`"${homeSnippet.lyric}" \nFrom "${homeSnippet.from.song}" in "${homeSnippet.from.album}" by ${homeSnippet.from.artist} \nListen on ${homeSnippet.from.url.spotify} (Provided by Korus)`)

	useEffect(() => {
		const ctx = gsap.context(() => {
			const introTl = gsap.timeline({
				scrollTrigger: {
					scrub: true,
					pin: true,
					trigger: introRef.current,
					end: "bottom -100%"
				}
			});

			const textsChildren = [...textsRef.current?.children ?? []];
			for (let [index, child] of textsChildren.entries()) {
				if (index === 0) {
					introTl.to(child, { scale: 1.5 });
					introTl.to(child, { opacity: 0 });
				} else {
					gsap.set(child, { scale: 5, opacity: 0 });
					introTl.to(child, { scale: 1, opacity: 1 });
					if (index < textsChildren.length - 1) introTl.to(child, { scale: 0.5, opacity: 0 });
				};
			};
		});

		return () => ctx.revert();
	}, [loaded]);

	useEffect(() => {
		const ctx = gsap.context(() => {
			const timestampedTl = gsap.timeline({
				scrollTrigger: {
					scrub: true,
					pin: true,
					trigger: karaokeRef.current
				}
			});

			for (let child of karaokeTexts.current?.children ?? [])
				timestampedTl.to(child, { backgroundColor: "rgba(255, 255, 255, 0.25)" });
		});

		return () => ctx.revert();
	}, [loaded, karaokeSnippet]);

	useEffect(() => {
		const ctx = gsap.context(() => {
			const polaroidsScale = 1.5
			gsap.set(polaroidsRef.current, { x: "100%" });
			gsap.to(polaroidsRef.current, {
				x: `-${100 * polaroidsScale}%`,
				scale: polaroidsScale,
				scrollTrigger: {
					scrub: true,
					trigger: polaroidsRef.current,
					end: "bottom -150%"
				}
			});

			for (let child of polaroidsRef.current?.children ?? [])
				gsap.to(child, {
					rotate: "15deg",
					scrollTrigger: {
						scrub: true,
						trigger: polaroidsRef.current,
						end: "bottom"
					}
				})
		});

		return () => ctx.revert();
	}, [loaded, sharingSnippets]);

	return (
		<>
			<NavBar></NavBar>

			{/* <NextLocomotiveScroll options={locomotiveScrollOptions} gsap={true}> */}
				{/* Home section */}
				<section className="hero relative overflow-hidden" id="home">
					<Lottie className="absolute -right-20 bottom-1 w-64" data-scroll data-scroll-speed="-5" play loop animationData={scrollAnimationData}></Lottie>
					<a href={homeBackground?.by?.url} className="z-10 absolute text-lg bottom-4 left-4 opacity-75 hover:opacity-100">Background by {homeBackground?.by?.name}</a>
					<div className="background-container h-full max-w-5xl left-0 w-[100vw] absolute -z-[1] background themed" data-scroll data-scroll-speed="-2.5">
						<Image fetchPriority="high" loading="eager" priority alt="A dynamic portrait of a person looking for lyrical inspiration and song information" style={{ objectFit: "cover" }} fill={true} src={`/backgrounds/random/${homeBackground?.image}`}></Image>
					</div>
					<div className="h-full w-full absolute lyric-container flex items-center justify-center">
						<div className="w-full flex justify-center">
							<div className="px-10" ref={snippetRef}>
								<div ref={snippetTextRef}>
									<div className="transition-transform duration-300 ease-out-cubic active:scale-95">
										<pre onClick={copyHomeSnippet} className="hover:text-yellow-400 transition-colors duration-300 ease-out-cubic font-sans font-light uppercase text-2xl break-words whitespace-pre-wrap cursor-pointer select-none">{homeSnippet?.lyric}</pre>
									</div>
								</div>
								<div ref={snippetSongRef} className={homeSnippet ? "" : "hidden"}>
									<a className="!font-medium" target="_blank" rel="noreferrer" href={homeSnippet?.from?.url?.spotify}>{`From "${homeSnippet?.from?.song}" by ${homeSnippet?.from?.artist}`}</a>
								</div>
							</div>
						</div>
					</div>
				</section>

				<section className="hero relative" id="intro" ref={introRef}>
					<div className="bg-gradient-to-r from-black to-transparent h-full w-1/2 right-0 absolute bg-no-repeat -z-[1]"></div>

					<div className="background-container h-full w-1/2 top-0 right-0 absolute flex items-center justify-end -z-[2] themed">
						<Image loading="lazy" alt="Tyler, The Creator wearing his 'Call Me When You Get Lost' hat looking forward with his head slightly tilted down in dominance" style={{ objectFit: "cover" }} fill={true} src={"/backgrounds/artists/tyler-the-creator.png"}></Image>
					</div>

					<div className="w-full h-full texts flex items-center justify-center [&>*:first-child]:text-3xl [&>*]:text-[15vw] [&>*]:pointer-events-none [&>*]:select-none [&>*]:absolute [&>*]:w-max" ref={textsRef}>
						{
							introTexts.map((val, i) => <h1 key={i}>{val.bold ? <b>|{val.text}|</b> : val.text}</h1>)
						}
					</div>
				</section>

				{/* Karaoke lyrics section */}
				<section className="hero flex" id="timestamped" ref={karaokeRef}>
					<div className="w-1/2 flex items-center h-full">
						<h1 className="text-[5vw] w-full text-center">| karaoke <b>LYRICS.</b> |</h1>
					</div>
					<div className="w-1/2 h-full grid place-items-center">
						<div className="full-w">
							<div className="w-full">
								<h1 className="text-2xl font-sans text-center w-full flex flex-wrap" ref={karaokeTexts}>
									{
										karaokeSnippet?.lyric?.split(" ")
											.map((word, i) => <div key={i} className="m-[3px] p-[3px] rounded"><pre className="font-sans">{word}</pre></div>)
									}
								</h1>
							</div>
						</div>
					</div>
				</section>

				{/* Sharing is caring section */}
				<section className="w-[100vw] h-[125vh] relative">
					<div className="absolute top-0 left-0 -z-[1] w-full h-full flex justify-center items-center">
						<h1 className="text-5xl">| sharing is <b>CARING.</b> |</h1>
					</div>
					<div className="flex w-full h-full items-center justify-between" ref={polaroidsRef}>
						{
							sharingSnippets ? <>
								{
									sharingSnippets.map((snippet, i) =>
										<Polaroid className="w-[calc(calc(100vw/5)-2.5vw)] min-w-[210px]" desc={snippet.from.artist} key={i}>
											<h1 className="p-2 text-2xl">&quot;{snippet.lyric}&quot;</h1>
										</Polaroid>
									)
								}
							</> : null
						}
					</div>
				</section>

				<Footer></Footer>
			{/* </NextLocomotiveScroll> */}
		</>
	)
}