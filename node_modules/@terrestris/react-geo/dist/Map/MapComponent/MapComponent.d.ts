import * as React from 'react';
import { PureComponent } from 'react';
import OlMap from 'ol/Map';
export interface WindowLocale {
}
interface DefaultProps {
    mapDivId: string;
}
interface BaseProps {
    children?: React.ReactChildren;
    map: OlMap;
}
export declare type MapComponentProps = BaseProps & Partial<DefaultProps> & React.HTMLAttributes<HTMLDivElement>;
/**
 * Class representing a map.
 *
 * @class The MapComponent.
 * @extends React.PureComponent
 */
export declare class MapComponent extends PureComponent<MapComponentProps> {
    /**
     * The default properties.
     */
    static defaultProps: DefaultProps;
    /**
     * Create a MapComponent.
     */
    constructor(props: MapComponentProps);
    /**
     * The componentDidMount function.
     */
    componentDidMount(): void;
    /**
     * The componentWillUnmount function.
     */
    componentWillUnmount(): void;
    /**
     * Invoked immediately after updating occured and also called for the initial
     * render.
     */
    componentDidUpdate(): void;
    /**
     * The render function.
     */
    render(): any;
}
export default MapComponent;
