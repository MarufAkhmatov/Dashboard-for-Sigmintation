import { createContext, useContext, useState, type ReactNode } from "react";

export type Lang = "en" | "ru" | "uz";

const en = {
  nav_dashboard: "Dashboard",
  search: "Search...",
  title: "Dashboard Overview",
  subtitle: "Welcome back! Here's what's happening with your clients today",
  total_appointments: "Total Appointments",
  active_patients: "Active Patients",
  critical_alerts: "Critical Alerts",
  wellness_progress: "Your Wellness Progress",
  tab_Daily: "Daily",
  tab_Monthly: "Monthly",
  tab_Weekly: "Weekly",
  tab_Yearly: "Yearly",
  stress_recovery: "Stress / Recovery Balance",
  recovery_note: "You reached optimal recovery. Keeping your bedtime consistent will sustain this",
  glucose: "Glucose",
  mgdl: "mg/dL",
  capacity68: "68% Capacity",
  patient_flow: "Patient Flow",
  completed: "Completed",
  upcoming: "Upcoming",
  healthcare_providers: "Healthcare Providers",
  provider_name: "Provider Name",
  department: "Department",
  contact: "Contact",
  action: "Action",
  filter: "Filter",
  available: "Available",
  absent: "Absent",
  Pathology: "Pathology",
  Orthopedics: "Orthopedics",
  aria_sub: "Your personal AI assistant",
  credits: "100 Credits Remaining",
  upgrade: "Upgrade",
  ask_anything: "Ask anything...",
  suggestion1: "Why is my HRV low?",
  suggestion2: "How's my recovery today?",
  aria_greeting: "Hi! I'm Aria, your personal health AI. Ask me anything about your health data.",
  aria_reply: "Based on your recent health data, I recommend maintaining consistent sleep patterns and staying hydrated. Your HRV trends suggest moderate stress — consider a 10-minute breathing exercise today.",
  dayShort: { Mon: "Mon", Tue: "Tue", Wed: "Wed", Thu: "Thu", Fri: "Fri", Sat: "Sat", Sun: "Sun" } as Record<string, string>,
  monShort: { Jan: "Jan", Feb: "Feb", Mar: "Mar" } as Record<string, string>,
};

type Dict = typeof en;

const ru: Dict = {
  nav_dashboard: "Панель",
  search: "Поиск...",
  title: "Обзор панели",
  subtitle: "С возвращением! Вот что происходит с вашими клиентами сегодня",
  total_appointments: "Всего приёмов",
  active_patients: "Активные пациенты",
  critical_alerts: "Критические оповещения",
  wellness_progress: "Ваш прогресс здоровья",
  tab_Daily: "День",
  tab_Monthly: "Месяц",
  tab_Weekly: "Неделя",
  tab_Yearly: "Год",
  stress_recovery: "Баланс стресса / восстановления",
  recovery_note: "Вы достигли оптимального восстановления. Постоянный режим сна поможет это сохранить",
  glucose: "Глюкоза",
  mgdl: "мг/дл",
  capacity68: "68% ёмкости",
  patient_flow: "Поток пациентов",
  completed: "Завершено",
  upcoming: "Предстоящие",
  healthcare_providers: "Медицинские работники",
  provider_name: "Имя врача",
  department: "Отделение",
  contact: "Контакт",
  action: "Действие",
  filter: "Фильтр",
  available: "Доступен",
  absent: "Отсутствует",
  Pathology: "Патология",
  Orthopedics: "Ортопедия",
  aria_sub: "Ваш личный ИИ-ассистент",
  credits: "Осталось 100 кредитов",
  upgrade: "Улучшить",
  ask_anything: "Спросите что угодно...",
  suggestion1: "Почему мой HRV низкий?",
  suggestion2: "Как моё восстановление сегодня?",
  aria_greeting: "Привет! Я Ария, ваш личный ИИ по здоровью. Спрашивайте что угодно о ваших данных здоровья.",
  aria_reply: "На основе ваших недавних данных рекомендую соблюдать режим сна и пить достаточно воды. Ваш HRV указывает на умеренный стресс — попробуйте 10-минутное дыхательное упражнение сегодня.",
  dayShort: { Mon: "Пн", Tue: "Вт", Wed: "Ср", Thu: "Чт", Fri: "Пт", Sat: "Сб", Sun: "Вс" },
  monShort: { Jan: "Янв", Feb: "Фев", Mar: "Мар" },
};

const uz: Dict = {
  nav_dashboard: "Boshqaruv",
  search: "Qidirish...",
  title: "Boshqaruv paneli",
  subtitle: "Xush kelibsiz! Bugun mijozlaringiz bilan nimalar bo‘layotganini ko‘ring",
  total_appointments: "Jami qabullar",
  active_patients: "Faol bemorlar",
  critical_alerts: "Muhim ogohlantirishlar",
  wellness_progress: "Sog‘lig‘ingiz taraqqiyoti",
  tab_Daily: "Kunlik",
  tab_Monthly: "Oylik",
  tab_Weekly: "Haftalik",
  tab_Yearly: "Yillik",
  stress_recovery: "Stress / Tiklanish balansi",
  recovery_note: "Siz optimal tiklanishga erishdingiz. Uyqu rejimini barqaror saqlash buni davom ettiradi",
  glucose: "Glyukoza",
  mgdl: "mg/dL",
  capacity68: "68% sig‘im",
  patient_flow: "Bemorlar oqimi",
  completed: "Yakunlangan",
  upcoming: "Kelgusi",
  healthcare_providers: "Tibbiyot xodimlari",
  provider_name: "Shifokor ismi",
  department: "Bo‘lim",
  contact: "Aloqa",
  action: "Amal",
  filter: "Filtr",
  available: "Mavjud",
  absent: "Yo‘q",
  Pathology: "Patologiya",
  Orthopedics: "Ortopediya",
  aria_sub: "Shaxsiy AI yordamchingiz",
  credits: "100 kredit qoldi",
  upgrade: "Yangilash",
  ask_anything: "Istalgan narsani so‘rang...",
  suggestion1: "Nega HRV past?",
  suggestion2: "Bugun tiklanishim qanday?",
  aria_greeting: "Salom! Men Aria, shaxsiy sog‘liq AI yordamchingizman. Sog‘liq ma'lumotlaringiz haqida so‘rang.",
  aria_reply: "So‘nggi ma'lumotlaringizga ko‘ra, uyqu rejimini barqaror saqlash va yetarlicha suv ichishni tavsiya qilaman. HRV ko‘rsatkichlaringiz o‘rtacha stressni bildiradi — bugun 10 daqiqalik nafas mashqini sinab ko‘ring.",
  dayShort: { Mon: "Dush", Tue: "Sesh", Wed: "Chor", Thu: "Pay", Fri: "Jum", Sat: "Shan", Sun: "Yak" },
  monShort: { Jan: "Yan", Feb: "Fev", Mar: "Mar" },
};

const dicts: Record<Lang, Dict> = { en, ru, uz };

export const LANGS: { code: Lang; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "ru", label: "RU" },
  { code: "uz", label: "UZ" },
];

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (k: string) => string; d: Dict };

const I18nCtx = createContext<Ctx>({ lang: "en", setLang: () => {}, t: (k) => k, d: en });

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");
  const d = dicts[lang];
  const t = (k: string) => ((d as any)[k] ?? (en as any)[k] ?? k) as string;
  return <I18nCtx.Provider value={{ lang, setLang, t, d }}>{children}</I18nCtx.Provider>;
}

export const useI18n = () => useContext(I18nCtx);
