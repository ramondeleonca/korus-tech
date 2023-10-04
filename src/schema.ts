import { z } from "zod";
import { Users } from "./xata";

export const user = z.object({
    id: z.string().length(20).regex(/^[0-9]+$/),
    username: z.string().min(3).max(20),
    email: z.string().email(),
    emailVerified: z.boolean(),
    birthdate: z.date(),
    password: z.string().min(8).max(100),
    country: z.string().min(1).max(8),
    name: z.string().min(1).max(100)
} satisfies {[key in keyof Users]: any})