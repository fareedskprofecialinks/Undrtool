import * as React from 'react';
import './Titlebar.less';
export interface BaseProps {
    /**
     * An optional CSS class which should be added.
     */
    className?: string;
    /**
     * Additional elements to show at the right side of the Titlebar.
     */
    tools?: React.ReactNode[];
}
export declare type TitlebarProps = BaseProps & React.HTMLAttributes<HTMLDivElement>;
/**
 * Class representing the titlebar. Usually used in a panel.
 *
 * @class The TitleBar
 * @extends React.Component
 */
export declare class Titlebar extends React.Component<TitlebarProps> {
    /**
     * The className added to this component.
     * @private
     */
    className: string;
    /**
     * The render function.
     */
    render(): JSX.Element;
}
export default Titlebar;
