import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { STRINGS, type Lang, type Strings } from './strings'

interface AppSettingsContextValue {
  lang: Lang
  setLang: (lang: Lang) => void
  strings: Strings
  largeText: boolean
  setLargeText: (v: boolean) => void
}

const AppSettingsContext = createContext<AppSettingsContextValue | null>(null)

const LANG_STORAGE_KEY = 'rakshacall.lang'
const LARGE_TEXT_STORAGE_KEY = 'rakshacall.largeText'

function readStoredLang(): Lang {
  try {
    const stored = localStorage.getItem(LANG_STORAGE_KEY)
    if (stored === 'en' || stored === 'hi' || stored === 'mr') return stored
  } catch {
    // localStorage unavailable (private browsing etc.) — fall back silently.
  }
  return 'en'
}

function readStoredLargeText(): boolean {
  try {
    return localStorage.getItem(LARGE_TEXT_STORAGE_KEY) === 'true'
  } catch {
    return false
  }
}

export function AppSettingsProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(readStoredLang)
  const [largeText, setLargeText] = useState<boolean>(readStoredLargeText)

  useEffect(() => {
    try {
      localStorage.setItem(LANG_STORAGE_KEY, lang)
    } catch {
      // ignore
    }
  }, [lang])

  useEffect(() => {
    try {
      localStorage.setItem(LARGE_TEXT_STORAGE_KEY, String(largeText))
    } catch {
      // ignore
    }
  }, [largeText])

  const value = useMemo<AppSettingsContextValue>(
    () => ({ lang, setLang, strings: STRINGS[lang], largeText, setLargeText }),
    [lang, largeText],
  )

  return <AppSettingsContext.Provider value={value}>{children}</AppSettingsContext.Provider>
}

export function useAppSettings(): AppSettingsContextValue {
  const ctx = useContext(AppSettingsContext)
  if (!ctx) throw new Error('useAppSettings must be used within AppSettingsProvider')
  return ctx
}
