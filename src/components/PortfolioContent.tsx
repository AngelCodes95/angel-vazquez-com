export function PortfolioContent() {
  return (
    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-sans text-white text-center z-[1001] pointer-events-none text-[clamp(0.5rem,2vw,1rem)] w-[90vw] max-w-[600px]">
      <h1 className="text-[clamp(2rem,8vw,3rem)] font-light m-0 mb-2 opacity-0 animate-neon-reveal [animation-delay:1s]">
        ANGEL VAZQUEZ
      </h1>

      <h2 className="text-[clamp(1rem,4.5vw,1.65rem)] font-light m-0 mb-6 opacity-0 tracking-[0.1em] animate-neon-reveal [animation-delay:2s]">
        SOFTWARE ENGINEER
      </h2>

      <div className="w-[clamp(120px,20vw,200px)] h-0.5 bg-white mx-auto mb-5 opacity-0 shadow-[0_0_10px_rgba(255,255,255,0.8)] animate-neon-reveal [animation-delay:2.5s]" />

      <div className="flex flex-col items-center gap-6 opacity-0 animate-neon-reveal [animation-delay:3s]">
        <div className="flex gap-[clamp(2rem,8vw,3.75rem)] justify-center">
          <a
            href="https://github.com/AngelCodes95"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub Profile"
            className="inline-block transition-all duration-300 pointer-events-auto [filter:drop-shadow(0_0_10px_rgba(255,255,255,0.5))] hover:-translate-y-1 hover:[filter:drop-shadow(0_0_20px_rgba(255,255,255,0.8))]"
          >
            <svg
              viewBox="0 0 24 24"
              className="w-[clamp(20px,5vw,30px)] h-[clamp(20px,5vw,30px)] fill-white stroke-white"
            >
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
          </a>

          <a
            href="https://linkedin.com/in/angelthedev"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn Profile"
            className="inline-block transition-all duration-300 pointer-events-auto [filter:drop-shadow(0_0_10px_rgba(255,255,255,0.5))] hover:-translate-y-1 hover:[filter:drop-shadow(0_0_20px_rgba(255,255,255,0.8))]"
          >
            <svg
              viewBox="0 0 24 24"
              className="w-[clamp(20px,5vw,30px)] h-[clamp(20px,5vw,30px)] fill-white stroke-white"
            >
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </a>
        </div>

        <div className="flex justify-center">
          <a
            href="https://portfolio.angel-vazquez.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Portfolio Documentation"
            className="inline-block transition-all duration-300 pointer-events-auto [filter:drop-shadow(0_0_10px_rgba(255,255,255,0.5))] hover:-translate-y-1 hover:[filter:drop-shadow(0_0_20px_rgba(255,255,255,0.8))]"
            style={{ position: 'relative' }}
          >
            <svg
              viewBox="0 0 24 24"
              className="w-[clamp(20px,5vw,30px)] h-[clamp(20px,5vw,30px)] fill-white stroke-white"
            >
              <path d="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1zm0 13.5c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v11.5z" />
            </svg>
            <div
              className="text-white text-[clamp(10px,2.5vw,12px)] font-light opacity-0 pointer-events-none z-[1002] [text-shadow:0_0_10px_rgba(255,255,255,0.8)] animate-portfolio-hint whitespace-nowrap text-center"
              style={{
                position: 'absolute',
                top: '35px',
                left: '50%',
                transform: 'translateX(-50%)',
                transformOrigin: 'center',
              }}
            >
              Portfolio
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
