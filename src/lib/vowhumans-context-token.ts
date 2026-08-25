import { createHmac, timingSafeEqual } from "node:crypto";

const TOKEN_AUDIENCE = "vowhumans-lesson-context";
const TOKEN_TTL_SECONDS = 5 * 60;

type LessonContextTokenPayload = {
  aud: typeof TOKEN_AUDIENCE;
  exp: number;
  slug: string;
};

function contextSecret() {
  return process.env.VOWHUMANS_LESSON_CONTEXT_SECRET ?? "";
}

function signatureFor(encodedPayload: string, secret: string) {
  return createHmac("sha256", secret).update(encodedPayload).digest("base64url");
}

export function mintVowHumansLessonContextToken(slug: string): string | null {
  const secret = contextSecret();
  if (!secret) return null;

  const payload: LessonContextTokenPayload = {
    aud: TOKEN_AUDIENCE,
    exp: Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS,
    slug,
  };
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${encodedPayload}.${signatureFor(encodedPayload, secret)}`;
}

export function verifyVowHumansLessonContextToken(
  token: string,
  expectedSlug: string,
): boolean {
  const secret = contextSecret();
  if (!secret) return false;

  const [encodedPayload, providedSignature, extra] = token.split(".");
  if (!encodedPayload || !providedSignature || extra) return false;

  const expectedSignature = signatureFor(encodedPayload, secret);
  const providedBuffer = Buffer.from(providedSignature);
  const expectedBuffer = Buffer.from(expectedSignature);
  if (
    providedBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(providedBuffer, expectedBuffer)
  ) {
    return false;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(encodedPayload, "base64url").toString("utf8"),
    ) as Partial<LessonContextTokenPayload>;
    return (
      payload.aud === TOKEN_AUDIENCE &&
      payload.slug === expectedSlug &&
      typeof payload.exp === "number" &&
      payload.exp >= Math.floor(Date.now() / 1000)
    );
  } catch {
    return false;
  }
}
