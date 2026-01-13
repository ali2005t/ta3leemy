import { spring, useCurrentFrame, useVideoConfig, AbsoluteFill, Sequence } from 'remotion';

const FeatureItem = ({ text, icon, delay }: { text: string; icon: string; delay: number }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const slideUp = spring({
        fps,
        frame: frame - delay,
        config: { damping: 100 },
    });

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            marginBottom: '30px',
            opacity: slideUp,
            transform: `translateY(${(1 - slideUp) * 50}px)`
        }}>
            <span style={{ fontSize: '60px' }}>{icon}</span>
            <span style={{ fontSize: '50px', fontFamily: 'Cairo', fontWeight: 'bold', color: '#334155' }}>{text}</span>
        </div>
    );
};

export const Showcase = () => {
    return (
        <AbsoluteFill style={{
            backgroundColor: 'white',
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            <h2 style={{ fontFamily: 'Cairo', fontSize: '60px', color: '#4F46E5', marginBottom: '50px' }}>مميزات خرافية</h2>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <FeatureItem icon="🎥" text="بث مباشر بجودة عالية" delay={0} />
                <FeatureItem icon="📝" text="امتحانات وتصحيح تلقائي" delay={15} />
                <FeatureItem icon="📊" text="تقارير متابعة دورية" delay={30} />
                <FeatureItem icon="🔒" text="حماية كاملة للمحتوى" delay={45} />
            </div>
        </AbsoluteFill>
    );
};
