import { environment } from '#store/environment';
import { mappingState } from '#components/mappings/state';
import { undo, redo } from '#store/history';
import { getDistance } from './distance';

/*
 * mod = ctrl / cmd
 *
 * Mouse:
 *
 * left + outside = select
 * left + inside = drag
 * double left = toggle
 * right + outside = pan
 * wheel = zoom
 */

export const commands = [
    [
        {
            map: 'mod+z', name: 'Undo', color: 'orange',
            func: () => { undo(); },
        },
        {
            map: 'mod+r', name: 'Redo', color: 'orange',
            func: () => { redo(); },
        },
    ],

    [
        {
            map: 'mod+a', name: 'Select All',
            func: () => { mappingState.selectAll(); },
        },
        {
            map: 'mod+d', name: 'Select None',
            func: () => { mappingState.selectNone(); },
        },
    ],

    [
        {
            map: 't', name: 'Transparency', color: 'magenta',
            func: () => { environment.config.transparency = !environment.config.transparency; },
        },
        {
            map: '=', name: 'Reset Pan/Zoom', color: 'magenta',
            func: () => { mappingState.resetPanAndZoom(); },
        },
        {
            map: 'g', name: 'Guidelines', color: 'magenta',
            func: () => { mappingState.guidelines.enabled = !mappingState.guidelines.enabled; },
        },
    ],



    [
        {
            map: ']', name: 'Next Sprite', color: 'yellow',
            func: () => { environment.config.currentSprite++; },
        },
        {
            map: '[', name: 'Previous Sprite', color: 'yellow',
            func: () => { environment.config.currentSprite--; },
        },
        {
            map: 'home', name: 'First Sprite', color: 'yellow',
            func: () => { environment.config.currentSprite = 0; },
        },
        {
            map: 'end', name: 'Last Sprite', color: 'yellow',
            func: () => { environment.config.currentSprite = Infinity; },
        },
    ],

    [
        {
            map: 'o', name: 'Add New Sprite', color: 'green',
            func: () => {
                const { currentSprite, dplcsEnabled } = environment.config;
                environment.mappings.splice(currentSprite+1, 0, []);
                dplcsEnabled &&
                environment.dplcs.splice(currentSprite+1, 0, []);
                environment.config.currentSprite++;
            },
        },
        {
            map: 'd s', name: 'Delete Sprite', color: 'red',
            func: () => {
                const { currentSprite, dplcsEnabled } = environment.config;
                environment.mappings.splice(currentSprite, 1);
                environment.dplcs.splice(currentSprite, 1);
            },
        },
        {
            map: 'd m', name: 'Delete Selected', color: 'red',
            func: () => {
                const { selectedIndicies } = mappingState;
                const { currentSprite, dplcsEnabled } = environment;
                selectedIndicies.forEach((i) => {
                    currentSprite.mappings[i].rip = true;
                });
                currentSprite.mappings.replace(
                    currentSprite.mappings.filter((d) => !d.rip)
                );
                mappingState.selectedIndicies.replace([]);
            },
        },
    ],

    [
        {
            map: 'left', name: 'Move Left', hasShift: true, color: 'white',
            func: () => {
                mappingState.mutateActive((mapping) => {
                    mapping.left -= getDistance();
                });
            },
        },
        {
            map: 'right', name: 'Move Right', hasShift: true, color: 'white',
            func: () => {
                mappingState.mutateActive((mapping) => {
                    mapping.left += getDistance();
                });
            },
        },
        {
            map: 'up', name: 'Move Up', hasShift: true, color: 'white',
            func: (e) => {
                e && e.preventDefault();
                mappingState.mutateActive((mapping) => {
                    mapping.top -= getDistance();
                });
            },
        },
        {
            map: 'down', name: 'Move Down', hasShift: true, color: 'white',
            func: (e) => {
                e && e.preventDefault();
                mappingState.mutateActive((mapping) => {
                    mapping.top += getDistance();
                });
            },
        },
        {
            map: 'h', name: 'Horizontal Flip', color: 'green',
            func: (e) => {
                const { x } = mappingState.center || {};
                mappingState.mutateActive((mapping) => {
                    mapping.hflip = !mapping.hflip;
                    const xOffset = mapping.left + (mapping.width * 8 / 2) - x;
                    mapping.left = - xOffset - (mapping.width * 8 / 2) + x;
                });
            },
        },
        {
            map: 'v', name: 'Vertical Flip', color: 'green',
            func: (e) => {
                const { y } = mappingState.center || {};
                mappingState.mutateActive((mapping) => {
                    mapping.vflip = !mapping.vflip;
                    const yOffset = mapping.top + (mapping.height * 8 / 2) - y;
                    mapping.top = - yOffset - (mapping.height * 8 / 2) + y;
                });
            },
        },
        {
            map: 'f', name: 'Toggle Priority', color: 'orange',
            func: (e) => {
                mappingState.mutateActive((mapping) => {
                    mapping.priority = !mapping.priority;
                });
            },
        },
        {
            map: 'p', name: 'Shift Palette', color: 'orange',
            func: (e) => {
                mappingState.mutateActive((mapping) => {
                    mapping.palette = (mapping.palette+1) % 4;
                });
            },
        },
    ],


    [
        {
            map: 'u a', name: 'Unload Art', color: 'red',
            func: () => { environment.tiles.replace([]); },
        },
        {
            map: 'u m', name: 'Unload Mappings', color: 'red',

            func: () => { environment.mappings.replace([]); },
        },
        {
            map: 'u d', name: 'Unload DPLCs', color: 'red',
            func: () => { environment.dplcs.replace([]); },
        },
        {
            map: 'u p', name: 'Unload Palettes', color: 'red',
            func: () => { environment.resetPalettes(); },
        },
    ],
];