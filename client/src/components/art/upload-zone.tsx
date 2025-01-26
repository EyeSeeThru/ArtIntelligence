import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { AnalysisResult } from "@/lib/art-analysis";

interface UploadZoneProps {
  onImagesSelected: (files: File[]) => void;
  selectedImages: File[];
  onAnalysisComplete: (results: AnalysisResult[]) => void;
}

export default function UploadZone({ 
  onImagesSelected, 
  selectedImages,
  onAnalysisComplete 
}: UploadZoneProps) {
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    onImagesSelected([...selectedImages, ...acceptedFiles]);
  }, [selectedImages, onImagesSelected]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    maxSize: 5242880 // 5MB
  });

  const removeImage = (index: number) => {
    const newImages = [...selectedImages];
    newImages.splice(index, 1);
    onImagesSelected(newImages);
  };

  const analyzeMutation = useMutation({
    mutationFn: async (files: File[]) => {
      const formData = new FormData();
      files.forEach(file => formData.append('images', file));

      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Analysis complete",
        description: "Your artwork has been analyzed successfully."
      });
      onAnalysisComplete(data);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to analyze artwork. Please try again.",
        variant: "destructive"
      });
    }
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'}`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
        <p className="mt-2 text-sm text-muted-foreground">
          Drag & drop images here, or click to select files
        </p>
      </div>

      {selectedImages.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {selectedImages.map((file, index) => (
            <Card key={index} className="relative group">
              <img
                src={URL.createObjectURL(file)}
                alt={`Upload ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeImage(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </Card>
          ))}
        </div>
      )}

      {selectedImages.length > 0 && (
        <Button
          className="w-full"
          onClick={() => analyzeMutation.mutate(selectedImages)}
          disabled={analyzeMutation.isPending}
        >
          {analyzeMutation.isPending ? "Analyzing..." : "Analyze Artwork"}
        </Button>
      )}
    </div>
  );
}