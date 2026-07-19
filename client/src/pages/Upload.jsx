import React, { useState, useRef } from 'react';
import axios from 'axios';
import DashboardLayout from '../components/DashboardLayout';
import { 
  UploadCloud, 
  Camera, 
  RefreshCw, 
  FileText, 
  ShieldAlert, 
  Leaf, 
  CheckCircle, 
  Download, 
  Sparkles,
  Zap
} from 'lucide-react';
import { jsPDF } from 'jspdf';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Upload() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  
  // Webcam states
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // File drag & drop states
  const [dragActive, setDragActive] = useState(false);

  // Handle file select
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setResult(null);
      setError('');
    }
  };

  // Drag handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      setFile(droppedFile);
      setPreview(URL.createObjectURL(droppedFile));
      setResult(null);
      setError('');
    }
  };

  // Webcam controls
  const startCamera = async () => {
    setResult(null);
    setError('');
    setShowCamera(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      videoRef.current.srcObject = stream;
      streamRef.current = stream;
    } catch (err) {
      console.error(err);
      setError('Could not open camera. Please grant permissions or upload an image instead.');
      setShowCamera(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      
      canvas.toBlob((blob) => {
        const capturedFile = new File([blob], `webcam-${Date.now()}.jpg`, { type: 'image/jpeg' });
        setFile(capturedFile);
        setPreview(URL.createObjectURL(capturedFile));
        stopCamera();
      }, 'image/jpeg');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setShowCamera(false);
  };

  // Submit diagnosis
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select or capture a photo first.');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await axios.post(`${API_URL}/api/prediction/predict`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setResult(res.data.data.prediction);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to analyze crop leaf. Please verify that the AI microservice is online.');
    } finally {
      setLoading(false);
    }
  };

  // PDF generation
  const downloadPDFReport = () => {
    if (!result) return;
    
    const doc = new jsPDF();
    const primaryColor = [16, 185, 129]; // Emerald 500
    
    // Header
    doc.setFillColor(15, 118, 110); // Teal 700
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text("AgriVision AI - Diagnosis Report", 15, 25);
    
    // Date
    doc.setTextColor(200, 200, 200);
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 150, 25);
    
    // Body layout
    doc.setTextColor(30, 41, 59); // Slate 800
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Diagnosis Results Summary", 15, 55);
    doc.line(15, 57, 195, 57);
    
    // Details table
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(`Target Crop: ${result.crop}`, 15, 68);
    doc.text(`Condition Identified: ${result.disease}`, 15, 76);
    doc.text(`Diagnosis Confidence: ${result.confidence}%`, 15, 84);
    doc.text(`Condition Severity: ${result.severity || 'N/A'}`, 15, 92);
    
    // Symptoms
    doc.setFont("helvetica", "bold");
    doc.text("Identified Symptoms", 15, 105);
    doc.line(15, 107, 195, 107);
    doc.setFont("helvetica", "normal");
    let y = 115;
    result.symptoms.forEach((symp) => {
      doc.text(`- ${symp}`, 18, y);
      y += 8;
    });
    
    // Treatments
    y += 5;
    doc.setFont("helvetica", "bold");
    doc.text("Treatment Plan & Guidelines", 15, y);
    doc.line(15, y + 2, 195, y + 2);
    y += 10;
    
    // Organic
    doc.setFont("helvetica", "bold");
    doc.text("Organic Treatments:", 15, y);
    doc.setFont("helvetica", "normal");
    y += 8;
    result.treatment.organic.forEach((tr) => {
      const splitText = doc.splitTextToSize(`- ${tr}`, 180);
      doc.text(splitText, 18, y);
      y += (splitText.length * 6);
    });
    
    // Chemical
    y += 3;
    doc.setFont("helvetica", "bold");
    doc.text("Chemical Treatments:", 15, y);
    doc.setFont("helvetica", "normal");
    y += 8;
    result.treatment.chemical.forEach((tr) => {
      const splitText = doc.splitTextToSize(`- ${tr}`, 180);
      doc.text(splitText, 18, y);
      y += (splitText.length * 6);
    });

    // Dosage
    if (result.dosage && result.dosage !== "None required") {
      y += 5;
      doc.setFont("helvetica", "bold");
      doc.text(`Pesticide Dosage:`, 15, y);
      doc.setFont("helvetica", "normal");
      y += 8;
      const splitDosage = doc.splitTextToSize(result.dosage, 180);
      doc.text(splitDosage, 18, y);
    }
    
    // Footer
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text("Report compiled by AgriVision AI. Consult an agricultural expert for final review.", 15, 280);
    
    doc.save(`AgriVision_Report_${result.crop}_${result.disease.replace(/\s+/g, '_')}.pdf`);
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Intro */}
        <div className="bg-emerald-600/5 dark:bg-emerald-950/20 border border-emerald-500/20 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-4">
          <div className="p-3 bg-emerald-500 rounded-xl text-white">
            <Leaf className="h-8 w-8" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white">Smart Crop Leaf Diagnosis</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Upload a clear photo of an infected crop leaf or capture it using your camera. Our AI model currently detects diseases in <strong className="text-emerald-600 dark:text-emerald-400">Tomato, Potato, and Rice</strong>.
            </p>
          </div>
        </div>

        {/* Upload Panel Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          {error && (
            <div className="mb-4 p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50 rounded-xl text-sm text-red-600 dark:text-red-400 flex items-center gap-3">
              <ShieldAlert className="h-5 w-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Camera View */}
          {showCamera ? (
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-4 bg-slate-950 relative overflow-hidden">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                className="w-full max-h-[350px] object-cover rounded-xl"
              ></video>
              <div className="mt-4 flex gap-3 z-10">
                <button
                  onClick={capturePhoto}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center gap-2 cursor-pointer transition-all active:scale-95"
                >
                  <Camera className="h-5 w-5" />
                  Capture Photo
                </button>
                <button
                  onClick={stopCamera}
                  className="px-6 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium cursor-pointer transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            /* Drag & Drop Frame */
            <form onSubmit={handleSubmit} onDragEnter={handleDrag} className="space-y-6">
              <div
                className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-all ${
                  dragActive 
                    ? "border-emerald-500 bg-emerald-500/5" 
                    : "border-slate-300 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 bg-slate-50 dark:bg-slate-800/40"
                }`}
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
              >
                {preview ? (
                  <div className="flex flex-col items-center">
                    <img 
                      src={preview} 
                      alt="Crop leaf preview" 
                      className="max-h-[260px] max-w-full rounded-xl object-contain shadow-md mb-4"
                    />
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={startCamera}
                        className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 font-semibold rounded-xl text-sm transition-all cursor-pointer flex items-center gap-2"
                      >
                        <Camera className="h-4 w-4" />
                        Take Another
                      </button>
                      <label className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 font-semibold rounded-xl text-sm transition-all cursor-pointer flex items-center gap-2">
                        <UploadCloud className="h-4 w-4" />
                        Choose File
                        <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                      </label>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-center">
                    <div className="p-4 bg-white dark:bg-slate-800 rounded-full shadow-md text-emerald-500 mb-4">
                      <UploadCloud className="h-10 w-10 animate-pulse" />
                    </div>
                    <p className="text-base font-semibold text-slate-700 dark:text-slate-200">
                      Drag and drop your leaf photo here
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Supports JPG, JPEG, PNG formats (Max 5MB)
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-3 mt-6">
                      <label className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm shadow-md shadow-emerald-600/20 cursor-pointer flex items-center justify-center gap-2 transition-all active:scale-95">
                        <UploadCloud className="h-4 w-4" />
                        Upload Leaf Photo
                        <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                      </label>
                      
                      <button
                        type="button"
                        onClick={startCamera}
                        className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl text-sm border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-2 transition-all cursor-pointer"
                      >
                        <Camera className="h-4 w-4" />
                        Use Device Camera
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {preview && (
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] transition-all text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="h-5 w-5 animate-spin" />
                      Analyzing Foliage...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" />
                      Get Diagnosis
                    </>
                  )}
                </button>
              )}
            </form>
          )}
        </div>

        {/* Diagnosis Results Card */}
        {result && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden animate-fade-in">
            {/* Header Title */}
            <div className={`p-6 border-b text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              result.status === 'healthy' 
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600' 
                : 'bg-gradient-to-r from-amber-500 to-orange-600'
            }`}>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-8 w-8 text-white shrink-0" />
                <div>
                  <h4 className="text-2xl font-bold leading-tight">{result.crop} - {result.disease}</h4>
                  <p className="text-xs text-white/80 mt-0.5">Status: <span className="font-bold uppercase tracking-wider">{result.status}</span></p>
                </div>
              </div>
              <button
                onClick={downloadPDFReport}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl text-xs font-bold border border-white/20 flex items-center gap-1.5 cursor-pointer self-start sm:self-center"
              >
                <Download className="h-4 w-4" />
                Download Report PDF
              </button>
            </div>

            {/* Results Grid */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Confidence and Stats */}
              <div className="md:col-span-4 space-y-6">
                <div className="p-5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800/80">
                  <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider block mb-2">Confidence Level</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-extrabold text-slate-800 dark:text-white">{result.confidence}%</span>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full mt-3 overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${result.status === 'healthy' ? 'bg-emerald-500' : 'bg-amber-500'}`} 
                      style={{ width: `${result.confidence}%` }}
                    ></div>
                  </div>
                </div>

                <div className="p-5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800/80">
                  <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider block mb-2">Diagnosis Mode</span>
                  <div className="flex items-center gap-2 mt-1">
                    <Zap className="h-5 w-5 text-emerald-500 shrink-0" />
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{result.model_mode}</span>
                  </div>
                </div>

                <div className="p-5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800/80">
                  <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider block mb-2">Condition Severity</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold mt-1 ${
                    result.severity === 'High' 
                      ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' 
                      : result.severity === 'Medium'
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                      : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'
                  }`}>
                    {result.severity} Severity
                  </span>
                </div>
              </div>

              {/* Symptoms and Treatments */}
              <div className="md:col-span-8 space-y-6">
                <div>
                  <h5 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    <FileText className="h-5 w-5 text-emerald-500" />
                    Observed Symptoms
                  </h5>
                  <ul className="mt-3 space-y-2">
                    {result.symptoms.map((symptom, i) => (
                      <li key={i} className="text-sm text-slate-600 dark:text-slate-300 flex items-start gap-2.5">
                        <span className="h-5 w-5 rounded-full bg-slate-100 dark:bg-slate-800 text-xs flex items-center justify-center font-bold text-slate-500 dark:text-slate-400 mt-0.5">{i+1}</span>
                        <span className="mt-0.5">{symptom}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t border-slate-100 dark:border-slate-800/80 pt-6">
                  <h5 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    <Leaf className="h-5 w-5 text-emerald-500" />
                    Treatment Recommendations
                  </h5>
                  
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Organic remedies */}
                    <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/10 border border-emerald-100 dark:border-emerald-900/20 rounded-xl">
                      <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block mb-2">Organic Solutions</span>
                      <ul className="space-y-1.5">
                        {result.treatment.organic.map((org, i) => (
                          <li key={i} className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed list-disc list-inside">
                            {org}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Chemical Remedies */}
                    <div className="p-4 bg-amber-50/50 dark:bg-amber-950/10 border border-amber-100 dark:border-amber-900/20 rounded-xl">
                      <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider block mb-2">Chemical Solutions</span>
                      <ul className="space-y-1.5">
                        {result.treatment.chemical.map((chem, i) => (
                          <li key={i} className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed list-disc list-inside">
                            {chem}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Dosage info */}
                  {result.dosage && result.dosage !== "None required" && (
                    <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-100 dark:border-slate-800/85">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1">Recommended Application & Dosage</span>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{result.dosage}</p>
                    </div>
                  )}
                </div>

              </div>
            </div>
          </div>
        )}
        
      </div>
    </DashboardLayout>
  );
}
