import { Resource } from '@modelcontextprotocol/sdk/types.js';
import { UIActionResult } from '../types';
import React from 'react';
import { createInstance } from '@module-federation/enhanced/runtime';
import { HTMLResourceRendererProps } from './HTMLResourceRenderer';

// Singleton module federation instance
let mfInstance: ReturnType<typeof createInstance> | null = null;

const getMFInstance = () => {
  if (!mfInstance) {
    mfInstance = createInstance({
      name: 'mcp-ui_host',
      remotes: []
    });
  }
  return mfInstance;
};

const registerRemote = (name: string, entry: string) => {
  const mf = getMFInstance();
  mf.registerRemotes([{ name, alias: name, entry }]);
};

export const ModuleFederationResourceRenderer = ({ resource }: { resource: Partial<Resource>, 
    onUIAction?: (result: UIActionResult) => Promise<unknown>,
    htmlProps?: Omit<HTMLResourceRendererProps, 'resource' | 'onUIAction'>;
}) => {
  const remoteName = String(resource.text || '').split('@')[0];
  const remoteEntry = String(resource.text || '').split('@')[1];
  
  React.useEffect(() => {
    if (remoteName && remoteEntry) {
      registerRemote(remoteName, remoteEntry);
    }
  }, [remoteName, remoteEntry]);

  const RemoteButton = React.lazy(() =>
    // @ts-expect-error TODO: fix this
    getMFInstance().loadRemote(remoteName, remoteEntry)
  );

  return (
    <div>
      Module Federation: {remoteName} from {remoteEntry}
      <React.Suspense fallback="Loading Remote Component...">
        <RemoteButton />
      </React.Suspense>
    </div>
  );
};