"use client";

import { useEffect, useState } from "react";
import { isDev } from "@/server";

export default function useIsDev() {
    const [dev, setIsDev] = useState(false);
    useEffect(() => {isDev().then(setIsDev)}, [dev]);
    return dev;
}