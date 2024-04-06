import { audioEngine, decisionEngine } from "@/controllers/init";
import { motion } from "framer-motion";
import { useSwipeable } from "react-swipeable";

export function ActionButton() {
  const bind = useSwipeable({
    onSwipedUp: () => {
      console.log("swiped up");
      new Howl({
        src: ["/audio/query.mp3"],
      }).play();
      decisionEngine.visionInference(true);
    },
    onSwipedDown: () => {
      console.log("swiped down");
    },
    onSwipedLeft: () => {
      console.log("swiped left");
      new Howl({
        src: ["/audio/success.mp3"],
      }).play();
      audioEngine.ignore();
    },
    onSwipedRight: () => {
      console.log("swiped right");
      new Howl({
        src: ["/audio/success.mp3"],
      }).play();
    },
    onTap: () => {
      console.log("tapped");
      audioEngine.ignore();
    },
  });

  return (
    <div className="fixed bottom-32 left-0 right-0 mb-4 w-screen flex items-center justify-center h-64 z-10">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="h-72 w-72 rounded-full border-2 border-opacity-20 border-white flex items-center justify-center"
      >
        <button
          {...bind}
          className="h-64 w-64 rounded-full border-2 border-white touch-none"
        />
      </motion.div>
    </div>
  );
}
