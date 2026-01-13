import { spring, useCurrentFrame, useVideoConfig, AbsoluteFill } from 'remotion';

export const CourseMgmt = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const slide = spring({
        fps,
        frame,
        config: { damping: 200 }
    });

    return (
        <AbsoluteFill style={{
            background: '#1e1b4b',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white'
        }}>
            <h2 style={{ fontFamily: 'Cairo', fontSize: '50px', marginBottom: '50px' }}>📚 تنظيم المحتوى الدراسي</h2>

            <div style={{
                background: 'rgba(255,255,255,0.1)',
                width: '800px',
                borderRadius: '20px',
                overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.2)'
            }}>
                <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between' }}>
                    <span>الباب الأول: مقدمة في المنهج</span>
                    <span>✏️</span>
                </div>
                <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between' }}>
                    <span>الباب الثاني: المعادلات الصعبة</span>
                    <span>✏️</span>
                </div>
                <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', background: 'rgba(79, 70, 229, 0.3)' }}>
                    <span>+ إضافة درس جديد</span>
                </div>
            </div>
        </AbsoluteFill>
    );
};
