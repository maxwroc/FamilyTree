module FamilyTreePlotter {

    export class Canvas {

        public container: d3.Selection<"g">;

        constructor(rootElemPath: string) {
            let zoom = d3.behavior.zoom()
                .scaleExtent([1, 10])
                .on("zoom", () => this.onZoom());

            let svg = d3.select("body").append("svg")
                .attr("width", 1200)
                .attr("height", 600);

            let background = svg.append("rect")
                .attr("width", "100%")
                .attr("height", "100%")
                .attr("fill", "#F2EEE4")
                .style("pointer-events", "all")
                .style("cursor", "grab")
                .call(zoom);

            this.container = svg.append("g")
                .style("vector-effect", "non-scaling-stroke");
        }

        private onZoom() {
            let evt = d3.event as d3.ZoomEvent;
            this.container.attr("transform", "translate(" + evt.translate + ")scale(" + evt.scale + ")");
        }
    }

}