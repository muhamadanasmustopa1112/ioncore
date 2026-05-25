"use client";

import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toAbsoluteUrl } from "@/lib/helpers";

const LANGUAGES = [
  {
    code: "id",
    label: "Bahasa Indonesia",
    flag: toAbsoluteUrl("/media/flags/indonesia.svg"),
  },
  {
    code: "en",
    label: "English",
    flag: toAbsoluteUrl("/media/flags/united-states.svg"),
  },
];

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const currentLang = LANGUAGES.find((l) => l.code === i18n.language) || LANGUAGES[0];

  const handleLanguageChange = (code: string) => {
    i18n.changeLanguage(code);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="size-10 rounded-lg">
          <img
            src={currentLang.flag}
            alt={currentLang.label}
            className="size-5 rounded-full object-cover"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {LANGUAGES.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={i18n.language === lang.code ? "bg-muted" : ""}
          >
            <img
              src={lang.flag}
              alt={lang.label}
              className="size-4 rounded-full mr-2"
            />
            <span className="font-medium">{lang.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
