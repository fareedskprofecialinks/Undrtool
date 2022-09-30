import * as React from 'react';
export interface VisibleComponentProps {
    activeModules: any[];
    name: string;
}
/**
 * The HOC factory function.
 *
 * Wrapped components will be checked against the activeModules array of
 * the state: If the wrapped component (identified by it's name) is included
 * in the state, it will be rendered, if not, it wont.
 *
 * @param WrappedComponent The component to wrap and enhance.
 * @return The wrapped component.
 */
export declare function isVisibleComponent<P>(WrappedComponent: React.ComponentType<P>): React.ComponentType<P & VisibleComponentProps>;
