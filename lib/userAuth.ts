import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

const USER_SESSION_COOKIE = "terra_user";

const secret = new TextEncoder().encode(
  process.env.SESSION_SECRET
);

if (!process.env.SESSION_SECRET) {
  throw new Error(
    "Please define SESSION_SECRET in your environment variables"
  );
}

export async function setUserSession(userId: string) {
  const token = await new SignJWT({
    userId,
  })
    .setProtectedHeader({
      alg: "HS256",
    })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);

  const cookieStore = await cookies();

  cookieStore.set(USER_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function getUserSession() {
  const cookieStore = await cookies();

  const token = cookieStore.get(
    USER_SESSION_COOKIE
  )?.value;

  if (!token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(
      token,
      secret
    );

    const userId = payload.userId;

    if (
      typeof userId !== "string" ||
      !userId
    ) {
      return null;
    }

    return userId;
  } catch {
    return null;
  }
}

export async function clearUserSession() {
  const cookieStore = await cookies();

  cookieStore.delete(USER_SESSION_COOKIE);
}

export async function isUserAuthenticated() {
  const userId = await getUserSession();

  return Boolean(userId);
}