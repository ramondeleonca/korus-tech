"use server";

import { Users, UsersRecord, getXataClient } from "./xata";
import argon2 from "argon2";
import jwt, { JwtPayload } from "jsonwebtoken";
import { user as userSchema } from "./schema";
import rules from "./rules";
import HashIds from "hashids";

const xata = getXataClient();

const idHash = new HashIds(undefined, 8);

export const generateId = () => Array(20).fill(0).map(() => Math.ceil(Math.random() * 9)).join("");


export const generateUniqueId = async () => {
    let id = generateId();
    while (await xata.db.users.read(id)) id = generateId();
    return id;
}

export const signUp = async (
    username: string,
    email: string,
    birthdate: Date | string,
    password: string,
    country: string,
    name: string
) => {
    const id = await generateUniqueId();
    const bdate = typeof birthdate === "string" ? new Date(birthdate) : birthdate;
    const encodedPassword = await argon2.hash(password);

    const user = {
        id,
        username,
        email,
        emailVerified: false,
        birthdate: bdate,
        password: encodedPassword,
        country,
        name
    } as Users;

    const result = userSchema.safeParse(user);
    if (!result.success) return { success: false, message: "Invalid user data" };

    try {
        await xata.db.users.create(user);
    } catch (err) { return { success: false, message: "Can't create user" } }

    try {
        const token = jwt.sign({}, process.env.JWT_SECRET as string, { audience: "user", subject: id, expiresIn: "1d" });
        return { success: true, token };
    } catch (err) {
        return { success: false, message: "Can't create token" };
    }
}

export const logIn = async (username: string, password: string) => {
    const column = rules.email(username).valid ? "email" : "username";

    let user;
    try {
        user = await xata.db.users.filter({ [column]: username }).getFirst();
    } catch (err) { return { success: false, message: "Can't get user" } }

    if (!user) return { success: false, message: "Can't find user" };

    const result = await argon2.verify(user.password!, password);

    if (!result) return { success: false, message: "Incorrect password" };

    try {
        const token = jwt.sign({}, process.env.JWT_SECRET as string, { audience: "user", subject: user.id, expiresIn: "1d" });
        return { success: true, token };
    } catch (err) {
        return { success: false, message: "Cant create Token" };
    }
}

export const getMe = async (token: string) => {
    const decoded = jwt.decode(token) as JwtPayload;
    if (!decoded) return { success: false, message: "Invalid token" };

    const user = await xata.db.users.read(decoded.sub!);
    if (!user) return { success: false, message: "Can't find user" };

    return {
        success: true,
        birthdate: user.birthdate,
        country: user.country,
        emailVerified: user.emailVerified,
        originalId: user.id,
        id: idHash.encode(user.id),
        name: user.name,
        username: user.username,
        pfp: (await user.pfp?.read())?.toSerializable() ?? null,
        joinedAt: user?.xata.createdAt
    };
}

export const verifyToken = async (token: string) => {
    const decoded = jwt.decode(token) as JwtPayload;
    if (!decoded) return { success: false, message: "Invalid token" };
    return { success: true };
}