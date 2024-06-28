import { useEffect, useState } from 'react';
import { StoreApi, UseBoundStore, } from 'zustand'
import { StorePersist, Write } from 'zustand/middleware';

export const useHydration = (boundStore) => {
    console.log(boundStore.persist);
    const [hydrated, setHydrated] = useState(boundStore.persist?.hasHydrated);
    useEffect(() => {
        const unsubHydrate = boundStore.persist.onHydrate(() => setHydrated(false))
        const unsubFinishHydration = boundStore.persist.onFinishHydration(() => setHydrated(true))
        setHydrated(boundStore.persist.hasHydrated())
        return () => {
            unsubHydrate()
            unsubFinishHydration()
        }
    }, []);
    return hydrated;
}