import React from "react";

const Polaroid: React.FC<{desc?: string, children: JSX.Element, style?: React.CSSProperties, className?: string}> = (props) => {
    return (
        <div>
            <div style={props.style} className={`${props.className ?? ""} px-4 pt-4 bg-white w-72 h-fit`}>
                <div className="bg-black aspect-square text-white">
                    {props.children}
                </div>
                <p className="h-14 w-full font-script text-black text-lg pt-1">{props?.desc ?? ""}</p>
            </div>
            <div className="absolute top-0 left-0 right-0 bottom-0 bg-black blur-lg -translate-x-3 translate-y-3 -z-[1]"></div>
        </div>
    )
};

Polaroid.displayName = "Polaroid"
export default Polaroid;