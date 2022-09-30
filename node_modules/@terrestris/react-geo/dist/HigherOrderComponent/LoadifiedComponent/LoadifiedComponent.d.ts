import * as React from 'react';
import { SpinProps } from 'antd/lib/spin';
/**
 * The HOC factory function.
 *
 * Wrapped components will be used as the content of the Loader component.
 * If the wrapped component is set to be loading the loader element
 * will be shown and if not it wont.
 *
 * @param WrappedComponent The component to wrap and enhance.
 * @return The wrapped component.
 */
export declare function loadify<P>(WrappedComponent: React.ComponentType<any>): {
    new (props: P): {
        /**
         * The render function.
         */
        render(): JSX.Element;
        context: any;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<P & Partial<SpinProps>>) => {} | Pick<{}, K>) | Pick<{}, K>, callback?: () => void): void;
        forceUpdate(callback?: () => void): void;
        readonly props: Readonly<P & Partial<SpinProps>> & Readonly<{
            children?: React.ReactNode;
        }>;
        state: Readonly<{}>;
        refs: {
            [key: string]: React.ReactInstance;
        };
        componentDidMount?(): void;
        shouldComponentUpdate?(nextProps: Readonly<P & Partial<SpinProps>>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<P & Partial<SpinProps>>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<P & Partial<SpinProps>>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<P & Partial<SpinProps>>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<P & Partial<SpinProps>>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<P & Partial<SpinProps>>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<P & Partial<SpinProps>>, nextState: Readonly<{}>, nextContext: any): void;
    };
    /**
     * The default properties.
     */
    defaultProps: {
        spinning: boolean;
    };
    contextType?: React.Context<any>;
};
