import { useState } from "react";
import Mixer from "../dj/Mixer";

export default function MixerExample() {
  const [masterBpm, setMasterBpm] = useState(120);
  const [crossfade, setCrossfade] = useState(0.5);
  const [isSynced, setIsSynced] = useState(false);

  return (
    <div className="flex justify-center bg-background p-4">
      <Mixer
        masterBpm={masterBpm}
        onMasterBpmChange={setMasterBpm}
        crossfade={crossfade}
        onCrossfadeChange={setCrossfade}
        onSync={() => {
          console.log("Sync triggered");
          setIsSynced(true);
        }}
        isSynced={isSynced}
      />
    </div>
  );
}
