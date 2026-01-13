import { AbsoluteFill, Sequence } from 'remotion';
import { Intro } from './Scenes/Intro';
import { ProblemSolution } from './Scenes/ProblemSolution';
import { LiveChat } from './Scenes/LiveChat';
import { Showcase } from './Scenes/Showcase';
import { SuccessMoment } from './Scenes/SuccessMoment';
import { CTA } from './Scenes/CTA';

export const MarketingVideo = () => {
    // Total Duration: 690 frames
    return (
        <AbsoluteFill style={{ backgroundColor: 'white' }}>
            {/* 0s -> 3s: Intro */}
            <Sequence from={0} durationInFrames={90}>
                <Intro />
            </Sequence>

            {/* 3s -> 7s: Problem/Solution */}
            <Sequence from={90} durationInFrames={120}>
                <ProblemSolution />
            </Sequence>

            {/* 7s -> 11s: Live Chat */}
            <Sequence from={210} durationInFrames={120}>
                <LiveChat />
            </Sequence>

            {/* 11s -> 15s: Showcase */}
            <Sequence from={330} durationInFrames={120}>
                <Showcase />
            </Sequence>

            {/* 15s -> 19s: Success Moment (NEW) */}
            <Sequence from={450} durationInFrames={120}>
                <SuccessMoment />
            </Sequence>

            {/* 19s -> 23s: CTA */}
            <Sequence from={570} durationInFrames={120}>
                <CTA />
            </Sequence>
        </AbsoluteFill>
    );
};
