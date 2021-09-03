/**
 * @file select type
 * @author skykun
 */

import { FormType } from './form';
import Input from './input';
import ArrowIcon from '../assets/icon/arrow.svg';

type CustomHTMLSelectElement = HTMLSelectElement & { selected: boolean };

export default class Select extends Input {
    menuId: string;
    arrowId: string;
    constructor(data: FormType) {
        super(data);
        this.defaultValue = this.metaData.defaultValue;
        this.menuId = `select-menu-${this.uuid}`;
        this.arrowId = `select-menu-arrow-${this.uuid}`;
    }

    handleItemTpl(data: {value: string, text: string}): string {
        return `<li value="${data.value}" ${data.value === this.defaultValue ? 'selected': ''}>${data.text}</li>`;
    }

    /**
     * @override
     */
    handleTpl(): string | never {
        if (!this.metaData.items.length) {
            throw new Error('please check select element items');
        }
        const selectItems = this.metaData.items.reduce((res, item) => {
            res += this.handleItemTpl(item);
            return res;
        }, '');

        // wrap select container
        return `<div class="form-genki-select-wrapper"><div id="${this.uuid}" name="${this.metaData.name}" class="form-genki-select ${this.setStyle()}"></div>
        <div class="form-genki-select-items" id=${this.menuId} style="display: none">${selectItems}</div>${this.getSelectIcon()}</div>`
    }

    /**
     * @override
     * handle select click & choose event
     */
    handleAction(): void {
        const {$select, $selectItems, $arrow} = this.getSelectItems();
        $select.addEventListener('click', (evt) => {
            this.handleSelectClick($selectItems, $arrow);
        });
        $selectItems.addEventListener('click', (evt) => {
            this.handleSelectItemClick(evt, $select, $selectItems);
        });
        // click outside to close selectItems
        document.addEventListener('click', (evt) => {
            this.handleDocumentClick(evt, $select, $selectItems, $arrow);
        });
    }

    /**
     * @override
     * remove event listener
     */
    removeAction(): void {
        const {$select, $selectItems, $arrow} = this.getSelectItems();
        $select.removeEventListener('click', (evt) => {
            this.handleSelectClick($selectItems, $arrow);
        });
        $selectItems.removeEventListener('click', (evt) => {
            this.handleSelectItemClick(evt, $select, $selectItems);
        });
        // click outside to close selectItems
        document.removeEventListener('click', (evt) => {
            this.handleDocumentClick(evt, $select, $selectItems, $arrow);
        });
    }

    private getSelectItems () {
        return {
            $select: document.getElementById(this.uuid),
            $selectItems: document.getElementById(this.menuId),
            $arrow:  document.getElementById(this.arrowId),
        };
    }

    /**
     * 
     * @param $selectItems 
     * @param $arrow 
     */
    private handleSelectClick ($selectItems: HTMLElement, $arrow: HTMLElement) {
        this.toggleItems($selectItems);
        this.toggleIcon($arrow);
    }

    private handleSelectItemClick (evt: MouseEvent, $select: HTMLElement, $selectItems: HTMLElement) {
        const itemElement = evt.target as Element;
        if (itemElement.tagName === 'LI') {
            // get value of li
            const selectName = itemElement.innerHTML;
            // set select value
            $select.innerHTML = selectName;
        }
        this.toggleItems($selectItems);
    }

    private handleDocumentClick (evt: MouseEvent, $select: HTMLElement, $selectItems: HTMLElement, $arrow: HTMLElement) {
        if (!$select.contains(evt.target as Node)) {
            $selectItems.style.display = 'none';
            $arrow.style.transform = 'unset';
        }
    }

    /**
     * control select drop menu
     */
    private toggleItems ($selectItems: HTMLElement) {
        $selectItems.style.display = $selectItems.style.display === 'block' ? 'none' : 'block';
    }

    /**
     * set arrow icon style
     */
    private toggleIcon ($icon: HTMLElement) {
        const iconTransform = $icon.style.transform;
        $icon.style.transform = (!iconTransform || iconTransform === 'unset') ? 'rotate(180deg)' : 'unset';
    }

    /**
     * select arrow content
     */
    getSelectIcon(): string {
        return `<span class="form-genki-arrow" id=${this.arrowId}>${ArrowIcon}</span>`
    }

    /**
     * @override
     */
    getValue(): string {
        const $radioItems = document.getElementById(this.uuid);
        let res = '';
        [].forEach.call($radioItems.children, (el: CustomHTMLSelectElement) => {
            if (el.selected) {
                res = el.value;
            }
        });
        return res;
    }
}