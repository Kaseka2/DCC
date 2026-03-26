"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

type Language = "en" | "sw";

type Dictionary = Record<string, { en: string; sw: string }>;

const dictionary: Dictionary = {
  overview: { en: "Overview", sw: "Muhtasari" },
  members: { en: "Members", sw: "Washiriki" },
  donations: { en: "Offerings", sw: "Sadaka" },
  attendance: { en: "Attendance", sw: "Mahudhurio" },
  events: { en: "Events", sw: "Matukio" },
  sermons: { en: "Sermons", sw: "Mahubiri" },
  reports: { en: "Reports", sw: "Ripoti" },
  userManagement: { en: "User Management", sw: "Usimamizi wa Watumiaji" },
  signOut: { en: "Sign out", sw: "Ondoka" },
  welcomeBack: { en: "Welcome back", sw: "Karibu tena" },
  accessLevel: { en: "Access level", sw: "Kiwango cha ruhusa" },
  dark: { en: "Dark", sw: "Giza" },
  light: { en: "Light", sw: "Mwanga" },
  language: { en: "Swahili", sw: "English" },
  dashboard: { en: "Dashboard", sw: "Dashibodi" },
  memberPortal: { en: "Member Portal", sw: "Jukwaa la Mshiriki" },
  signIn: { en: "Sign in", sw: "Ingia" },
  username: { en: "Username", sw: "Jina la mtumiaji" },
  password: { en: "Password", sw: "Nenosiri" },
  addMember: { en: "Add Member", sw: "Ongeza Mshiriki" },
  addDonation: { en: "Add Offering", sw: "Ongeza Sadaka" },
  addAttendance: { en: "Add Record", sw: "Ongeza Rekodi" },
  addEvent: { en: "Add Event", sw: "Ongeza Tukio" },
  addSermon: { en: "Add Sermon", sw: "Ongeza Mahubiri" },
  save: { en: "Save", sw: "Hifadhi" },
  delete: { en: "Delete", sw: "Futa" },
  collapse: { en: "Collapse", sw: "Funga" },
  expand: { en: "Expand", sw: "Panua" },
  createUser: { en: "Create User", sw: "Unda Mtumiaji" },
  downloadCsv: { en: "Download CSV", sw: "Pakua CSV" },
  memberDirectory: { en: "Member Directory", sw: "Orodha ya Washiriki" },
  givingRecords: { en: "Offering Records", sw: "Rekodi za Sadaka" },
  offeringTypes: { en: "Offering Types", sw: "Aina za Sadaka" },
  offeringType: { en: "Offering type", sw: "Aina ya sadaka" },
  requiresMember: { en: "Requires member name", sw: "Inahitaji jina la mshiriki" },
  offeringTotals: { en: "Totals by type", sw: "Jumla kwa aina" },
  notesLabel: { en: "Notes / description", sw: "Maelezo" },
  addType: { en: "Add type", sw: "Ongeza aina" },
  addTypeFirst: {
    en: "Add an offering type first to record offerings.",
    sw: "Ongeza aina ya sadaka kwanza ili kurekodi sadaka.",
  },
  yes: { en: "Yes", sw: "Ndiyo" },
  no: { en: "No", sw: "Hapana" },
  pledges: { en: "Pledges", sw: "Ahadi" },
  pledgeRecords: { en: "Pledge Records", sw: "Rekodi za Ahadi" },
  addPledge: { en: "Add Pledge", sw: "Ongeza Ahadi" },
  purpose: { en: "Purpose", sw: "Lengo" },
  statusOpen: { en: "Open", sw: "Wazi" },
  statusFulfilled: { en: "Fulfilled", sw: "Imetimizwa" },
  statusCancelled: { en: "Cancelled", sw: "Imefutwa" },
  edit: { en: "Edit", sw: "Hariri" },
  cancel: { en: "Cancel", sw: "Ghairi" },
  serviceName: { en: "Service", sw: "Ibada" },
  cause: { en: "Cause", sw: "Lengo" },
  anonymousOfferings: {
    en: "General Offerings (No Names)",
    sw: "Sadaka za Jumla (Bila Majina)",
  },
  quickAddNoNames: {
    en: "Quick add (no names)",
    sw: "Ongeza haraka (bila majina)",
  },
  monthlyTotalsByType: {
    en: "Monthly totals by type",
    sw: "Jumla za mwezi kwa aina",
  },
  exportCategory: {
    en: "Export by category",
    sw: "Hamisha kwa aina",
  },
  filter: { en: "Filter", sw: "Chuja" },
  dateFrom: { en: "From", sw: "Kuanzia" },
  dateTo: { en: "To", sw: "Hadi" },
  weekly: { en: "Weekly", sw: "Kila wiki" },
  monthly: { en: "Monthly", sw: "Kila mwezi" },
  noMonthlyOfferings: {
    en: "No offerings recorded this month yet.",
    sw: "Hakuna sadaka zilizorekodiwa mwezi huu.",
  },
  attendanceRecords: { en: "Attendance Records", sw: "Rekodi za Mahudhurio" },
  eventCalendar: { en: "Event Calendar", sw: "Kalenda ya Matukio" },
  sermonLibrary: { en: "Sermon Library", sw: "Maktaba ya Mahubiri" },
  reportsExports: { en: "Reports & Exports", sw: "Ripoti na Usafirishaji" },
  overviewSubtitle: {
    en: "Quick insights across the ministry, giving, and planning.",
    sw: "Muhtasari wa haraka kuhusu huduma, michango, na mipango.",
  },
  membersSubtitle: {
    en: "Manage member profiles, contact details, and ministry assignments.",
    sw: "Simamia profaili za washiriki, mawasiliano, na majukumu ya huduma.",
  },
  donationsSubtitle: {
    en: "Record offerings by type, including tithes, thanksgiving, and special collections.",
    sw: "Rekodi sadaka kwa aina, ikiwemo zaka, sadaka za shukrani, na michango maalum.",
  },
  attendanceSubtitle: {
    en: "Track service attendance, event participation, and follow-up.",
    sw: "Fuatilia mahudhurio ya ibada, ushiriki wa matukio, na ufuatiliaji.",
  },
  eventsSubtitle: {
    en: "Plan services, conferences, and ministry gatherings.",
    sw: "Panga ibada, makongamano, na mikutano ya huduma.",
  },
  sermonsSubtitle: {
    en: "Archive sermons, notes, and teaching references.",
    sw: "Hifadhi mahubiri, dondoo, na rejea za mafundisho.",
  },
  reportsSubtitle: {
    en: "Download CSV exports for reporting and backups.",
    sw: "Pakua CSV kwa ripoti na nakala za akiba.",
  },
  memberCount: { en: "Members", sw: "Washiriki" },
  totalGiving: { en: "Total Offerings", sw: "Jumla ya Sadaka" },
  upcomingEvents: { en: "Upcoming Events", sw: "Matukio Yanayokuja" },
  recordedDonations: { en: "Recorded offerings", sw: "Sadaka zilizorekodiwa" },
  activeProfiles: { en: "Active profiles", sw: "Profaili hai" },
  onCalendar: { en: "On the calendar", sw: "Kwenye kalenda" },
  nextSteps: { en: "Next Steps", sw: "Hatua Zijazo" },
  nextStepsBody: {
    en: "Use the sidebar to manage members, attendance, events, sermons, and offerings. Reports and exports are ready for admin review.",
    sw: "Tumia upau wa pembeni kusimamia washiriki, mahudhurio, matukio, mahubiri, na sadaka. Ripoti na usafirishaji ziko tayari kwa ukaguzi wa msimamizi.",
  },
  loginHeadline: {
    en: "Welcome back to your ministry hub",
    sw: "Karibu tena kwenye kitovu cha huduma yako",
  },
  loginSubtitle: {
    en: "Secure access for leadership, staff, and members with centralized management for offerings, attendance, and events.",
    sw: "Ufikiaji salama kwa viongozi, wafanyakazi, na washiriki kwa usimamizi wa sadaka, mahudhurio, na matukio.",
  },
  loginFeatureOne: {
    en: "Track membership, offerings, and attendance in one place.",
    sw: "Fuatilia uanachama, sadaka, na mahudhurio sehemu moja.",
  },
  loginFeatureTwo: {
    en: "Admin-controlled accounts with role-based access.",
    sw: "Akaunti zinazosimamiwa na msimamizi kwa ruhusa kulingana na majukumu.",
  },
  addNewMember: { en: "Add new member", sw: "Ongeza mshiriki mpya" },
  recordDonation: { en: "Record new offering", sw: "Rekodi sadaka mpya" },
  logAttendance: { en: "Log attendance", sw: "Rekodi mahudhurio" },
  createEvent: { en: "Create event", sw: "Unda tukio" },
  member: { en: "Member", sw: "Mshiriki" },
  event: { en: "Event", sw: "Tukio" },
  date: { en: "Date", sw: "Tarehe" },
  status: { en: "Status", sw: "Hali" },
  notes: { en: "Notes", sw: "Maelezo" },
  title: { en: "Title", sw: "Kichwa" },
  location: { en: "Location", sw: "Mahali" },
  description: { en: "Description", sw: "Maelezo" },
  start: { en: "Start", sw: "Mwanzo" },
  end: { en: "End", sw: "Mwisho" },
  preacher: { en: "Preacher", sw: "Mhubiri" },
  summary: { en: "Summary", sw: "Muhtasari" },
  amount: { en: "Amount", sw: "Kiasi" },
  type: { en: "Type", sw: "Aina" },
  paymentMethod: { en: "Payment method", sw: "Njia ya malipo" },
  fullName: { en: "Full name", sw: "Jina kamili" },
  phone: { en: "Phone", sw: "Simu" },
  gender: { en: "Gender", sw: "Jinsia" },
  actions: { en: "Actions", sw: "Vitendo" },
  temporaryPassword: { en: "Temporary password", sw: "Nenosiri la muda" },
  role: { en: "Role", sw: "Jukumu" },
  created: { en: "Created", sw: "Imeundwa" },
  memberPortalBody: {
    en: "Your attendance history, upcoming events, and sermon notes will appear here. If you need a profile update, contact your church administrator.",
    sw: "Historia yako ya mahudhurio, matukio yanayokuja, na dondoo za mahubiri vitaonekana hapa. Ikiwa unahitaji mabadiliko ya profaili, wasiliana na msimamizi wa kanisa.",
  },
  whatNext: { en: "What’s next", sw: "Kinachofuata" },
  reportsMembers: { en: "Member directory export.", sw: "Usafirishaji wa orodha ya washiriki." },
  reportsDonations: { en: "Offering records export.", sw: "Usafirishaji wa rekodi za sadaka." },
  reportsAttendance: { en: "Attendance records export.", sw: "Usafirishaji wa rekodi za mahudhurio." },
  reportsEvents: { en: "Event calendar export.", sw: "Usafirishaji wa kalenda ya matukio." },
  reportsSermons: { en: "Sermon library export.", sw: "Usafirishaji wa maktaba ya mahubiri." },
};

export type DictionaryKey = keyof typeof dictionary;

type LanguageContextValue = {
  language: Language;
  toggleLanguage: () => void;
  t: (key: DictionaryKey) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);
const LANG_KEY = "churchcms-language";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window === "undefined") {
      return "en";
    }
    return (window.localStorage.getItem(LANG_KEY) as Language | null) ?? "en";
  });

  useEffect(() => {
    document.documentElement.dataset.lang = language;
    window.localStorage.setItem(LANG_KEY, language);
  }, [language]);

  function toggleLanguage() {
    setLanguage((current) => (current === "en" ? "sw" : "en"));
  }

  const value = useMemo<LanguageContextValue>(() => {
    return {
      language,
      toggleLanguage,
      t: (key) => dictionary[key][language],
    };
  }, [language]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider.");
  }
  return context;
}
