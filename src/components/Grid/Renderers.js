import React from 'react';

export class Renderers {
    constructor(enterEdit, exitEdit, editFieldName) {
        this.enterEdit = enterEdit;
        this.exitEdit = exitEdit;
        this.editFieldName = editFieldName;

        this.cellRender = this.cellRender.bind(this);
        this.rowRender = this.rowRender.bind(this);
    }

    cellRender(tdElement, cellProps) {
        const dataItem = cellProps.dataItem;
        const field = cellProps.field;
        const additionalProps = (cellProps.dataItem[this.editFieldName] && (cellProps.field === cellProps.dataItem[this.editFieldName])) ?
            {
                ref: (td) => {
                    const input = td && td.querySelector('input');
                    if (!input || (input === document.activeElement)) { return; }
                    if (input.type === 'checkbox') {
                        input.focus();
                    } else {
                        input.select();
                    }
                }
            } : {
                onClick: () => { this.enterEdit(dataItem, field); }
            };
        return React.cloneElement(tdElement, { ...tdElement.props, ...additionalProps }, tdElement.props.children);
    }

    rowRender(trElement, dataItem) {
        const trProps = {
            ...trElement.props,
            onMouseDown: () => {
                this.preventExit = true;
                clearTimeout(this.preventExitTimeout);
                this.preventExitTimeout = setTimeout(() => { this.preventExit = undefined; });
            },
            onBlur: () => {
                clearTimeout(this.blurTimeout);
                if (!this.preventExit) {
                    this.blurTimeout = setTimeout(() => { this.exitEdit(); });
                }
            },
            onFocus: () => { clearTimeout(this.blurTimeout); }
        };
        return React.cloneElement(trElement, { ...trProps }, trElement.props.children);
    }
}