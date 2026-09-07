/**
 * South Africa's 11 official languages, for Thandi's language selector.
 *
 * `speechCode` is a best-effort BCP-47 tag for the Web Speech API
 * (SpeechSynthesis/SpeechRecognition) — browser/OS voice support for the
 * non-English entries varies a lot in practice, so `useThandiVoiceActivation`
 * always falls back to English if the requested voice isn't installed.
 *
 * Per VowHumans' own multilingual policy: the platform does not publicly
 * claim uniform, production-grade quality across all 11 languages for every
 * capability. What *is* real: VowHumans' Realtime conversation path is
 * approved production for all 11 (per its Sept 2026 customer acceptance),
 * which is exactly the capability Thandi uses here. Selecting a language
 * asks Thandi to converse in it — it is not a guarantee of equal polish to
 * English, and the panel says so.
 */
export type ThandiLanguage = {
  code: string;
  speechCode: string;
  name: string;
  nativeName: string;
};

export const THANDI_LANGUAGES: ThandiLanguage[] = [
  { code: "en", speechCode: "en-ZA", name: "English", nativeName: "English" },
  { code: "af", speechCode: "af-ZA", name: "Afrikaans", nativeName: "Afrikaans" },
  { code: "zu", speechCode: "zu-ZA", name: "Zulu", nativeName: "isiZulu" },
  { code: "xh", speechCode: "xh-ZA", name: "Xhosa", nativeName: "isiXhosa" },
  { code: "st", speechCode: "st-ZA", name: "Sesotho", nativeName: "Sesotho" },
  { code: "tn", speechCode: "tn-ZA", name: "Setswana", nativeName: "Setswana" },
  { code: "nso", speechCode: "nso-ZA", name: "Sepedi", nativeName: "Sepedi" },
  { code: "ts", speechCode: "ts-ZA", name: "Tsonga", nativeName: "Xitsonga" },
  { code: "ss", speechCode: "ss-ZA", name: "Swati", nativeName: "siSwati" },
  { code: "ve", speechCode: "ve-ZA", name: "Venda", nativeName: "Tshivenda" },
  { code: "nr", speechCode: "nr-ZA", name: "Ndebele", nativeName: "isiNdebele" },
];

export function getThandiLanguage(code: string): ThandiLanguage {
  return THANDI_LANGUAGES.find((l) => l.code === code) ?? THANDI_LANGUAGES[0];
}
