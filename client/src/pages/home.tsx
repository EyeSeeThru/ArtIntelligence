import { Card } from "@/components/ui/card";
import UploadZone from "@/components/art/upload-zone";
import AnalysisResults from "@/components/art/analysis-results";
import Visualization from "@/components/art/visualization";
import { useState } from "react";
import { Image } from "lucide-react";
import { AnalysisResult } from "@/lib/art-analysis";

export default function Home() {
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center">
          <div className="flex items-center space-x-2">
            <Image className="h-6 w-6" />
            <span className="font-semibold">Art Insight AI</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 space-y-8">
        <Card className="p-6">
          <h1 className="text-2xl font-semibold mb-4">
            Upload artwork for AI analysis
          </h1>
          <UploadZone 
            onImagesSelected={setSelectedImages}
            selectedImages={selectedImages}
            onAnalysisComplete={setAnalysisResults}
          />
        </Card>

        {analysisResults.length > 0 && (
          <>
            <AnalysisResults results={analysisResults} />
            <Visualization results={analysisResults} />
          </>
        )}
      </main>
    </div>
  );
}