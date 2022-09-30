import * as React from 'react';
import { AvatarProps } from 'antd/lib/avatar';
import './UserChip.less';
export interface BaseProps {
    /**
     * An optional CSS class which should be added.
     */
    className?: string;
    /**
     * The image src.
     */
    imageSrc?: string;
    /**
     * The react element representing the user menu
     */
    userMenu?: React.ReactNode;
    /**
     * The user name.
     */
    userName?: React.ReactNode;
    /**
     * The style object
     */
    style?: any;
}
export declare type UserChipProps = BaseProps & AvatarProps;
/**
 * Class representing the user chip containing an image of the user and his/her
 * name
 *
 * @class The UserChip
 * @extends React.Component
 */
declare class UserChip extends React.Component<UserChipProps> {
    /**
     * The className added to this component.
     * @private
     */
    _className: string;
    /**
     * Create a UserChip.
     * @constructs UserChip
     */
    constructor(props: UserChipProps);
    /**
     * Determine initials for a given user name. The username will be splitted by
     * a whitespace and the first character of each part (capital letter) is added
     * to the initials.
     * e.g. 'John Doe' leads to 'JD'
     *
     * @return Initials if the user name.
     *
     * @method getInitials
     */
    getInitials(): string;
    /**
     * getUserMenu - Description
     *
     * @return Description
     */
    getUserMenu(): JSX.Element;
    /**
     * The render function
     */
    render(): JSX.Element;
}
export default UserChip;
