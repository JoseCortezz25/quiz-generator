"use client";
import { ChangeEvent, DragEvent, useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { FileUp, Check, File, OctagonXIcon, ImagePlusIcon } from 'lucide-react';
import { FileType, usePDF } from '@/store/store';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslations } from 'next-intl';

interface PDFUploaderProps {
  onUpload: () => void;
}

export default function PDFUploader({ onUpload }: PDFUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);
  const [fileNames, setFileNames] = useState<string[]>([]);
  const [showInvalidGenerate, setShowInvalidGenerate] = useState(false);
  const { setUploadedFiles, setTypeFile } = usePDF();
  const quizCount = typeof window !== 'undefined' ? parseInt(localStorage.getItem('quizCount') || '0') : 0;
  const [activeTab, setActiveTab] = useState(FileType.PDF);
  const [error, setError] = useState<string | null>(null);
  const t = useTranslations('HomePage');

  useEffect(() => {
    const invalidGenerate = quizCount >= 5 && !localStorage.getItem('apiKey');
    setShowInvalidGenerate(invalidGenerate);
  }, [quizCount]);

  const handleUpload = () => {
    const fileInput = document.getElementById('fileInput');
    if (fileInput) {
      fileInput.click();
    }
  };

  const isValidFileType = (file: File) => {
    setError(null);
    if (activeTab === FileType.PDF) {
      if (file.type !== "application/pdf") {
        setError("Por favor, sube únicamente archivos PDF.");
        return false;
      }
    } else {
      const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!validImageTypes.includes(file.type)) {
        setError("Por favor, sube únicamente imágenes (JPEG, PNG, GIF).");
        return false;
      }
    }
    return true;
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0 && files.every(isValidFileType)) {
      uploadFiles(files);
      setFileNames(files.map(file => file.name));
    }
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer?.files || []);
    if (files.length > 0 && files.every(isValidFileType)) {
      uploadFiles(files);
      setFileNames(files.map(file => file.name));
    }
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const uploadFiles = (files: File[]) => {
    setShowInvalidGenerate(false);
    setIsUploading(true);
    if (files.length > 0) {
      setUploadedFiles(files);
      setTimeout(() => {
        setIsUploading(false);
        setIsUploaded(true);
        setTimeout(() => {
          onUpload();
        }, 1000);
      }, 2000);
    }
  };

  const LimitReached = () => {
    return (
      <div className="flex flex-col items-center">
        <OctagonXIcon className="w-16 h-16 text-[#00FF88] mb-4" />
        <p className="text-[#00FF88] font-semibold mb-4 w-[60%] text-center">
          {t('mainContent.limit')}
        </p>
      </div>
    );
  };

  const UploadPDF = () => {
    return (
      <div className="flex flex-col items-center">
        <Check className="w-16 h-16 text-[#00FF88] mb-4" />
        <p className="text-[#00FF88] font-semibold mb-4">{t('mainContent.file.title')}</p>
        <Button
          onClick={onUpload}
          className="bg-[#00FF88] text-black hover:bg-[#00FF88]/90"
        >
          {t('mainContent.file.cta')}
        </Button>
      </div>
    );
  };

  const UploadedPDF = () => {
    return (
      <div
        className="space-y-4 w-full"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <div
          id="uploadArea"
          className="border-2 border-dashed border-gray-700 rounded-lg p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#00FF88]/50 transition-colors"
          onClick={handleUpload}
        >
          {fileNames.length > 0 ? (
            <div className="flex flex-col gap-2 w-full">
              {fileNames.map((fileName, index) => (
                <div key={index} className="flex gap-4 items-center">
                  <File className="size-6 text-[#00FF88]" />
                  <p className="text-gray-400 text-start text-sm">{fileName}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">
              {t('mainContent.file.select')} {activeTab === FileType.PDF ? t('mainContent.file.pdf') : t('mainContent.file.image')}
            </p>
          )}
          {error && (
            <p className="text-red-500 mt-2 text-sm">{error}</p>
          )}
        </div>
        <input
          id="fileInput"
          type="file"
          accept={activeTab === FileType.PDF ? "application/pdf" : "image/*"}
          className="hidden"
          onChange={handleFileChange}
          multiple={activeTab === FileType.IMAGE}
        />
        <Button
          onClick={handleUpload}
          disabled={isUploading}
          className="w-full bg-[#00FF88] text-black hover:bg-[#00FF88]/90"
        >
          {isUploading ? t('mainContent.file.submiting') : `${t('mainContent.file.submit')} ${activeTab === FileType.PDF ? t('mainContent.file.pdf') : t('mainContent.file.image')}`}
        </Button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0A0E12] text-white flex flex-col">
      {/* Main content */}
      <main className="flex-grow flex items-center">
        <div className="mx-auto py-12 grid grid-cols-1 md:grid-cols-2 gap-16">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              {t('mainContent.headline')}
            </h1>
            <p className="text-xl text-gray-400 text-balance">
              {t('mainContent.description')}
            </p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-[#00FF88]" />
                <span>{t('mainContent.features.aiQuestions')}</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-[#00FF88]" />
                <span>{t('mainContent.features.tailoredContent')}</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-[#00FF88]" />
                <span>{t('mainContent.features.instantFeedback')}</span>
              </li>
            </ul>
          </div>

          {/* Right column - PDF upload */}
          <div className="bg-[#1A1F25] rounded-lg p-8 flex flex-col items-center justify-center md:max-w-[95%]">
            <Tabs
              defaultValue={FileType.PDF}
              className="file-tabs"
              onValueChange={(value) => {
                setActiveTab(value as FileType);
                setTypeFile(value as FileType);
              }}
            >
              <TabsList className="file-tabs__list">
                <TabsTrigger value={FileType.PDF}>{t('mainContent.file.pdf')}</TabsTrigger>
                <TabsTrigger value={FileType.IMAGE} className="capitalize">{t('mainContent.file.image')}</TabsTrigger>
              </TabsList>
              <TabsContent value={FileType.PDF}>
                <section className="w-full">
                  <div className="flex gap-4 mt-5 flex-col items-center sm:items-start sm:flex-row">
                    <div className="min-w-20 min-h-20 w-20 h-20 rounded-full bg-[#00FF88]/10 flex items-center justify-center mb-6">
                      <FileUp className="w-10 h-10 text-[#00FF88]" />
                    </div>
                    <div className="flex flex-col items-center sm:items-start">
                      <h2 className="text-2xl font-bold">{t('mainContent.file.headline')} {t('mainContent.file.pdf')}</h2>
                      <p className="text-gray-400 mb-6 text-balance text-center sm:text-start md:max-w-[320px]">
                        {t('mainContent.file.description.pdf')}
                      </p>
                    </div>
                  </div>

                  {showInvalidGenerate && <LimitReached />}
                  {!showInvalidGenerate && isUploaded && <UploadPDF />}
                  {!showInvalidGenerate && !isUploaded && <UploadedPDF />}
                </section>
              </TabsContent>
              <TabsContent value={FileType.IMAGE}>
                <section className="w-full">
                  <div className="flex gap-4 mt-5 flex-col items-center sm:items-start sm:flex-row">
                    <div className="min-w-20 min-h-20 w-20 h-20 rounded-full bg-[#00FF88]/10 flex items-center justify-center mb-6">
                      <ImagePlusIcon className="w-10 h-10 text-[#00FF88]" />
                    </div>
                    <div className="flex flex-col items-center sm:items-start">
                      <h2 className="text-2xl font-bold">{t('mainContent.file.headline')} {t('mainContent.file.image')}</h2>
                      <p className="text-gray-400 mb-6 text-balance text-center sm:text-start md:max-w-[320px]">
                        {t('mainContent.file.description.image')}
                      </p>
                    </div>
                  </div>

                  {showInvalidGenerate && <LimitReached />}
                  {!showInvalidGenerate && isUploaded && <UploadPDF />}
                  {!showInvalidGenerate && !isUploaded && <UploadedPDF />}
                </section>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
}