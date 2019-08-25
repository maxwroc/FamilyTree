module FamilyTreePlotter {

    const props = {
        width: 250,
        height: 120,
        siblingSpace: 60,
        generationSpace: 100,
        cornerRadious: 20,
        colors: {
            m: {
                background: "rgb(159, 213, 235)",
                stroke: "rgb(142, 191, 211)"
            },
            f: {
                background: "rgb(245, 184, 219)",
                stroke: "rgb(214, 161, 191)"
            }
        },
        menColor: "rgb(159, 213, 235)",
        menStrokeColor: "rgb(142, 191, 211)",
        womenColor: "rgb(245, 184, 219)",
        womenStrokeColor: "rgb(214, 161, 191)"
    }



    export class Painter {

        private drawingData: IDrawingData = {};

        constructor(private canvas: Canvas, private people: IInitializedPeople) {

        }

        public drawTree(mainPerson: Person) {

            // going up the tree root
            let rootPerson = this.getTreeRoot(mainPerson);

            this.drawPerson(rootPerson);
        }

        private getTreeRoot(person: Person): Person {
            let parent = person.relatives.father || person.relatives.mother;

            if (!parent) {
                // we found root
                return person;
            }

            return this.getTreeRoot(parent);
        }

        private drawPerson(person: Person) {

            // initialize when needed
            this.drawingData[person.id] = this.drawingData[person.id] || {};

            let coords = this.getCoords(person);
            this.drawBox(person.data.sex as Sex, coords)
        }

        /*
        private getCoords(person: Person): ICoords {

            let descendantFamilyGroupWidth = this.getWidthOfDescendantsFamilyGroup(person);
            let fatherId = person.relatives.father ? person.relatives.father.id : null;
            let motherId = person.relatives.mother ? person.relatives.mother.id : null;
            let parentId = fatherId || motherId;

            let coords = { x: 100, y: 100 }
            // if there is no parent
            if (!parentId || !(this.drawingData[parentId] && this.drawingData[parentId].isDrawn)) {

                // check if there are children drawn (if there is there should be only 1)
                let drawnChild = person.relatives.children.find(child => this.drawingData[child.id] && this.drawingData[child.id].isDrawn);
                if (drawnChild) {
                    // TODO support additional partners in calculation
                    let childrenLength = person.relatives.children.length;
                    let childrenMiddlePoint = Math.floor(props.width * childrenLength + props.siblingSpace * (childrenLength - 1) / 2);
                    coords.x = motherId == null || fatherId == null ? childrenMiddlePoint : childrenMiddlePoint - props.width - Math.floor(props.siblingSpace / 2);
                    coords.y = this.drawingData[drawnChild.id].coords.y - props.generationSpace - props.height;
                }

                this.drawingData[person.id].coords = coords;
                return coords;
            }

            // when there is parent drawn already
            let children =
            let drawnChildren = person.relatives.father.children.filter(child => this.drawingData[child.id] && this.drawingData[child.id].isDrawn);

            this.drawingData[person.id].coords = coords;
            return coords;
        }
        /* */

        private getCoords(person: Person): ICoords {

            let coords: ICoords = { x: 100, y: 100 };

            let parent = person.relatives.father || person.relatives.mother;
            if (!parent) {
                let drawnSpouse = person.relatives.spouses.find(s => this.drawingData[s.id] && this.drawingData[s.id].isDrawn);
                if (drawnSpouse) {
                    // TODO
                }

                return coords;
            }

            // assume parent must be drawn already (we don't take spouse's parents into consideration for now)
            if (!this.drawingData[parent.id] || !this.drawingData[parent.id].isDrawn) {
                throw new Error("Parents should be drawn already (we don't support spouse's parents)");
            }

            if (parent.relatives.children.length == 1) {
                coords.x = this.drawingData[parent.id].coords.x;
                coords.y = this.drawingData[parent.id].coords.y + props.height + props.generationSpace;
            }
            else {
                let lastDrawnSibling = this.getLastDrawnChild(parent);
                if (!lastDrawnSibling) {
                    return coords;
                }
                coords.y = this.drawingData[lastDrawnSibling.id].coords.y;
            }

            this.drawingData[person.id].coords = coords;
            return coords;
        }

        private getLastDrawnChild(person: Person): Person {
            return person.relatives.children.reduce((candidate, child) => {

                let candidateDrawingData = candidate ? this.drawingData[candidate.id] : null;
                let childDrawingData = this.drawingData[child.id];

                if (childDrawingData && childDrawingData.isDrawn) {

                    if (!candidateDrawingData || childDrawingData.coords.y > candidateDrawingData.coords.y) {
                        return child;
                    }
                }

                return candidate;
            }, <unknown>null as Person);
        }

        private getChildren(person: Person, spouse: Person): Person[] {
            if (!spouse) {
                return person.relatives.children;
            }

            return person.relatives.children.filter(
                child => spouse.relatives.children.some(spouseChild => spouseChild.id == child.id)
            );
        }

        /**
         * Gets total width of person's family, including spouses and children.
         *
         * @param person Subject to calculate descendant family greoup width
         */
        private getWidthOfDescendantsFamilyGroup(person: Person): number {

            let personDrawingData = this.drawingData[person.id];

            // make sure we calculate it just once
            if (personDrawingData.descendantFamilyGroupWidth) {
                return personDrawingData.descendantFamilyGroupWidth;
            }

            let minWidth = props.width;

            person.relatives.spouses.forEach(spouse => {
                if (person.relatives.children.length) {
                    // get common children
                    let children = person.relatives.children.filter(
                        child => spouse.relatives.children.some(spouseChild => spouseChild.id == child.id)
                    );

                    children.forEach((child, index) => {
                        minWidth += this.getWidthOfDescendantsFamilyGroup(child);

                        if (index != children.length - 1) {
                            minWidth += props.siblingSpace;
                            // TODO consider not adding space when next sibling has larger family
                        }
                    })
                }
                else {
                    // no children
                    minWidth += props.width + props.siblingSpace;
                    // TODO consider not adding sibling space if there were other spouses with kids
                }
            });

            this.drawingData[person.id].descendantFamilyGroupWidth = minWidth;
            return minWidth;
        }

        private drawBox(sex: Sex, coords: ICoords) {
            let colors = props.colors[sex];
            this.canvas.container.append('rect')
                .attr("x", coords.x)
                .attr("y", coords.y)
                .attr("rx", props.cornerRadious)
                .attr("ry", props.cornerRadious)
                .attr("width", props.width)
                .attr("height", props.height)
                .attr("fill", colors.background)
                .attr("stroke-width", 1.5)
                .attr("stroke", colors.stroke)
                .attr("class", "person");
        }

        private connectRelatives(relative: IRelative) {

            let path: string = "";

            switch (relative.relation) {
                case Relation.Sibling:
                    let relTopCenter = relative.person.x + props.width / 2;
                    path = new Path(relTopCenter, relative.person.y).arcTo(30, -30, 30, 30).lineTo(this.x + props.width / 2 - 30, null, false).arcTo(30, 30, 30, 30).getPath();
                    break;
                case Relation.Child:
                    //path = new Path(relTopCenter, relative.person.y).arcTo(30, -30, 30, 30).lineTo(this.x + Person.props.width / 2 - 30, null, false).arcTo(30, 30, 30, 30).getPath();
                    break;
            }

            this.connectionLine = relative.person.connectionLine = Person.canvas.container.append("path")
                .attr("d", path)
                .attr("stroke", "#000")
                .attr("stroke-width", 1)
                .attr("stroke-opacity", 0.3)
                .attr("fill", "none");
        }
    }

    interface ICoords {
        x: number;
        y: number;
    }

    interface IDrawingData {
        [id: number]: {
            isDrawn?: boolean,
            coords: ICoords,
            descendantFamilyGroupWidth?: number,
            box?: d3.Selection<"rect">,
            connectionLine?: d3.Selection<"path">
        }
    }

}