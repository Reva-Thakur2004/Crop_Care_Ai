import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      welcome: "Welcome back",
      dashboard: "Dashboard",
      upload: "Scan Leaf",
      history: "History",
      stores: "Agri Stores",
      newScan: "New Scan Diagnosis",
      totalDiagnoses: "Total Diagnoses",
      healthyCrops: "Healthy Crops",
      diseasedLeaves: "Diseased Leaves",
      accuracyRate: "Accuracy Rate",
      weatherAdvisory: "Crop Weather Advisory",
      recentDiagnoses: "Recent Diagnoses",
      symptoms: "Observed Symptoms",
      treatments: "Treatment Recommendations",
      organic: "Organic Solutions",
      chemical: "Chemical Solutions",
      dosage: "Recommended Application & Dosage",
      logout: "Logout",
      crop: "Crop",
      disease: "Condition",
      confidence: "Confidence",
      date: "Date",
      viewAll: "View All",
      risk: "Disease Risk",
      assessment: "Risk Assessment Details",
      loading: "Loading AgriVision AI..."
    }
  },
  hi: {
    translation: {
      welcome: "स्वागत है",
      dashboard: "डैशबोर्ड",
      upload: "लीफ स्कैन",
      history: "इतिहास",
      stores: "कृषि दुकानें",
      newScan: "नया स्कैन निदान",
      totalDiagnoses: "कुल निदान",
      healthyCrops: "स्वस्थ फसलें",
      diseasedLeaves: "बीमार पत्तियां",
      accuracyRate: "सटीकता दर",
      weatherAdvisory: "फसल मौसम सलाह",
      recentDiagnoses: "हाल के निदान",
      symptoms: "देखे गए लक्षण",
      treatments: "उपचार सिफारिशें",
      organic: "जैविक समाधान",
      chemical: "रासायनिक समाधान",
      dosage: "अनुशंसित खुराक और अनुप्रयोग",
      logout: "लॉगआउट",
      crop: "फसल",
      disease: "स्थिति",
      confidence: "विश्वास",
      date: "दिनांक",
      viewAll: "सभी देखें",
      risk: "रोग का जोखिम",
      assessment: "जोखिम मूल्यांकन विवरण",
      loading: "कृषि-विज़न एआई लोड हो रहा है..."
    }
  },
  mr: {
    translation: {
      welcome: "स्वागत आहे",
      dashboard: "डॅशबोर्ड",
      upload: "लीफ स्कॅन",
      history: "इतिहास",
      stores: "कृषी दुकाने",
      newScan: "नवीन स्कॅन निदान",
      totalDiagnoses: "एकूण निदान",
      healthyCrops: "निरोगी पिके",
      diseasedLeaves: "आजारी पाने",
      accuracyRate: "अचूकता दर",
      weatherAdvisory: "पीक हवामान सल्ला",
      recentDiagnoses: "अलीकडील निदान",
      symptoms: "आढळलेली लक्षणे",
      treatments: "उपचाराच्या शिफारसी",
      organic: "सेंद्रिय उपाय",
      chemical: "रासायनिक उपाय",
      dosage: "शिफारस केलेले डोस आणि वापर",
      logout: "लॉगआउट",
      crop: "पीक",
      disease: "स्थिती",
      confidence: "आत्मविश्वास",
      date: "दिनांक",
      viewAll: "सर्व पहा",
      risk: "रोगाचा धोका",
      assessment: "धोका मूल्यांकन तपशील",
      loading: "कृषी-व्हिजन एआय लोड होत आहे..."
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('lng') || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
