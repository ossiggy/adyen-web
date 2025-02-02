import { h } from 'preact';
import './SRPanel.scss';
import { SRPanelProps } from './types';
import BaseElement from '../../components/BaseElement';
import { SRMessages, SRMessagesRef } from './SRMessages';

/**
 * A panel meant to hold messages that will be read out by ScreenReaders on an aria-live="polite" basis
 * Expects a string or string array of message to add to the panel to be read out
 * For testing purposes can be made visible
 */
export class SRPanel extends BaseElement<SRPanelProps> {
    public static defaultProps = {
        enabled: true,
        node: 'body',
        showPanel: false,
        id: 'ariaLiveSRPanel'
    };

    private readonly srPanelContainer = null;

    private readonly id;
    private readonly showPanel;
    private readonly _enabled: boolean;
    private readonly _moveFocus: boolean;

    private componentRef: SRMessagesRef;

    constructor(props: SRPanelProps) {
        super(props);
        this.id = this.props.id;
        this.showPanel = process.env.NODE_ENV !== 'production' ? this.props.showPanel : false;
        this._enabled = false;
        this._moveFocus = this.props.moveFocus ?? true;

        if (this.props.enabled) {
            this._enabled = true;
            if (document.querySelector(this.props.node)) {
                this.srPanelContainer = document.createElement('div');
                this.srPanelContainer.className = 'sr-panel-holder';
                this.srPanelContainer.id = this.id;

                document.querySelector(this.props.node).appendChild(this.srPanelContainer);
                this.mount(this.srPanelContainer);
            } else {
                throw new Error('Component could not mount. Root node was not found.');
            }
        }
    }

    public setComponentRef = ref => {
        this.componentRef = ref;
    };

    public get enabled() {
        return this._enabled;
    }

    public get moveFocus() {
        return this._moveFocus;
    }

    // A method we can expose to allow comps to set messages in this panel
    public setMessages = (messages: string[] | string): void => {
        if (!this.props.enabled) return;

        let panelMessages = null;
        if (messages) {
            // Ensure panelMessages is an array
            panelMessages = Array.isArray(messages) ? messages : [messages];
        }

        this.componentRef.setMessages(panelMessages);
    };

    render() {
        if (!this.props.enabled) return null;
        return (
            <div
                className={this.showPanel ? 'adyen-checkout-sr-panel' : 'adyen-checkout-sr-panel--sr-only'}
                aria-live={'polite'}
                aria-atomic={'true'}
                role={'log'}
                aria-relevant={'all'}
                {...(process.env.NODE_ENV !== 'production' && { 'data-testid': this.id })}
            >
                <SRMessages setComponentRef={this.setComponentRef} />
            </div>
        );
    }
}
