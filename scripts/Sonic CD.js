// Flex2 mapping definition

const {
    label,
    info,
    offsetTable,
    mapping,
    mappingHeader,
    write,
    read,
    nybble,
    dc,
} = Flex2;

label('Sonic CD');
offsetTable(dc.w);
mappingHeader(
    (_mappings) => read(dc.b),
    (mappings) => write(dc.b, mappings.length),
);
mappings(
    (mapping) => {
        mapping.top = read(dc.b);
        read(nybble);
        mapping.width = read(2) + 1;
        mapping.height = read(2) + 1;
        mapping.priority = read(1);
        mapping.palette = read(2);
        mapping.yflip = read(1);
        mapping.xflip = read(1);
        mapping.offset = read(1);
        mapping.left = read(dc.b);
    },
    (mapping) => {
        // top
        write(dc.b, mapping.top);
        write(nybble, 0);
        // size
        write(2, mapping.width - 1);
        write(2, mapping.height - 1);
        // 1 player
        write(1, mapping.priority);
        write(2, mapping.palette);
        write(1, mapping.yflip);
        write(1, mapping.xflip);
        write(11, mapping.offset);
        // left
        write(dc.b, mapping.left);
    },
);
dplcHeader(
    (_dplcs) => read(dc.w),
    (dplcs) => write(dc.w, dplcs.length),
);
dplcs(
    (dplc) => {
        dplc.size = read(nybble);
        dplc.offset = read(nybble * 3);
    },
    (dplc) => {
        write(nybble, dplc.size);
        write(nybblr * 3, dplc.offset);
    },
);
