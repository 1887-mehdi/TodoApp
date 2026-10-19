import { dueInput, dateField, dateBtn, dateText, dateClear } from '../core/dom.js';
import { formatDue } from '../utils/date.js';
import { openDatePicker, prepareDatePicker } from './datePicker.js';

function sync() {
    const value = dueInput.value;
    dateText.textContent = value ? formatDue(value) : '';
    dateField.classList.toggle('has-value', Boolean(value));
    dateClear.hidden = !value;
}

function setValue(iso) {
    dueInput.value = iso;
    sync();
}

export function initDateField() {
    prepareDatePicker();
    dateBtn.addEventListener('click', () => {
        console.log('کلیک روی تقویم');
        openDatePicker({
            anchor: dateField,
            value: dueInput.value,
            onPick: setValue,
        });
    });

    dateClear.addEventListener('click', () => setValue(''));

    sync();
}

export function resetDateField() {
    setValue('');
}