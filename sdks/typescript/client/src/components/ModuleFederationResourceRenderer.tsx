import { Resource } from '@modelcontextprotocol/sdk/types.js';
import { UIActionResult } from '../types';
import React, { useEffect, useMemo, useRef } from 'react';
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

  const remoteRef = useRef<HTMLDivElement>(null);

  const framework = useMemo(() => {
    const mimeType = resource.mimeType || '';
    if (mimeType.includes('framework=vue')) {
      return 'vue';
    }
    // Default to react
    return 'react';
  }, [resource.mimeType]);

  useEffect(() => {
    if (remoteName && remoteEntry) {
      registerRemote(remoteName, remoteEntry);
    }
    if(framework === 'vue'){
      getMFInstance().loadRemote(remoteName).then((remote) => {
        // @ts-expect-error TODO: fix this
        remote.default(remoteRef.current);
      });
    }
  }, []);

    const RemoteComponent = React.lazy(() =>
      // @ts-expect-error test
      getMFInstance().loadRemote(remoteName, remoteEntry)
    );
  console.log('$$ RemoteComponent', RemoteComponent);
  return (
    <div>
      Module Federation: {remoteName} from {remoteEntry} {framework}
      {
      framework === 'vue' ? <div ref={remoteRef} /> : <React.Suspense fallback="Loading Remote Component...">
        <RemoteComponent />
      </React.Suspense>
      }
    </div>
  );
};