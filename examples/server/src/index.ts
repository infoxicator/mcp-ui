import { McpAgent } from 'agents/mcp';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { createRequestHandler } from 'react-router';
import { createUIResource } from '@mcp-ui/server';

// Autovisualiser types and schemas
const VisualizationTypeSchema = z.enum([
  'bar', 'line', 'pie', 'donut', 'scatter',
  'sankey', 'radar', 'treemap', 'chord', 'map'
]);

const BaseChartDataSchema = z.object({
  label: z.string(),
  value: z.number(),
  color: z.string().optional()
});

const LineChartDataSchema = z.object({
  x: z.union([z.string(), z.number()]),
  y: z.number(),
  series: z.string().optional()
});

const SankeyNodeSchema = z.object({
  id: z.string(),
  name: z.string()
});

const SankeyLinkSchema = z.object({
  source: z.string(),
  target: z.string(),
  value: z.number()
});

const SankeyDataSchema = z.object({
  nodes: z.array(SankeyNodeSchema),
  links: z.array(SankeyLinkSchema)
});

const RadarDataSchema = z.object({
  subject: z.string(),
  value: z.number(),
  fullMark: z.number().optional()
});

const TreemapDataSchema = z.object({
  name: z.string(),
  value: z.number(),
  children: z.array(z.any()).optional()
});

const MapDataSchema = z.object({
  lat: z.number(),
  lng: z.number(),
  label: z.string(),
  value: z.number().optional()
});

const AutovisualiseSchema = z.object({
  type: VisualizationTypeSchema,
  data: z.any(),
  title: z.string().optional(),
  options: z.record(z.any()).optional()
});

type VisualizationType = z.infer<typeof VisualizationTypeSchema>;
type AutovisualiseInput = z.infer<typeof AutovisualiseSchema>;

// Data validation functions
function validateVisualizationData(type: VisualizationType, data: any): { isValid: boolean; error?: string } {
  try {
    switch (type) {
      case 'bar':
      case 'pie':
      case 'donut':
        if (!Array.isArray(data)) {
          return { isValid: false, error: `${type} chart requires an array of data points` };
        }
        for (const item of data) {
          BaseChartDataSchema.parse(item);
        }
        break;
      
      case 'line':
      case 'scatter':
        if (!Array.isArray(data)) {
          return { isValid: false, error: `${type} chart requires an array of data points` };
        }
        for (const item of data) {
          LineChartDataSchema.parse(item);
        }
        break;
      
      case 'sankey':
        SankeyDataSchema.parse(data);
        break;
      
      case 'radar':
        if (!Array.isArray(data)) {
          return { isValid: false, error: 'Radar chart requires an array of data points' };
        }
        for (const item of data) {
          RadarDataSchema.parse(item);
        }
        break;
      
      case 'treemap':
        if (!Array.isArray(data)) {
          return { isValid: false, error: 'Treemap requires an array of data points' };
        }
        for (const item of data) {
          TreemapDataSchema.parse(item);
        }
        break;
      
      case 'map':
        if (!Array.isArray(data)) {
          return { isValid: false, error: 'Map requires an array of data points' };
        }
        for (const item of data) {
          MapDataSchema.parse(item);
        }
        break;
      
      case 'chord':
        if (!Array.isArray(data) || !data.every(row => Array.isArray(row))) {
          return { isValid: false, error: 'Chord diagram requires a matrix (array of arrays)' };
        }
        break;
      
      default:
        return { isValid: false, error: `Unsupported visualization type: ${type}` };
    }
    
    return { isValid: true };
  } catch (error) {
    return { 
      isValid: false, 
      error: `Data validation failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
    };
  }
}

// Visualization rendering functions
function generateBarChartScript(data: any[], title?: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${title || 'Bar Chart'}</title>
  <style>
    body { 
      margin: 0; 
      padding: 20px; 
      font-family: Arial, sans-serif; 
      background: #f9f9f9; 
    }
    .container { 
      width: 100%; 
      max-width: 800px; 
      margin: 0 auto; 
      background: white; 
      padding: 20px; 
      border-radius: 8px; 
      box-shadow: 0 2px 10px rgba(0,0,0,0.1); 
    }
    h1 { 
      text-align: center; 
      color: #333; 
      margin-bottom: 30px; 
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>${title || 'Bar Chart'}</h1>
    <svg width="100%" height="400" style="border: 1px solid #ddd; background: white;">
      <!-- Chart will be generated here -->
    </svg>
  </div>
  
  <script>
    const data = ${JSON.stringify(data)};
    const svg = document.querySelector('svg');
    const svgRect = svg.getBoundingClientRect();
    const svgWidth = svgRect.width;
    const svgHeight = 400;
    const margin = { top: 20, right: 30, bottom: 60, left: 60 };
    const chartWidth = svgWidth - margin.left - margin.right;
    const chartHeight = svgHeight - margin.top - margin.bottom;
    
    // Calculate scales
    const maxValue = Math.max(...data.map(d => d.value));
    const barWidth = chartWidth / data.length * 0.8;
    const barSpacing = chartWidth / data.length * 0.2;
    
    // Create bars
    data.forEach((item, i) => {
      const barHeight = (item.value / maxValue) * chartHeight;
      const x = margin.left + i * (barWidth + barSpacing) + barSpacing / 2;
      const y = margin.top + chartHeight - barHeight;
      
      // Bar rectangle
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', x.toString());
      rect.setAttribute('y', y.toString());
      rect.setAttribute('width', barWidth.toString());
      rect.setAttribute('height', barHeight.toString());
      rect.setAttribute('fill', item.color || '#4285f4');
      rect.style.cursor = 'pointer';
      
      // Add hover effect
      rect.addEventListener('mouseenter', () => {
        rect.setAttribute('opacity', '0.8');
      });
      rect.addEventListener('mouseleave', () => {
        rect.setAttribute('opacity', '1');
      });
      
      svg.appendChild(rect);
      
      // Label
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', (x + barWidth / 2).toString());
      text.setAttribute('y', (margin.top + chartHeight + 20).toString());
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('fill', '#666');
      text.setAttribute('font-size', '12');
      text.textContent = item.label;
      svg.appendChild(text);
      
      // Value label
      const valueText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      valueText.setAttribute('x', (x + barWidth / 2).toString());
      valueText.setAttribute('y', (y - 5).toString());
      valueText.setAttribute('text-anchor', 'middle');
      valueText.setAttribute('fill', '#333');
      valueText.setAttribute('font-size', '11');
      valueText.textContent = item.value.toString();
      svg.appendChild(valueText);
    });
  </script>
</body>
</html>`;
}

function generateLineChartScript(data: any[], title?: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${title || 'Line Chart'}</title>
  <style>
    body { 
      margin: 0; 
      padding: 20px; 
      font-family: Arial, sans-serif; 
      background: #f9f9f9; 
    }
    .container { 
      width: 100%; 
      max-width: 800px; 
      margin: 0 auto; 
      background: white; 
      padding: 20px; 
      border-radius: 8px; 
      box-shadow: 0 2px 10px rgba(0,0,0,0.1); 
    }
    h1 { 
      text-align: center; 
      color: #333; 
      margin-bottom: 30px; 
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>${title || 'Line Chart'}</h1>
    <svg width="100%" height="400" style="border: 1px solid #ddd; background: white;">
      <!-- Chart will be generated here -->
    </svg>
  </div>
  
  <script>
    const data = ${JSON.stringify(data)};
    const svg = document.querySelector('svg');
    const svgRect = svg.getBoundingClientRect();
    const svgWidth = svgRect.width;
    const svgHeight = 400;
    const margin = { top: 20, right: 30, bottom: 60, left: 60 };
    const chartWidth = svgWidth - margin.left - margin.right;
    const chartHeight = svgHeight - margin.top - margin.bottom;
    
    // Sort data by x value
    const sortedData = [...data].sort((a, b) => {
      const aX = typeof a.x === 'string' ? parseFloat(a.x) || 0 : a.x;
      const bX = typeof b.x === 'string' ? parseFloat(b.x) || 0 : b.x;
      return aX - bX;
    });
    
    // Calculate scales
    const xValues = sortedData.map(d => typeof d.x === 'string' ? parseFloat(d.x) || 0 : d.x);
    const yValues = sortedData.map(d => d.y);
    const minX = Math.min(...xValues);
    const maxX = Math.max(...xValues);
    const minY = Math.min(...yValues);
    const maxY = Math.max(...yValues);
    
    // Create path
    let pathData = '';
    sortedData.forEach((item, i) => {
      const x = margin.left + ((typeof item.x === 'string' ? parseFloat(item.x) || 0 : item.x) - minX) / (maxX - minX) * chartWidth;
      const y = margin.top + chartHeight - (item.y - minY) / (maxY - minY) * chartHeight;
      
      if (i === 0) {
        pathData += \`M \${x} \${y}\`;
      } else {
        pathData += \` L \${x} \${y}\`;
      }
      
      // Add circle for data point
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', x.toString());
      circle.setAttribute('cy', y.toString());
      circle.setAttribute('r', '4');
      circle.setAttribute('fill', '#4285f4');
      circle.style.cursor = 'pointer';
      svg.appendChild(circle);
    });
    
    // Create line path
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', pathData);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', '#4285f4');
    path.setAttribute('stroke-width', '2');
    svg.appendChild(path);
  </script>
</body>
</html>`;
}

function generatePieChartScript(data: any[], title?: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${title || 'Pie Chart'}</title>
  <style>
    body { 
      margin: 0; 
      padding: 20px; 
      font-family: Arial, sans-serif; 
      background: #f9f9f9; 
    }
    .container { 
      width: 100%; 
      max-width: 800px; 
      margin: 0 auto; 
      background: white; 
      padding: 20px; 
      border-radius: 8px; 
      box-shadow: 0 2px 10px rgba(0,0,0,0.1); 
    }
    h1 { 
      text-align: center; 
      color: #333; 
      margin-bottom: 30px; 
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>${title || 'Pie Chart'}</h1>
    <svg width="100%" height="400" style="border: 1px solid #ddd; background: white;">
      <!-- Chart will be generated here -->
    </svg>
  </div>
  
  <script>
    const data = ${JSON.stringify(data)};
    const svg = document.querySelector('svg');
    const svgRect = svg.getBoundingClientRect();
    const centerX = svgRect.width / 2;
    const centerY = 200;
    const radius = 100;
    
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let currentAngle = 0;
    
    // Default colors
    const defaultColors = ['#4285f4', '#ea4335', '#fbbc05', '#34a853', '#9c27b0', '#ff9800', '#795548', '#607d8b'];
    
    data.forEach((item, i) => {
      const sliceAngle = (item.value / total) * 2 * Math.PI;
      const endAngle = currentAngle + sliceAngle;
      
      const x1 = centerX + radius * Math.cos(currentAngle);
      const y1 = centerY + radius * Math.sin(currentAngle);
      const x2 = centerX + radius * Math.cos(endAngle);
      const y2 = centerY + radius * Math.sin(endAngle);
      
      const largeArcFlag = sliceAngle > Math.PI ? 1 : 0;
      
      const pathData = [
        \`M \${centerX} \${centerY}\`,
        \`L \${x1} \${y1}\`,
        \`A \${radius} \${radius} 0 \${largeArcFlag} 1 \${x2} \${y2}\`,
        'Z'
      ].join(' ');
      
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', pathData);
      path.setAttribute('fill', item.color || defaultColors[i % defaultColors.length]);
      path.style.cursor = 'pointer';
      
      // Add hover effect
      path.addEventListener('mouseenter', () => {
        path.setAttribute('opacity', '0.8');
      });
      path.addEventListener('mouseleave', () => {
        path.setAttribute('opacity', '1');
      });
      
      svg.appendChild(path);
      
      // Add label
      const labelAngle = currentAngle + sliceAngle / 2;
      const labelX = centerX + (radius + 20) * Math.cos(labelAngle);
      const labelY = centerY + (radius + 20) * Math.sin(labelAngle);
      
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', labelX.toString());
      text.setAttribute('y', labelY.toString());
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('fill', '#666');
      text.setAttribute('font-size', '12');
      text.textContent = \`\${item.label} (\${Math.round(item.value / total * 100)}%)\`;
      svg.appendChild(text);
      
      currentAngle = endAngle;
    });
  </script>
</body>
</html>`;
}

function generateSankeyScript(data: any, title?: string): string {
  return `
    // Sankey Diagram Implementation
    const data = ${JSON.stringify(data)};
    const title = ${JSON.stringify(title || 'Sankey Diagram')};
    
    // Create container
    const container = document.createElement('div');
    container.style.cssText = 'width: 100%; height: 500px; font-family: Arial, sans-serif; padding: 20px; box-sizing: border-box;';
    
    // Create title
    if (title) {
      const titleEl = document.createElement('h3');
      titleEl.textContent = title;
      titleEl.style.cssText = 'text-align: center; margin-bottom: 20px; color: #333;';
      container.appendChild(titleEl);
    }
    
    // Simple Sankey implementation
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 400;
    canvas.style.cssText = 'border: 1px solid #ddd; background: white; width: 100%; height: 80%;';
    const ctx = canvas.getContext('2d');
    
    // Node positioning
    const nodeWidth = 20;
    const nodeSpacing = 100;
    const nodeHeight = 40;
    const nodes = data.nodes.map((node, i) => ({
      ...node,
      x: (i % 3) * 200 + 50,
      y: Math.floor(i / 3) * 100 + 50,
      width: nodeWidth,
      height: nodeHeight
    }));
    
    // Draw links
    data.links.forEach(link => {
      const sourceNode = nodes.find(n => n.id === link.source);
      const targetNode = nodes.find(n => n.id === link.target);
      
      if (sourceNode && targetNode) {
        ctx.strokeStyle = '#4285f4';
        ctx.lineWidth = Math.max(2, link.value / 10);
        ctx.globalAlpha = 0.6;
        ctx.beginPath();
        ctx.moveTo(sourceNode.x + sourceNode.width, sourceNode.y + sourceNode.height / 2);
        ctx.lineTo(targetNode.x, targetNode.y + targetNode.height / 2);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    });
    
    // Draw nodes
    nodes.forEach(node => {
      ctx.fillStyle = '#34a853';
      ctx.fillRect(node.x, node.y, node.width, node.height);
      
      ctx.fillStyle = '#000';
      ctx.font = '12px Arial';
      ctx.fillText(node.name, node.x + node.width + 5, node.y + node.height / 2);
    });
    
    container.appendChild(canvas);
    root.appendChild(container);
  `;
}

function generateRadarScript(data: any[], title?: string): string {
  return `
    // Radar Chart Implementation
    const data = ${JSON.stringify(data)};
    const title = ${JSON.stringify(title || 'Radar Chart')};
    
    // Create container
    const container = document.createElement('div');
    container.style.cssText = 'width: 100%; height: 450px; font-family: Arial, sans-serif; padding: 20px; box-sizing: border-box;';
    
    // Create title
    if (title) {
      const titleEl = document.createElement('h3');
      titleEl.textContent = title;
      titleEl.style.cssText = 'text-align: center; margin-bottom: 20px; color: #333;';
      container.appendChild(titleEl);
    }
    
    // Create SVG
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '350');
    svg.style.cssText = 'border: 1px solid #ddd; background: white;';
    
    const centerX = 200;
    const centerY = 175;
    const maxRadius = 120;
    const levels = 5;
    
    // Draw radar grid
    for (let level = 1; level <= levels; level++) {
      const radius = (maxRadius / levels) * level;
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', centerX.toString());
      circle.setAttribute('cy', centerY.toString());
      circle.setAttribute('r', radius.toString());
      circle.setAttribute('fill', 'none');
      circle.setAttribute('stroke', '#ddd');
      circle.setAttribute('stroke-width', '1');
      svg.appendChild(circle);
    }
    
    // Calculate angles for each axis
    const angleStep = (2 * Math.PI) / data.length;
    let pathData = '';
    
    data.forEach((item, i) => {
      const angle = i * angleStep - Math.PI / 2; // Start from top
      const maxValue = item.fullMark || 100;
      const radius = (item.value / maxValue) * maxRadius;
      
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      
      if (i === 0) {
        pathData += \`M \${x} \${y}\`;
      } else {
        pathData += \` L \${x} \${y}\`;
      }
      
      // Draw axis line
      const axisX = centerX + maxRadius * Math.cos(angle);
      const axisY = centerY + maxRadius * Math.sin(angle);
      
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', centerX.toString());
      line.setAttribute('y1', centerY.toString());
      line.setAttribute('x2', axisX.toString());
      line.setAttribute('y2', axisY.toString());
      line.setAttribute('stroke', '#ccc');
      line.setAttribute('stroke-width', '1');
      svg.appendChild(line);
      
      // Add label
      const labelX = centerX + (maxRadius + 20) * Math.cos(angle);
      const labelY = centerY + (maxRadius + 20) * Math.sin(angle);
      
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', labelX.toString());
      text.setAttribute('y', labelY.toString());
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('fill', '#666');
      text.setAttribute('font-size', '11');
      text.textContent = item.subject;
      svg.appendChild(text);
      
      // Add data point
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', x.toString());
      circle.setAttribute('cy', y.toString());
      circle.setAttribute('r', '3');
      circle.setAttribute('fill', '#4285f4');
      svg.appendChild(circle);
    });
    
    // Close the path
    pathData += ' Z';
    
    // Create the radar polygon
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', pathData);
    path.setAttribute('fill', '#4285f4');
    path.setAttribute('fill-opacity', '0.3');
    path.setAttribute('stroke', '#4285f4');
    path.setAttribute('stroke-width', '2');
    svg.appendChild(path);
    
    container.appendChild(svg);
    root.appendChild(container);
  `;
}

function generateTreemapScript(data: any[], title?: string): string {
  return `
    // Treemap Implementation
    const data = ${JSON.stringify(data)};
    const title = ${JSON.stringify(title || 'Treemap')};
    
    // Create container
    const container = document.createElement('div');
    container.style.cssText = 'width: 100%; height: 450px; font-family: Arial, sans-serif; padding: 20px; box-sizing: border-box;';
    
    // Create title
    if (title) {
      const titleEl = document.createElement('h3');
      titleEl.textContent = title;
      titleEl.style.cssText = 'text-align: center; margin-bottom: 20px; color: #333;';
      container.appendChild(titleEl);
    }
    
    // Simple treemap implementation
    const treemapContainer = document.createElement('div');
    treemapContainer.style.cssText = 'width: 100%; height: 350px; position: relative; border: 1px solid #ddd; background: white;';
    
    const total = data.reduce((sum, item) => sum + item.value, 0);
    const colors = ['#4285f4', '#ea4335', '#fbbc05', '#34a853', '#9c27b0', '#ff9800', '#795548', '#607d8b'];
    
    let currentX = 0;
    let currentY = 0;
    const containerWidth = 600;
    const containerHeight = 350;
    
    data.forEach((item, i) => {
      const area = (item.value / total) * containerWidth * containerHeight;
      const width = Math.sqrt(area * 2);
      const height = area / width;
      
      const rect = document.createElement('div');
      rect.style.cssText = \`
        position: absolute;
        left: \${currentX}px;
        top: \${currentY}px;
        width: \${width}px;
        height: \${height}px;
        background-color: \${colors[i % colors.length]};
        border: 1px solid white;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 12px;
        font-weight: bold;
        text-align: center;
        cursor: pointer;
        opacity: 0.8;
      \`;
      
      rect.textContent = \`\${item.name} (\${item.value})\`;
      
      // Add hover effect
      rect.addEventListener('mouseenter', () => {
        rect.style.opacity = '1';
        rect.style.transform = 'scale(1.02)';
      });
      rect.addEventListener('mouseleave', () => {
        rect.style.opacity = '0.8';
        rect.style.transform = 'scale(1)';
      });
      
      treemapContainer.appendChild(rect);
      
      // Update position for next rectangle (simple layout)
      currentX += width;
      if (currentX > containerWidth - 50) {
        currentX = 0;
        currentY += height;
      }
    });
    
    container.appendChild(treemapContainer);
    root.appendChild(container);
  `;
}

declare module 'react-router' {
  export interface AppLoadContext {
    cloudflare: {
      env: CloudflareEnvironment;
      ctx: ExecutionContext;
    };
  }
}

const requestHandler = createRequestHandler(
  () => import('virtual:react-router/server-build'),
  import.meta.env.MODE,
);

// Define our MCP agent with tools
export class MyMCP extends McpAgent {
  server = new McpServer({
    name: 'MCP-UI Example',
    version: '1.0.0',
  });

  async init() {
    const requestUrl = this.props.requestUrl as string;
    const url = new URL(requestUrl);
    const requestHost = url.host;

    this.server.tool(
      'get_tasks_status',
      'The main way to get a textual representation of the status of all tasks',
      async () => {
        const todayData = {
          alice: { remaining: 12, toDo: 5, inProgress: 4, blocked: 3 },
          bob: { remaining: 18, toDo: 11, inProgress: 4, blocked: 3 },
          charlie: { remaining: 14, toDo: 6, inProgress: 5, blocked: 3 },
        };

        // Full sprint data for weekly summary
        const sprintDataFull = [
          {
            date: '5/10',
            alice: { remaining: 8, toDo: 3, inProgress: 3, blocked: 2 },
            bob: { remaining: 7, toDo: 2, inProgress: 3, blocked: 2 },
            charlie: { remaining: 9, toDo: 4, inProgress: 3, blocked: 2 },
          },
          {
            date: '5/11',
            alice: { remaining: 7, toDo: 2, inProgress: 3, blocked: 2 },
            bob: { remaining: 6, toDo: 2, inProgress: 2, blocked: 2 },
            charlie: { remaining: 8, toDo: 3, inProgress: 3, blocked: 2 },
          },
          {
            date: '5/12',
            alice: { remaining: 9, toDo: 3, inProgress: 4, blocked: 2 },
            bob: { remaining: 8, toDo: 3, inProgress: 3, blocked: 2 },
            charlie: { remaining: 10, toDo: 4, inProgress: 4, blocked: 2 },
          },
          {
            date: '5/13',
            alice: { remaining: 6, toDo: 1, inProgress: 2, blocked: 3 },
            bob: { remaining: 9, toDo: 3, inProgress: 3, blocked: 3 },
            charlie: { remaining: 11, toDo: 5, inProgress: 3, blocked: 3 },
          },
          {
            date: '5/14',
            alice: { remaining: 10, toDo: 4, inProgress: 3, blocked: 3 },
            bob: { remaining: 9, toDo: 3, inProgress: 3, blocked: 3 },
            charlie: { remaining: 12, toDo: 5, inProgress: 4, blocked: 3 },
          },
          {
            date: '5/15',
            alice: { remaining: 11, toDo: 4, inProgress: 4, blocked: 3 },
            bob: { remaining: 10, toDo: 3, inProgress: 4, blocked: 3 },
            charlie: { remaining: 13, toDo: 6, inProgress: 4, blocked: 3 },
          },
          {
            date: '5/16',
            alice: { remaining: 12, toDo: 5, inProgress: 4, blocked: 3 },
            bob: { remaining: 11, toDo: 4, inProgress: 4, blocked: 3 },
            charlie: { remaining: 14, toDo: 6, inProgress: 5, blocked: 3 },
          },
        ];
        const teamMembers = ['alice', 'bob', 'charlie'];

        let statusText = "Today's Task Status:\n\n";

        statusText += 'Alice:\n';
        statusText += `  To Do: ${todayData.alice.toDo}\n`;
        statusText += `  In Progress: ${todayData.alice.inProgress}\n`;
        statusText += `  Blocked: ${todayData.alice.blocked}\n`;
        statusText += `  Remaining: ${todayData.alice.remaining}\n\n`;

        statusText += 'Bob:\n';
        statusText += `  To Do: ${todayData.bob.toDo}\n`;
        statusText += `  In Progress: ${todayData.bob.inProgress}\n`;
        statusText += `  Blocked: ${todayData.bob.blocked}\n`;
        statusText += `  Remaining: ${todayData.bob.remaining}\n\n`;

        statusText += 'Charlie:\n';
        statusText += `  To Do: ${todayData.charlie.toDo}\n`;
        statusText += `  In Progress: ${todayData.charlie.inProgress}\n`;
        statusText += `  Blocked: ${todayData.charlie.blocked}\n`;
        statusText += `  Remaining: ${todayData.charlie.remaining}\n`;

        // Calculate weekly totals
        let weeklyTotalToDo = 0;
        let weeklyTotalInProgress = 0;
        let weeklyTotalBlocked = 0;

        sprintDataFull.forEach((day) => {
          teamMembers.forEach((member) => {
            // @ts-expect-error - member is a string, but it's used as an index type for day
            weeklyTotalToDo += day[member]?.toDo || 0;
            // @ts-expect-error - member is a string, but it's used as an index type for day
            weeklyTotalInProgress += day[member]?.inProgress || 0;
            // @ts-expect-error - member is a string, but it's used as an index type for day
            weeklyTotalBlocked += day[member]?.blocked || 0;
          });
        });

        statusText += '\n\nSummary for the past week:\n';
        statusText += `Total tasks To Do: ${weeklyTotalToDo}\n`;
        statusText += `Total tasks In Progress: ${weeklyTotalInProgress}\n`;
        statusText += `Total tasks Blocked: ${weeklyTotalBlocked}\n`;

        return {
          content: [{ type: 'text', text: statusText }],
        };
      },
    );

    this.server.tool('nudge_team_member', { name: z.string() }, async ({ name }) => ({
      content: [{ type: 'text', text: 'Nudged ' + name + '!' }],
    }));

    this.server.tool(
      'show_task_status',
      'Displays a UI for the user to see the status of tasks. Use get_tasks_status unless asked to SHOW the status',
      async () => {
        const scheme =
          requestHost.includes('localhost') || requestHost.includes('127.0.0.1') ? 'http' : 'https';

        const pickerPageUrl = `${scheme}://${requestHost}/task`;

        // Generate a unique URI for this specific invocation of the file picker UI.
        // This URI identifies the resource block itself, not the content of the iframe.
        const uniqueUIAppUri = `ui://task-manager/${Date.now()}` as `ui://${string}`;
        const resourceBlock = createUIResource({
          uri: uniqueUIAppUri,
          content: { type: 'externalUrl', iframeUrl: pickerPageUrl },
          encoding: 'text', // The URL itself is delivered as text
        });

        return {
          content: [resourceBlock],
        };
      },
    );
    this.server.tool(
      'show_user_status',
      'Displays a UI for the user to see the status of a user and their tasks',
      { id: z.string(), name: z.string(), avatarUrl: z.string() },
      async ({ id, name, avatarUrl }) => {
        const scheme =
          requestHost.includes('localhost') || requestHost.includes('127.0.0.1') ? 'http' : 'https';

        const pickerPageUrl = `${scheme}://${requestHost}/user?id=${id}&name=${name}&avatarUrl=${avatarUrl}`;

        // Generate a unique URI for this specific invocation of the file picker UI.
        // This URI identifies the resource block itself, not the content of the iframe.
        const uniqueUIAppUri = `ui://user-profile/${Date.now()}` as `ui://${string}`;
        const resourceBlock = createUIResource({
          uri: uniqueUIAppUri,
          content: { type: 'externalUrl', iframeUrl: pickerPageUrl },
          encoding: 'text', // The URL itself is delivered as text
        });

        return {
          content: [resourceBlock],
        };
      },
    );

    this.server.tool('show_remote_dom_react', 'Shows a react remote-dom component', 
      { framework: z.enum(['react', 'webcomponents']).optional() },
      async () => {
      const resourceBlock = createUIResource({
        uri: `ui://remote-dom-react/${Date.now()}` as `ui://${string}`,
        encoding: 'text',
        content: {
          type: 'remoteDom',
          framework: 'react',
          script: `
            // Create a state variable to track the current logo
            let isDarkMode = false;

            // Create the main container stack with centered alignment
            const stack = document.createElement('ui-stack');
            stack.setAttribute('direction', 'vertical');
            stack.setAttribute('spacing', '20');
            stack.setAttribute('align', 'center');

            // Create the title text
            const title = document.createElement('ui-text');
            title.setAttribute('content', 'Logo Toggle Demo');

            // Create a centered container for the logo
            const logoContainer = document.createElement('ui-stack');
            logoContainer.setAttribute('direction', 'vertical');
            logoContainer.setAttribute('spacing', '0');
            logoContainer.setAttribute('align', 'center');

            // Create the logo image (starts with light theme)
            const logo = document.createElement('ui-image');
            logo.setAttribute('src', 'https://block.github.io/goose/img/logo_light.png');
            logo.setAttribute('alt', 'Goose Logo');
            logo.setAttribute('width', '200');

            // Create the toggle button
            const toggleButton = document.createElement('ui-button');
            toggleButton.setAttribute('label', '🌙 Switch to Dark Mode');

            // Add the toggle functionality
            toggleButton.addEventListener('press', () => {
              isDarkMode = !isDarkMode;
              
              if (isDarkMode) {
                // Switch to dark mode
                logo.setAttribute('src', 'https://block.github.io/goose/img/logo_dark.png');
                logo.setAttribute('alt', 'Goose Logo (Dark Mode)');
                toggleButton.setAttribute('label', '☀️ Switch to Light Mode');
              } else {
                // Switch to light mode
                logo.setAttribute('src', 'https://block.github.io/goose/img/logo_light.png');
                logo.setAttribute('alt', 'Goose Logo (Light Mode)');
                toggleButton.setAttribute('label', '🌙 Switch to Dark Mode');
              }
              
              console.log('Logo toggled to:', isDarkMode ? 'dark' : 'light', 'mode');
            });

            // Assemble the UI
            logoContainer.appendChild(logo);
            stack.appendChild(title);
            stack.appendChild(logoContainer);
            stack.appendChild(toggleButton);
            root.appendChild(stack);
          `,
        },
      });
      return {
        content: [resourceBlock],
      };
    });

    this.server.tool(
      'show_remote_dom_web_components',
      'Shows a web components remote-dom component',
      async () => {
        const resourceBlock = createUIResource({
          uri: `ui://remote-dom-wc/${Date.now()}` as `ui://${string}`,
          encoding: 'text',
          content: {
            type: 'remoteDom',
            framework: 'webcomponents',
            script: `
            // Create a state variable to track the current logo
            let isDarkMode = false;

            // Create the main container stack with centered alignment
            const stack = document.createElement('ui-stack');
            stack.setAttribute('direction', 'vertical');
            stack.setAttribute('spacing', '20');
            stack.setAttribute('align', 'center');

            // Create the title text
            const title = document.createElement('ui-text');
            title.setAttribute('content', 'Logo Toggle Demo');

            // Create a centered container for the logo
            const logoContainer = document.createElement('ui-stack');
            logoContainer.setAttribute('direction', 'vertical');
            logoContainer.setAttribute('spacing', '0');
            logoContainer.setAttribute('align', 'center');

            // Create the logo image (starts with light theme)
            const logo = document.createElement('ui-image');
            logo.setAttribute('src', 'https://block.github.io/goose/img/logo_light.png');
            logo.setAttribute('alt', 'Goose Logo');
            logo.setAttribute('width', '200');

            // Create the toggle button
            const toggleButton = document.createElement('ui-button');
            toggleButton.setAttribute('label', '🌙 Switch to Dark Mode');

            // Add the toggle functionality
            toggleButton.addEventListener('press', () => {
              isDarkMode = !isDarkMode;
              
              if (isDarkMode) {
                // Switch to dark mode
                logo.setAttribute('src', 'https://block.github.io/goose/img/logo_dark.png');
                logo.setAttribute('alt', 'Goose Logo (Dark Mode)');
                toggleButton.setAttribute('label', '☀️ Switch to Light Mode');
              } else {
                // Switch to light mode
                logo.setAttribute('src', 'https://block.github.io/goose/img/logo_light.png');
                logo.setAttribute('alt', 'Goose Logo (Light Mode)');
                toggleButton.setAttribute('label', '🌙 Switch to Dark Mode');
              }
              
              console.log('Logo toggled to:', isDarkMode ? 'dark' : 'light', 'mode');
            });

            // Assemble the UI
            logoContainer.appendChild(logo);
            stack.appendChild(title);
            stack.appendChild(logoContainer);
            stack.appendChild(toggleButton);
            root.appendChild(stack);
          `,
          },
        });
        return {
          content: [resourceBlock],
        };
      },
    );

    this.server.tool(
      'show_module_federation',
      'Shows a module federation component',
      { framework: z.enum(['react', 'vue', 'svelte', 'solid', 'angular']).optional() },
      async ({ framework }) => {
        const resourceBlock1 = createUIResource({
          uri: `ui://module-federation/${Date.now()}` as `ui://${string}`,
          encoding: 'text',
          content: {
            type: 'moduleFederation',
            remoteName: 'mf_react',
            remoteEntry: 'https://mcp-ui-example-remotes.vercel.app/mf_react/mf-manifest.json',
            framework: 'react',
          },
        });
        const resourceBlock2 = createUIResource({
          uri: `ui://module-federation/${Date.now()}` as `ui://${string}`,
          encoding: 'text',
          content: {
            type: 'moduleFederation',
            remoteName: 'mf_vue',
            remoteEntry: 'https://mcp-ui-example-remotes.vercel.app/mf_vue/mf-manifest.json',
            framework: 'vue',
          },
        });
          const resourceBlock3 = createUIResource({
            uri: `ui://module-federation/${Date.now()}` as `ui://${string}`,
            encoding: 'text',
            content: {
              type: 'moduleFederation',
              remoteName: 'mf_svelte',
              remoteEntry: 'https://mcp-ui-example-remotes.vercel.app/mf_svelte/mf-manifest.json',
              framework: 'svelte',
            },
          });
          const resourceBlock4 = createUIResource({
            uri: `ui://module-federation/${Date.now()}` as `ui://${string}`,
            encoding: 'text',
            content: {
              type: 'moduleFederation',
              remoteName: 'mf_solid',
              remoteEntry: 'https://mcp-ui-example-remotes.vercel.app/mf_solid/mf-manifest.json',
              framework: 'solid',
            },
          });
          const resourceBlock5 = createUIResource({
            uri: `ui://module-federation/${Date.now()}` as `ui://${string}`,
            encoding: 'text',
            content: {
              type: 'moduleFederation',
              remoteName: 'mfe1',
              remoteEntry: 'https://mcp-ui-example-remotes.vercel.app/angular_mfe1/browser/remoteEntry.js',
              framework: 'angular',
            },
          });

        if (framework === 'react') {
          return {
            content: [resourceBlock1],
          };
        }
        if (framework === 'vue') {
          return {
            content: [resourceBlock2],
          };
        }
        if (framework === 'svelte') {
          return {
            content: [resourceBlock3],
          };
        }
        if (framework === 'solid') {
          return {
            content: [resourceBlock4],
          };
        }
        if (framework === 'angular') {
          return {
            content: [resourceBlock5],
          };
        }
        return {
          content: [resourceBlock1, resourceBlock2, resourceBlock3, resourceBlock4, resourceBlock5],
        };
      },
    );

    this.server.tool(
      'autovisualise',
      'Generate interactive data visualizations from JSON data. Supports bar, line, pie, donut, scatter, sankey, radar, treemap, chord, and map charts.',
      {
        type: VisualizationTypeSchema,
        data: z.any(),
        title: z.string().optional(),
        options: z.record(z.any()).optional()
      },
      async ({ type, data, title, options }) => {
        // Validate the data
        const validation = validateVisualizationData(type, data);
        if (!validation.isValid) {
          return {
            content: [{
              type: 'text',
              text: `Visualization Error: ${validation.error}`
            }]
          };
        }

        // Generate the appropriate script based on visualization type
        let script: string;
        
        switch (type) {
          case 'bar':
            script = generateBarChartScript(data, title);
            break;
          case 'line':
            script = generateLineChartScript(data, title);
            break;
          case 'pie':
          case 'donut':
            script = generatePieChartScript(data, title);
            break;
          case 'sankey':
            script = generateSankeyScript(data, title);
            break;
          case 'radar':
            script = generateRadarScript(data, title);
            break;
          case 'treemap':
            script = generateTreemapScript(data, title);
            break;
          case 'scatter':
            // Use line chart script but with points only
            script = generateLineChartScript(data, title).replace('// Line Chart Implementation', '// Scatter Plot Implementation');
            break;
          case 'chord':
            script = `
              // Chord Diagram - Basic Implementation
              const data = ${JSON.stringify(data)};
              const title = ${JSON.stringify(title || 'Chord Diagram')};
              const container = document.createElement('div');
              container.style.cssText = 'width: 100%; height: 400px; font-family: Arial, sans-serif; padding: 20px; text-align: center;';
              container.innerHTML = '<h3>' + title + '</h3><p>Chord diagram visualization requires complex D3.js implementation. Please use a simpler chart type for now.</p>';
              root.appendChild(container);
            `;
            break;
          case 'map':
            script = `
              // Map - Basic Implementation
              const data = ${JSON.stringify(data)};
              const title = ${JSON.stringify(title || 'Map')};
              const container = document.createElement('div');
              container.style.cssText = 'width: 100%; height: 400px; font-family: Arial, sans-serif; padding: 20px; text-align: center;';
              container.innerHTML = '<h3>' + title + '</h3><p>Interactive map visualization requires external mapping libraries. Please use a different chart type for now.</p>';
              root.appendChild(container);
            `;
            break;
          default:
            return {
              content: [{
                type: 'text',
                text: `Unsupported visualization type: ${type}`
              }]
            };
        }

        const resourceBlock = createUIResource({
          uri: `ui://autovisualise/${Date.now()}` as `ui://${string}`,
          encoding: 'text',
          content: {
            type: 'rawHtml',
            htmlString: script,
          },
        });

        return {
          content: [resourceBlock],
        };
      },
    );

    this.server.tool(
      'show_video',
      'Renders a video from localhost:3000 as a uri-list resource',
      async () => {
        const resourceBlock = createUIResource({
          uri: `ui://video-player/${Date.now()}` as `ui://${string}`,
          encoding: 'text',
          content: {
            type: 'externalUrl',
            iframeUrl: 'http://localhost:3000'
          },
        });

        return {
          content: [resourceBlock],
        };
      },
    );
    
  }
}

export default {
  fetch(request: Request, env: Env, ctx: ExecutionContext) {
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET,HEAD,OPTIONS',
          'Access-Control-Allow-Headers': '*',
        },
      });
    }

    const url = new URL(request.url);
    ctx.props.requestUrl = request.url;

    if (url.pathname === '/sse' || url.pathname === '/sse/message') {
      return MyMCP.serveSSE('/sse').fetch(request, env, ctx);
    }

    if (url.pathname === '/mcp') {
      return MyMCP.serve('/mcp').fetch(request, env, ctx);
    }

    return requestHandler(request, {
      cloudflare: { env, ctx },
    });
    // return new Response("Not found", { status: 404 });
  },
};
