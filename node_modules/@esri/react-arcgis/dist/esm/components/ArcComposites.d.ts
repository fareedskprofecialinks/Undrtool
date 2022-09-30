/// <reference types="react" />
import { BaseProps } from './ArcBase';
export interface MapBaseProps extends BaseProps {
    scriptUri: string[];
    [index: string]: any;
}
export interface WebBaseProps extends BaseProps {
    scriptUri: string[];
    id: string;
    [index: string]: any;
}
export interface EventMap {
    onClick: 'click' | string;
    onDoubleClick: 'double-click' | string;
    onDrag: 'drag' | string;
    onHold: 'hold' | string;
    onKeyDown: 'key-down' | string;
    onKeyUp: 'key-up' | string;
    onLayerViewCreate: 'layerview-create' | string;
    onLayerViewDestroy: 'layerview-destroy' | string;
    onMouseWheel: 'mouse-wheel' | string;
    onPointerDown: 'pointer-down' | string;
    onPointerMove: 'pointer-move' | string;
    onPointerUp: 'pointer-up' | string;
    onResize: 'resize' | string;
    [index: string]: string;
}
export declare const MapBase: (props: MapBaseProps) => JSX.Element;
export declare const WebBase: (props: WebBaseProps) => JSX.Element;
