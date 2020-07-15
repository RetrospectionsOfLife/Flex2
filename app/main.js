// without this line, we cant run WASM without warnings
// the messages are hidden in prod, and we dont do network stuff anyway
window.ELECTRON_DISABLE_SECURITY_WARNINGS = true;

import React from 'react';
import { render } from 'react-dom';
import { Layout } from '#components/layout';
import './controls/keyboard';
import './components/import';

render(
    <Layout/>,
    document.body.appendChild(document.createElement('div'))
);

document.addEventListener('dragover', (e) => {
    e.preventDefault();
    return false;
}, false);

document.addEventListener('drop', (e) => {
    e.preventDefault();
    return false;
}, false);
