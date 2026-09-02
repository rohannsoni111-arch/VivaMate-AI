import React, { createContext, useContext, useState } from 'react';
import { AvatarExaminer } from '../AvatarExaminer';

export type AvatarState = 'idle' | 'speaking' | 'listening' | 'thinking';

export interface AvatarProviderProps {
  providerType?: 'local_mock' | 'third_party_did' | 'third_party_heygen';
  state: AvatarState;
  questionText?: string;
  isTtsEnabled?: boolean;
  onToggleTts?: () => void;
}

interface AvatarContextType {
  providerType: 'local_mock' | 'third_party_did' | 'third_party_heygen';
  setProviderType: (type: 'local_mock' | 'third_party_did' | 'third_party_heygen') => void;
}

const AvatarContext = createContext<AvatarContextType>({
  providerType: 'local_mock',
  setProviderType: () => {}
});

export const useAvatarContext = () => useContext(AvatarContext);

export const AvatarProvider: React.FC<AvatarProviderProps> = ({
  providerType = 'local_mock',
  state,
  questionText,
  isTtsEnabled = true,
  onToggleTts
}) => {
  const [currentProvider, setCurrentProvider] = useState(providerType);

  return (
    <AvatarContext.Provider value={{ providerType: currentProvider, setProviderType: setCurrentProvider }}>
      <div className="w-full relative">
        {/* Active Provider Indicator */}
        <div className="absolute top-2 right-2 z-20">
          <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded bg-slate-800/80 text-slate-400 border border-slate-700/60">
            {currentProvider === 'local_mock' ? 'Interactive AI Avatar Engine' : 'Stream Avatar API'}
          </span>
        </div>

        {/* Local Polished Interactive Avatar Engine */}
        <AvatarExaminer
          state={state}
          questionText={questionText}
          isTtsEnabled={isTtsEnabled}
          onToggleTts={onToggleTts}
        />
      </div>
    </AvatarContext.Provider>
  );
};
