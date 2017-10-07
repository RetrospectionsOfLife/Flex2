import React, { Component } from 'react';
import { model, saveModel } from './model';

import FlexLayout from 'flexlayout-react';

import { ProjectConfig } from '#components/project/config';
import { Palettes } from '#components/palettes';
import { Art } from '#components/art';
import { Sprites } from '#components/sprites';
import { Mappings } from '#components/mappings';

export class Layout extends Component {

    factory = (node) => {
        let component = node.getComponent();
        saveModel();

        return node._visible && do {
            if (component == 'project') {
                <ProjectConfig node={node}/>;
            }
            else if (component == 'palettes') {
                <Palettes node={node}/>;
            }
            else if (component == 'art') {
                <Art node={node}/>;
            }
            else if (component == 'sprites') {
                <Sprites node={node}/>;
            }
            else if (component == 'mappings') {
                <Mappings node={node}/>;
            }
        };
    }

    render() {
        return (
            <FlexLayout.Layout
                model={model}
                factory={this.factory}
            />
        );
    }

}
