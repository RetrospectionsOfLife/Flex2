import chunk from 'lodash/chunk';

const sizeLookup = {
    'b': 1,
    'w': 2,
    'l': 4,
};

export function asmToBin(buffer) {

    const asm = buffer.toString()
        .replace(/\$|even|(;(.*?)$)/gm, '') // remove comments / even / $ (assume no decimal)
        .replace(/(^\s*$)/gm, ''); // remove empty lines

    // split into labels/data
    // double comment char used to indicate start of line
    // add starting label to ensure all sections are accounted for
    const sections = (('__flex2__internal: \n' + asm)
        .replace(/^\S/gm, (d) => `;;${d}`)
        .replace(/\s/gm, '') + ';') // strip all whitespace (windows line endings)
        .match(/;.*?:.*?;/g)
        .map((d) => d.replace(/;/g, '').split(':'));

    // calculate pointer for each label
    let dataIndex = 0;
    const pointerMap = {};
    sections.forEach(([label, data]) => {
        pointerMap[label] = dataIndex;
        // insert newlines to split on
        const lines = data.split('dc').join('\ndc').split('\n');
        lines.forEach((line) => {
            const sizeMatch = line.match(/dc\.(b|w|l)/);
            if (sizeMatch) {
                const size = sizeLookup[sizeMatch[1]];
                const fragments = line.split(',');
                dataIndex += size * fragments.length;
            }
        });
    });

    const bytes = [];

    // now just convert the data sections
    asm.replace(/^(.*?):/gm, '')
        .split('\n')
        .forEach((line) => {
            const sizeMatch = line.match(/dc\.(b|w|l)/);
            if (sizeMatch) {
                const size = sizeLookup[sizeMatch[1]];
                const fragments = line.replace(/dc\.(b|w|l)|\s/g, '').split(',');

                // save each fragment into byte array based on size
                fragments.forEach((fragment) => {
                    if (~fragment.indexOf('-')) {
                        // if data is calculated from labels
                        const [lVal, rVal] = fragment.split('-');
                        let pointer = (pointerMap[lVal]||0) - (pointerMap[rVal]||0);
                        let pointerBytes = [];
                        for (let i = 0; i < size; i++) {
                            pointerBytes.unshift(pointer & 0xFF);
                            pointer = pointer >> 8;
                        }

                        bytes.push(...pointerBytes);
                    }
                    else {
                        let hex = parseInt(fragment, 16);
                        let fragmentBytes = [];
                        for (let i = 0; i < size; i++) {
                            fragmentBytes.unshift(hex & 0xFF);
                            hex = hex >> 8;
                        }
                        bytes.push(...fragmentBytes);
                    }
                });

            }
        });


    return bytes;
}

export function stuffToAsm(frames, name, isMapping = false) {
    // get real mapping name
    const startLabel = name.replace(/[^\w]/g, '')
        || 'DATA' + Math.random().toString(36).slice(2).toUpperCase();

    let output = `; ${'='.repeat(80)}
; Sprite ${isMapping?'Mappings' : 'DPLCs'} - generated by Flex 2 ${new Date()}
; ${'='.repeat(80)}

${startLabel}:
`;

    let dataOutput = '';
    let labels = [];

    frames.forEach((arrays, index) => {
        let label;
        if (arrays.length == 0) {
            label = 0;
        }
        else {
            label = `${startLabel}_${index.toString(16).toUpperCase()}`;
            const [header, ...data] = arrays;
            // header
            dataOutput += `${label}: dc.b ${to68kByteStr(header)}\n`;
            // pieces
            data.forEach((piece) => {
                piece.forEach((datum) => {
                    dataOutput += `\tdc.b ${to68kByteStr(datum)}\n`;
                });
            });
        }
        labels.push(label);
    });

    dataOutput += '\teven';

    // draw headers
    chunk(labels, 2)
        .forEach((words) => {
            output += `\tdc.w ${words.map((word) => (
                word == 0 ? '$0' : `${word}-${startLabel}`
            )).join`, `}\n`;
        });

    output += dataOutput;
    return output;
}

function to68kByteStr(arr) {
    return arr.map((d) => '$' + d.toString(16).toUpperCase()).join`, `;
}