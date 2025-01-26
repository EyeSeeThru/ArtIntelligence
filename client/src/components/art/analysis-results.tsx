import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface AnalysisResult {
  style: string;
  period: string;
  insights: string[];
  connections: {
    artists: string[];
    movements: string[];
  };
}

interface AnalysisResultsProps {
  results: AnalysisResult[];
}

export default function AnalysisResults({ results }: AnalysisResultsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {results.map((result, index) => (
        <Card key={index} className="overflow-hidden">
          <CardHeader>
            <CardTitle>Analysis Results {index + 1}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Style & Period</h3>
              <div className="flex gap-2 flex-wrap">
                <Badge variant="outline">{result.style}</Badge>
                <Badge variant="outline">{result.period}</Badge>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Key Insights</h3>
              <ScrollArea className="h-32">
                <ul className="space-y-2">
                  {result.insights.map((insight, i) => (
                    <li key={i} className="text-sm">{insight}</li>
                  ))}
                </ul>
              </ScrollArea>
            </div>

            <div>
              <h3 className="font-medium mb-2">Artistic Connections</h3>
              <div className="space-y-2">
                <div className="flex gap-2 flex-wrap">
                  {result.connections.artists.map((artist, i) => (
                    <Badge key={i} variant="secondary">{artist}</Badge>
                  ))}
                </div>
                <div className="flex gap-2 flex-wrap">
                  {result.connections.movements.map((movement, i) => (
                    <Badge key={i} variant="secondary">{movement}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
