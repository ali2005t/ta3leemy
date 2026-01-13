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
            backgroundColor: 'white',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <h1 style={{
                fontFamily: 'Cairo, sans-serif',
                fontSize: '100px',
                fontWeight: 'bold',
                color: '#4F46E5',
                transform: `scale(${scale})`
            }}>
                🚀 تعليمي
            </h1>
            <h2 style={{
                fontFamily: 'Cairo, sans-serif',
                fontSize: '40px',
                color: '#0ea5e9',
                opacity: opacity
            }}>
                مستقبل التعليم الإلكتروني
            </h2>
        </div>
    );
};
