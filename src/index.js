/**
 * D3 plugins for creating chevron flow charts
 *
 * This module provides two D3 plugins:
 * 1. straightChevronChart - for creating horizontal chevron flow charts
 * 2. radialChevronChart - for creating radial chevron flow charts
 *
 * @module chevron-flow-chart
 */

/**
 * @typedef {Object} ChevronSegment
 * @property {string} label - The text label for the segment
 * @property {string} [description] - Optional description for the segment
 * @property {string} [icon] - Optional icon for the segment
 * @property {string} [color] - Optional custom color for the segment
 */

/**
 * Creates a straight (horizontal) chevron flow chart
 *
 * @param {Object} [config] - Configuration options
 * @param {number} [config.width=220] - Width of each chevron
 * @param {number} [config.height=80] - Height of each chevron
 * @param {number} [config.headPoint=40] - Size of the chevron head point
 * @param {number} [config.tailPoint=40] - Size of the chevron tail point
 * @param {number} [config.gap=12] - Gap between chevrons
 * @param {string[]} [config.colors=d3.schemeObservable10] - Array of colors to use
 * @param {string} [config.textColor='#fff'] - Color of the text labels
 * @param {string} [config.strokeColor='#fff'] - Color of the stroke
 * @param {number} [config.strokeWidth=2] - Width of the stroke
 * @param {string} [config.fontFamily='sans-serif'] - Font family for labels
 * @param {number} [config.fontSize=26] - Font size for labels
 * @param {boolean} [config.fontWeight='bold'] - Font weight for labels
 * @param {string} [config.fontColour='#fff'] - Font weight for labels
 * @param {boolean} [config.flatFirstArrow=true] - Font weight for labels
 * @param {'round'|'miter'} [config.strokeLineJoin='miter'] - Font weight for labels
 * @returns {Function} - A D3 chart function
 */
export function straightChevronChart(config = {}) {
    const cfg = {
        width: config.width ?? 220,
        height: config.height ?? 80,
        headPoint: config.headPoint ?? 40,
        tailPoint: config.tailPoint ?? 40,
        gap: config.gap ?? 12,
        colors: config.colors ?? d3.schemeObservable10,
        textColor: config.textColor ?? '#fff',
        strokeColor: config.strokeColor ?? '#fff',
        strokeWidth: config.strokeWidth ?? 2,
        fontFamily: config.fontFamily ?? 'sans-serif',
        fontSize: config.fontSize ?? 26,
        fontWeight: config.fontWeight ?? 'bold',
        flatFirstArrow: config.flatFirstArrow !== undefined ? config.flatFirstArrow : true,
        strokeLinejoin: config.strokeLineJoin ?? 'miter'
    };

    /**
     * The chart function that renders the straight chevron chart.
     *
     * @param {d3.Selection} selection - The D3 selection to render the chart in.
     * @returns {d3.Selection} - The updated selection.
     */
    function chart(selection) {
        selection.each(function (data) {
            const segments = data ?? [];
            const startOffset = cfg.tailPoint;
            const svgWidth = startOffset + segments.length * (cfg.width + cfg.headPoint + cfg.gap) - cfg.gap + cfg.tailPoint;

            const svg = d3.select(this).selectAll('svg').data([segments]);
            const svgEnter = svg.enter().append('svg');
            const svgMerge = svgEnter.merge(svg);
            svgMerge.attr('viewBox', `-${cfg.strokeWidth / 2} -${cfg.strokeWidth / 2} ${svgWidth + cfg.strokeWidth} ${cfg.height + cfg.strokeWidth}`);
            function chevronPath(x, isFirst) {
                const midY = cfg.height / 2;
                if (isFirst && cfg.flatFirstArrow) {
                    const backCorner = x - cfg.tailPoint;
                    return `M${x},0 
                            L${x + cfg.width},0 
                            L${x + cfg.width + cfg.headPoint},${midY} 
                            L${x + cfg.width},${cfg.height} 
                            L${backCorner},${cfg.height} 
                            L${backCorner},0 Z`;
                } else {
                    const leftCorner = x - cfg.tailPoint;
                    return `M${x},0 
                            L${x + cfg.width},0 
                            L${x + cfg.width + cfg.headPoint},${midY} 
                            L${x + cfg.width},${cfg.height} 
                            L${leftCorner},${cfg.height} 
                            L${x},${midY} 
                            L${leftCorner},0 Z`;
                }
            }

            let cursorX = startOffset;
            const paths = svgMerge.selectAll('path.arrow').data(segments);

            paths.enter()
                .append('path')
                .attr('class', 'arrow')
                .merge(paths)
                .attr('d', (d, i) => {
                    const pathStr = chevronPath(cursorX, i === 0);
                    cursorX += cfg.width + cfg.headPoint + cfg.gap;
                    return pathStr;
                })
                .attr('fill', (d, i) => d.color ?? cfg.colors[i % cfg.colors.length])
                .attr('stroke', cfg.strokeColor)
                .attr('stroke-width', cfg.strokeWidth)
                .attr('stroke-linejoin', cfg.strokeLineJoin);


            paths.exit().remove();

            const texts = svgMerge.selectAll('text').data(segments);

            texts.enter()
                .append('text')
                .merge(texts)
                .attr('fill', cfg.textColor)
                .attr('font-family', cfg.fontFamily)
                .attr('font-weight', cfg.fontWeight)
                .attr('font-size', cfg.fontSize)
                .attr('text-anchor', 'middle')
                .attr('dominant-baseline', 'central')
                .attr('x', (d, i) => startOffset + i * (cfg.width + cfg.headPoint + cfg.gap) + (cfg.tailPoint + cfg.width / 2))
                .attr('y', cfg.height / 2)
                .text(d => d.label);

            texts.exit().remove();
        });

        return selection;
    }

    return chart;
}

/**
 * Creates a radial chevron flow chart
 *
 * @param {Object} [config] - Configuration options
 * @param {number} [config.width=700] - Width of the SVG
 * @param {number} [config.height=700] - Height of the SVG
 * @param {number} [config.innerRadius=180] - Inner radius of the chart
 * @param {number} [config.outerRadius=300] - Outer radius of the chart
 * @param {number} [config.gapDegrees=4] - Gap between segments in degrees
 * @param {number} [config.rotateDegrees=10] - Rotation of the chevron points in degrees
 * @param {number} [config.labelOffsetDeg=30] - Label position offset in degrees
 * @param {string[]} [config.colors=d3.schemeObservable10] - Array of colors to use
 * @param {string} [config.textColor='#fff'] - Color of the text labels
 * @param {string} [config.strokeColor='#fff'] - Color of the stroke
 * @param {number} [config.strokeWidth=8] - Width of the stroke
 * @param {string} [config.fontFamily='sans-serif'] - Font family for labels
 * @param {number} [config.fontSize=26] - Font size for labels
 * @param {boolean} [config.fontWeight='bold'] - Font weight for labels
 * @param {boolean} [config.responsive=true] - Whether to make the chart responsive
 * @returns {Function} - A D3 chart function
 */
export function radialChevronChart(config = {}) {
    const cfg = {
        width: config.width ?? 700,
        height: config.height ?? 700,
        innerRadius: config.innerRadius ?? 180,
        outerRadius: config.outerRadius ?? 300,
        gapDegrees: config.gapDegrees ?? 4,
        rotateDegrees: config.rotateDegrees ?? 10,
        labelOffsetDeg: config.labelOffsetDeg ?? 30,
        colors: config.colors ?? d3.schemeObservable10,
        textColor: config.textColor ?? '#fff',
        strokeColor: config.strokeColor ?? '#fff',
        strokeWidth: config.strokeWidth ?? 8,
        fontFamily: config.fontFamily ?? 'sans-serif',
        fontSize: config.fontSize ?? 26,
        fontWeight: config.fontWeight ?? 'bold',
        responsive: config.responsive !== undefined ? config.responsive : true
    };

    /**
     * Helper function to rotate a point around the origin
     *
     * @param {number[]} p - Point coordinates [x, y]
     * @param {number} a - Angle in radians
     * @returns {number[]} - Rotated point coordinates [x, y]
     */
    function rotate(p, a) {
        return [
            p[0] * Math.cos(a) - p[1] * Math.sin(a),
            p[0] * Math.sin(a) + p[1] * Math.cos(a)
        ];
    }

    /**
     * The chart function that renders the radial chevron chart
     *
     * @param {d3.Selection} selection - The D3 selection to render the chart in
     * @returns {d3.Selection} - The updated selection
     */
    function chart(selection) {
        selection.each(function (data) {
            const segments = data ?? [];
            const steps = segments.length;

            if (steps === 0) return;

            const cx = cfg.width / 2;
            const cy = cfg.height / 2;
            const gapInner = cfg.gapDegrees * Math.PI / 180;
            const gapOuter = gapInner * cfg.innerRadius / cfg.outerRadius;
            const rot = cfg.rotateDegrees * Math.PI / 180;
            const stepA = 2 * Math.PI / steps;
            const labelOffset = cfg.labelOffsetDeg * Math.PI / 180;

            const wedges = d3.range(steps).map(i => {
                const a0Inner = i * stepA + gapInner / 2;
                const a1Inner = (i + 1) * stepA - gapInner / 2;
                const a0Outer = i * stepA + gapOuter / 2;
                const a1Outer = (i + 1) * stepA - gapOuter / 2;

                const pOut0 = [cfg.outerRadius * Math.cos(a0Outer), cfg.outerRadius * Math.sin(a0Outer)];
                const pOut1 = [cfg.outerRadius * Math.cos(a1Outer), cfg.outerRadius * Math.sin(a1Outer)];
                const pIn0 = [cfg.innerRadius * Math.cos(a0Inner), cfg.innerRadius * Math.sin(a0Inner)];
                const pIn1 = [cfg.innerRadius * Math.cos(a1Inner), cfg.innerRadius * Math.sin(a1Inner)];

                const pMid0 = rotate([(pOut0[0] + pIn0[0]) / 2, (pOut0[1] + pIn0[1]) / 2], rot);
                const pMid1 = rotate([(pOut1[0] + pIn1[0]) / 2, (pOut1[1] + pIn1[1]) / 2], rot);

                const outerArc = d3.range(0, 36).map(t => {
                    const a = a0Outer + (a1Outer - a0Outer) * t / 35;
                    return [cfg.outerRadius * Math.cos(a), cfg.outerRadius * Math.sin(a)];
                });

                const innerArc = d3.range(0, 36).map(t => {
                    const a = a1Inner - (a1Inner - a0Inner) * t / 35;
                    return [cfg.innerRadius * Math.cos(a), cfg.innerRadius * Math.sin(a)];
                });

                return {
                    vertices: [
                        ...outerArc,
                        pMid1, pIn1,
                        ...innerArc,
                        pMid0, pOut0
                    ],
                    labelAngle: (a0Inner + a1Inner) / 2 + labelOffset,
                    colour: segments[i].color ?? cfg.colors[i % cfg.colors.length],
                    idx: i
                };
            });

            const svg = d3.select(this).selectAll('svg').data([wedges]);
            const svgEnter = svg.enter().append('svg');
            const svgMerge = svgEnter.merge(svg);

            svgMerge
                .attr('viewBox', `0 0 ${cfg.width} ${cfg.height}`)
                .attr('width', cfg.width)
                .attr('height', cfg.height);

            const g = svgMerge.selectAll('g').data([wedges]);
            const gEnter = g.enter().append('g');
            const gMerge = gEnter.merge(g);

            gMerge.attr('transform', `translate(${cx},${cy})`);

            const paths = gMerge.selectAll('path.wedge').data(d => d);

            paths.enter()
                .append('path')
                .attr('class', 'wedge')
                .merge(paths)
                .attr('d', d => {
                    const path = d3.path();
                    d.vertices.forEach((p, i) => i ? path.lineTo(...p) : path.moveTo(...p));
                    path.closePath();
                    return path.toString();
                })
                .attr('fill', d => d.colour)
                .attr('stroke', cfg.strokeColor)
                .attr('stroke-width', cfg.strokeWidth);

            paths.exit().remove();

            const texts = gMerge.selectAll('text.label').data(d => d);

            texts.enter()
                .append('text')
                .attr('class', 'label')
                .merge(texts)
                .text(d => segments[d.idx].label)
                .attr('fill', cfg.textColor)
                .attr('font-family', cfg.fontFamily)
                .attr('font-weight', cfg.fontWeight)
                .attr('font-size', cfg.fontSize)
                .attr('text-anchor', 'middle')
                .attr('dominant-baseline', 'central')
                .attr('x', d => Math.cos(d.labelAngle) * (cfg.innerRadius + cfg.outerRadius) / 2)
                .attr('y', d => Math.sin(d.labelAngle) * (cfg.innerRadius + cfg.outerRadius) / 2);

            texts.exit().remove();

            if (cfg.responsive) {
                const resizeFunction = () => {
                    const containerWidth = this.clientWidth;
                    const containerHeight = this.clientHeight;
                    if (containerWidth && containerHeight) {
                        const size = Math.min(containerWidth, containerHeight);
                        svgMerge
                            .attr('width', size)
                            .attr('height', size);
                    }
                };

                if (window) {
                    window.addEventListener('resize', resizeFunction);
                    resizeFunction();
                }
            }
        });

        return selection;
    }

    return chart;
}