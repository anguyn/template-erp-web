import { createWithEqualityFn } from 'zustand/traditional';
import { immer } from 'zustand/middleware/immer';
import { devtools } from 'zustand/middleware';
import {createSelectors} from '@/utils/createSelectors';

export const useMenuStore = createSelectors(createWithEqualityFn(
    devtools(immer((set, get) => ({
        activeMenu: '',
        setActiveMenu: (activeMenu) => {
            set((state) => {
                state.activeMenu = activeMenu;
            });
        },
    })))
));
