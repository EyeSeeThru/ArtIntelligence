import { useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import * as d3 from 'd3';

interface AnalysisResult {
  style: string;
  period: string;
  insights: string[];
  connections: {
    artists: string[];
    movements: string[];
  };
}

interface VisualizationProps {
  results: AnalysisResult[];
}

export default function Visualization({ results }: VisualizationProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !results.length) return;

    const width = 800;
    const height = 600;
    const svg = d3.select(svgRef.current);

    // Clear previous visualization
    svg.selectAll("*").remove();

    // Create nodes from results with unique IDs
    const nodes = results.flatMap((result, idx) => [
      { id: `style-${idx}-${result.style}`, label: result.style, group: 'style', radius: 20 },
      { id: `period-${idx}-${result.period}`, label: result.period, group: 'period', radius: 20 },
      ...result.connections.artists.map(artist => ({ 
        id: `artist-${artist}`, 
        label: artist, 
        group: 'artist', 
        radius: 15 
      })),
      ...result.connections.movements.map(movement => ({ 
        id: `movement-${movement}`, 
        label: movement, 
        group: 'movement', 
        radius: 15 
      }))
    ]);

    // Create links between nodes
    const links = results.flatMap((result, idx) => [
      ...result.connections.artists.map(artist => ({
        source: `style-${idx}-${result.style}`,
        target: `artist-${artist}`,
        value: 1
      })),
      ...result.connections.movements.map(movement => ({
        source: `period-${idx}-${result.period}`,
        target: `movement-${movement}`,
        value: 1
      }))
    ]);

    // Define color scheme
    const colors: Record<string, string> = {
      style: 'hsl(var(--primary))',
      period: 'hsl(var(--secondary))',
      artist: 'hsl(var(--accent))',
      movement: 'hsl(var(--muted))'
    };

    // Create force simulation
    const simulation = d3.forceSimulation(nodes as any)
      .force("link", d3.forceLink(links).id((d: any) => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius((d: any) => d.radius + 10));

    // Create container group with zoom behavior
    const g = svg.append("g");
    svg.call(d3.zoom()
      .extent([[0, 0], [width, height]])
      .scaleExtent([0.25, 4])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      }) as any);

    // Draw links
    const link = g.append("g")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", "hsl(var(--border))")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", 2);

    // Create node groups
    const node = g.append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended) as any);

    // Add circles to nodes
    node.append("circle")
      .attr("r", (d: any) => d.radius)
      .attr("fill", (d: any) => colors[d.group])
      .attr("stroke", "hsl(var(--border))")
      .attr("stroke-width", 2)
      .attr("cursor", "grab")
      .on("mouseover", function() {
        d3.select(this)
          .attr("stroke-width", 3)
          .attr("stroke", "hsl(var(--primary))");
      })
      .on("mouseout", function() {
        d3.select(this)
          .attr("stroke-width", 2)
          .attr("stroke", "hsl(var(--border))");
      });

    // Add labels
    const label = node.append("text")
      .text((d: any) => d.label)
      .attr("x", (d: any) => d.radius + 5)
      .attr("y", "0.31em")
      .attr("font-size", "12px")
      .attr("fill", "hsl(var(--foreground))")
      .clone(true).lower()
      .attr("fill", "none")
      .attr("stroke", "hsl(var(--background))")
      .attr("stroke-width", 3);

    // Update positions on simulation tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node
        .attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    // Drag functions
    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
      d3.select(this).select("circle").attr("cursor", "grabbing");
    }

    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
      d3.select(this).select("circle").attr("cursor", "grab");
    }

    // Add legend
    const legend = svg.append("g")
      .attr("transform", `translate(20, ${height - 100})`);

    Object.entries(colors).forEach(([key, color], i) => {
      const legendRow = legend.append("g")
        .attr("transform", `translate(0, ${i * 25})`);

      legendRow.append("circle")
        .attr("r", 7)
        .attr("fill", color);

      legendRow.append("text")
        .attr("x", 15)
        .attr("y", 5)
        .attr("fill", "hsl(var(--foreground))")
        .style("font-size", "12px")
        .text(key.charAt(0).toUpperCase() + key.slice(1));
    });

  }, [results]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Artistic Connections Visualization</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative aspect-[4/3] w-full">
          <svg 
            ref={svgRef} 
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 800 600" 
            preserveAspectRatio="xMidYMid meet"
          />
        </div>
      </CardContent>
    </Card>
  );
}