import { spring, useCurrentFrame, useVideoConfig } from 'remotion';

export const Intro = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const scale = spring({
        fps,
        frame,
        config: {
            damping: 200,
        },
    });

    const opacity = spring({
        fps,
        frame: frame - 20,
        config: {
            damping: 200,
        },
    });

    return (
        <div style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            background: 'linear-gradient(135deg, #4F46E5 0%, #0ea5e9 100%)', // Gradient BG
            display: 'flex',
            flexDirection: 'column',
            color: 'white'
        }}>
            <h1 style={{
                fontFamily: 'Roboto, sans-serif', // English Font
                fontSize: '140px',
                fontWeight: '900',
                letterSpacing: '5px',
                transform: `scale(${scale})`,
                textShadow: '0 10px 30px rgba(0,0,0,0.3)'
            }}>
                Ta3leemy
            </h1>
            <h2 style={{
                fontFamily: 'Cairo, sans-serif',
                fontSize: '50px',
                marginTop: '20px',
                opacity: opacity,
                fontWeight: '300'
            }}>
                The Future of Education 🚀
            </h2>
        </div>
    );
};
