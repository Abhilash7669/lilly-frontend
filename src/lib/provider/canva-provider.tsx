"use client";

import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";

type Props = {
  children: React.ReactNode;
};

type MouseCoords = {
  x: number | undefined;
  y: number | undefined;
};

export default function CanvaProvider({ children }: Props) {
  const [onMount, setOnMount] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [circleColor, setCircleColor] = useState<string | null>(null);

  const { theme } = useTheme();

  useEffect(() => {
    if (!onMount) return setOnMount(() => true);

    const color = getComputedStyle(document.documentElement)
      .getPropertyValue("--color-canva-circle")
      .trim();

    if (color) setCircleColor(() => color);

    const mouse: MouseCoords = {
      x: undefined,
      y: undefined,
    };

    function handleCanvasResize() {
      if (canvasRef && canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    }

    function handleMouseMove(e: MouseEvent) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    }

    if (typeof window !== "undefined") {
      if (canvasRef && canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;

        window.addEventListener("resize", handleCanvasResize);

        window.addEventListener("mousemove", handleMouseMove);

        const ctx = canvasRef.current.getContext("2d");

        if (!ctx) {
          console.error("Could not get canvas context");
          return;
        }

        class Circle {
          x: number;
          y: number;
          dy: number;
          dx: number;
          r: number;
          mxr: number;
          minr: number;
          alpha: number;
          alphaDirection: number;

          constructor(
            x: number,
            y: number,
            dy: number,
            dx: number,
            r: number,
            mxr: number,
            alpha: number
          ) {
            this.x = x;
            this.y = y;
            this.dy = dy;
            this.dx = dx;
            this.r = r;
            this.mxr = mxr;
            this.minr = r;
            this.alpha = alpha;
            this.alphaDirection = 1;
          }

          draw() {
            if (ctx) {
              ctx.beginPath();
              ctx.globalAlpha = this.alpha;
              ctx.fillStyle = `${circleColor || "white"}`;
              ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
              ctx.fill();
            }
          }

          pulse() {
            this.alpha += 0.009 * this.alphaDirection;

            if (this.alpha > 1) {
              this.alpha = 1;
              this.alphaDirection = -1;
            } else if(this.alpha <= 0.2){
              this.alpha = 0.2;
              this.alphaDirection = 1;
            }
          }

          line() {
            // distance between two points = sqrt (x2 - x1)^2 - (y2 - y1)^2;

            if(ctx && mouse.x && mouse.y) {

              const distance = Math.sqrt((mouse.x - this.x) ** 2 + (mouse.y - this.y) **2);

              if(distance < 100) {
                ctx.beginPath();
                ctx.moveTo(this.x, this.y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.lineWidth = 1;
                ctx.strokeStyle = color;
                ctx.stroke()
              }

            }


           }

          update() {
            if (this.x - this.r > innerWidth || this.x - this.r < 0)
              this.dx = -this.dx;

            if (this.y - this.r > innerHeight || this.y - this.r < 0)
              this.dy = -this.dy;

            // if (mouse.x && mouse.y) {
            //   if (
            //     mouse.x - this.x < 50 &&
            //     mouse.x - this.x > -50 &&
            //     mouse.y - this.y < 50 &&
            //     mouse.y - this.y > -50
            //   ) {
            //     if (this.r <= this.mxr) this.r += 1;
            //   } else {
            //     if (this.r >= this.minr) this.r -= 1;
            //   }
            // }

            this.x += this.dx;
            this.y += this.dy;
            this.draw();
            this.pulse();
            this.line();
          }
        }

        const circleArray: Circle[] = [];
        const numberOfCircles = 72;
        const radius = 1;
        const mxr = 40;

        for (let i = 0; i < numberOfCircles; ++i) {
          const x = Math.random() * (innerWidth - radius * 2) + radius;
          const y = Math.random() * (innerHeight - radius * 2) + radius;
          const dx = (Math.random() - 0.5) * 0.24;
          const dy = (Math.random() - 0.5) * 0.24;
          const alpha = parseFloat((Math.random() * 1).toFixed(1));

          console.log(alpha, "ALPHA");

          circleArray[i] = new Circle(x, y, dy, dx, radius, mxr, alpha);
        }

        function animate() {
          requestAnimationFrame(animate);

          if (!ctx) return;

          ctx.clearRect(0, 0, innerWidth, innerHeight);
          let i = 0;
          for (i; i < circleArray.length; ++i) {
            circleArray[i].update();
          }
        }

        // call function
        animate();
      }
    }

    return () => {
      window.removeEventListener("resize", handleCanvasResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onMount]);

  useEffect(() => {
    const color = getComputedStyle(document.documentElement)
      .getPropertyValue("--color-canva-circle")
      .trim();

    if (color) setCircleColor(() => color);
  }, [theme]);

  return (
    <>
      <canvas
        className="-z-10 bg-background fixed top-0 left-0"
        ref={canvasRef}
      ></canvas>
      {children}
    </>
  );
}
