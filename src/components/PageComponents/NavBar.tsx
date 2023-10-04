"use client"

const NavBar = () => {
    return (
        <nav className="fixed top-0 left-0 right-0 z-20 h-fit">
            {/* Mobile */}
            <div className="w-full h-14 absolute sm:hidden flex justify-between items-center">
                <div className="left ml-2">
                    
                </div>
                <div className="middle">
                    <a className="mx-2 explore--link button" href={`/app/`}>EXPLORE.</a>
                    <a className="mx-2 onboarding--link button primary" href={`/onboarding/`}><b>| JOIN. |</b></a>
                </div>
                <div className="right mr-2 mt-2">
                    
                </div>
            </div>

            {/* Desktop */}
            <div className="w-full h-8 absolute hidden sm:flex items-center justify-center">
                <ul className="list-none flex items-center justify-center">
                    <li key="home">
                        <a className="!mx-2 home--link" href={`/`}><b>| HOME. |</b></a>
                    </li>
                    <li key="contribute">
                        <a className="!mx-2 contribute--link" href={`/app/contribute/`}><b>| CONTRIBUTE. |</b></a>
                    </li>
                    <li key="explore">
                        <a className="!mx-2 explore--link" href={`/app/`}><b>| EXPLORE. |</b></a>
                    </li>
                    <li key="onboarding">
                        <a className="!mx-2 onboarding--link" href={`/onboarding/`}><b>| JOIN. |</b></a>
                    </li>
                    <li key="request">
                        <a className="!mx-2 request--link" href={`/app/request/`}><b>| REQUEST. |</b></a>
                    </li>
                    <li key="create">
                        <a className="!mx-2 create--link" href={`/app/create/`}><b>| CREATE. |</b></a>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

NavBar.displayName = "NavBar";
export default NavBar;