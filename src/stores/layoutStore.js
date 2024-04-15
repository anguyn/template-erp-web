import { createWithEqualityFn } from 'zustand/traditional';
import { immer } from 'zustand/middleware/immer';
import { devtools, persist } from 'zustand/middleware';
import {createSelectors} from '@/utils/createSelectors';

export const useLayoutStore = createSelectors(createWithEqualityFn(
    devtools(
        persist(
            immer((set, get) => ({
            layoutConfig: {
                ripple: false,
                inputStyle: 'outlined',
                menuMode: 'static',
                colorScheme: 'light',
                theme: 'lara-light-indigo',
                scale: 14,
            },
            setLayoutConfig: (partialState) => {
                set((state) => {
                    Object.keys(partialState).forEach((key) => {
                        if (state.layoutConfig.hasOwnProperty(key)) {
                            state.layoutConfig[key] = partialState[key];
                        }
                    });
                });
            },
            layoutState: {
                staticMenuDesktopInactive: false,
                overlayMenuActive: false,
                profileSidebarVisible: false,
                configSidebarVisible: false,
                staticMenuMobileActive: false,
                menuHoverActive: false,
            },
            setLayoutState: (partialState) => {
                set((state) => {
                    Object.keys(partialState).forEach((key) => {
                        if (state.layoutState.hasOwnProperty(key)) {
                            state.layoutState[key] = partialState[key];
                        }
                    });
                });
            },
            isOverlay: () => {
                return get().layoutConfig.menuMode === 'overlay';
            },
            isDesktop: () => {
                return window.innerWidth > 991;
            },
            onMenuToggle: () => {
                if (get().isOverlay()) {
                    set((state) => {
                        state.layoutState.overlayMenuActive = !get().layoutState.overlayMenuActive;
                    });
                }
                if (get().isDesktop()) {
                    set((state) => {
                        state.layoutState.staticMenuDesktopInactive =
                            !get().layoutState.staticMenuDesktopInactive;
                    });
                } else {
                    set((state) => {
                        state.layoutState.staticMenuMobileActive =
                            !get().layoutState.staticMenuMobileActive;
                    });
                }
            },
            showProfileSidebar: () =>
                set((state) => {
                    state.layoutState.profileSidebarVisible = !get().layoutState.profileSidebarVisible;
                }),
        })
    )
        ,{
        name: 'Layout Store'
    })
)
));
