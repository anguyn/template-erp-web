import { createWithEqualityFn } from 'zustand/traditional';
import { immer } from 'zustand/middleware/immer';
import { devtools, persist } from 'zustand/middleware';
import { createSelectors } from '@/utils/createSelectors';

export const useDataStore = createSelectors(createWithEqualityFn(
    devtools(
        persist(
            immer((set, get) => ({
                documentEntries: {
                    GoodsReceiptPO: null,
                    Delivery: null,
                    SalesOrder: null,
                    PurchaseOrder: null,
                    SalesQuotation: null,
                    PurchaseQuotation: null,
                    PurchaseQuotation: null,
                    GoodsReceipt: null,
                    GoodsIssue: null,
                },
                setDocumentEntries: (partialState) => {
                    set((state) => {
                        Object.keys(partialState).forEach((key) => {
                            if (state.documentEntries.hasOwnProperty(key)) {
                                state.documentEntries[key] = partialState[key];
                            }
                        });
                    });
                },
            })
            )
            , {
                name: 'Data Store'
            })
    )
));

// isOverlay: () => {
//     return get().layoutConfig.menuMode === 'overlay';
// },
// isDesktop: () => {
//     return window.innerWidth > 991;
// },
// onMenuToggle: () => {
//     if (get().isOverlay()) {
//         set((state) => {
//             state.layoutState.overlayMenuActive = !get().layoutState.overlayMenuActive;
//         });
//     }
//     if (get().isDesktop()) {
//         set((state) => {
//             state.layoutState.staticMenuDesktopInactive =
//                 !get().layoutState.staticMenuDesktopInactive;
//         });
//     } else {
//         set((state) => {
//             state.layoutState.staticMenuMobileActive =
//                 !get().layoutState.staticMenuMobileActive;
//         });
//     }
// },
// showProfileSidebar: () =>
//     set((state) => {
//         state.layoutState.profileSidebarVisible = !get().layoutState.profileSidebarVisible;
//     }),
