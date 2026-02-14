'use client';

import { useState } from 'react';
import { summarizeBylaws } from '@/ai/flows/bylaws-summarization';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, FileUp, FileText, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/context/language-context';

const clientOnlyTranslations = {
  en: {
    invalidFileType: 'Invalid File Type',
    pleaseUploadPdf: 'Please upload a PDF file.',
    noFileSelected: 'No File Selected',
    pleaseChoosePdf: 'Please choose a PDF file to summarize.',
    readFileError: 'Failed to read the selected file. Please try again.',
    summaryError: 'Failed to generate summary.',
    unknownError: 'An unknown error occurred.',
  },
  ar: {
    invalidFileType: 'نوع ملف غير صالح',
    pleaseUploadPdf: 'يرجى تحميل ملف PDF.',
    noFileSelected: 'لم يتم اختيار ملف',
    pleaseChoosePdf: 'يرجى اختيار ملف PDF لتلخيصه.',
    readFileError: 'فشل في قراءة الملف المحدد. يرجى المحاولة مرة أخرى.',
    summaryError: 'فشل في إنشاء الملخص.',
    unknownError: 'حدث خطأ غير معروف.',
  }
};

export function BylawsClient({ translations }: { translations: Record<string, string> }) {
  const [file, setFile] = useState<File | null>(null);
  const [summary, setSummary] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const { toast } = useToast();
  const { language } = useLanguage();
  const t = clientOnlyTranslations[language];

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        toast({
          variant: 'destructive',
          title: t.invalidFileType,
          description: t.pleaseUploadPdf,
        });
        setFile(null);
        event.target.value = ''; // Reset file input
        return;
      }
      setFile(selectedFile);
      setSummary('');
      setError('');
    }
  };

  const handleSummarize = async () => {
    if (!file) {
      toast({
        variant: 'destructive',
        title: t.noFileSelected,
        description: t.pleaseChoosePdf,
      });
      return;
    }

    setIsLoading(true);
    setError('');
    setSummary('');

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const pdfDataUri = reader.result as string;
        const result = await summarizeBylaws({ pdfDataUri });
        setSummary(result.summary);
      };
      reader.onerror = (error) => {
        console.error('Error reading file:', error);
        setError(t.readFileError);
      };
    } catch (e) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : t.unknownError;
      setError(`${t.summaryError} ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="font-headline text-2xl text-primary">{translations.cardTitle}</CardTitle>
        <CardDescription>
          {translations.cardDescription}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="bylaws-upload">{translations.uploadLabel}</Label>
          <div className="flex items-center gap-4">
            <Input id="bylaws-upload" type="file" accept="application/pdf" onChange={handleFileChange} className="flex-grow" />
            <Button onClick={handleSummarize} disabled={isLoading || !file}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin rtl:ml-2 rtl:mr-0" />
                  {translations.summarizing}
                </>
              ) : (
                <>
                  <FileUp className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />
                  {translations.summarize}
                </>
              )}
            </Button>
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{translations.errorTitle}</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {summary && (
          <div className="space-y-4 rounded-lg border bg-secondary/50 p-4">
            <h3 className="font-headline text-xl text-primary flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {translations.summaryTitle}
            </h3>
            <div className="prose prose-sm max-w-none text-foreground whitespace-pre-wrap">{summary}</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
