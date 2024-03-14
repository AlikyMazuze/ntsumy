const canvas = document.getElementById('hearts')
const main = document.querySelector('body')
const dpr = window.devicePixelRatio;

const quantity = 50,
    staticity = 50,
    ease = 50

export default function renderStars() {
    // Set the context
    const circles = []
    const context = canvas.getContext('2d')
    const canvasSize = {
        w: main.offsetWidth,
        h: main.offsetHeight
    }

    const { mouse, mousePosition } = useMousePosition(canvasSize)



    const sizeCanvas = () => {
        canvas.width = canvasSize.w * dpr
        canvas.height = canvasSize.h * dpr
        canvas.style.width = `${canvasSize.w}px`;
        canvas.style.height = `${canvasSize.h}px`;
        context.scale(dpr, dpr);
    }


    // drawing particles    
    const clearContext = () => {
        context.clearRect(
            0,
            0,
            canvasSize.w,
            canvasSize.h,
        );
    }

    const drawCircle = (circle, update = false) => {
        if (context) {
            const { x, y, translateX, translateY, size, alpha } = circle;
            context.translate(translateX, translateY);
            context.beginPath();
            context.arc(x, y, size, 0, 2 * Math.PI);
            context.fillStyle = `rgba(255, 255, 255, ${alpha})`;
            context.fill();
            context.setTransform(dpr, 0, 0, dpr, 0, 0);

            if (!update) {
                circles.push(circle);
            }
        }
    };

    const circleParams = () => {
        const x = Math.floor(Math.random() * canvasSize.w);
        const y = Math.floor(Math.random() * canvasSize.h);
        const translateX = 0;
        const translateY = 0;
        const size = Math.floor(Math.random() * 2) + 0.1;
        const alpha = 0;
        const targetAlpha = parseFloat((Math.random() * 0.6 + 0.1).toFixed(1));
        const dx = (Math.random() - 0.5) * 0.2;
        const dy = (Math.random() - 0.5) * 0.2;
        const magnetism = 0.1 + Math.random() * 4;
        return {
            x,
            y,
            translateX,
            translateY,
            size,
            alpha,
            targetAlpha,
            dx,
            dy,
            magnetism,
        };
    };

    const drawParticles = () => {
        clearContext()

        for (let i = 0; i < quantity; i++) {
            const circle = circleParams()
            drawCircle(circle)
        }
    }



    const remapValue = (value, start1, end1, start2, end2) => {
        const remapped =
            ((value - start1) * (end2 - start2)) / (end1 - start1) + start2;
        return remapped > 0 ? remapped : 0;
    };
    const animate = () => {
        clearContext();
        circles.forEach((circle, i) => {
            // Handle the alpha value
            const edge = [
                circle.x + circle.translateX - circle.size, // distance from left edge
                canvasSize.w - circle.x - circle.translateX - circle.size, // distance from right edge
                circle.y + circle.translateY - circle.size, // distance from top edge
                canvasSize.h - circle.y - circle.translateY - circle.size, // distance from bottom edge
            ];
            const closestEdge = edge.reduce((a, b) => Math.min(a, b));
            const remapClosestEdge = parseFloat(
                remapValue(closestEdge, 0, 20, 0, 1).toFixed(2),
            );
            if (remapClosestEdge > 1) {
                circle.alpha += 0.02;
                if (circle.alpha > circle.targetAlpha) {
                    circle.alpha = circle.targetAlpha;
                }
            } else {
                circle.alpha = circle.targetAlpha * remapClosestEdge;
            }
            circle.x += circle.dx;
            circle.y += circle.dy;
            circle.translateX +=
                (mouse.x / (staticity / circle.magnetism) - circle.translateX) /
                ease;
            circle.translateY +=
                (mouse.y / (staticity / circle.magnetism) - circle.translateY) /
                ease;
            // circle gets out of the canvas
            if (
                circle.x < -circle.size ||
                circle.x > canvasSize.w + circle.size ||
                circle.y < -circle.size ||
                circle.y > canvasSize.h + circle.size
            ) {
                // remove the circle from the array
                circles.splice(i, 1);
                // create a new circle
                const newCircle = circleParams();
                drawCircle(newCircle);
                // update the circle position
            } else {
                drawCircle(
                    {
                        ...circle,
                        x: circle.x,
                        y: circle.y,
                        translateX: circle.translateX,
                        translateY: circle.translateY,
                        alpha: circle.alpha,
                    },
                    true,
                );
            }
        });
        window.requestAnimationFrame(animate);
    };

    const initCanvas = () => {
        sizeCanvas()
        drawParticles()
    }
    initCanvas()
    animate()

    window.addEventListener('resize', initCanvas)
}



function useMousePosition(canvasSize) {
    const mouse = {
        x: 0,
        y: 0,
    }
    let mousePosition = {
        x: 0,
        y: 0,
        setMousePosition(x, y) {
            this.x = x
            this.y = y
        }
    }

    const handleMouseMove = (event) => {
        mousePosition.setMousePosition(event.clientX, event.clientY);
        onMouseMove()
    };

    window.addEventListener("mousemove", handleMouseMove);

    const onMouseMove = () => {
        const rect = canvas.getBoundingClientRect();
        const { w, h } = canvasSize;
        const x = mousePosition.x - rect.left - w / 2;
        const y = mousePosition.y - rect.top - h / 2;
        const inside = x < w / 2 && x > -w / 2 && y < h / 2 && y > -h / 2;
        if (inside) {
            mouse.x = x;
            mouse.y = y;
        }
    };

    return { mouse, mousePosition };
}
