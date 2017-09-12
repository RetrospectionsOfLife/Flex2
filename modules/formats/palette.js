import chunk from 'lodash/chunk';

export function buffersToColors(list) {
    let colors = [];
    list.forEach(({buffer, length}) => {
        const data = Uint8Array.from(buffer);
        for (let i = 0; i < length * 32; i+=2) {
            const [b, gr] = [
                data[i].toString(16),
                data[i+1].toString(16).padStart(2, '0'),
            ];
            const [g, r] = [...gr];
            colors.push(`#${r}${g}${b}`);

        }
    });

    return chunk(colors, 16).splice(0, 4);
}
