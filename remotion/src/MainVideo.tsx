import { AbsoluteFill } from "remotion";
import { TransitionSeries, springTiming } from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";
import { fade } from "@remotion/transitions/fade";
import { PersistentBackground } from "./components/PersistentBackground";
import { Scene1Intro } from "./scenes/Scene1Intro";
import { Scene2Library } from "./scenes/Scene2Library";
import { Scene3Builder } from "./scenes/Scene3Builder";
import { Scene4Output } from "./scenes/Scene4Output";
import { Scene5Outro } from "./scenes/Scene5Outro";

const timing = springTiming({ config: { damping: 200 }, durationInFrames: 20 });

export const MainVideo = () => (
  <AbsoluteFill>
    <PersistentBackground />
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={90}>
        <Scene1Intro />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={slide({ direction: "from-right" })} timing={timing} />
      <TransitionSeries.Sequence durationInFrames={120}>
        <Scene2Library />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={slide({ direction: "from-left" })} timing={timing} />
      <TransitionSeries.Sequence durationInFrames={120}>
        <Scene3Builder />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={slide({ direction: "from-right" })} timing={timing} />
      <TransitionSeries.Sequence durationInFrames={110}>
        <Scene4Output />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={timing} />
      <TransitionSeries.Sequence durationInFrames={100}>
        <Scene5Outro />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  </AbsoluteFill>
);
