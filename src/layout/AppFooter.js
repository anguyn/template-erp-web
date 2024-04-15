import React, { useContext } from 'react';
import { useLayoutStore } from '@/stores/layoutStore';
import { shallow } from 'zustand/shallow';

const AppFooter = () => {
    const { layoutConfig } = useLayoutStore((state) => state, shallow);

    return (
        <div className="layout-footer">
            OS Template from
            <span className="font-medium mx-1">PrimeReact</span>
            <span>- Powered by an 🐼 </span>
        </div>
    );
};

export default AppFooter;
