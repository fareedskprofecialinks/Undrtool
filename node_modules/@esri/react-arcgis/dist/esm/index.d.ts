/// <reference types="react" />
import * as MapViews from './components/MapComposites';
import * as WebViews from './components/WebComposites';
declare const ReactArcGIS: {
    Map: (props: MapViews.MapProps) => JSX.Element;
    Scene: (props: MapViews.SceneProps) => JSX.Element;
    WebMap: (props: WebViews.MapProps) => JSX.Element;
    WebScene: (props: WebViews.SceneProps) => JSX.Element;
};
export default ReactArcGIS;
export declare const WebMap: (props: WebViews.MapProps) => JSX.Element;
export declare const WebScene: (props: WebViews.SceneProps) => JSX.Element;
export declare const Map: (props: MapViews.MapProps) => JSX.Element;
export declare const Scene: (props: MapViews.SceneProps) => JSX.Element;
