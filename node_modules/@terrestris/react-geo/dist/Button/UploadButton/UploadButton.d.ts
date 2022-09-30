import * as React from 'react';
import { SimpleButtonProps } from '../SimpleButton/SimpleButton';
import './UploadButton.less';
interface BaseProps {
    /**
     * The className which should be added.
     */
    className?: string;
    /**
     * Object of props that should be passed to the input field.
     */
    inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
    /**
     * The onChange handler for the upload input field.
     */
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
export declare type UploadButtonProps = BaseProps & SimpleButtonProps;
/**
 * Class representing an upload button. Can be used as wrapper if children
 * are given. Otherwise a Simplebutton will be rendered.
 *
 * To use a text with the UploadButton provide a SimpleButton as children.
 *
 * This automatically supports uploads via drag and drop from the operating
 * system.
 *
 * @class The UploadButton
 * @extends React.Component
 */
declare class UploadButton extends React.Component<UploadButtonProps> {
    /**
     * The className added to this component.
     * @private
     */
    _className: string;
    /**
     * The render function.
     */
    render(): JSX.Element;
}
export default UploadButton;
