import { spring, useCurrentFrame, useVideoConfig, AbsoluteFill } from 'remotion';

export const PDFViewer = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const scroll = spring({
        fps,
        frame,
        config: { damping: 200 }
    });

    return (
        <AbsoluteFill style={{
            background: '#e2e8f0',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden'
        }}>
            <h2 style={{ fontFamily: 'Cairo', fontSize: '50px', marginBottom: '30px', color: '#1e293b', zIndex: 10 }}>📖 مكتبة الملازم والكتب</h2>

            <div style={{
                width: '500px',
                height: '700px',
                background: 'white',
                boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
                transform: `translateY(${-100 + scroll * 50}px) rotate(${Math.sin(frame / 20) * 2}deg)`,
                padding: '40px'
            }}>
                <div style={{ height: '30px', background: '#cbd5e1', marginBottom: '20px', width: '60%' }}></div>
                <div style={{ height: '10px', background: '#e2e8f0', marginBottom: '10px' }}></div>
                <div style={{ height: '10px', background: '#e2e8f0', marginBottom: '10px' }}></div>
                <div style={{ height: '10px', background: '#e2e8f0', marginBottom: '10px' }}></div>
                <div style={{ height: '150px', background: '#f1f5f9', margin: '20px 0' }}></div>
                <div style={{ height: '10px', background: '#e2e8f0', marginBottom: '10px' }}></div>
                <div style={{ height: '10px', background: '#e2e8f0', marginBottom: '10px' }}></div>
                <div style={{ height: '10px', background: '#e2e8f0', marginBottom: '10px' }}></div>
            </div>
        </AbsoluteFill>
    );
};
