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
      remotes: [],
    });
  }
  return mfInstance;
};

const registerRemote = (name: string, entry: string) => {
  const mf = getMFInstance();
  mf.registerRemotes([{ name, alias: name, entry }]);
};

export const ModuleFederationResourceRenderer = ({
  resource,
}: {
  resource: Partial<Resource>;
  onUIAction?: (result: UIActionResult) => Promise<unknown>;
  htmlProps?: Omit<HTMLResourceRendererProps, 'resource' | 'onUIAction'>;
}) => {
  const remoteName = String(resource.text || '').split('@')[0];
  const remoteEntry = String(resource.text || '').split('@')[1];

  const svelteRef = useRef<HTMLDivElement>(null);
  const vueRef = useRef<HTMLDivElement>(null);
  const solidRef = useRef<HTMLDivElement>(null);
  const angularRef = useRef<HTMLDivElement>(null);

  const framework = useMemo(() => {
    const mimeType = resource.mimeType || '';
    if (mimeType.includes('framework=vue')) {
      return 'vue';
    }
    if (mimeType.includes('framework=svelte')) {
      return 'svelte';
    }
    if (mimeType.includes('framework=solid')) {
      return 'solid';
    }
    if (mimeType.includes('framework=angular')) {
      return 'angular';
    }
    // Default to react
    return 'react';
  }, [resource.mimeType]);

  useEffect(() => {
    if (remoteName && remoteEntry) {
      registerRemote(remoteName, remoteEntry);
    }
    if (framework === 'angular') {
      getMFInstance().loadRemote('mfe1/Component').then((remote) => {
        console.log('$$ remote', remote);
        // @ts-expect-error TODO: fix this
        remote.default(angularRef.current);
      });
    }
    if (framework === 'svelte') {
      getMFInstance()
        .loadRemote(remoteName)
        .then((remote) => {
          console.log('$$ remote', remote);
          // @ts-expect-error TODO: fix this
          remote.default(svelteRef.current);
        });
    }
    if (framework === 'vue') {
      getMFInstance()
        .loadRemote(remoteName)
        .then((remote) => {
          console.log('$$ remote', remote);
          // @ts-expect-error TODO: fix this
          remote.default(vueRef.current);
        });
    }
    if (framework === 'solid') {
      getMFInstance()
        .loadRemote(remoteName)
        .then((remote) => {
          console.log('$$ remote', remote);
          // @ts-expect-error TODO: fix this
          remote.default(solidRef.current);
        });
    }
  }, [framework, remoteName, remoteEntry]);

  const RemoteComponent = React.lazy(() =>
    // @ts-expect-error test
    getMFInstance().loadRemote(remoteName, remoteEntry),
  );
  // console.log('$$ RemoteComponent2', RemoteComponent);
  return (
    <div>
      Module Federation: {remoteName} from {remoteEntry} {framework}
      {framework === 'vue' ? (
        <div ref={vueRef} />
      ) : framework === 'svelte' ? (
        <div ref={svelteRef} />
      ) : framework === 'solid' ? (
        <div ref={solidRef} />
      ) : framework === 'angular' ? (
        <div ref={angularRef} />
      ) : (
        <React.Suspense fallback="Loading Remote Component...">
          <RemoteComponent />
        </React.Suspense>
      )}
    </div>
  );
};
