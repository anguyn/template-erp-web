import { createWithEqualityFn } from 'zustand/traditional';
import { immer } from 'zustand/middleware/immer';
import { devtools, persist } from 'zustand/middleware';
import { createSelectors } from '@/utils/createSelectors';

export const useCompanyStore = createSelectors(createWithEqualityFn(
    devtools(
        persist(
            immer((set, get) => ({
                companyInfo: {
                    Code: null,
                    CompanyName: '',
                    Address: '',
                    Country: '',
                    PhoneNumber: '',
                    FaxNumber: '',
                    eMail: '',
                    LocalCurrency: '',
                    SystemCurrency: '',
                    TaxPercentage: '',
                    WithholdingTaxDdctOffice: '',
                    TotalsAccuracy: null,
                    AccuracyofQuantities: null,
                    PriceAccuracy: null,
                    RateAccuracy: null,
                    PercentageAccuracy: null,
                    MeasuringAccuracy: null,
                    QueryAccuracy: null,
                    ManagingDirectorForeignLan: '',
                    TaxDefinitionforVatitem: '',
                    TaxDefinitionforVatservice: '',
                    TaxGroupforPurchaseItem: '',
                    TaxGroupforServicePurchase: '',
                    ExtendedAdminInfo: null,
                },
                setCompanyInfo: (partialState) => {
                    set((state) => {
                        Object.keys(partialState).forEach((key) => {
                            if (state.companyInfo.hasOwnProperty(key)) {
                                state.companyInfo[key] = partialState[key];
                            }
                        });
                    });
                },
                currencies: [],
                setCurrencies: (partialState) => {
                    if (Array.isArray(partialState)) {
                        set((state) => {
                            state.currencies = partialState;
                        });
                    }
                },
            })
            )
            , {
                name: 'Company Store'
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
