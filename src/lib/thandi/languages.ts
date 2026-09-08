/**
 * South Africa's 11 official languages, for Thandi's language selector.
 *
 * `code` is VowHumans' own real language code (`languages.code` in its
 * database, e.g. "xh-ZA") — not an arbitrary short code VowLMS invented. It
 * has to match exactly: this is the value sent as `language_code` to
 * VowHumans' `embed-sessions` API to actually set Thandi's spoken language
 * for the call, and it's what the Web Speech API's `lang` field expects too,
 * so one field serves both purposes.
 *
 * Per VowHumans' own multilingual policy: the platform does not publicly
 * claim uniform, production-grade quality across all 11 languages for every
 * capability. What *is* real: VowHumans' Realtime conversation path was
 * promoted to production for all 11 in `025_realtime_languages_production.sql`
 * after real customer acceptance testing — exactly the capability Thandi
 * uses here. `embed-sessions` resolves the actual usable language server-side
 * (falling back to English if a code somehow isn't usable); this list only
 * offers the codes real enough to be worth offering.
 */
export type ThandiLanguage = {
  /** VowHumans' real language code — sent verbatim as `language_code`. */
  code: string;
  name: string;
  nativeName: string;
};

export const THANDI_LANGUAGES: ThandiLanguage[] = [
  { code: "en-ZA", name: "English", nativeName: "English" },
  { code: "af-ZA", name: "Afrikaans", nativeName: "Afrikaans" },
  { code: "zu-ZA", name: "Zulu", nativeName: "isiZulu" },
  { code: "xh-ZA", name: "Xhosa", nativeName: "isiXhosa" },
  { code: "st-ZA", name: "Sesotho", nativeName: "Sesotho" },
  { code: "tn-ZA", name: "Setswana", nativeName: "Setswana" },
  { code: "nso-ZA", name: "Sepedi", nativeName: "Sepedi" },
  { code: "ts-ZA", name: "Tsonga", nativeName: "Xitsonga" },
  { code: "ss-ZA", name: "Swati", nativeName: "siSwati" },
  { code: "ve-ZA", name: "Venda", nativeName: "Tshivenda" },
  { code: "nr-ZA", name: "Ndebele", nativeName: "isiNdebele" },
];

export function getThandiLanguage(code: string): ThandiLanguage {
  return THANDI_LANGUAGES.find((l) => l.code === code) ?? THANDI_LANGUAGES[0];
}
