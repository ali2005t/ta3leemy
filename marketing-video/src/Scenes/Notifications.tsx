import { spring, useCurrentFrame, useVideoConfig, AbsoluteFill } from 'remotion';

export const Notifications = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const slideIn = spring({
        fps,
        frame,
        config: { damping: 15 }
    });

    return (
        <AbsoluteFill style={{
            background: '#fff',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column'
        }}>
            <h2 style={{ fontFamily: 'Cairo', fontSize: '50px', marginBottom: '50px', color: '#1e293b' }}>🔔 تنبيهات فورية</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{
                    background: '#f1f5f9',
                    padding: '20px 40px',
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px',
                    width: '600px',
                    boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
                    transform: `translateX(${(1 - slideIn) * -100}%)`,
                    opacity: slideIn
                }}>
                    <span style={{ fontSize: '30px', background: '#e0e7ff', padding: '10px', borderRadius: '50%' }}>📢</span>
                    <div>
                        <h3 style={{ fontFamily: 'Cairo', margin: 0 }}>مستر محمد نزل حصة جديدة</h3>
                        <p style={{ fontFamily: 'Cairo', margin: 0, color: '#64748b' }}>منذ دقيقة</p>
                    </div>
                </div>

                <div style={{
                    background: '#f1f5f9',
                    padding: '20px 40px',
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px',
                    width: '600px',
                    boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
                    transform: `translateX(${(1 - slideIn) * 100}%)`,
                    opacity: slideIn
                }}>
                    <span style={{ fontSize: '30px', background: '#dcfce7', padding: '10px', borderRadius: '50%' }}>✅</span>
                    <div>
                        <h3 style={{ fontFamily: 'Cairo', margin: 0 }}>تم تصحيح امتحان الكيمياء</h3>
                        <p style={{ fontFamily: 'Cairo', margin: 0, color: '#64748b' }}>الدرجة: 48/50</p>
                    </div>
                </div>
            </div>
        </AbsoluteFill>
    );
};
