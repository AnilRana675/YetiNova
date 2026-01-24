import { useEffect, useRef } from 'react';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

export function NodeAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const nodesRef = useRef<Node[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initNodes();
    };

    const initNodes = () => {
      const width = canvas.width;
      const isMobile = width < 768;
      
      // Tweaked divisor for better density (lower number = more nodes)
      const areaDivisor = isMobile ? 14000 : 15000; 
      const nodeCount = Math.floor((canvas.width * canvas.height) / areaDivisor);
      
      nodesRef.current = [];
      
      for (let i = 0; i < nodeCount; i++) {
        // INCREASED: Base radius sizes for prominence
        // Mobile: 1.5 -> 2.2 | Desktop: 2 -> 2.8
        const baseRadius = isMobile ? 2.2 : 2.8;
        
        nodesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          // INCREASED: Minimum size is now 1.5 (was 1)
          // Formula creates nodes between 1.5px and (Base + 1.5)px
          radius: Math.random() * baseRadius + 1.5,
        });
      }
    };

    const drawNode = (node: Node) => {
      if (!ctx) return;
      
      // Node glow - Color 6 (rgb 85, 184, 96)
      // INCREASED: Glow radius multiplier from 3 to 4 for "showcase" effect
      const gradient = ctx.createRadialGradient(
        node.x, node.y, 0,
        node.x, node.y, node.radius * 4 
      );
      
      // INCREASED: Opacity slightly for punchier look
      gradient.addColorStop(0, 'rgba(85, 184, 96, 0.9)'); 
      gradient.addColorStop(0.4, 'rgba(85, 184, 96, 0.4)');
      gradient.addColorStop(1, 'rgba(85, 184, 96, 0)');
      
      ctx.beginPath();
      // Draw glow
      ctx.arc(node.x, node.y, node.radius * 4, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
      
      // Node core - Color 3 (rgb 4, 62, 102)
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgb(4, 62, 102)';
      ctx.fill();
    };

    const drawConnection = (node1: Node, node2: Node, distance: number, maxDistance: number) => {
      if (!ctx) return;
      
      const opacity = 1 - (distance / maxDistance);
      ctx.beginPath();
      ctx.moveTo(node1.x, node1.y);
      ctx.lineTo(node2.x, node2.y);
      // Connection Line - Color 3
      // INCREASED: Base opacity multiplier 0.4 -> 0.5
      ctx.strokeStyle = `rgba(4, 62, 102, ${opacity * 0.5})`;
      // INCREASED: Line width 1 -> 1.2
      ctx.lineWidth = 1.2;
      ctx.stroke();
    };

    const animate = () => {
      if (!ctx || !canvas) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const nodes = nodesRef.current;
      const isMobile = canvas.width < 768;
      // INCREASED: Interaction distance for mobile
      const maxDistance = isMobile ? 110 : 150; 

      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        
        node.x += node.vx;
        node.y += node.vy;
        
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;
        
        // Mouse/Touch Interaction
        const dx = mouseRef.current.x - node.x;
        const dy = mouseRef.current.y - node.y;
        const mouseDist = Math.sqrt(dx * dx + dy * dy);
        
        // Interaction radius
        if (mouseDist < 120 && mouseDist > 0) {
          node.vx -= (dx / mouseDist) * 0.02;
          node.vy -= (dy / mouseDist) * 0.02;
        }
        
        const speed = Math.sqrt(node.vx * node.vx + node.vy * node.vy);
        if (speed > 1) {
          node.vx = (node.vx / speed) * 1;
          node.vy = (node.vy / speed) * 1;
        }

        for (let j = i + 1; j < nodes.length; j++) {
          const other = nodes[j];
          const distance = Math.sqrt(
            Math.pow(node.x - other.x, 2) + Math.pow(node.y - other.y, 2)
          );
          
          if (distance < maxDistance) {
            drawConnection(node, other, distance, maxDistance);
          }
        }
        
        drawNode(node);
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleTouchMove = (e: TouchEvent) => {
        if(e.touches.length > 0) {
            mouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }
    };

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);
    
    resizeCanvas();
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}