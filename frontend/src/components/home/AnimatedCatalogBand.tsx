import { useEffect, useRef } from 'react';

export const AnimatedCatalogBand: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    let step = 0;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    window.addEventListener('resize', handleResize);

    // Wave parameters: elegant, organic, gentle mathematics
    const waves = [
      {
        amplitude: 35,
        frequency: 0.004,
        speed: 0.015,
        color: 'rgba(93, 149, 179, 0.35)', // #5d95b3
        yOffset: 0.45,
      },
      {
        amplitude: 45,
        frequency: 0.003,
        speed: 0.010,
        color: 'rgba(35, 73, 104, 0.50)', // #234968
        yOffset: 0.55,
      },
      {
        amplitude: 25,
        frequency: 0.006,
        speed: 0.020,
        color: 'rgba(16, 185, 129, 0.15)', // #10b981
        yOffset: 0.65,
      },
      {
        amplitude: 50,
        frequency: 0.002,
        speed: 0.008,
        color: 'rgba(28, 56, 74, 0.60)', // #1c384a
        yOffset: 0.40,
      },
    ];

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Deep navy background gradient
      const bgGrad = ctx.createLinearGradient(0, 0, width, height);
      bgGrad.addColorStop(0, '#1c384a');
      bgGrad.addColorStop(0.5, '#234968');
      bgGrad.addColorStop(1, '#152b39');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Draw each harmonic wave
      waves.forEach((w, idx) => {
        ctx.beginPath();
        ctx.moveTo(0, height);

        const currentYBase = height * w.yOffset;
        const phase = step * w.speed + idx * 1.5;

        for (let x = 0; x <= width; x += 6) {
          const y =
            currentYBase +
            Math.sin(x * w.frequency + phase) * w.amplitude +
            Math.cos(x * w.frequency * 0.5 + phase * 0.7) * (w.amplitude * 0.35);

          if (x === 0) {
            ctx.lineTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        ctx.lineTo(width, height);
        ctx.closePath();

        ctx.fillStyle = w.color;
        ctx.fill();
      });

      // Flowing glowing radial light node
      const lightX = width * (0.5 + Math.sin(step * 0.008) * 0.3);
      const lightY = height * (0.5 + Math.cos(step * 0.012) * 0.2);
      const glow = ctx.createRadialGradient(lightX, lightY, 10, lightX, lightY, width * 0.6);
      glow.addColorStop(0, 'rgba(93, 149, 179, 0.22)');
      glow.addColorStop(0.5, 'rgba(35, 73, 104, 0.10)');
      glow.addColorStop(1, 'transparent');

      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, width, height);

      step += 1;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-90 transition-opacity duration-300"
      aria-hidden="true"
    />
  );
};
