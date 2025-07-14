import React, { useMemo } from "react";

const Animation = ({ count = 25 }) => {
  // Memoize the positions and animation durations
  const dots = useMemo(() => {
    return Array.from({ length: count }).map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      duration: `${3 + Math.random() * 4}s`,
      delay: `${Math.random() * 2}s`,
    }));
  }, [count]);

  return (
    <>
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {dots.map((dot, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-purple-300 rounded-full animate-float"
            style={{
              left: dot.left,
              top: dot.top,
              animationDuration: dot.duration,
              animationDelay: dot.delay,
            }}
          />
        ))}
      </div>

      {/* Define the float animation keyframes */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }

        .animate-float {
          animation-name: float;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }
      `}</style>
    </>
  );
};

export default Animation;
