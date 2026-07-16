export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8787";

export const BOARDS = [
  "dhaka",
  "rajshahi",
  "comilla",
  "chittagong",
  "jessore",
  "sylhet",
  "dinajpur",
  "barisal",
  "mymensingh",
  "madrasah",
  "technical",
];

// Mapping for SMS Board Codes
export const SMS_BOARD_CODES = {
  dhaka: "DHA",
  rajshahi: "RAJ",
  comilla: "COM",
  chittagong: "CHI",
  jessore: "JES",
  sylhet: "SYL",
  dinajpur: "DIN",
  barisal: "BAR",
  mymensingh: "MYM",
  madrasah: "MAD",
  technical: "TEC",
};

export const GRADE_COLORS = {
  "A+": "text-emerald-400 bg-emerald-400/10 border-emerald-500/20",
  A: "text-lime-400 bg-lime-400/10 border-lime-400/20",
  "A-": "text-yellow-400 bg-yellow-400/10 border-yellow-500/20",
  B: "text-amber-400 bg-amber-400/10 border-amber-500/20",
  C: "text-orange-400 bg-orange-400/10 border-orange-500/20",
  D: "text-rose-400 bg-rose-400/10 border-rose-500/20",
  F: "text-red-500 bg-red-500/10 border-red-500/25",
};

// Bangla translations for backend / network error messages
export const ERROR_TRANSLATIONS = {
  "Result not found. Please check your details.":
    "ফলাফল পাওয়া যায়নি। তথ্যগুলো সঠিক আছে কিনা যাচাই করুন।",

  "Wrong captcha. Please refresh and try again.":
    "ক্যাপচা কোড ভুল হয়েছে। ছবিতে দেখানো কোডটি নির্ভুলভাবে লিখুন।",

  "Network timeout. Check your internet connection.":
    "এই মুহূর্তে সার্ভার ডাউন রয়েছে। কিছুক্ষণ পর আবার চেষ্টা করুন অথবা মেসেজের মাধ্যমে রেজাল্ট চেক করুন ",

  "Security validation failed.":
    "নিরাপত্তা যাচাই ব্যর্থ হয়েছে। পেজটি রিফ্রেশ করুন। ",
};
